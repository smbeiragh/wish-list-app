import { gql } from '@apollo/client';
import { UpdateResult } from '../Types';

export const QUERY = gql`
  mutation deleteWish($wishId: Int!) {
    deleteWish(wishId: $wishId) {
      success
      message
      data
    }
  }
`;

export interface Result {
  deleteWish: UpdateResult<number[]>;
}

export interface Variables {
  wishId: number;
}
