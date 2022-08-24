import React, {useContext, useState,useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EncryptedStorage from 'react-native-encrypted-storage';
import {LoginContext} from '../../Constants/AllContext';

import {rnEncryptedStorageKey} from '../../Constants/glb';
import FieldWarning from '../../Components/FieldWarning';
import GradientBackGround from '../../Components/GradientBackGround';
import Button from '../../Components/Button';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import Input from '../../Components/Input';
import {colors} from '../../Styles/theme';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import {termData} from 'app/Utils/termModelContain';
import LinearGradient from 'react-native-linear-gradient';
import ErrorShow from 'app/Components/ErrorShow';
import normalize from 'app/Utils/normalize';
import Clipboard from '@react-native-community/clipboard';
import Entypo from 'react-native-vector-icons/Entypo';

const deviceWidth = Dimensions.get('screen').width;
const checkPng = require('../../Assets/Png/check.png');

export default function PrivateKeyShowScreen({navigation}) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsloading] = useState<boolean>(false);
  const {web3Context} = useContext(LoginContext);
  const [privateKey, setPrivateKey] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);
  const [showPrivateKey, setShowPrivateKey] = useState<boolean>(true);
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [showPrivateKeyModel, setShowPrivateKeyModel] =
    useState<boolean>(false);

  interface FieldValues {
    walletPassword: string;
  }

  const decryptRNStorage = async (values: FieldValues) => {
    setIsloading(true);
    try {
      await EncryptedStorage.getItem(rnEncryptedStorageKey).then(
        async JSONresult => {
          const web3 = web3Context;
          const result = await web3.eth.accounts.decrypt(
            JSON.parse(JSONresult),
            values.walletPassword,
          );
          setPrivateKey(result.privateKey);
          setWalletAddress(result.address);
          if (result.privateKey) {
            setIsloading(false);
            setShowPrivateKeyModel(true);
          }
        },
      );
    } catch (error) {
      setIsloading(false);
      setErrorMessage('Wrong Password');
    }
  };

  /**Method to validate all field using yup library */
  const validationSchema = yup.object().shape({
    walletPassword: yup.string().required('Password is required'),
  });

  const showTermsModelMethod = () => {
    if (showTermsModel) {
      return (
        <TermsModel
          header="Terms Model"
          subHeader={termData}
          HeaderStyle={{color: '#fff', fontSize: 16}}
          onClose={() => {
            setShowTermModel(false);
          }}
        />
      );
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <QuestionLogo onTouchField={() => setShowTermModel(!showTermsModel)} />
      ),
    });
  });

  const privateKeyModel = () => {
    if (showPrivateKeyModel) {
      return (
        <View
          style={[
            styles.containerModel,
            {backgroundColor: 'rgba(4, 21, 39, 0.85)'},
          ]}>
          <LinearGradient
            colors={['#002E5E', '#092038']}
            locations={[0, 1]}
            useAngle={true}
            angle={180}
            style={[styles.holderStyle]}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={checkPng}
                style={{height: 55, width: 55}}
                resizeMode="contain"
              />
              <View style={{alignItems: 'center', width: '87%'}}>
                <Text style={[styles.headerTextStyle]}>Account ABC</Text>
                <Text style={styles.subHeaderTextStyle}>{walletAddress}</Text>
              </View>
              <View style={styles.privateKeyContainer}>
                <View style={styles.privateKeyContainerHeaderHolder}>
                  <Text style={styles.privateKeyContainerText}>
                    This is your private key
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() => {
                        Clipboard.setString(privateKey);
                      }}>
                      <Image
                        source={require('../../Assets/Png/copyIconHollow.png')}
                        style={styles.modelIocnsImageStyle}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setShowPrivateKey(!showPrivateKey)}
                      style={{marginHorizontal: normalize(16)}}>
                      {showPrivateKey ? (
                        <Image
                          source={require('../../Assets/Png/eyeHide.png')}
                          style={styles.modelIocnsImageStyle}
                          resizeMode="contain"
                        />
                      ) : (
                        <Image
                          source={require('../../Assets/Png/eyeUnhide.png')}
                          style={styles.modelIocnsImageStyle}
                          resizeMode="contain"
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  {showPrivateKey ? (
                    <Input
                      value={privateKey}
                      style={styles.textInputStyle}
                      Allstyle={{width: deviceWidth / 1.5}}
                      textStyle={styles.textInputField}
                      multiline={false}
                      editable={false}
                    />
                  ) : (
                    <Input
                      value={privateKey}
                      style={styles.textInputStyle}
                      Allstyle={{width: deviceWidth / 1.5}}
                      textStyle={styles.textInputField}
                      secureTextEntry={true}
                      editable={false}
                    />
                  )}
                </View>
              </View>
              <Button
                lable="Done"
                labelStyle={{color: '#fff', fontWeight: '600'}}
                buttonWidth={deviceWidth / 3}
                buttonHeight={40}
                buttonStyle={{marginTop: 20}}
                onPress={() => {
                  navigation.goBack();
                }}
              />
            </View>
          </LinearGradient>
        </View>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvovidingHolder}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <GradientBackGround>
          <SafeAreaView>
            <View style={[styles.subHolder, {flex: 1}]}>
              <ScrollView>
                <HeaderTitleHolder
                  headerTitle="Enter your Wallet Password"
                  headerSubTitle="To view private key, please enter your wallet password."
                  entypoIconName="wallet"
                />

                <Formik
                  validationSchema={validationSchema}
                  initialValues={{
                    walletPassword: '',
                  }}
                  onSubmit={decryptRNStorage}>
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                  }) => (
                    <>
                      <View style={styles.fieldHolder}>
                        <View
                          style={{
                            justifyContent: 'space-evenly',
                            height: deviceWidth / 3.5,
                            width: '91%',
                          }}>
                          <Text style={styles.fieldTextHeading}>
                            Enter Wallet Password
                          </Text>
                          <Input
                            value={values.walletPassword}
                            onChangeText={handleChange('walletPassword')}
                            onBlur={() => {
                              handleBlur('walletPassword');
                            }}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            leftContainer={
                              <AntDesign name="lock" style={styles.iconStyle} />
                            }
                            secureTextEntry={hidePassword}
                            placeholder="Enter password"
                            errorContainer={
                              errors.walletPassword &&
                              touched.walletPassword && (
                                <FieldWarning title={errors.walletPassword} />
                              )
                            }
                            rightContainer={
                              <TouchableOpacity
                                onPress={() => setHidePassword(!hidePassword)}
                                style={{justifyContent: 'center'}}>
                                <Entypo
                                  name={hidePassword ? 'eye' : 'eye-with-line'}
                                  style={{
                                    color: 'rgba(255,255,255,0.5)',
                                    fontSize: 22,
                                  }}
                                />
                              </TouchableOpacity>
                            }
                          />
                          <ErrorShow
                            message={errorMessage ? errorMessage : ''}
                          />
                        </View>
                      </View>
                      <Button
                        lable="Submit"
                        labelStyle={styles.labelStyle}
                        onPress={() => {
                          handleSubmit();
                        }}
                        buttonStyle={{alignSelf: 'center'}}
                        buttonWidth={240}
                        buttonHeight={56}
                        showActivityIndicator={isLoading}
                      />
                    </>
                  )}
                </Formik>
              </ScrollView>
            </View>
          </SafeAreaView>
          {showTermsModelMethod()}
          {privateKeyModel()}
        </GradientBackGround>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  keyboardAvovidingHolder: {
    flex: 1,
  },
  textInputStyle: {
    width: '100%',
    padding: Platform.OS === 'ios' ? 9 : 0,
    color: colors.white,
    paddingLeft: 0,
    paddingRight: 9,
  },
  labelStyle: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  fieldHolder: {
    borderColor: colors.fieldHolderBorder,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: deviceWidth - 28,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 16,
    backgroundColor: colors.fieldHolderBg,
    paddingVertical: 10,
    marginVertical: 25,
  },
  subHolder: {
    width: deviceWidth - 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS == 'ios' ? 20 : 90,
  },
  errorText: {
    fontSize: 13,
    color: 'red',
    lineHeight: 14,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  iconStyle: {
    color: colors.white,
    fontSize: 22,
    paddingLeft: 10,
    marginRight: Platform.OS === 'android' ? -18 : -9,
    flex: 2,
    alignSelf: 'center',
  },
  fieldTextHeading: {
    color: colors.white,
    alignSelf: 'flex-start',
  },
  wholeFieldStyle: {
    width: deviceWidth - 65,
  },
  textInputField: {
    padding: Platform.OS == 'ios' ? 4 : 7,
  },
  containerModel: {
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
    fontSize: 12,
    fontWeight: '400',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  holderStyle: {
    width: deviceWidth / 1.3,
    height: deviceWidth / 1.1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: deviceWidth / 2,
    borderRadius: 5,
  },
  privateKeyContainer: {
    marginTop: normalize(15),
    marginBottom: normalize(10),
  },
  modelIocnsImageStyle: {
    width: normalize(20),
    height: normalize(20),
  },
  privateKeyContainerHeaderHolder: {
    flexDirection: 'row',
    width: deviceWidth / 1.5,
    justifyContent: 'space-between',
    marginVertical: normalize(8),
  },
  privateKeyContainerText: {
    color: '#fff',
    fontSize: 14,
  },
});
