import { gql } from '@apollo/client';
import { LoginResult } from '../Types';
import { userFragment } from './fragments';

export const QUERY = gql`
  mutation register($email: String, $password: String) {
    register(email: $email, password: $password) {
      user {
        ...User
      }
      token
    }
  }
  ${userFragment}
`;

export interface Register {
  register: LoginResult;
}

export interface Variables {
  email: string;
  password: string;
}
