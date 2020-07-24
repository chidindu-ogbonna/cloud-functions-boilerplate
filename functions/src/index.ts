import * as functions from 'firebase-functions';

export const api = functions
  .runWith({ timeoutSeconds: 540, memory: '1GB' })
  .https.onRequest(async (request, response) => {
    await (await import('./services/api')).default(request, response);
  });

export const userOnCreate = functions.auth.user().onCreate(async (user, context) => {
  await (await import('./services/userOnCreate')).default(user, context);
});
