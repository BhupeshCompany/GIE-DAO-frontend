import React,{useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
  AlertIOS
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import MyWallet from 'app/Utils/myWallet';
import GradientBackGround from '../../Components/GradientBackGround';
import {colors} from '../../Styles/theme';
import normalize from '../../Utils/normalize';
import QRCode from 'react-native-qrcode-svg';

const deviceWidth = Dimensions.get('screen').width;
const maxCharacterToDisplay = 25;

const ReceiveTokens = () => {
  const [loggedInUser] = useState<string>(MyWallet.getWallet().address);

  return (
    <GradientBackGround>
      <View style={styles.subHolder}>
        <View style={styles.mainContainer}>
          <View style={styles.qrHolder}>
            <View style={styles.qrImageHolder}>
              <QRCode value={loggedInUser} size={normalize(128)} />
            </View>
            <Text style={styles.commonTextStyle}>
              Scan address to receive payment
            </Text>
          </View>
          <View style={styles.keyHolder}>
            <View style={styles.keyHolder1}>
              <Text
                style={[
                  styles.commonTextStyle,
                  {fontWeight: '600', maxWidth: normalize(280)},
                ]}>
                {loggedInUser.slice(0, maxCharacterToDisplay) +
                  (loggedInUser.length > maxCharacterToDisplay ? '...' : '')}
              </Text>
              <View style={styles.iconHolder}>
                <TouchableOpacity
                  onPress={() => {
                    Clipboard.setString(loggedInUser);
                  }}>
                  <Image
                    source={require('../../Assets/Png/keyCheck.png')}
                    style={styles.keySideImageStyle}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Image
                  source={require('../../Assets/Png/share.png')}
                  style={styles.keySideImageStyle}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </GradientBackGround>
  );
};

export default ReceiveTokens;

const styles = StyleSheet.create({
  subHolder: {
    width: deviceWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    width: deviceWidth - 28,
    flex: 1,
  },
  qrHolder: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: normalize(15),
  },
  qrImageHolder: {
    backgroundColor: colors.white,
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(15),
    borderRadius: 8,
    marginVertical: normalize(10),
  },
  qrCodeStyle: {
    width: normalize(120),
    height: normalize(120),
  },
  commonTextStyle: {
    color: '#fff',
  },
  keyHolder: {
    borderWidth: 1,
    borderColor: colors.fieldHolderBorder,
    borderRadius: 12,
    padding: normalize(14),
    marginTop: normalize(20),
  },
  keyHolder1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keySideImageStyle: {
    width: normalize(25),
    height: normalize(25),
  },
  iconHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: normalize(70),
  },
});
