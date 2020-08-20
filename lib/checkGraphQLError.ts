import { ApolloError } from '@apollo/client';

export default function checkGraphQLError(error: ApolloError | undefined, code: string) {
  if (error && error.graphQLErrors) {
    const e = error.graphQLErrors.find((e) => e.extensions && e.extensions.code === code);
    if (e) {
      return true;
    }
    return false;
  }
}
