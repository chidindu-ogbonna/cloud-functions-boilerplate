/**
 * UserOnCreate Trigger
 * - Save in firestore
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export default async (user: functions.auth.UserRecord, context: functions.EventContext): Promise<null> => {
  const { email, photoURL, uid, displayName } = user;

  if (!email) return null;

  // XXX: For indempotency and making use of retries, you make use of the context params
  // Check for more details - https://cloud.google.com/blog/products/serverless/cloud-functions-pro-tips-retries-and-idempotency-in-action

  // XXX: Example
  // const { eventId, timestamp } = context;
  // const userRef = db.collection('users').doc(eventId);
  // await userRef.set({ email, photoURL, uid, displayName, createdAt: timestamp });

  const userRef = db.collection('users').doc(uid);
  await userRef.set({ email, photoURL, displayName, createdAt: admin.firestore.FieldValue.serverTimestamp() });
  return null;
};
