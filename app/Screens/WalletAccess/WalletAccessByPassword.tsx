import React, {useContext, useState} from 'react';
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
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EncryptedStorage from 'react-native-encrypted-storage';
import MyWallet from '../../Utils/myWallet';
import {LoginContext} from '../../Constants/AllContext';

import Entypo from 'react-native-vector-icons/Entypo';
import {rnEncryptedStorageKey} from '../../Constants/glb';
import FieldWarning from '../../Components/FieldWarning';
import GradientBackGround from '../../Components/GradientBackGround';
import Button from '../../Components/Button';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import Input from '../../Components/Input';
import {colors} from '../../Styles/theme';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import { termData } from 'app/Utils/termModelContain';
import ErrorShow from 'app/Components/ErrorShow';

const deviceWidth = Dimensions.get('screen').width;

export default function WalletAccessByPassword({navigation}) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsloading] = useState<boolean>(false);
  const {setIsWalletPasswordEntered, web3Context} = useContext(LoginContext);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  /**Declearing Object Type for values */
  interface FieldValues {
    walletPassword: string;
  }

  /**On submit click, the user will be redirected to home screen*/
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
          let privateKey = result.privateKey;
          const wallet = web3.eth.accounts.wallet.add(privateKey);
          MyWallet.setWallet(wallet);
          setIsWalletPasswordEntered(true);
          setIsloading(false);
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

  navigation.setOptions({
    headerRight: () => (
      <QuestionLogo onTouchField={() => setShowTermModel(!showTermsModel)} />
    ),
  });

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
                  headerTitle={`Access your Wallet`}
                  headerSubTitle={`Enter your wallet password`}
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
                            width:'91%'
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
                        lable="Next"
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
});
