import React, {useEffect, useState} from 'react';
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
  TouchableOpacity,
  Image
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

import FieldWarning from '../../Components/FieldWarning';
import GradientBackGround from '../../Components/GradientBackGround';
import Button from '../../Components/Button';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import Input from '../../Components/Input';
import {colors} from '../../Styles/theme';
import normalize from 'app/Utils/normalize';
import TermsModel from 'app/Components/TermsModel';
import {termData} from 'app/Utils/termModelContain';
import QuestionLogo from 'app/Components/QuestionLogo';

//#region regex
const passwordRegex =
  /^.*(?=.{3,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
//endregion

const deviceWidth = Dimensions.get('screen').width;
const behaviorForKeyboard = Platform.OS === 'ios' ? 'padding' : 'height';

export default function PasswordCreateScreen({route, navigation}) {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [walletAddType, setWalletAddType] = useState<string>('');
  const [hidePassword, sethidePassword] = useState<boolean>(true);
  const [hidePasswordConfirm, sethidePasswordConfirm] = useState<boolean>(true);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  useEffect(() => {
    const {mnemonicFromRoute, walletAddTypeFromRoute, privateKeyFromRoute} =
      route.params;
    setMnemonic(mnemonicFromRoute);
    setWalletAddType(walletAddTypeFromRoute);
    setPrivateKey(privateKeyFromRoute);
  }, [route.params]);

  /**Declearing Object Type for values */
  interface FieldValues {
    walletPassword: string;
    walletPasswordConfirm: string;
  }

  /**On submit click, the user will be directed to animation popup model screen */
  const directToAnimationScreen = (values: FieldValues) => {
    Keyboard.dismiss();
    navigation.navigate('LoadingScreen', {
      mnemonicFromRoute: mnemonic,
      walletPasswordFromRoute: values.walletPassword,
      privateKeyFromRoute: privateKey,
      walletAddTypeFromRoute: walletAddType,
    });
  };

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

  navigation.setOptions({
    headerRight: () => (
      <QuestionLogo onTouchField={() => setShowTermModel(!showTermsModel)} />
    ),
  });

  /**Method to validate all field using yup library */
  const validationSchema = yup.object().shape({
    walletPassword: yup
      .string()
      .matches(
        passwordRegex,
        'Password should contain one uppercase letter, one lowercase letter, one numeric value and one special character.',
      )
      .min(8, ({min}) => `Password must be at least ${min} characters.`)
      .required('Password is required'),
    walletPasswordConfirm: yup
      .string()
      .oneOf([yup.ref('walletPassword'), null], 'Password must match.')
      .required('Field is required'),
  });

  const infoRender = () => {
    return (
      <View>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={require('../../Assets/Png/error.png')}
            style={styles.errorPngStyle}
          />
          <View>
            <Text style={[styles.infoTextStyle,{fontWeight:'700',marginBottom:normalize(4)}]}>Create a strong password.</Text>
            <Text style={styles.infoTextStyle}>Must contain at least 8 -20 characters & 1 special character</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvovidingHolder}
      behavior={behaviorForKeyboard}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <GradientBackGround>
          <SafeAreaView>
            <View style={styles.subHolder}>
              <ScrollView>
                <HeaderTitleHolder
                  headerTitle={`Wallet ${walletAddType} Successfully`}
                  headerSubTitle={`Wallet ${walletAddType} successfully, now create a password so no one else but you can unlock your wallet.`}
                  entypoIconName="wallet"
                />
                <Formik
                  validationSchema={validationSchema}
                  initialValues={{
                    walletPassword: '',
                    walletPasswordConfirm: '',
                  }}
                  onSubmit={directToAnimationScreen}>
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
                            height: deviceWidth / 2,
                            width: '91%',
                          }}>
                          <Text style={styles.fieldTextHeading}>
                            Create Wallet Password
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
                                onPress={() => sethidePassword(!hidePassword)}
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
                          <Input
                            value={values.walletPasswordConfirm}
                            onChangeText={handleChange('walletPasswordConfirm')}
                            onBlur={() => {
                              handleBlur('walletPasswordConfirm');
                            }}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            leftContainer={
                              <AntDesign name="lock" style={styles.iconStyle} />
                            }
                            secureTextEntry={hidePasswordConfirm}
                            placeholder="Enter confirm password"
                            errorContainer={
                              errors.walletPasswordConfirm &&
                              touched.walletPasswordConfirm && (
                                <FieldWarning
                                  title={errors.walletPasswordConfirm}
                                />
                              )
                            }
                            rightContainer={
                              <TouchableOpacity
                                onPress={() =>
                                  sethidePasswordConfirm(!hidePasswordConfirm)
                                }
                                style={{justifyContent: 'center'}}>
                                <Entypo
                                  name={
                                    hidePasswordConfirm
                                      ? 'eye'
                                      : 'eye-with-line'
                                  }
                                  style={{
                                    color: 'rgba(255,255,255,0.5)',
                                    fontSize: 22,
                                  }}
                                />
                              </TouchableOpacity>
                            }
                          />
                          {infoRender()}
                        </View>
                      </View>
                      <Button
                        lable="Submit"
                        labelStyle={styles.labelStyle} // use prop labelStyle for lable style
                        onPress={() => {
                          handleSubmit();
                        }}
                        buttonStyle={{alignSelf: 'center'}}
                        buttonWidth={240}
                        buttonHeight={56}
                      />
                    </>
                  )}
                </Formik>
              </ScrollView>
            </View>
          </SafeAreaView>
          {showTermsModelMethod()}
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
    paddingRight: 10,
    color: colors.white,
    paddingLeft: 0,
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
    marginTop: Platform.OS === 'ios' ? normalize(20) : normalize(90),
    flex: 1,
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
  errorPngStyle: {
    width: normalize(15),
    height: normalize(15),
    alignSelf: 'flex-start',
    marginHorizontal: normalize(8),
    marginTop: Platform.OS === 'android' ? normalize(4) : 0,
  },
  infoTextStyle: {
    color: '#fff',
    fontSize: 12,
    width:'99%'
  },
});
