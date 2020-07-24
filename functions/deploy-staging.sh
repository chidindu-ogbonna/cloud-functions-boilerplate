export GOOGLE_APPLICATION_CREDENTIALS="service-account/staging-service-account.json"

firebase functions:config:set cloudinary.cloud_name="" cloudinary.api_key="" cloudinary.api_secret=""
firebase functions:config:set environment.name="staging"

firebase --project=<staging> deploy --only functions