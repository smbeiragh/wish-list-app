import React, { useState } from 'react';
import { OpenGraph } from '../Types';
import WishForm, { IFormInputs } from './WishForm';
import * as openGraphQuery from '../queries/openGraph';
import { useApolloClient } from '@apollo/client';
import { SubmitHandler } from 'react-hook-form';
import classNames from 'classnames';
import * as yup from 'yup';

interface PropTypes {
  submitText: string;
  onSubmit: SubmitHandler<IFormInputs>;
  defaultValues?: IFormInputs;
  onCancel?(): void;
  className?: string;
}

interface IView {
  title?: string;
  note?: string;
  imageUrl?: string;
  url?: string;
}

type View = IView | null | undefined;

type ViewKeys = keyof View;

const getField = function (sources: View[], name: ViewKeys, defaultValue = '') {
  for (let i = 0; i < sources.length; i += 1) {
    if (sources[i] && (sources[i] as any)[name]) {
      return (sources[i] as any)[name];
    }
  }
  return defaultValue;
};

export default function WishEditor(props: PropTypes) {
  const { onSubmit, defaultValues, submitText, onCancel, className } = props;

  const [openGraph, setOpenGraph] = useState<OpenGraph | null | undefined>();
  const [openGraphError, setOpenGraphError] = useState<boolean>(false);
  const [openGraphUrl, setOpenGraphUrl] = useState<string>('');

  const client = useApolloClient();

  async function handleChangeUrl(url: string) {
    if (yup.string().url().isValidSync(url)) {
      setOpenGraphError(false);
      setOpenGraphUrl(url);
      const { data } = await client.query<openGraphQuery.Result, { url: string }>({
        query: openGraphQuery.QUERY,
        variables: { url },
      });

      if (data && data.openGraph && data.openGraph.success) {
        setOpenGraph(data.openGraph.data);
      } else {
        setOpenGraphError(true);
      }
    }
  }

  return (
    <div className={classNames('flex flex-col md:flex-row md:space-x-4', className)}>
      <div className="flex-1 bg-indigo-100 p-6 rounded-sm mb-4">
        <WishForm
          submitText={submitText}
          onSubmit={(wish) => {
            onSubmit(wish);
            if (!defaultValues) {
              // is creation action
              setOpenGraph(null);
            }
          }}
          onChangeUrl={handleChangeUrl}
          openGraph={openGraph}
          defaultValues={defaultValues}
          onCancel={onCancel}
        />
      </div>

      <div className="flex-1 bg-indigo-100 p-6 rounded-sm mb-4">
        <h3 className="text-indigo-900 text-3xl mb-1">
          {getField([openGraph, defaultValues], 'title' as ViewKeys, '[empty title]')}
        </h3>
        {openGraphError && (
          <div className="text-red-600 mb-1">
            Error Fetching link information
            <button
              className="text-indigo-800 px-1 underline"
              onClick={() => {
                handleChangeUrl(openGraphUrl);
              }}
            >
              Retry
            </button>
          </div>
        )}
        <figure>
          <div className="mb-2 rounded-sm bg-gray-500">
            <img
              className="object-contain h-48 w-full"
              src={getField([openGraph, defaultValues], 'imageUrl' as ViewKeys, '/tmp.gif')}
            />
          </div>
          <figcaption>
            <p className="text-sm mb-2">{getField([openGraph, defaultValues], 'note' as ViewKeys, '[empty note]')}</p>
            <a
              className="text-base text-indigo-900 uppercase"
              href={getField([openGraph, defaultValues], 'url' as ViewKeys, '#')}
              target="_blank"
              rel="noreferrer"
            >
              View Details
            </a>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
