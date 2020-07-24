/**
 * UserOnCreate Trigger
 * - Update default profile photo
 * - If social auth - Create shop document in database
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export default async (user: functions.auth.UserRecord, context: functions.EventContext): Promise<null> => {
  const { email, photoURL, uid, displayName } = user;

  if (!email) return null;

  if (!photoURL) {
    const defaultPhotoURL = '';
    await admin.auth().updateUser(uid, { photoURL: defaultPhotoURL });
  }

  const isPassword = user.providerData.filter((profile) => profile.providerId === 'password').length;

  if (!isPassword) {
    const createdAt = admin.firestore.FieldValue.serverTimestamp();
    const shopRef = db.collection('shops').doc(user.uid);
    await shopRef.set({ email, displayName, createdAt, bio: '' });
  }
  return null;
};
