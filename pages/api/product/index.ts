import type { NextApiRequest, NextApiResponse } from 'next';
import { ProductItem } from '../../../typings';
import { itemsInfo } from './products.mock';

const getAllProducts = (req: NextApiRequest, res: NextApiResponse<ProductItem[]>) => {
  try {
    return res.status(200).json(itemsInfo);
  } catch (error) {
    return res.status(500);
  }
};

export default getAllProducts;
