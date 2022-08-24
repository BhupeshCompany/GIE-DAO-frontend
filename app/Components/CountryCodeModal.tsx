import normalize from 'app/Utils/normalize';
import React from 'react';
import {
  Image,
  StyleProp,
  ViewStyle,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';

const width = Dimensions.get('screen').width;

import LinearGradient from 'react-native-linear-gradient';

const countryList = [
  {
    countryName: 'USA',
    countryCode: '+1',
    logo: require('../Assets/Png/usLogo.png'),
  },
  {
    countryName: 'India',
    countryCode: '+91',
    logo: require('../Assets/Png/indiaLogo.png'),
  },
];

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  onPressTile?: (item) => void;
}

const CountryCodeModal = (props: Props) => {
  const {containerStyle, onPressTile} = props;
  return (
    <View
      style={[styles.container, {backgroundColor: 'rgba(4, 21, 39, 0.85)'}]}>
      <LinearGradient
        colors={['#002E5E', '#092038']}
        locations={[0, 1]}
        useAngle={true}
        angle={180}
        style={[styles.holderStyle, containerStyle]}>
        <FlatList
          data={countryList}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={styles.phoneFieldLeftContainer}
                onPress={() => {
                  onPressTile(item);
                }}>
                <View style={styles.countryCodeArrowHolder}>
                  <Image source={item.logo} style={styles.logoStyle} />
                  <Text style={styles.comText}>{item.countryCode}</Text>
                </View>
                <View>
                  <Text style={styles.comText}>{item.countryName}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item.countryCode}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{height: 1, backgroundColor: 'rgba(4, 21, 39, 1)'}}
              />
            );
          }}
        />
      </LinearGradient>
    </View>
  );
};
export default CountryCodeModal;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    right: 0,
    left: 0,
    flex: 1,
    alignItems: 'center',
    opacity: 1,
  },
  headerTextStyle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    marginTop: 15,
    textAlign: 'center',
  },
  subHeaderTextStyle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  holderStyle: {
    width: width / 1.4,
    maxHeight: width / 1.4,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: width / 1.5,
    borderRadius: 5,
  },
  phoneFieldLeftContainer: {
    flexDirection: 'row',
    paddingVertical: normalize(16),
    width: width / 1.4,
  },
  countryCodeArrowHolder: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-around',
    borderRightWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 10,
    width: '26%',
    marginRight: normalize(15),
  },
  downArrowStyle: {
    color: '#fff',
    fontSize: 12,
    alignSelf: 'center',
  },
  logoStyle: {
    width: normalize(20),
    height: normalize(20),
    alignSelf: 'center',
  },
  comText: {
    color: 'rgba(255,255,255,0.7)',
    textAlignVertical: 'center',
  },
});
