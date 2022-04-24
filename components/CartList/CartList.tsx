import React from 'react';
import { CartListItem } from './CartListItem';
import { ProductItem } from '../../typings';

interface Props {
  cart: Array<ProductItem>;
}

export const CartList: React.FC<Props> = ({ cart }) => {
  const cartsBlock = cart.map((item) => {
    return <CartListItem key={item.id} productItem={item} />;
  });

  return <>{cartsBlock}</>;
};
