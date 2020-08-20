import { gql } from '@apollo/client';
import { userFragment } from './fragments';

export const GET_USERS_QUERY = gql`
  query getUsers {
    users {
      ...User
    }
  }
  ${userFragment}
`;

export interface UsersList {
  users: [{ id: number; fullName: string }];
}
