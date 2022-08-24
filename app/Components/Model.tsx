import React from 'react';
import {
  Image,
  StyleProp,
  ViewStyle,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextProps,
} from 'react-native';

const width = Dimensions.get('screen').width;

import LinearGradient from 'react-native-linear-gradient';
import Button from './Button';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  header?: string;
  subHeader?: string;
  source?: any;
  HeaderStyle?: StyleProp<TextProps>;
  onClose?: () => void;
  messageOnButton?: string;
}

const Model = (props: Props) => {
  const {
    containerStyle,
    header,
    subHeader,
    source,
    HeaderStyle,
    onClose,
    messageOnButton,
  } = props;
  return (
    <View
      style={[styles.container, {backgroundColor: 'rgba(4, 21, 39, 0.85)'}]}>
      <LinearGradient
        colors={['#002E5E', '#092038']}
        locations={[0, 1]}
        useAngle={true}
        angle={180}
        style={[styles.holderStyle, containerStyle]}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={source}
            style={{height: 55, width: 55}}
            resizeMode="contain"
          />
          <View style={{alignItems: 'center', width: '90%'}}>
            <Text style={[styles.headerTextStyle, HeaderStyle]}>{header}</Text>
            <Text style={styles.subHeaderTextStyle}>{subHeader}</Text>
          </View>
          <Button
            lable={messageOnButton ? messageOnButton : 'Done'}
            labelStyle={{color: '#fff', fontWeight: '600'}}
            buttonWidth={width / 3}
            buttonHeight={40}
            buttonStyle={{marginTop: 20}}
            onPress={onClose}
          />
        </View>
      </LinearGradient>
    </View>
  );
};
export default Model;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    right: 0,
    left: 0,
    flex: 1,
    alignItems: 'center',
    opacity: 1,
  },
  headerTextStyle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    marginTop: 15,
    textAlign: 'center',
  },
  subHeaderTextStyle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  holderStyle: {
    width: width / 1.4,
    height: width / 1.4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: width / 2,
    borderRadius: 5,
  },
});
