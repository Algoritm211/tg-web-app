import {Tag} from "antd";
import {ProductItem} from "../../typings";
import React from "react";

interface Props {
  productItem: ProductItem
}

export const CartListItem: React.FC<Props> = ({productItem}) => {
  // @ts-ignore
  const {imgSource, title, price, size} = productItem
  const themeParams = window.Telegram.WebApp.themeParams

  return (
    <div className='py-2 d-flex align-items-center'>
      <img
        className='mr-2'
        style={{
          width: "30px",
          height: "30px",
          objectFit: "cover"
        }} src={imgSource} alt={title}
      />
      <h4
        className='m-0 mr-3 d-flex align-items-center'
        style={{
          fontWeight: "bold",
          color: themeParams.text_color
        }}
      >
        {title}
      </h4>
      <div className='ml-auto m-0 d-flex align-items-center'>
        <Tag
          className='m-0 d-flex align-items-center'
          color={themeParams.link_color}
        >{size}</Tag>
        <h4
          className='ml-3 m-0 d-flex align-items-center'
          style={{
            fontWeight: "bold",
            color: themeParams.text_color
          }}
        >
          {price}₴
        </h4>
      </div>
    </div>
  )
}
