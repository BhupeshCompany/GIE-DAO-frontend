import React from 'react';
import {
  View,
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Text,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import normalize from '../Utils/normalize';

interface IAllBackgroundProps {
  Style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ViewStyle>;
  value: any;
  onValueSelect?: (item: {id: string; logo: any; title: string}) => void;
  onTouchField?: () => void;
}

const DropDown = (props: IAllBackgroundProps) => {
  const {Style, value, onTouchField, imageStyle} = props;

  return (
    <View>
      <TouchableOpacity
        style={[styles.touchableField, Style]}
        onPress={() => {
          onTouchField();
        }}>
        <View style={{flexDirection: 'row'}}>
          {value?.logo ? (
            <View style={[{padding: 2}, imageStyle]}>
              <Image
                source={value?.logo ? {uri:value.logo} : null}
                style={{height: 18, width: 18}}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View style={[{padding: 2}, imageStyle]}>
              <Image
                source={require('../Assets/Png/ethLogo.png')}
                style={{height: 18, width: 18}}
                resizeMode="contain"
              />
            </View>
          )}

          <View style={styles.valueHolder}>
            <Text style={styles.selectedText}>
              {value?.symbol ? value.symbol : 'Select Token'}
            </Text>
          </View>
          <View style={{paddingLeft: 4, alignSelf: 'center'}}>
            <AntDesign name="caretdown" style={{fontSize: 10, color: '#fff'}} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 1,
  },
  touchableField: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(3),
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 8,
    shadowOpacity: 0.9,
    shadowColor: 'rgba(48, 42, 42, 0.25)',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  valueHolder: {
    paddingHorizontal: normalize(5),
    paddingVertical: normalize(2),
  },
  dropDownHolder: {
    position: 'absolute',
    top: normalize(37),
    zIndex: normalize(5),
    backgroundColor: 'rgba(0,0, 0, 0.5)',
  },
});

export default DropDown;
