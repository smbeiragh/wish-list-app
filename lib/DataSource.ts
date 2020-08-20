import knex from 'knex';
import { createUserProvider } from './UserProvider';
import { createWishProvider } from './WishProvider';
import { DataSource } from './Types';

const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

export default function createDataSource(): DataSource {
  // eslint-disable-next-line prefer-const
  let dataSource: DataSource;

  const getDataSource: () => DataSource = () => {
    return dataSource;
  };

  dataSource = {
    users: createUserProvider({ db, getDataSource }),
    wishes: createWishProvider({ db, getDataSource }),
    currentUser: null,
  };

  return dataSource;
}
