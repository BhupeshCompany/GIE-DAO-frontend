import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  SafeAreaView,
  Text,
} from 'react-native';
import {RNHoleView} from 'react-native-hole-view';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import GradientBackGround from '../../Components/GradientBackGround';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import normalize from '../../Utils/normalize';

const deviceWidth = Dimensions.get('screen').width;

const CameraScreen = ({navigation, route}) => {
  const [barcode, setBarcode] = useState<string>('');
  const [isScanned, setIsScanned] = useState<boolean>(false);
  const [tokenSelected, setTokenSelected] = useState({});

  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([
    BarcodeFormat.QR_CODE, // You can only specify a particular format
  ]);

  React.useEffect(() => {
    toggleActiveState();
    return () => {
      barcodes;
    };
  }, [barcodes]);

  React.useEffect(() => {
    const {selectedToken} = route.params;
    setTokenSelected(selectedToken);
  }, [route.params]);

  const toggleActiveState = async () => {
    if (barcodes && barcodes.length > 0 && isScanned === false) {
      setIsScanned(true);
      barcodes.forEach(async (scannedBarcode: any) => {
        if (scannedBarcode.rawValue !== '') {
          setBarcode(scannedBarcode.rawValue);
          navigation.navigate('SendRecipientAdd', {
            selectedToken: tokenSelected,
            recipientAddressFromScan: scannedBarcode.rawValue,
          });
        }
      });
    }
  };

  return (
    <GradientBackGround>
      <SafeAreaView>
        {device ? (
          <View style={styles.subHolder}>
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={!isScanned}
              frameProcessor={frameProcessor}
              frameProcessorFps={'auto'}
              audio={false}
            />
            <RNHoleView
              holes={[
                {
                  x: 100,
                  y: normalize(deviceWidth / 2),
                  width: deviceWidth / 2,
                  height: deviceWidth / 2,
                  borderRadius: 10,
                },
              ]}
              style={styles.rnholeView}
            />
          </View>
        ) : (
          <View style={styles.subHolder}>
            <Text style={styles.testStyle}>
              Please switch to physical device
            </Text>
          </View>
        )}
      </SafeAreaView>
    </GradientBackGround>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  subHolder: {
    width: deviceWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? normalize(0) : normalize(65),
  },
  testStyle: {
    color: '#fff',
  },
  rnholeView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});
