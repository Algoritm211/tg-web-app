import React, { useState } from 'react';
import { Button, Modal, Radio, RadioChangeEvent } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { ProductItem } from '../../typings';

interface Props {
  cart: Array<ProductItem>;
  product: ProductItem | null;
  isModalVisible: boolean;
  setCart: (cart: Array<ProductItem>) => void;
  setCurrentProduct: (product: ProductItem | null) => void;
  setIsModalVisible: (value: boolean) => void;
  closeModal: () => void;
}

export const AddToCartModal: React.FC<Props> = ({ cart, product, isModalVisible, setCart, setCurrentProduct, closeModal }) => {
  const [size, setSize] = useState(null);
  const { themeParams } = window.Telegram.WebApp;

  const onChange = (event: RadioChangeEvent) => {
    if (event.target) {
      setSize(event.target.value);
    }
  };

  const AddProduct = (product: ProductItem) => {
    const newCart = [...cart, product];
    setCart(newCart);
    setSize(null);
    setCurrentProduct(null);
  };

  if (product === null) {
    return <></>;
  }

  const { imgSource, title, price, sizes } = product;

  return (
    // @ts-ignore
    <Modal
      style={{ top: 20 }}
      title={null}
      footer={null}
      closeIcon={<Button type="primary" shape="circle" icon={<CloseOutlined />} />}
      bodyStyle={{ backgroundColor: themeParams.bg_color }}
      visible={isModalVisible}
      onCancel={closeModal}
    >
      <div>
        <img
          className="mb-3"
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
          }}
          src={imgSource}
          alt={title}
        />
        <h3 style={{ color: themeParams.text_color }}>{title}</h3>
        <h4
          style={{
            fontWeight: 'bold',
            color: themeParams.text_color,
          }}
        >
          {price}₴
        </h4>
        <div className="my-3">
          <h4 style={{ color: themeParams.text_color }} className="mb-2">
            Choose size:
          </h4>
          <Radio.Group value={size} onChange={onChange} buttonStyle="solid">
            {sizes.map((size: string) => {
              return (
                <Radio.Button key={size} value={size}>
                  {size}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </div>
        <Button
          style={{ borderRadius: '8px' }}
          block
          size="large"
          type="primary"
          disabled={size === null}
          onClick={() => AddProduct(Object.assign(product, { size }))}
        >
          Add to cart
        </Button>
      </div>
    </Modal>
  );
};
