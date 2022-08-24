import React, {useState, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useMutation} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LOGIN_USER} from '../../GraphqlOperations/mutation/mutation';
import {LoginContext} from '../../Constants/AllContext';

import GradientBackGround from '../../Components/GradientBackGround';
import Button from '../../Components/Button';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import Input from '../../Components/Input';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {colors} from '../../Styles/theme';
import FieldWarning from '../../Components/FieldWarning';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import {termData} from 'app/Utils/termModelContain';
import ErrorShow from 'app/Components/ErrorShow';

/**constants */
const behaviorForKeyboard = Platform.OS === 'ios' ? 'padding' : 'height';
const deviceWidth = Dimensions.get('screen').width;

const UserLoginScreen = ({navigation}) => {
  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false);
  const [hidePassword, sethidePassword] = useState<boolean>(true);
  const [loginUser, {loading, error}] = useMutation(LOGIN_USER);
  const {setToken, setIsWalletPasswordEntered} = useContext(LoginContext);
  const [, setMessage] = useState<string>('');
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  /**Declearing Object Type for values */
  interface FieldValuesForBothOtp {
    emailOrPhone: string;
    password: string;
  }

  /** API call to login user on providing valid data */
  const userLogin = (values: FieldValuesForBothOtp) => {
    try {
      loginUser({
        variables: {
          emailOrPhone: values.emailOrPhone,
          password: values.password,
        },
      })
        .then(async result => {
          const LocalToken = result.data.login.token;
          setToken(LocalToken);
          try {
            await AsyncStorage.setItem('token', LocalToken);
          } catch (e) {
            setMessage(e.message);
          }
        })
        .then(() => {
          setIsWalletPasswordEntered(false);
        })
        .catch(e => {
          setMessage(e.message);
        });
    } catch (e) {
      setMessage(e.message);
    }
  };

  /**Method to validate all data in field using yup library */
  const validationSchema = yup.object().shape({
    emailOrPhone: yup
      .string()
      .required('Email/Phone Number is required')
      .test('test-name', 'Enter Valid Phone/Email', function (value) {
        const emailRegex =
          /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        const phoneRegex = /^(\+91-|\+91|0)?\d{10}$/;
        let isValidEmail = emailRegex.test(value);
        let isValidPhone = phoneRegex.test(value);
        if (!isValidEmail && !isValidPhone) {
          return false;
        }
        return true;
      }),
    password: yup.string().required('Password is required'),
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
      style={styles.keyboardAvoidingHolder}
      behavior={behaviorForKeyboard}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <GradientBackGround>
          <SafeAreaView>
            <View style={[styles.subHolder, {flex: 1}]}>
              <ScrollView>
                <HeaderTitleHolder
                  entypoIconName="wallet"
                  headerTitle="User Login"
                  headerSubTitle="To get started, login using your Email/Phone number and password."
                />
                <Formik
                  validationSchema={validationSchema}
                  initialValues={{
                    emailOrPhone: '',
                    password: '',
                  }}
                  onSubmit={userLogin}>
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
                            height: deviceWidth / 2,
                            justifyContent: 'space-around',
                            width:'92%',
                          }}>
                          <Text style={styles.fieldHeaderText}>
                            Enter login details
                          </Text>
                          <Input
                            value={values.emailOrPhone}
                            onChangeText={handleChange('emailOrPhone')}
                            onBlur={() => {
                              handleBlur('emailOrPhone');
                            }}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            leftContainer={
                              <AntDesign name="mail" style={styles.iconStyle} />
                            }
                            placeholder="Enter Email Id/Phone Number"
                            errorContainer={
                              errors.emailOrPhone &&
                              touched.emailOrPhone && (
                                <FieldWarning title={errors.emailOrPhone} />
                              )
                            }
                          />
                          <Input
                            value={values.password}
                            onChangeText={handleChange('password')}
                            onBlur={() => {
                              handleBlur('password');
                            }}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            leftContainer={
                              <AntDesign name="lock" style={styles.iconStyle} />
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
                            secureTextEntry={hidePassword}
                            placeholder="Enter password"
                            errorContainer={
                              errors.password &&
                              touched.password && (
                                <FieldWarning title={errors.password} />
                              )
                            }
                          />
                          <ErrorShow message={error?.message} />

                          <View
                            style={[
                              styles.checkBoxHolder,
                              {justifyContent: 'space-between'},
                            ]}>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate('ForgotPasswordScreen')
                              }>
                              <Text style={styles.subText}>
                                Forgot Password ?
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                      <Button
                        lable="Login"
                        labelStyle={styles.labelStyle}
                        onPress={() => {
                          handleSubmit();
                        }}
                        buttonWidth={240}
                        buttonHeight={56}
                        showActivityIndicator={loading}
                        buttonStyle={{alignSelf: 'center'}}
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
};

export default UserLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subHolder: {
    width: deviceWidth - 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS == 'ios' ? 20 : 90,
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
    paddingVertical: 15,
    marginVertical: 25,
  },
  textInputStyle: {
    width: '100%',
    padding: Platform.OS === 'ios' ? 9 : 0,
    paddingRight: 9,
    color: '#fff',
    paddingLeft: 0,
  },
  labelStyle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
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
  fieldHeaderText: {
    color: '#fff',
    alignSelf: 'flex-start',
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
  checkBoxHolder: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  subText: {
    color: '#fff',
    fontSize: 12,
    textAlignVertical: 'center',
    fontWeight: '500',
    marginLeft: Platform.OS === 'ios' ? 10 : 24,
    marginTop: Platform.OS === 'ios' ? 3 : 0,
  },
  errorMessage: {
    color: '#fff',
    marginBottom: 10,
  },
  keyboardAvoidingHolder: {
    flex: 1,
  },
  wholeFieldStyle: {
    width: '100%'
  },
  textInputField: {
    padding: Platform.OS == 'ios' ? 4 : 7,
  },
});
