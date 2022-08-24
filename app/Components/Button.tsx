import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface IAllButtonProps {
  lable?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  mainStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  showActivityIndicator?: boolean;
  buttonWidth?: number;
  buttonHeight?: number;
}

const Button = (props: IAllButtonProps) => {
  const {
    lable,
    buttonStyle,
    labelStyle,
    onPress,
    disabled,
    showActivityIndicator,
    buttonWidth,
    buttonHeight,
    mainStyle,
  } = props;
  return (
    <View style={[styles.mainContainer, mainStyle]}>
      <LinearGradient
        colors={['#12529F', '#002E5E']}
        style={[styles.container, buttonStyle, {width: buttonWidth}]}>
        <TouchableOpacity
          style={[
            {justifyContent: 'center', alignItems: 'center'},
            {width: '100%', height: buttonHeight},
          ]}
          onPress={onPress}
          disabled={disabled}>
          {showActivityIndicator ? (
            <ActivityIndicator color={'#fff'} size="small" />
          ) : (
            <Text style={labelStyle}>{lable}</Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0)',
    borderRadius: 8,
    alignContent: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(1,1,1,1)',
    elevation: 26,
  },
  mainContainer: {
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 10,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(4, 34, 60, 1)',
  },
});

export default Button;
