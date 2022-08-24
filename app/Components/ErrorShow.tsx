import normalize from 'app/Utils/normalize';
import React from 'react';
import {View, StyleProp, StyleSheet, ViewStyle, Text,Image} from 'react-native';
import {colors} from '../Styles/theme';

interface IAllerrorShowProps {
  Style?: StyleProp<ViewStyle>;
  message?: string;
}

const ErrorShow = (props: IAllerrorShowProps) => {
  const {Style, message} = props;

  return (
    <View
      style={[
        styles.field,
        {
          display: message ? 'flex' : 'none',
        },
        Style,
      ]}>
      <Image
        source={require('../Assets/Png/errorWhite.png')}
        style={styles.alertIconstyle}
      />
      <Text
        style={{
          color: 'rgba(255,255,255,1)',
          fontSize: 11,
          width:'90%'
        }}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    backgroundColor: colors.errorbg,
    padding: 4,
    borderRadius: 5,
  },
  alertIconstyle: {
    width: normalize(15),
    height: normalize(15),
    alignSelf:'center',
    marginHorizontal:normalize(8)
  },
});

export default ErrorShow;
