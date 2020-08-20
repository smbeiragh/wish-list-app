import { gql } from '@apollo/client';
import { UpdateResult, User, UserInput, Wish } from '../Types';
import { userFragment } from './fragments';

export const QUERY = gql`
  mutation updateUser($userId: Int, $user: UserInput) {
    updateUser(userId: $userId, user: $user) {
      success
      message
      data {
        ...User
      }
    }
  }
  ${userFragment}
`;

export interface Result {
  updateUser: UpdateResult<User>;
}

export interface Variables {
  userId: number;
  user: UserInput;
}
