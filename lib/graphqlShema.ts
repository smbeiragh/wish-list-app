import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  type Query {
    users: [User!]!
    me: User
    getUserByUrl(urlShortName: String): User
    openGraph(url: String): OpenGraphResult
  }

  type Mutation {
    login(email: String, password: String): LoginResult
    register(email: String, password: String): LoginResult
    updateUser(userId: Int, user: UserInput): UserUpdateResult
    addWish(wish: WishInput): WishUpdateResult
    deleteWish(wishId: Int): DeleteResult
    updateWish(wishId: Int, wish: WishInput): WishUpdateResult
  }

  type LoginResult {
    user: User
    token: String
  }

  type User {
    id: Int!
    email: String
    fullName: String
    passwordHash: String
    urlShortName: String
    birthday: Int
    wishes: [Wish]!
  }

  input UserInput {
    email: String
    fullName: String
    password: String
    urlShortName: String
    birthday: Int
  }

  type UserUpdateResult {
    success: Boolean
    message: String
    data: User!
  }

  type Wish {
    id: Int!
    title: String
    url: String
    imageUrl: String
    note: String
    rate: Int
    userId: Int
  }

  input WishInput {
    title: String
    url: String
    imageUrl: String
    note: String
    rate: Int
    userId: Int
  }

  type WishUpdateResult {
    success: Boolean
    message: String
    data: [Wish]!
  }

  type DeleteResult {
    success: Boolean
    message: String
    data: [Int]!
  }

  type OpenGraphResult {
    success: Boolean
    message: String
    data: OpenGraph
  }

  type OpenGraph {
    id: String
    url: String
    title: String
    imageUrl: String
    note: String
  }
`;

export default typeDefs;
