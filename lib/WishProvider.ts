import Knex from 'knex';
import ogs, { ErrorResult } from 'open-graph-scraper';
import { ForbiddenError } from 'apollo-server-micro';
import { OpenGraph, UpdateResult, Wish, WishInput, DataSource } from './Types';

export interface WishProvider {
  getUserWishes(userId: number): Promise<Wish[]>;
  createWish(wish: WishInput): Promise<UpdateResult<Wish[]>>;
  updateWish(wishId: number, wish: WishInput): Promise<UpdateResult<Wish[]>>;
  deleteWish(wishId: number): Promise<UpdateResult<number[]>>;
  getOpenGraph(url: string): Promise<UpdateResult<OpenGraph>>;
}

export function createWishProvider({ db, getDataSource }: { db: Knex; getDataSource: () => DataSource }): WishProvider {
  const wishProvider: WishProvider = {
    async getUserWishes(userId: number) {
      return db.select('*').from<Wish>('wishes').where({ userId });
    },
    async createWish(wish: WishInput) {
      const dataSource = getDataSource();
      if (dataSource?.currentUser?.id === wish.userId) {
        const [id]: number[] = await db('wishes').insert(wish);
        return {
          success: true,
          message: '',
          data: [
            {
              id,
              ...wish,
            } as Wish,
          ],
        };
      } else {
        throw new ForbiddenError("Access denied - you're not allowed to create a wish for this user");
      }
    },
    async updateWish(wishId: number, wishInput: WishInput) {
      const dataSource = getDataSource();
      const wish = (await db.select('*').from<Wish>('wishes').where({ id: wishId }))[0];
      if (dataSource?.currentUser?.id === (wish && wish?.userId)) {
        await db('wishes').where({ id: wishId }).update<WishInput>(wishInput);
        return {
          success: true,
          message: '',
          data: [
            {
              id: wishId,
              ...wishInput,
            } as Wish,
          ],
        };
      } else {
        throw new ForbiddenError("Access denied - you're not allowed to update this wish");
      }
    },
    async deleteWish(wishId: number) {
      const dataSource = getDataSource();
      const wish = (await db.select('*').from<Wish>('wishes').where({ id: wishId }))[0];
      if (dataSource?.currentUser?.id === (wish && wish?.userId)) {
        await db('wishes').where({ id: wishId }).delete();
        return {
          success: true,
          message: '',
          data: [wishId],
        };
      } else {
        throw new ForbiddenError("Access denied - you're not allowed to delete this wish");
      }
    },
    async getOpenGraph(url: string) {
      let og;

      try {
        og = await ogs({
          url,
          headers: { 'user-agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; .NET CLR 1.0.3705;)' },
          ogImageFallback: true,
          allMedia: true,
        });
      } catch (e) {
        return {
          success: false,
          message: `${e}`,
        };
      }

      if (og.error) {
        return {
          success: false,
          message: `${(og as ErrorResult).result.error}`,
        };
      } else if (og.result.success) {
        const img: any = og.result.ogImage;
        let imageUrl = null;
        if (img && img instanceof Array && img.length > 0) {
          imageUrl = img[0].url;
        } else if (img) {
          imageUrl = img.url;
        }
        if (!imageUrl) {
          imageUrl = 'http://localhost:3000/tmp.jpg';
        }
        return {
          success: true,
          message: 'ok',
          data: {
            id: url,
            url,
            title: og.result.ogTitle,
            imageUrl: imageUrl as string,
            note: og.result.ogDescription,
          },
        };
      } else {
        return {
          success: false,
          message: 'unknown error',
        };
      }
    },
  };
  return wishProvider;
}
