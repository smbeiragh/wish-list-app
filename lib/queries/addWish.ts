import { gql } from '@apollo/client';
import { UpdateResult, Wish, WishInput } from '../Types';
import { wishFragment } from './fragments';

export const QUERY = gql`
  mutation addWish($wish: WishInput) {
    addWish(wish: $wish) {
      success
      message
      data {
        ...Wish
      }
    }
  }
  ${wishFragment}
`;

export interface Result {
  addWish: UpdateResult<Wish[]>;
}

export interface Variables {
  wish: WishInput;
}
