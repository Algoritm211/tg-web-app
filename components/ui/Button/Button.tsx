import {Button, ButtonProps} from "antd";
import React from "react";

interface Props extends ButtonProps {
  icon: string
}

export const BuyButton: React.FC<Props> = ({icon, children, ...props}) => {
  return (
    <Button {...props}>
      <i className={`fas ${icon} mr-2`} />
      {children}
    </Button>
  )
}
