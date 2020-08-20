import { gql } from '@apollo/client';
import { LoginResult } from '../Types';
import { userFragment } from './fragments';

export const QUERY = gql`
  mutation login($email: String, $password: String) {
    login(email: $email, password: $password) {
      user {
        ...User
      }
      token
    }
  }
  ${userFragment}
`;

export interface Login {
  login: LoginResult;
}

export interface Variables {
  email: string;
  password: string;
}
