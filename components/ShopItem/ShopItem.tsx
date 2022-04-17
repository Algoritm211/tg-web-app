import {Col} from "antd";
import {ProductItem} from "../../typings";
import React from "react";
import {BuyButton} from "../ui/Button/Button";

interface Props {
  cart: ProductItem[];
  product: ProductItem;
  RemoveProduct: (product: ProductItem) => void
  showModal: (product: ProductItem) => void
}

export const ShopItem: React.FC<Props> = ({cart, RemoveProduct, showModal, product}) => {
  const {id, title, price, imgSource} = product
  const isItemAdded = cart.some(e => e.id === id)

  const themeParams = window.Telegram.WebApp.themeParams

  return (
    <Col span={8}>
      <div style={{height: "100%"}}>
        <img
          className='mb-2' style={{
          width: "100%",
          height: "200px",
          objectFit: "cover"
        }} src={imgSource} alt={title}
        />
        <h4
          style={{color: themeParams.text_color}}
          className='elipsis-title'
        >{title}</h4>
        <h5
          style={{color: themeParams.text_color}}
          className='d-flex mb-2 justify-content-start'
        > {price}₴</h5>
        <div className='d-flex justify-content-center'>
          {isItemAdded ?
            <BuyButton
              icon='fa-check'
              type='primary'
              ghost
              onClick={() => {
                RemoveProduct(product)
              }}
            >Added</BuyButton> :
            <BuyButton
              icon='fa-cart-plus'
              type='primary'
              onClick={() => {
                showModal(product)
              }}
            >Add</BuyButton>
          }
        </div>
      </div>
    </Col>
  )
}
