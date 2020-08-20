import { ApolloServer, gql, AuthenticationError } from 'apollo-server-micro';
import jwt from 'jsonwebtoken';
import typeDefs from '../../lib/graphqlShema';
import resolvers from '../../lib/graphqlResolvers';
import createDataSource from '../../lib/DataSource';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { NullableUser, TokenPayload } from '../../lib/Types';

const context = async ({ req }: { req: MicroRequest }) => {
  const auth: string = (req.headers && req.headers.authorization) || '';

  let user: NullableUser;
  const dataSource = createDataSource();

  if (auth) {
    try {
      const data: unknown = jwt.verify(auth.split(' ')[1], process.env.TOKEN_KEY as string);
      if (data && typeof data === 'object') {
        user = await dataSource.users.getUserById((data as TokenPayload).id);
        dataSource.currentUser = user;
      }
    } catch (e) {
      throw new AuthenticationError(e.message);
    }
  }

  return {
    dataSource,
    user,
  };
};

const apolloServer = new ApolloServer({ typeDefs, resolvers, context });

export default apolloServer.createHandler({ path: '/api/graphql' });

export const config = {
  api: {
    bodyParser: false,
  },
};
