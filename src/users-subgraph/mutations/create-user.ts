import { Collection } from 'mongodb';
import { User } from '../types';
import admin from '../firebase-config';
import { FirebaseError } from 'firebase-admin/lib/utils/error';

export default async function createUser(
  _: undefined,
  args: {
    userData: {
      email: string;
      password: string;
      photoUrl: string;
    };
  },
  {
    users,
  }: {
    users: Collection<User>;
  },
) {
  const { userData } = args;
  const { email, password, photoUrl } = userData;

  try {
    await admin.auth().createUser({ email, password });
  } catch (err) {
    if (
      (err as FirebaseError).message ===
      'The email address is already in use by another account.'
    ) {
      return {
        code: '400',
        success: false,
        message: 'The email address is already in use by another account.',
        user: null,
      };
    } else {
      return {
        code: '400',
        success: false,
        message: 'User creation fail.',
        user: null,
      };
    }
  }

  await users.insertOne({
    email,
    photoUrl: photoUrl,
  });

  return {
    code: '200',
    message: 'User created successfullly',
    success: true,
    user: {
      email,
      photoUrl,
    },
  };
}
