import Knex from 'knex';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserInputError, ForbiddenError } from 'apollo-server-micro';
import {
  DataSource,
  User,
  LoginInput,
  LoginResult,
  TokenPayload,
  UserInput,
  UpdateResult,
  NullableUser,
} from './Types';

export interface UserProvider {
  users(): Promise<User[]>;
  getUserById(id: number): Promise<NullableUser>;
  getUserByUrl(urlShortName: string): Promise<User>;
  login(input: LoginInput): Promise<LoginResult>;
  register(input: LoginInput): Promise<LoginResult>;
  updateUser(user: UserInput, userId: number): Promise<UpdateResult<User>>;
}

export function createUserProvider({ db, getDataSource }: { db: Knex; getDataSource: () => DataSource }): UserProvider {
  const userProvider: UserProvider = {
    async users() {
      return db.select('*').from<User>('users');
    },
    async getUserById(id: number) {
      return (await db.select('*').from<NullableUser>('users').where({ id }))[0];
    },
    async getUserByUrl(urlShortName: string) {
      return (await db.select('*').from<User>('users').where({ urlShortName }))[0];
    },
    async register({ email, password }: LoginInput) {
      let user = (await db.select('*').from<User>('users').where({ email }))[0];

      if (user) {
        throw new UserInputError('A user with this email already exists ', { invalidArgs: ['email'] });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const [id]: number[] = await db('users').insert({ email, passwordHash });

      user = (await db.from<User>('users').select('*').where({ id }))[0];

      const token = jwt.sign({ id: user.id } as TokenPayload, process.env.TOKEN_KEY as string, {
        expiresIn: 60 * 60 * 3,
      });

      return {
        user,
        token,
      };
    },
    async login({ email, password }: LoginInput) {
      const user = (await db.select('*').from<User>('users').where({ email }))[0];

      if (!user) {
        throw new UserInputError('Invalid username or password', { invalidArgs: ['email', 'password'] });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);

      if (!isValid) {
        throw new UserInputError('Invalid username or password', { invalidArgs: ['email', 'password'] });
      }

      const token = jwt.sign({ id: user.id } as TokenPayload, process.env.TOKEN_KEY as string, {
        expiresIn: 60 * 60 * 3,
      });

      return {
        user,
        token,
      };
    },
    async updateUser(userInput: UserInput, userId: number) {
      const dataSource = getDataSource();
      const { password, ...updateInfo } = userInput;

      if (dataSource?.currentUser?.id !== userId) {
        throw new ForbiddenError("Access denied - you're not allowed to update this user");
      }

      let user = (await db.select('*').from<User>('users').where({ id: userId }))[0];

      if (!user) {
        throw new UserInputError(`user with "${userId}" not exists`, { invalidArgs: ['userId'] });
      }

      if (updateInfo.urlShortName) {
        user = (await db.select('*').from<User>('users').where({ urlShortName: updateInfo.urlShortName }))[0];
        if (user && user.id !== userId) {
          throw new UserInputError(`url name "${updateInfo.urlShortName}" already taken by another user`, {
            invalidArgs: ['urlShortName'],
          });
        }
      }

      if (password) {
        updateInfo.passwordHash = await bcrypt.hash(userInput.password, 10);
      }

      await db('users').where({ id: userId }).update<UserInput>(updateInfo);

      user = (await db.select('*').from<User>('users').where({ id: userId }))[0];

      return {
        success: true,
        message: '',
        data: user,
      };
    },
  };
  return userProvider;
}
