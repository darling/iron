import { firestore } from 'firebase-admin';
import { ICharacter, IUser } from '../types/db';
import { getRandCharacter } from '../util/characters';
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

export const addCharacterToUser = async (
	uid: string,
	character: ICharacter
) => {
	// Type override beacause I'm too lazy to adapt typings
	await updateUser(uid, {
		characters: firestore.FieldValue.arrayUnion(character) as any,
	});
};

export const mintCharacterToUser = async (uid: string) => {
	const char = getRandCharacter();
	await addCharacterToUser(uid, char);
};

const userCollection = db.collection('users');

export const getUserCharacters = async (uid: string) => {
	const snapshot = (await userCollection
		.doc(uid)
		.get()) as firestore.DocumentSnapshot<IUser>;
	const data = snapshot.data();

	return data?.characters;
};

export const getUserCharacter = async (uid: string, code: string) => {
	if (code.length !== 6) return;

	const snapshot = (await userCollection
		.doc(uid)
		.get()) as firestore.DocumentSnapshot<IUser>;
	const data = snapshot.data();

	return data?.characters?.find((char) => {
		return char.code === code;
	});
};

export const deleteUserCharacter = async (
	uid: string,
	character: ICharacter
) => {
	await updateUser(uid, {
		characters: firestore.FieldValue.arrayRemove(character) as any,
	});
};

export const deleteUserCharacterFromCode = async (
	uid: string,
	code: string
) => {
	const char = await getUserCharacter(uid, code);

	if (char) await deleteUserCharacter(uid, char);

	return char;
};

export const setPrimaryCharacter = async (
	uid: string,
	character: ICharacter
) => {
	const snapshot = (await userCollection
		.doc(uid)
		.get()) as firestore.DocumentSnapshot<IUser>;
	const data = snapshot.data();

	await updateUser(uid, {
		primary: character,
		characters: firestore.FieldValue.arrayRemove(character) as any,
	});

	if (data?.primary) {
		await updateUser(uid, {
			characters: firestore.FieldValue.arrayUnion(data?.primary) as any,
		});
	}
};
