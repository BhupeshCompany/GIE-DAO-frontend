import {appStyles} from 'app/Styles/theme';
import React from 'react';
import {ImageBackground} from 'react-native';

const GradientFill = ({children}) => {
  return (
    <ImageBackground
      source={require('app/Assets/Gradient/asset-screen-bg.png')}
      style={appStyles.flex1}>
      {children}
    </ImageBackground>
  );
};
export default GradientFill;
