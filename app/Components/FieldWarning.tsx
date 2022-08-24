import React from 'react';
import {View, StyleProp, StyleSheet, ViewStyle, Text} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {colors} from '../Styles/theme';

interface IAllBackgroundProps {
  Style?: StyleProp<ViewStyle>;
  title?: string;
}

const FieldWarning = (props: IAllBackgroundProps) => {
  const {Style, title} = props;

  return (
    <View style={[styles.field, Style]}>
      <Entypo name="warning" style={{fontSize: 13, color: colors.errorbg}} />
      <Text
        style={{
          color: '#fff',
          lineHeight: 14,
          fontSize: 10,
          paddingHorizontal: 5,
        }}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    width: '95%',
    flexDirection: 'row',
    padding: 4,
  },
});

export default FieldWarning;
