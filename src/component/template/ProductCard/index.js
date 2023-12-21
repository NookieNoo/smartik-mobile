import { observer } from 'mobx-react-lite';
import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import styled from 'styled-components/native';
import CartCard from './CartCard';
import CatalogCard from './CatalogCard';

const ProductCard = ({ product, index, type = 'catalog', ...props }) => {
  const render = () => {
    if (typeof product === 'number') {
      return (
        <></>
        /*<Loader viewBox={"0 0 100 100"} preserveAspectRatio={"none"}>
					<Rect rx="10" ry="5" width={100} height={100}/>
				</Loader>*/
      );
    }
    switch (type) {
      case 'catalog': {
        return <CatalogCard product={product} index={index} price={product.prices[0]} />;
      }
      case 'cart': {
        return <CartCard product={product} index={index} />;
      }
    }
  };

  return <Wrapper {...props}>{render()}</Wrapper>;
};

export default observer(ProductCard);

const Wrapper = styled.View`
  flex: 1;
`;
const Loader = styled(ContentLoader)``;
