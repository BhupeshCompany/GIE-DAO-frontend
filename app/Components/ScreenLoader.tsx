import {appStyles, colors} from 'app/Styles/theme';
import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';

const ScreenLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={colors.white} />
    </View>
  );
};
export default ScreenLoader;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flex: 1,
    ...appStyles.flexRowAJCenter,
    zIndex: 1000,
  },
});
