import React, {ReactNode} from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface IAllBackgroundProps {
  children: ReactNode;
  Style?: StyleProp<ViewStyle>;
}

const GradientBackGround = (props: IAllBackgroundProps) => {
  const {Style} = props;

  return (
    <LinearGradient
      colors={['#002E5E', '#092038', '#12529F', '#0E4383', '#000B1A']}
      locations={[0.0119, 0.0751, 0.3045, 0.5474, 1]}
      useAngle={true}
      angle={280.3}
      style={[styles.container, Style]}>
      {props.children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
});

export default GradientBackGround;
