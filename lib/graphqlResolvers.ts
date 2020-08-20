import { User, LoginInput, WishInput, GraphqlContext, UserInput } from './Types';

const resolvers = {
  Query: {
    users(parent: any, args: any, { dataSource }: GraphqlContext) {
      return dataSource.users.users();
    },
    me(parent: any, args: any, { dataSource, user }: GraphqlContext) {
      return user;
    },
    openGraph(parent: any, { url }: { url: string }, { dataSource }: GraphqlContext) {
      return dataSource.wishes.getOpenGraph(url);
    },
    getUserByUrl(parent: any, { urlShortName }: { urlShortName: string }, { dataSource }: GraphqlContext) {
      return dataSource.users.getUserByUrl(urlShortName);
    },
  },
  User: {
    wishes(parent: User, args: any, { dataSource }: GraphqlContext) {
      return dataSource.wishes.getUserWishes(parent.id);
    },
  },
  Mutation: {
    login(parent: any, { email, password }: LoginInput, { dataSource }: GraphqlContext) {
      return dataSource.users.login({ email, password });
    },
    register(parent: any, { email, password }: LoginInput, { dataSource }: GraphqlContext) {
      return dataSource.users.register({ email, password });
    },
    updateUser(parent: any, { user, userId }: { user: UserInput; userId: number }, { dataSource }: GraphqlContext) {
      return dataSource.users.updateUser(user, userId);
    },
    addWish(parent: any, { wish }: { wish: WishInput }, { dataSource }: GraphqlContext) {
      return dataSource.wishes.createWish(wish);
    },
    deleteWish(parent: any, { wishId }: { wishId: number }, { dataSource }: GraphqlContext) {
      return dataSource.wishes.deleteWish(wishId);
    },
    updateWish(parent: any, { wish, wishId }: { wish: WishInput; wishId: number }, { dataSource }: GraphqlContext) {
      return dataSource.wishes.updateWish(wishId, wish);
    },
  },
};

export default resolvers;
