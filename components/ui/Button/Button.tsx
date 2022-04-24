import { Button, ButtonProps } from 'antd';
import React from 'react';

interface Props extends ButtonProps {
  iconClass: string;
}

export const BuyButton: React.FC<Props> = ({ iconClass, children, ...props }) => {
  return (
    <Button {...props}>
      <i className={`fas ${iconClass} mr-2`} />
      {children}
    </Button>
  );
};
