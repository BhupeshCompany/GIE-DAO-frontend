import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Shimmer from 'react-native-shimmer';
import normalize from 'app/Utils/normalize';
import {colors} from 'app/Styles/theme';

interface Props {
  parentStyle?: any;
  childStyle?: any;
}
const staticItemArray = [0, 1, 2, 3, 4];
export default function TxnLoader({parentStyle, childStyle}: Props) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    }, 200);
  }, []);

  const renderLoaderItem = index => {
    if (Platform.OS === 'android') {
      return (
        <Shimmer style={[styles.parentLoader, parentStyle]} key={index}>
          <View style={[styles.cardLoading, childStyle]} />
        </Shimmer>
      );
    }

    return (
      <Shimmer
        style={[styles.parentLoader, parentStyle]}
        animating={loading}
        key={index}>
        <View style={[styles.cardLoading, childStyle]} />
      </Shimmer>
    );
  };

  return (
    <>
      {staticItemArray.map((item, index) => {
        return renderLoaderItem(index);
      })}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
  },
  parentLoader: {
    // marginHorizontal: normalize(20),
    marginTop: 10,
  },
  cardLoading: {
    backgroundColor: colors.white,
    borderRadius: normalize(8),
    height: normalize(60, 'height'),
    shadowColor: 'rgba(255, 255, 255, 0.4)',
    shadowOpacity: 0.5,
    shadowOffset: {height: 1, width: 3},
    shadowRadius: 10,
    elevation: 10,
  },
});
