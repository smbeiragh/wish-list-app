import { gql } from '@apollo/client';

export const wishFragment = gql`
  fragment Wish on Wish {
    id
    title
    url
    imageUrl
    note
    rate
    userId
  }
`;

export const userFragment = gql`
  fragment User on User {
    id
    email
    fullName
    passwordHash
    urlShortName
    birthday
  }
`;
