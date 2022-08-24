import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  StyleSheet,
  Text,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  header?: string;
  subHeader?: string;
}

const Loader = (props: Props) => {
  const {containerStyle, header, subHeader} = props;
  return (
    <LinearGradient
      colors={['#012E5E', '#092039']}
      locations={[0, 1]}
      useAngle={true}
      angle={180}
      style={[styles.container, containerStyle]}>
      <ActivityIndicator color={'white'} size="large" />
      <Text style={styles.headerTextStyle}>{header}</Text>
      <Text style={styles.subHeaderTextStyle}>{subHeader}</Text>
    </LinearGradient>
  );
};
export default Loader;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    right: 0,
    left: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.85,
  },
  headerTextStyle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    marginVertical: 15,
  },
  subHeaderTextStyle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
  },
});
