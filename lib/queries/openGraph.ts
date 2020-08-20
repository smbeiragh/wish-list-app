import { gql } from '@apollo/client';
import { OpenGraph, UpdateResult } from '../Types';

export const QUERY = gql`
  query getOpenGraph($url: String) {
    openGraph(url: $url) {
      success
      message
      data {
        id
        url
        title
        imageUrl
        note
      }
    }
  }
`;

export interface Result {
  openGraph: UpdateResult<OpenGraph>;
}
