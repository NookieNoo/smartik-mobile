import React from 'react';

import Cart from '../assets/svg/icon/Cart';
import Home from '../assets/svg/icon/Home';
import Promo from '../assets/svg/icon/Promo';
import Catalog from '../assets/svg/icon/Catalog';
import Profile from '../assets/svg/icon/Profile';
import Trash from '../assets/svg/icon/Trash';
import MyLocation from '../assets/svg/icon/MyLocation';
import EmptyCart from '../assets/svg/icon/EmptyCart';
import Face from '../assets/svg/icon/Face';

const CustomIcon = ({ icon, ...props }) => {
  switch (icon) {
    case 'Cart': {
      return <Cart {...props} />;
    }
    case 'Face': {
      return <Face {...props} />;
    }
    case 'Home': {
      return <Home {...props} />;
    }
    case 'Promo': {
      return <Promo {...props} />;
    }
    case 'Catalog': {
      return <Catalog {...props} />;
    }
    case 'Profile': {
      return <Profile {...props} />;
    }
    case 'Trash': {
      return <Trash {...props} />;
    }
    case 'MyLocation': {
      return <MyLocation {...props} />;
    }
    case 'EmptyCart': {
      return <EmptyCart {...props} />;
    }
  }
};

export default CustomIcon;
