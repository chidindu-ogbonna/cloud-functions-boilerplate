export GOOGLE_APPLICATION_CREDENTIALS="service-account/prod-service-account.json"

firebase functions:config:set cloudinary.cloud_name="" cloudinary.api_key="" cloudinary.api_secret=""
firebase functions:config:set environment.name="production"

firebase --project=<production> deploy --only functions