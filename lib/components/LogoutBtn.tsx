import React from 'react';
import { useApolloClient } from '@apollo/client';
import jsCookie from 'js-cookie';
import * as meQuery from '../queries/me';
import classNames from 'classnames';

interface PropTypes {
  className?: string;
}

export default function LogoutBtn(props: PropTypes) {
  const { className } = props;

  const client = useApolloClient();

  return (
    <button
      className={classNames(className)}
      onClick={() => {
        jsCookie.remove('token');
        client.writeQuery<meQuery.Me, null>({ query: meQuery.QUERY, data: { me: null } });
      }}
    >
      Logout
    </button>
  );
}
