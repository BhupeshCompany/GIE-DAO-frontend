import React, {useState, useEffect, useContext} from 'react';
import {Text, StyleSheet} from 'react-native';
import bip39 from 'bip39js';
import {hdkey} from 'ethereumjs-wallet';
import {mnemonicPhraseHDpath} from '../../Constants/glb';
import {LoginContext} from '../../Constants/AllContext';
import {encryptWallet} from '../../Utils/utilities';
import GradientBackGround from '../../Components/GradientBackGround';
import Button from '../../Components/Button';
import {colors} from '../../Styles/theme';
import LottieView from 'lottie-react-native';

const LoadingScreen = ({route}) => {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [walletPassword, setWalletPassword] = useState<string>('');
  const [test, setTest] = useState<boolean>(false);
  const [, setMessage] = useState<string>('');
  const [walletAddType, setWalletAddType] = useState<string>('');
  const {setIsWalletPasswordEntered, setRnEW} = useContext(LoginContext);

  useEffect(() => {
    const {
      mnemonicFromRoute,
      walletPasswordFromRoute,
      privateKeyFromRoute,
      walletAddTypeFromRoute,
    } = route.params;
    setMnemonic(mnemonicFromRoute);
    setWalletPassword(walletPasswordFromRoute);
    setPrivateKey(privateKeyFromRoute);
    setWalletAddType(walletAddTypeFromRoute);
  }, [route.params]);

  /**Run function createWallet when mnemonic phrases gets in state */
  useEffect(() => {
    setTimeout(() => {
      createWallet();
    }, 1500);
  }, [mnemonic]);

  /**Create and encrypt wallet using password*/
  const createWallet = async () => {
    try {
      if (mnemonic) {
        const seed = await bip39.mnemonicToSeedSync(mnemonic);
        const hdwallet = hdkey.fromMasterSeed(seed);
        const wallet_hdpath = mnemonicPhraseHDpath;
        const wallet = hdwallet.derivePath(wallet_hdpath).getWallet();
        /**encrypt wallet private key and password */
        await encryptWallet(wallet.getPrivateKeyString(), walletPassword).then(
          () => {
            setTest(true);
          },
        );
      } else if (privateKey) {
        await encryptWallet(privateKey, walletPassword).then(() => {
          setTest(true);
        });
      }
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <GradientBackGround
      Style={{justifyContent: 'center', alignContent: 'center'}}>
      {!test ? (
        <LottieView
          source={require('../../Assets/Anims/walletLoder.json')}
          loop
          autoSize
          autoPlay
          style={{width: 200, height: 200}}
        />
      ) : (
        <LottieView
          source={require('../../Assets/Anims/success.json')}
          autoPlay
          autoSize
          loop={false}
          style={{width: 100, height: 150}}
        />
      )}
      {test ? (
        <Button
          lable="Let's Go"
          labelStyle={styles.labelStyle}
          onPress={() => {
            setIsWalletPasswordEntered(true);
            setRnEW({random: 'random'});
          }}
          buttonWidth={240}
          buttonHeight={56}
        />
      ) : (
        <Text style={{color: '#fff', fontSize: 16}}>
          {walletAddType.substring(0, walletAddType.length - 2) + 'ing '}
          wallet....
        </Text>
      )}
    </GradientBackGround>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelStyle: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
