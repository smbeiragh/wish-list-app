import { gql } from '@apollo/client';
import { UpdateResult, Wish, WishInput } from '../Types';
import { wishFragment } from './fragments';

export const QUERY = gql`
  mutation updateWish($wishId: Int!, $wish: WishInput) {
    updateWish(wishId: $wishId, wish: $wish) {
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
  updateWish: UpdateResult<Wish[]>;
}

export interface Variables {
  wish: WishInput;
  wishId: number;
}
