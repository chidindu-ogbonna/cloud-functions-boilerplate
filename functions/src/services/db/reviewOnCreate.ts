import * as functions from 'firebase-functions';

export default async (
  snap: functions.firestore.QueryDocumentSnapshot,
  context: functions.EventContext,
): Promise<null> => {
  const { reviewId } = context.params;
  const data = snap.data();

  console.log('Review ID: ', reviewId);
  console.log('Review Data: ', data);
  return null;
};
