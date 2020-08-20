import { gql } from '@apollo/client';
import { NullableUser } from '../Types';
import { userFragment } from './fragments';

export const QUERY = gql`
  query getMe {
    me {
      ...User
    }
  }
  ${userFragment}
`;

export interface Me {
  me: NullableUser;
}
