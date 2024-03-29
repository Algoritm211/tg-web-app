import React, { useEffect, useState } from 'react';
import { Drawer, Row } from 'antd';
import axios from 'axios';
import { ProductItem } from '../../typings';
import { CartList } from '../CartList/CartList';
import { AddToCartModal } from '../modals/AddToCartModal';
import { ShopItem } from '../ShopItem/ShopItem';

const Home: React.FC = () => {
  const [productList, setProductList] = useState<Array<ProductItem>>([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductItem | null>(null);
  const [cart, setCart] = useState<Array<ProductItem>>([]);
  const { themeParams } = window.Telegram.WebApp;
  const { user } = window.Telegram.WebApp.initDataUnsafe;

  useEffect(() => {
    const loadItems = async () => {
      const { data: productList } = await axios.get<ProductItem[]>('/api/product');
      setProductList(productList);
    };
    void loadItems();
  }, []);

  const RemoveProduct = (product: ProductItem) => {
    const newCart = cart.filter((el) => el.id !== product.id);
    setCart(newCart);
  };

  const showModal = (product: ProductItem) => {
    setIsModalVisible(true);
    setCurrentProduct(product);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const showDrawer = () => {
    setIsDrawerVisible(true);
    window.Telegram.WebApp.expand();
  };

  const makeInvoice = async () => {
    window.Telegram.WebApp.MainButton.showProgress(true);
    window.Telegram.WebApp.MainButton.disable(true);
    const { data } = await axios.post<{ message: string }>('/api/payments/createInvoice', {
      id: user.id,
      orderNumber: Math.floor(Math.random() * 9999999),
      userName: `${user.first_name} ${user.last_name}`,
      items: cart,
    });
    if (data.message === 'OK') {
      window.Telegram.WebApp.close();
    }
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const DrawerHeader = () => {
    return (
      <div className="d-flex align-items-center">
        <h3 style={{ color: themeParams.text_color }} className="m-0">
          Your order
        </h3>
        <a style={{ color: themeParams.link_color }} className="ml-auto mb-0" onClick={closeDrawer}>
          Edit
        </a>
      </div>
    );
  };

  const ShopDrawerModal = () => {
    return (
      <Drawer
        title={<DrawerHeader />}
        placement="bottom"
        bodyStyle={{ backgroundColor: themeParams.bg_color }}
        headerStyle={{
          backgroundColor: themeParams.bg_color,
          borderBottomColor: themeParams.link_color,
          borderRadius: 0,
        }}
        push={{ distance: 360 }}
        closable={false}
        height="100%"
        onClose={closeDrawer}
        visible={isDrawerVisible}
      >
        <CartList cart={cart} />
      </Drawer>
    );
  };

  if (typeof cart !== 'undefined' && cart.length > 0) {
    window.Telegram.WebApp.MainButton.show();
    if (!isDrawerVisible) {
      window.Telegram.WebApp.MainButton.setParams({
        text: 'View order',
        color: '#52c41a',
        text_color: '#ffffff',
      });
    } else {
      const initialValue = 0;
      const sum = cart.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.price;
      }, initialValue);
      window.Telegram.WebApp.MainButton.setText(`Pay ${sum}₴`);
    }
  } else {
    window.Telegram.WebApp.MainButton.hide();
  }

  const shopItems = productList.map((item) => {
    return <ShopItem showModal={showModal} RemoveProduct={RemoveProduct} key={item.id} cart={cart} product={item} />;
  });

  const callback = isDrawerVisible ? makeInvoice : showDrawer;
  useEffect(() => {
    window.Telegram.WebApp.onEvent('mainButtonClicked', callback);
    return () => {
      window.Telegram.WebApp.offEvent('mainButtonClicked', callback);
    };
  }, [callback]);

  return (
    <div
      className="App p-3"
      style={{
        background: themeParams.bg_color,
        color: themeParams.text_color,
      }}
    >
      <Row gutter={[16, 32]}>{shopItems}</Row>

      {/* <pre>
        Cart
        {JSON.stringify({ cart }, null, 2)}
      </pre>

      <pre>
        WebAppUser
        {JSON.stringify(window.Telegram.WebApp.initDataUnsafe.user, null, 2)}
      </pre> */}

      <ShopDrawerModal />
      <AddToCartModal
        cart={cart}
        product={currentProduct}
        setCart={setCart}
        setCurrentProduct={setCurrentProduct}
        setIsModalVisible={setIsModalVisible}
        closeModal={closeModal}
        isModalVisible={isModalVisible}
      />
    </div>
  );
};
export default Home;
