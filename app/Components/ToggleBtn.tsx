import {colors} from 'app/Styles/theme';
import normalize from 'app/Utils/normalize';
import React from 'react';
import {StyleSheet} from 'react-native';
import SwitchToggle from 'react-native-switch-toggle';
type ISwitch = {value: boolean; onValueChange: () => void};
const ToggleButton = (props: ISwitch) => {
  const {value, onValueChange} = props;
  return (
    <SwitchToggle
      switchOn={value}
      onPress={onValueChange}
      circleColorOff="#0061D7"
      circleColorOn="#64757D"
      backgroundColorOn="#092038"
      backgroundColorOff="#092038"
      containerStyle={styles.containerStyle}
      circleStyle={styles.circleStyle}
    />
  );
};
export default ToggleButton;

const styles = StyleSheet.create({
  containerStyle: {
    width: normalize(64),
    height: normalize(32, 'height'),
    borderRadius: normalize(18),
    padding: normalize(5),
  },
  circleStyle: {
    width: normalize(32),
    height: normalize(24, 'height'),
    borderRadius: normalize(14),
  },
});
