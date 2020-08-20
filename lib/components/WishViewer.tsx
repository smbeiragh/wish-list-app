import React, { useState } from 'react';
import Rating from './Rating';
import { User, Wish } from '../Types';
import * as deleteWishQuery from '../queries/deletetWish';
import * as updateWishQuery from '../queries/updateWish';
import * as myWishes from '../queries/myWishes';
import WishEditor from './WishEditor';
import { useMutation } from '@apollo/client';
import classNames from 'classnames';

interface PropTypes {
  wish: Wish;
  readOnly?: boolean;
}

export default function WishItem(props: PropTypes) {
  const { wish, readOnly = false } = props;

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [deleteWish, { loading: deleteWishLoading }] = useMutation<deleteWishQuery.Result, deleteWishQuery.Variables>(
    deleteWishQuery.QUERY,
    {
      update(cache, { data }) {
        if (data && data.deleteWish) {
          const result = data && data.deleteWish;
          const id: number | null = result && result.data ? result.data[0] : null;
          const myWishesResult = cache.readQuery<myWishes.MyWishes, null>({
            query: myWishes.QUERY,
          });

          if (myWishesResult) {
            cache.writeQuery<myWishes.MyWishes, null>({
              query: myWishes.QUERY,
              data: {
                me: {
                  ...(myWishesResult ? myWishesResult.me : {}),
                  wishes: (myWishesResult && myWishesResult.me.wishes ? myWishesResult.me.wishes : []).filter(
                    (wish) => wish.id !== id,
                  ),
                } as User,
              },
            });
          }
        }
      },
    },
  );

  const [updateWish /*, { loading: updateWishLoading, error: updateWishError }*/] = useMutation<
    updateWishQuery.Result,
    updateWishQuery.Variables
  >(updateWishQuery.QUERY, {
    update(cache, { data }) {
      if (data && data.updateWish) {
        const result = data && data.updateWish;
        const wish: Wish | null = result && result.data ? result.data[0] : null;
        if (wish) {
          const myWishesResult = cache.readQuery<myWishes.MyWishes, null>({
            query: myWishes.QUERY,
          });
          cache.writeQuery<myWishes.MyWishes, null>({
            query: myWishes.QUERY,
            data: {
              me: {
                ...(myWishesResult ? myWishesResult.me : {}),
                wishes: (myWishesResult && myWishesResult.me.wishes ? myWishesResult.me.wishes : []).map(
                  (cacheItem: Wish) => {
                    if (cacheItem.id === wish.id) {
                      return {
                        ...cacheItem,
                        ...wish,
                      };
                    }
                    return cacheItem;
                  },
                ),
              } as User,
            },
          });
        }
      }
    },
  });

  return (
    <div
      className={classNames(
        'flex flex-col sm:flex-row sm:space-x-4 mb-4 bg-gray-200 p-6 rounded-sm transition-color duration-500 ease-in-out',
        { 'pb-2 bg-yellow-100': isEditing },
      )}
      key={wish.id}
    >
      {isEditing && (
        <WishEditor
          defaultValues={wish}
          submitText="Save Changes"
          onSubmit={(formValues) => {
            updateWish({ variables: { wish: { ...formValues, userId: wish?.userId }, wishId: wish?.id } });
            setIsEditing(false);
          }}
          onCancel={() => {
            setIsEditing(false);
          }}
        />
      )}
      {!isEditing && (
        <>
          <div className="flex-1">
            <h3 className="text-indigo-900 text-3xl mb-1">{wish.title}</h3>
            <div className="rounded-sm bg-gray-500">
              <img className="object-contain h-48 w-full" src={wish.imageUrl} />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between sm:pt-12">
            <p className="text-sm mb-2">{wish.note}</p>
            <div className="flex flex-row">
              <div className="flex-1">
                {readOnly && (
                  <a className="text-base text-indigo-900 uppercase" href={wish.url} target="_blank" rel="noreferrer">
                    View & Purchase
                  </a>
                )}
                {!readOnly && (
                  <>
                    <Rating readOnly value={wish.rate} />
                    <a className="text-base text-indigo-900 uppercase" href={wish.url} target="_blank" rel="noreferrer">
                      View Details
                    </a>
                  </>
                )}
              </div>
              {readOnly && (
                <div className="flex-1 flex flex-row justify-end">
                  <Rating readOnly value={wish.rate} />
                </div>
              )}
              {!readOnly && (
                <div className="flex-1 flex flex-row justify-end space-x-2">
                  <button
                    className="btn-indigo"
                    disabled={deleteWishLoading}
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  >
                    edit
                  </button>
                  <button
                    className="btn-red-outline"
                    onClick={() => {
                      deleteWish({ variables: { wishId: wish.id } });
                    }}
                  >
                    delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
