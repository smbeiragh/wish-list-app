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
  url?: string;
  title?: string;
  note?: string;
  rate?: number;
  imageUrl?: string;
}

interface PropTypes {
  submitText: string;
  onSubmit: SubmitHandler<IFormInputs>;
  onChangeUrl?(url: string): void;
  defaultValues?: IFormInputs;
  openGraph?: OpenGraph | null | undefined;
  onCancel?(): void;
}

const schema = yup.object().shape({
  url: yup.string().url().required().max(255),
  title: yup.string().required().max(45),
  note: yup.string().max(255),
  rate: yup.number().integer().min(0).max(5),
});

export default function WishForm(props: PropTypes) {
  const { submitText, onSubmit, defaultValues = {}, onChangeUrl, openGraph, onCancel } = props;
  const { control, register, handleSubmit, errors, getValues, setValue, reset } = useForm<IFormInputs>({
    ...(defaultValues ? { defaultValues } : {}),
    resolver: yupResolver(schema),
  });

  const debouncedOnChangeUrl = useCallback(
    debounce((url: string) => {
      if (onChangeUrl) {
        onChangeUrl(url);
      }
    }, 200),
    [onChangeUrl],
  );

  // const debouncedOnChangeUrl = useMemo(()=> {
  //   return debounce((url: string) => {
  //     if(onChangeUrl) {
  //       onChangeUrl(url)
  //     }
  //   }, 200);
  // },[onChangeUrl]);

  const handleOnChangeUrl = async (e: ChangeEvent<HTMLInputElement>) => {
    debouncedOnChangeUrl(e.target.value);
  };

  useEffect(() => {
    if (openGraph) {
      const values = getValues(['title', 'note']);
      if (!values.title) {
        setValue('title', openGraph.title, {
          shouldDirty: true,
        });
      }
      if (!values.note) {
        setValue('note', openGraph.note, {
          shouldDirty: true,
        });
      }
    }
  }, [openGraph]);

  return (
    <form
      onSubmit={handleSubmit((values) => {
        if (openGraph && openGraph.imageUrl) {
          values.imageUrl = openGraph.imageUrl;
        } else if (defaultValues && defaultValues.imageUrl) {
          values.imageUrl = defaultValues.imageUrl;
        }
        onSubmit(values);
        if (!defaultValues) {
          // is creation action
          reset();
        }
      })}
    >
      <div className="mb-4">
        <label className="text-indigo-900">Url</label>
        <input
          name="url"
          onChange={handleOnChangeUrl}
          ref={register({ required: true, maxLength: 255 })}
          className="c-input"
        />
        <div className="text-red-500">{errors.url?.message}</div>
      </div>
      <div className="mb-4">
        <label className="text-indigo-900">Title</label>
        <input name="title" ref={register({ required: true, maxLength: 45 })} className="c-input" />
        <div className="text-red-500">{errors.title?.message}</div>
      </div>
      <div className="mb-8">
        <label className="text-indigo-900">Note</label>
        <textarea name="note" ref={register({ maxLength: 255 })} className="c-input" />
        <div className="text-red-500">{errors.note?.message}</div>
      </div>
      <div className="flex flex-row md:space-x-2">
        <div className="flex flex-row flex-1 items-center md:space-x-2">
          <label className="text-indigo-900">Rate</label>
          <Controller defaultValue={0} name="rate" as={<Rating className="" />} control={control} />
        </div>
        {!!onCancel && (
          <button type="button" onClick={() => onCancel()} className="btn-gray self-end">
            Cancel
          </button>
        )}
        <button type="submit" className="btn-indigo self-end">
          {submitText}
        </button>
      </div>
    </form>
  );
}
