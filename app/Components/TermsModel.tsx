import React from 'react';
import {
  StyleProp,
  ViewStyle,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextProps,
  TouchableOpacity,
} from 'react-native';

const width = Dimensions.get('screen').width;

import LinearGradient from 'react-native-linear-gradient';
import Button from './Button';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  header?: string;
  subHeader?: string;
  HeaderStyle?: StyleProp<TextProps>;
  onClose?: () => void;
  onButtonPress?: () => void;
}

const TermsModel = (props: Props) => {
  const {
    containerStyle,
    header,
    subHeader,
    HeaderStyle,
    onClose,
    onButtonPress,
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
        <TouchableOpacity onPress={onClose}>
          <AntDesign name="closecircle" style={styles.iconStyleCross} />
        </TouchableOpacity>
        <View style={{marginVertical: 20, alignItems: 'center'}}>
          <Text style={[styles.headerTextStyle, HeaderStyle]}>{header}</Text>
          <Text style={styles.subHeaderTextStyle}>{subHeader}</Text>
        </View>
        <Button
          lable="Know More"
          labelStyle={{color: '#fff', fontWeight: '600'}}
          buttonWidth={width / 3}
          buttonHeight={40}
          buttonStyle={{margin: 20}}
          onPress={onButtonPress}
        />
      </LinearGradient>
    </View>
  );
};
export default TermsModel;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    right: 0,
    left: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
  },
  headerTextStyle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    margin: 15,
  },
  subHeaderTextStyle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'justify',
    lineHeight: 20,
  },
  holderStyle: {
    width: width - 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 20,
  },
  iconStyleCross: {
    color: '#fff',
    fontSize: 26,
    position: 'relative',
    top: 0,
    left: 140,
  },
});
