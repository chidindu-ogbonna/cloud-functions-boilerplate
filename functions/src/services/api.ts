/**
 * API
 * Exposes endpoint that can be accessed from client side apps
 * Requires authentication for endpoints that require user data
 * - /add-product - Add a product to Grid
 *
 */

// import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { uploadToCloudinary } from './helpers/cloudinary';

admin.initializeApp();
const db = admin.firestore();
const app = express();

// Product Interface
interface Product {
  images: Array<string>;
  name: string;
  description: string;
  quantity: number;
  price: number;
  createdAt: object;
}

const validateAuthToken = async (request: express.Request, response: express.Response, next: () => any) => {
  const skipAuth: Array<string> = [];

  if (skipAuth.includes(request.path)) {
    return next();
  }

  // For testing purposes
  if (request.path === '/add-product') {
    const { uid } = request.body;
    if (uid) {
      request['shop'] = { uid };
      return next();
    } else {
      return response.status(401).send({
        message: 'Testing Error',
        code: 'testing-error',
      });
    }
  }

  const { authorization } = request.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return response.status(401).send({
      message:
        'Unauthorized: make sure you authorize your request by providing the following HTTP header - Authorization: Bearer <Firebase ID Token>',
      code: 'authentication-error',
    });
  }

  try {
    const authToken = authorization.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(authToken);

    request['shop'] = decodedToken;
    return next();
  } catch (error) {
    const { code } = error;
    if (code === 'auth/argument-error') {
      // Firebase ID Token error
      return response.status(401).send({
        message: 'Unauthorized: Incomplete arguments passed',
        code: 'authentication-error',
      });
    }

    if (code === 'auth/id-token-expired') {
      return response.status(401).send({
        message: 'Unauthorized: Refresh idToken',
        code: 'authentication-error',
      });
    }

    return response.status(401).send({
      message: 'Unauthorized',
      code: 'authentication-error',
    });
  }
};

app.use(validateAuthToken as any);
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/** * Add a product to Grid */
app.post('/add-product', async (request: express.Request, response: express.Response) => {
  const { uid: shopId } = request['shop'];

  if (!request.body.product) {
    return response
      .status(402)
      .send({ message: 'Bad Request: Incomplete parameters', code: 'bad-request', status: false });
  }

  try {
    const product: Product = {
      images: request.body.product['images'],
      description: request.body.product['description'],
      price: parseFloat(request.body.product['price']),
      quantity: parseFloat(request.body.product['quantity']),
      name: request.body.product['name'],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const { images, ...rest } = product;
    const productId = `${Date.now()}`;

    // upload to cloudinary
    const uploadPromises = images.map((image) => uploadToCloudinary(image, shopId, productId));
    const uploadImageURLs = await Promise.all(uploadPromises);

    // Add product to database
    const processedProduct = { images: uploadImageURLs, ...rest };
    const shopRef = db.collection('shops').doc(shopId);
    await shopRef.collection('products').doc(productId).set(processedProduct);

    return response.status(200).send({
      message: 'Product successfully created',
      code: 'success',
      status: true,
      data: processedProduct,
    });
  } catch (error) {
    return response.status(402).send({ message: 'Request Failed', code: 'api-error', status: false });
  }
});

export default app;
