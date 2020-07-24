import * as functions from 'firebase-functions';
import * as Cloudinary from 'cloudinary';

export const uploadToCloudinary = (image: string, shopID: string, productId: string): Promise<string> => {
  const cloudinary = Cloudinary.v2;

  const environment = functions.config().environment.name;
  const cloudinaryConfig = functions.config().cloudinary;
  const { cloud_name, api_key, api_secret } = cloudinaryConfig;

  const folder = environment === 'production' ? 'shop-prod' : 'shop-staging';

  const shopFolder = `${folder}/${shopID}`;
  const productFolder = `${shopFolder}/${productId}`;

  cloudinary.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
  });

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, { folder: productFolder }, (error: any, result: any) => {
      if (error) reject(error);
      if (result) resolve(result.secure_url);
    });
  });
};
