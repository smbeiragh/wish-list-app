import { WishProvider } from './WishProvider';
import { UserProvider } from './UserProvider';

export interface DataSource {
  users: UserProvider;
  wishes: WishProvider;
  currentUser?: NullableUser;
}

export interface GraphqlContext {
  dataSource: DataSource;
  user: User | null | undefined;
}

export interface TokenPayload {
  id: number;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  passwordHash: string;
  urlShortName: string;
  birthday: number;
  wishes: Wish[];
}

export type NullableUser = User | null | undefined;

export type UserInput = Partial<Omit<User, 'id'>> & { password?: string };

export interface Wish {
  id: number;
  title: string;
  url: string;
  imageUrl: string;
  note: string;
  rate: number;
  userId: number;
}

export type WishInput = Partial<Omit<Wish, 'id'>>;

export interface UpdateResult<TResult> {
  success: boolean;
  message: string;
  data?: TResult;
}

// export interface DeleteResult {
//   success: boolean,
//   message: string
// }

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  user: User;
  token: string;
}

export interface OpenGraph {
  id: string;
  url: string;
  title?: string;
  imageUrl?: string;
  note?: string;
}

export type AuthRole = 'Authenticated' | 'NotAuthenticated' | 'public';
