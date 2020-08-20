import { gql } from '@apollo/client';
import { NullableUser } from '../Types';
import { userFragment, wishFragment } from './fragments';

export const QUERY = gql`
  query getUserByUrl($urlShortName: String) {
    getUserByUrl(urlShortName: $urlShortName) {
      ...User
      wishes {
        ...Wish
      }
    }
  }
  ${userFragment}
  ${wishFragment}
`;

export interface Result {
  getUserByUrl: NullableUser;
}

export interface Variables {
  urlShortName: string | null;
}
