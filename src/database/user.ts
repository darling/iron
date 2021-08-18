import { firestore } from 'firebase-admin';
import { IUser } from '../types/db';
import { firebaseAdmin } from '../util/firebase';

const db = firebaseAdmin.firestore();

export const getUser = async (uid: string): Promise<IUser | undefined> => {
	const snapshot = (await db
		.collection('users')
		.doc(uid)
		.get()) as firestore.DocumentSnapshot<IUser>;

	return snapshot.data();
};

export const updateUser = async (uid: string, data: Partial<IUser>) => {
	await db.collection('users').doc(uid).set(data, { merge: true });
};
