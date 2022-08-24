import React, {useState, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';

import FieldWarning from '../../Components/FieldWarning';
import {LoginContext} from '../../Constants/AllContext';
import Model from '../../Components/Model';
import TermsModel from '../../Components/TermsModel';
import Button from '../../Components/Button';
import MyWallet from '../../Utils/myWallet';
import Web3Connection from '../../Utils/web3Connection';
import {privateKeyRegix} from '../../Utils/regexPattern';
import {privateKeyLength, privateKeyRegexPatter} from '../../Constants/glb';
import GradientBackGround from '../../Components/GradientBackGround';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import Input from '../../Components/Input';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors} from '../../Styles/theme';
import Clipboard from '@react-native-community/clipboard';
import CheckBox from '@react-native-community/checkbox';
import normalize from 'app/Utils/normalize';
import QuestionLogo from 'app/Components/QuestionLogo';
import {termData} from 'app/Utils/termModelContain';
import ErrorShow from 'app/Components/ErrorShow';

/**constants */
const behaviorForKeyboard = Platform.OS === 'ios' ? 'padding' : 'height';
const deviceWidth = Dimensions.get('screen').width;

export default function PrivatekeyImportType({navigation, route}) {
  const [messageShow, setMessageShow] = useState<boolean>(false);
  const [message, SetMessage] = useState<string>('');
  const [showModel, setShowModel] = useState<boolean>(false);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);
  const {setIsWalletPasswordEntered, setRnEW} = useContext(LoginContext);
  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false);
  const [showQuestionModel, setShowQuestionModel] = useState<boolean>(false);

  /**validate private key entered by user */
  const verifyPrivateKey = (privateKey: string) => {
    if (
      privateKey.length !== privateKeyLength ||
      typeof privateKey !== 'string' ||
      !privateKey.match(privateKeyRegexPatter)
    ) {
      return false;
    }
    return true;
  };
  /** access the wallet on successful validation of private key*/
  const accessWallet = (privateKey: string) => {
    try {
      privateKey =
        privateKey.substring(0, 2) === '0x' ? privateKey : '0x' + privateKey;
      const result = verifyPrivateKey(privateKey);
      if (result) {
        navigation.navigate('PasswordCreateScreen', {
          privateKeyFromRoute: privateKey,
          walletAddTypeFromRoute: 'Imported',
        });
      } else {
        SetMessage('Invalid Private Key!');
        setMessageShow(true);
      }
    } catch (e) {
      SetMessage('Invalid Private Key !');
      setMessageShow(true);
    }
  };

  const showModelMethod = () => {
    if (showModel) {
      return (
        <Model
          source={require('../../Assets/Png/check.png')}
          header={message}
          subHeader=""
          HeaderStyle={{color: '#25BD4F', fontSize: 16}}
          onClose={() => {
            setIsWalletPasswordEntered(true);
            setRnEW({randomValue: 'randomvalue'});
          }}
        />
      );
    }
  };

  const showTermsModelMethod = () => {
    if (showTermsModel || showQuestionModel) {
      return (
        <TermsModel
          header="Terms Model"
          subHeader={termData}
          HeaderStyle={{color: '#fff', fontSize: 16}}
          onClose={() => {
            setShowTermModel(false);
            setShowQuestionModel(false);
          }}
        />
      );
    }
  };

  /**Method to validate all data in field using yup library */
  const validationSchema = yup.object().shape({
    privateKey: yup
      .string()
      .matches(
        privateKeyRegix,
        'Private Key cannot have special characters and blank space.',
      )
      .required('Private Key is required.'),
  });

  /**Declearing Object Type for values */
  interface FieldValuesForPrivateKey {
    privateKey: string;
  }

  /** Call on valid input field entry */
  const onAccessWalletClick = (values: FieldValuesForPrivateKey) => {
    accessWallet(values.privateKey);
  };

  /**render warning depend on condition */
  const handelWarning = () => {
    if (messageShow) {
      return <ErrorShow message={message} />;
    }
    return null;
  };

  navigation.setOptions({
    headerRight: () => (
      <QuestionLogo
        onTouchField={() => setShowQuestionModel(!showQuestionModel)}
      />
    ),
  });

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={behaviorForKeyboard}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <GradientBackGround>
          <SafeAreaView>
            <View style={[styles.subHolder, {flex: 1}]}>
              <ScrollView>
                <Formik
                  validationSchema={validationSchema}
                  initialValues={{
                    privateKey: '',
                  }}
                  onSubmit={onAccessWalletClick}>
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    setFieldValue,
                  }) => (
                    <>
                      <HeaderTitleHolder
                        entypoIconName="wallet"
                        headerTitle="Access Wallet with Private Key"
                        headerSubTitle="Please enter the Private Key to access your wallet"
                      />
                      <View style={[styles.fieldHolder]}>
                        <View
                          style={{
                            height: deviceWidth / 3,
                            justifyContent: 'space-around',
                            width: '91%',
                          }}>
                          <Text
                            style={{
                              color: '#fff',
                              alignSelf: 'flex-start',
                            }}>
                            Enter your private key
                          </Text>
                          <Input
                            value={values.privateKey}
                            onChangeText={handleChange('privateKey')}
                            onBlur={() => {
                              handleBlur('privateKey');
                            }}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            leftContainer={
                              <AntDesign name="lock" style={styles.iconStyle} />
                            }
                            secureTextEntry={true}
                            placeholder="Private Key"
                            errorContainer={
                              errors.privateKey &&
                              touched.privateKey && (
                                <FieldWarning title={errors.privateKey} />
                              )
                            }
                            rightContainer={
                              <Button
                                lable="Paste"
                                buttonWidth={60}
                                buttonHeight={30}
                                onPress={async () => {
                                  setFieldValue(
                                    'privateKey',
                                    await Clipboard.getString(),
                                    true,
                                  );
                                }}
                                labelStyle={{color: '#fff', fontSize: 14}}
                                buttonStyle={styles.pasteButtonStyle}
                              />
                            }
                          />
                          <View
                            style={{flexDirection: 'row', marginVertical: 8}}>
                            <CheckBox
                              value={toggleCheckBox}
                              onValueChange={value => setToggleCheckBox(value)}
                              boxType="square"
                              lineWidth={2}
                              onCheckColor="#000"
                              hideBox={true}
                              tintColors={{true: '#fff', false: '#fff'}}
                              style={styles.checkBoxStyle}
                            />
                            <View style={{flexDirection: 'row'}}>
                              <Text style={styles.subText}>
                                To access my wallet, I accept
                              </Text>
                              <TouchableOpacity
                                onPress={() => setShowTermModel(true)}>
                                <Text
                                  style={[
                                    styles.subText,
                                    {
                                      marginLeft: 4,
                                      fontWeight: '700',
                                      textDecorationLine: 'underline',
                                      color: '#fff',
                                    },
                                  ]}>
                                  Terms Modal
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          {handelWarning()}
                        </View>
                      </View>
                      <Button
                        lable="Access Wallet"
                        buttonWidth={240}
                        buttonHeight={56}
                        labelStyle={styles.labelStyle}
                        onPress={() => {
                          if (toggleCheckBox) {
                            setMessageShow(false);
                            handleSubmit();
                          } else {
                            SetMessage('Please accept terms');
                            setMessageShow(true);
                          }
                        }}
                        buttonStyle={{alignSelf: 'center'}}
                      />
                    </>
                  )}
                </Formik>
              </ScrollView>
            </View>
          </SafeAreaView>
          {showModelMethod()}
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
  textInputStyle: {
    width: '100%',
    padding: Platform.OS === 'ios' ? 9 : 0,
    color: '#fff',
    paddingLeft: 0,
  },
  labelStyle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  fieldHolder: {
    borderColor: colors.fieldHolderBorder,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    width: Dimensions.get('screen').width - 28,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 16,
    backgroundColor: colors.fieldHolderBg,
    paddingVertical: 10,
    marginTop: normalize(50),
    marginBottom: normalize(25),
  },
  subHolder: {
    width: deviceWidth - 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? normalize(20) : normalize(90),
  },
  iconStyle: {
    color: colors.white,
    fontSize: 22,
    paddingLeft: 10,
    marginRight: Platform.OS === 'android' ? -18 : -9,
    flex: 2,
    alignSelf: 'center',
  },
  errorText: {
    fontSize: 13,
    color: 'red',
    lineHeight: 14,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  wholeFieldStyle: {
    width: deviceWidth - 65,
    paddingVertical: 4,
  },
  textInputField: {
    padding: Platform.OS == 'ios' ? 0 : 7,
  },
  pasteButtonStyle: {
    marginHorizontal: 5,
    marginVertical: Platform.OS === 'ios' ? -4 : 5,
  },
  checkBoxStyle:
    Platform.OS === 'ios'
      ? {
          height: 18,
          width: 18,
          borderWidth: 1,
          borderColor: '#fff',
          borderRadius: 5,
          backgroundColor: '#DADADA',
        }
      : {position: 'absolute', left: -8, top: -9},
  subText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    textAlignVertical: 'center',
    fontWeight: '500',
    marginLeft: Platform.OS === 'ios' ? 10 : 24,
    marginTop: Platform.OS === 'ios' ? 3 : 0,
  },
});
