/**
 * API
 * Exposes endpoints
 */

// import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

admin.initializeApp();
const db = admin.firestore();
const app = express();

/**
 * Similar to express-unless; this skips the middleware,
 * if the request.path is in the array of paths (both passed to this function)
 * @param paths Request paths that do not pass through the middleware
 * @param middleware Middleware that is in being skipped
 */
export const unless = (paths: Array<string>, middleware: any) => {
  return (request: express.Request, response: express.Response, next: any) => {
    if (paths.includes(request.path)) return next();
    else return middleware(request, response, next);
  };
};

/**
 * Validate authorization token passed in the authorization field of the request header
 * @param request express request
 * @param response express response
 * @param next go to the next
 */
const validateAuthToken = async (request: express.Request, response: express.Response, next: () => any) => {
  const { authorization } = request.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return response.status(401).send({
      message: 'Unauthorized: Authorize your request - Authorization: Bearer <idToken>',
      code: 'authentication-error',
    });
  }

  try {
    const authToken = authorization.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(authToken);

    request['user'] = decodedToken;
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

const formRoutes = ['/add-restaurant']; // should not be processed by the bodyParser middleware - use a form parser e.g busboy
const noValidationRoutes = ['/reviews']; // Does not require authentication

// Middlewares
app.use(cors({ origin: true }));
app.use(unless(noValidationRoutes, validateAuthToken));
app.use(unless(formRoutes, bodyParser.json()));
app.use(unless(formRoutes, bodyParser.urlencoded({ extended: true })));

// Endpoints

app.get('/reviews', async (request: express.Request, response: express.Response) => {
  try {
    const snapshot = await db.collection('reviews').get();
    if (snapshot.empty) {
      return response
        .status(200)
        .send({ message: 'No reviews available', code: 'success', status: true, data: { reviews: [] } });
    }

    const reviews = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return response.status(200).send({ message: 'Success', code: 'success', status: true, data: { reviews } });
  } catch (error) {
    return response.status(500).send({ message: 'Internal Server Error', code: 'api-error', status: false });
  }
});

app.post('/add-restaurant', (request: express.Request, response: express.Response) => {
  console.log('A request buffer: ', request.body);
  // XXX: Use a form parser to process this request

  try {
    return response.status(200).send({ message: 'Complete', code: 'success', status: true });
  } catch (error) {
    return response.status(400).send({ message: `Bad Request: Can't process`, code: 'error', status: false });
  }
});

app.post('/json', (request: express.Request, response: express.Response) => {
  console.log('A json request: ', request.body);

  try {
    return response.status(200).send({ message: 'Complete', code: 'success', status: true });
  } catch (error) {
    return response.status(400).send({ message: `Bad Request: Can't process`, code: 'error', status: false });
  }
});

export default app;
