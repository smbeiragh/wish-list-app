import React, { ChangeEvent, useCallback, useMemo, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import { useApolloClient } from '@apollo/client';
import * as openGraphQuery from '../queries/openGraph';
import debounce from 'lodash.debounce';

import Rating from './Rating';
import { OpenGraph } from '../Types';
import { useCurrentUser } from './AuthProvider';

export interface IFormInputs {
  fullName?: string;
  password?: string;
  urlShortName?: string;
}

interface PropTypes {
  onSubmit: SubmitHandler<IFormInputs>;
  defaultValues: IFormInputs;
}

const schema = yup.object().shape({
  fullName: yup.string().required().max(200),
  password: yup.string().max(45),
  urlShortName: yup.string().required().max(45),
});

export default function ProfileForm(props: PropTypes) {
  const { onSubmit, defaultValues } = props;

  const user = useCurrentUser();

  const { register, handleSubmit, errors } = useForm<IFormInputs>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  return (
    <form className="bg-indigo-100 p-6 rounded-sm mb-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="text-indigo-900">Name</label>
        <input name="fullName" ref={register()} className="c-input" />
        <div className="text-red-500">{errors.fullName?.message}</div>
      </div>
      <div className="mb-4">
        <label className="text-indigo-900">Your Wish List Link</label>
        <input name="urlShortName" ref={register()} className="c-input" />
        <div className="text-sx font-thin text-indigo-500">{`${process.env.NEXT_PUBLIC_BASE_URL}/w/${
          user?.urlShortName || 'YOUR_LINK'
        }`}</div>
        <div className="text-red-500">{errors.urlShortName?.message}</div>
      </div>
      <div className="mb-4">
        <label className="text-indigo-900">
          New Password <span className="text-sm">(change password?)</span>
        </label>
        <input type="password" name="password" ref={register()} className="c-input" />
        <div className="text-red-500">{errors.password?.message}</div>
      </div>
      <div className="mb-4">
        <button type="submit" className="btn-indigo w-full self-end">
          Update Profile
        </button>
      </div>
    </form>
  );
}
