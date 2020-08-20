import React, { ChangeEvent, useCallback, useMemo, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import { useApolloClient } from '@apollo/client';
import * as openGraphQuery from '../queries/openGraph';
import debounce from 'lodash.debounce';

import Rating from './Rating';
import { OpenGraph } from '../Types';

export interface IFormInputs {
  email: string;
  password: string;
}

interface PropTypes {
  onSubmit: SubmitHandler<IFormInputs>;
}

const schema = yup.object().shape({
  email: yup.string().email().required().max(255),
  password: yup.string().required().max(45),
});

export default function LoginForm(props: PropTypes) {
  const { onSubmit } = props;
  const { register, handleSubmit, errors } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  return (
    <form className="bg-indigo-100 p-6 rounded-sm mb-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="text-indigo-900">Email</label>
        <input name="email" ref={register({ required: true, maxLength: 255 })} className="c-input" />
        <div className="text-red-500">{errors.email?.message}</div>
      </div>
      <div className="mb-4">
        <label className="text-indigo-900">Password</label>
        <input type="password" name="password" ref={register({ required: true, maxLength: 45 })} className="c-input" />
        <div className="text-red-500">{errors.password?.message}</div>
      </div>
      <div className="mb-4">
        <button type="submit" className="btn-indigo w-full self-end">
          Login
        </button>
      </div>
    </form>
  );
}
