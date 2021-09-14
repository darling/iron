import { assign } from 'lodash';
import { getConnection } from 'typeorm';
import { User } from './models/User';

/**
 * Get the user data for a specific uid
 * @param uid Discord UID
 * @returns User or undefined
 */
export const getUser = async (uid: string): Promise<User> => {
	const connection = getConnection();
	let user = await connection.getRepository(User).findOne({ id: uid });

	if (!user) {
		user = new User(uid);
	}

	return user;
};

/**
 * Update the user using a partial. If no user exists, it will create a fresh user.
 * @param uid Discord ID
 * @param newData Properties to update
 * @returns User Obj
 */
export const setUser = async (
	uid: string,
	newData: Partial<User>
): Promise<User> => {
	const connection = getConnection();

	let user = await connection.getRepository(User).findOne({ id: uid });

	if (!user) {
		user = new User(uid);
	}

	const mutated = assign(user, newData);

	await connection.manager.save(mutated);

	return user;
};

/**
 * If you need granular control over an update, this function allows u to just submit a User Obj to save
 * @param user User to update
 * @returns User
 */
export const setUserByUser = async (user: User) => {
	const connection = getConnection();

	await connection.manager.save(user);

	return user;
};

/**
 * Mint a new user into the db
 * @param uid Discord UID
 */
export const newUser = async (uid: string) => {
	const connection = getConnection();

	let user = new User();

	user.id = uid;

	try {
		// const userRepository = connection.manager.getRepository(User);

		// userRepository.delete({ id: uid });

		connection.manager.save(user).then((user) => {
			console.log(`New user [${user.id}] created!`);
		});
	} catch (error) {
		console.error(error);
	}
};
