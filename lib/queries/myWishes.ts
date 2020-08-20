import { gql } from '@apollo/client';
import { User } from '../Types';
import { userFragment, wishFragment } from './fragments';

export const QUERY = gql`
  query getMyWishes {
    me {
      ...User
      wishes {
        ...Wish
      }
    }
  }
  ${userFragment}
  ${wishFragment}
`;

export interface MyWishes {
  me: User;
}
