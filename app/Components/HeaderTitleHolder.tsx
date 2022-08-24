import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
/** Entypo library for icons */
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

interface IAllHeaderProps {
  headerTitle?: string;
  headerSubTitle?: string;
  entypoIconName?: string;
  antDesign?: string;
  simpleLineIcons?: string;
}

const logoColor = 'rgba(255,255,255,0.5)';
const HeaderTitleHolder = (props: IAllHeaderProps) => {
  const {
    headerTitle,
    headerSubTitle,
    entypoIconName,
    antDesign,
    simpleLineIcons,
  } = props;

  /**condition to select icon library */
  const iconRender = () => {
    if (entypoIconName) {
      return (
        <Entypo
          name={entypoIconName}
          style={{color: logoColor, fontSize: 45, marginBottom: 10}}
        />
      );
    }
    if (antDesign) {
      return (
        <AntDesign
          name={antDesign}
          style={{color: logoColor, fontSize: 55, marginBottom: 10}}
        />
      );
    }
    if (simpleLineIcons) {
      return (
        <SimpleLineIcons
          name={simpleLineIcons}
          style={{color: logoColor, fontSize: 45, marginBottom: 10}}
        />
      );
    }
    return null;
  };

  return (
    <View
      style={[
        styles.headerTitleHolder,
        entypoIconName || antDesign || simpleLineIcons
          ? {justifyContent: 'space-between'}
          : {justifyContent: 'space-evenly'},
      ]}>
      {iconRender()}
      <Text style={styles.headerTextStyle}>{headerTitle}</Text>
      <Text style={styles.headerParaText}>
        {headerSubTitle ? headerSubTitle : null}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerTextStyle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerParaText: {
    color: logoColor,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  headerTitleHolder: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Dimensions.get('screen').width - 28,
  },
});

export default HeaderTitleHolder;
