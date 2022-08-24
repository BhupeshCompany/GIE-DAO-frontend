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
} from 'react-native';
import {GET_MY_PROFILE} from '../../GraphqlOperations/query/query';
import {
  UPDATE_PROFILE,
  SEND_EMAIL_OTP,
  SEND_PHONE_OTP,
  SEND_PHONE_EMAIL_OTP,
} from '../../GraphqlOperations/mutation/mutation';
import {useQuery, useMutation} from '@apollo/client';
import {useFocusEffect} from '@react-navigation/native';
import {Formik} from 'formik';
import * as yup from 'yup';
import GradientBackGround from '../../Components/GradientBackGround';
import Loader from '../../Components/Loader';
import {colors} from '../../Styles/theme';
import Button from '../../Components/Button';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import Input from '../../Components/Input';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Model from '../../Components/Model';
import FieldWarning from '../../Components/FieldWarning';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import {termData} from 'app/Utils/termModelContain';
import normalize from 'app/Utils/normalize';
import CountryCodeModal from 'app/Components/CountryCodeModal';

const deviceWidth = Dimensions.get('screen').width;
const behaviorForKeyboard = Platform.OS === 'ios' ? 'padding' : 'height';
const checkImage = require('../../Assets/Png/check.png');
const errorPng = require('../../Assets/Png/error.png');

export default function UpdateProfile({navigation}) {
  const [, setMessage] = useState<string>('');
  const [showModel, setShowModel] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<string>('');
  const [showCountryCodeModal, setShowCountryCodeModal] =
    useState<boolean>(false);
  const {
    data,
    refetch,
    loading: loadingE,
    error: errorE,
  } = useQuery(GET_MY_PROFILE);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  const [updateProfile, {loading: loadingA, error: errorA}] = useMutation(
    UPDATE_PROFILE,
    {refetchQueries: [GET_MY_PROFILE, 'myProfile']},
  );
  const [sendPhoneOTP, {loading: loadingB, error: errorB}] =
    useMutation(SEND_PHONE_OTP);
  const [sendEmailOTP, {loading: loadingC, error: errorC}] =
    useMutation(SEND_EMAIL_OTP);
  const [sendEmailPhoneOTP, {loading: loadingD, error: errorD}] =
    useMutation(SEND_PHONE_EMAIL_OTP);

  useEffect(() => {
    setCountryCode(data?.getProfile?.countryCode);
  }, []);

  useFocusEffect(() => {
    refetch();
  });

  /**Declearing Object Type for values */
  interface FieldValuesForProfile {
    userName: string;
    email: string;
    phoneNumber: string;
  }

  const handelLoadingAndError = () => {
    if (loadingE) {
      return (
        <Loader
          header="Please Wait"
          subHeader="Wait while we fetch you data securely"
        />
      );
    }
    if (errorE) {
      return (
        <Model
          source={errorPng}
          header="An error occured"
          subHeader={errorE?.message}
          HeaderStyle={{color: 'rgba(255, 15, 44, 0.75)'}}
          onClose={() => navigation.goBack()}
          messageOnButton="Go Back"
        />
      );
    }
    if (showModel) {
      return (
        <Model
          source={checkImage}
          header="Name Changed successfully"
          subHeader="Your name has been changed successfully"
          HeaderStyle={{color: '#25BD4F', fontSize: 16}}
          onClose={() => {
            setShowModel(false);
            navigation.goBack();
          }}
        />
      );
    }
    return null;
  };

  /**On submit click, the user will be directed to verify otp */
  const userProfileUpdate = async (values: FieldValuesForProfile) => {
    if (
      values.email === data.getProfile.email &&
      values.phoneNumber === data.getProfile.phone &&
      values.userName !== data.getProfile.name
    ) {
      try {
        updateProfile({
          variables: {
            name: values.userName || null,
            phone: null,
            email: null,
            prefferedLanguage: null,
            emailOtp: null,
            phoneOtp: null,
          },
        }).then(() => {
          setShowModel(true);
        });
      } catch (e) {
        setMessage(e.message);
      }
    } else if (
      values.email !== data.getProfile.email &&
      values.phoneNumber === data.getProfile.phone
    ) {
      try {
        await sendEmailOTP({
          variables: {
            resendOTP: false,
            requestType: 'UPDATE',
            email: values.email,
          },
        }).then(() => {
          navigation.navigate('OtpProfileUpdate', {
            userNameFromRoute: values.userName,
            emailFromRoute: values.email,
            phoneNoFromRoute: values.phoneNumber,
            typeOfOTPFromRoute: 'email',
            countryCodeFromRoute: '',
          });
        });
      } catch (e) {
        setMessage(e.message);
      }
    } else if (
      values.email === data.getProfile.email &&
      values.phoneNumber !== data.getProfile.phone
    ) {
      try {
        await sendPhoneOTP({
          variables: {
            resendOTP: false,
            requestType: 'UPDATE',
            countryCode: countryCode,
            phone: values.phoneNumber,
          },
        }).then(() => {
          navigation.navigate('OtpProfileUpdate', {
            userNameFromRoute: values.userName,
            emailFromRoute: values.email,
            phoneNoFromRoute: values.phoneNumber,
            typeOfOTPFromRoute: 'phone',
            countryCodeFromRoute: countryCode,
          });
        });
      } catch (e) {
        setMessage(e.message);
      }
    } else if (
      values.email !== data.getProfile.email &&
      values.phoneNumber !== data.getProfile.phone
    ) {
      sendEmailPhoneOTP({
        variables: {
          resendOTP: false,
          requestType: 'UPDATE',
          countryCode: countryCode,
          email: values.email,
          phone: values.phoneNumber,
        },
      })
        .then(() => {
          navigation.navigate('OtpProfileUpdate', {
            userNameFromRoute: values.userName,
            emailFromRoute: values.email,
            phoneNoFromRoute: values.phoneNumber,
            typeOfOTPFromRoute: 'both',
            countryCodeFromRoute: countryCode,
          });
        })
        .catch(e => {
          setMessage(e.message);
        });
    }
  };

  /**Method to validate all field using yup library */
  const validationSchema = yup.object().shape({
    userName: yup
      .string()
      .min(2, ({min}) => `Name must be ${min} characters`)
      .required('Username is required'),
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email Address is Required'),
    phoneNumber: yup
      .string()
      .required('Phone number is required')
      .min(10, () => 'Phone Number must be 10 character')
      .max(10, () => 'Phone Number must be 10 character'),
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
    <KeyboardAvoidingView style={{flex: 1}} behavior={behaviorForKeyboard}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <GradientBackGround>
          <SafeAreaView>
            <View style={[styles.subHolder, {flex: 1}]}>
              <ScrollView>
                <HeaderTitleHolder
                  antDesign="user"
                  headerTitle={'Update Profile'}
                  headerSubTitle={
                    'You can update your name, email and phone number here.'
                  }
                />
                <Formik
                  validationSchema={validationSchema}
                  initialValues={{
                    userName: data?.getProfile?.name || '',
                    email: data?.getProfile?.email || '',
                    phoneNumber: data?.getProfile?.phone || '',
                  }}
                  enableReinitialize
                  onSubmit={userProfileUpdate}>
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
                          }}>
                          <Input
                            value={values.userName}
                            onChangeText={handleChange('userName')}
                            onBlur={() => {
                              handleBlur('userName');
                            }}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            leftContainer={
                              <AntDesign name="user" style={styles.iconStyle} />
                            }
                            placeholder="Name"
                            errorContainer={
                              errors.userName &&
                              touched.userName && (
                                <FieldWarning title={errors.userName} />
                              )
                            }
                          />
                          <Input
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={() => {
                              handleBlur('email');
                            }}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            leftContainer={
                              <AntDesign name="mail" style={styles.iconStyle} />
                            }
                            placeholder="Email"
                            errorContainer={
                              errors.email &&
                              touched.email && (
                                <FieldWarning title={errors.email} />
                              )
                            }
                          />
                          <Input
                            value={values.phoneNumber}
                            onChangeText={handleChange('phoneNumber')}
                            onBlur={() => {
                              handleBlur('phoneNumber');
                            }}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            leftContainer={
                              <TouchableOpacity
                                style={styles.phoneFieldLeftContainer}
                                onPress={() => {
                                  setShowCountryCodeModal(
                                    !showCountryCodeModal,
                                  );
                                }}>
                                <AntDesign
                                  name="mobile1"
                                  style={styles.iconStyle}
                                />
                                <View style={styles.countryCodeArrowHolder}>
                                  <Text style={{color: '#fff'}}>
                                    {countryCode}
                                  </Text>
                                  <AntDesign
                                    name="caretdown"
                                    style={styles.downArrowStyle}
                                  />
                                </View>
                              </TouchableOpacity>
                            }
                            keyboardType="number-pad"
                            placeholder="Phone Number"
                            errorContainer={
                              errors.phoneNumber &&
                              touched.phoneNumber && (
                                <FieldWarning title={errors.phoneNumber} />
                              )
                            }
                          />
                          {(errorA || errorB || errorC || errorD) && (
                            <View style={styles.errorMessage}>
                              <Text
                                style={{
                                  color: 'rgba(255,255,255,1)',
                                  fontSize: 11,
                                }}>
                                {errorA?.message ||
                                  errorB?.message ||
                                  errorC?.message ||
                                  errorD?.message}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <Button
                        lable="Update Profile"
                        labelStyle={styles.labelStyle}
                        onPress={() => {
                          handleSubmit();
                        }}
                        buttonStyle={{alignSelf: 'center', zIndex: -1}}
                        buttonWidth={240}
                        buttonHeight={56}
                        showActivityIndicator={
                          loadingA || loadingB || loadingC || loadingD
                        }
                        disabled={loadingA || loadingB || loadingC || loadingD}
                      />
                    </>
                  )}
                </Formik>
              </ScrollView>
            </View>
          </SafeAreaView>
        </GradientBackGround>
      </TouchableWithoutFeedback>
      {handelLoadingAndError()}
      {showTermsModelMethod()}
      {showCountryCodeModal ? (
        <CountryCodeModal
          onPressTile={item => {
            setShowCountryCodeModal(false);
            setCountryCode(item.countryCode);
          }}
        />
      ) : null}
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
    fontSize: 14,
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
    marginVertical: 45,
    zIndex: 4,
  },
  subHolder: {
    width: deviceWidth - 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS == 'ios' ? 20 : 70,
  },
  errorText: {
    fontSize: 13,
    color: 'red',
    lineHeight: 14,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  iconStyle: {
    color: 'rgba(255,255,255,1)',
    fontSize: 22,
    paddingLeft: 10,
    marginRight: Platform.OS === 'android' ? -18 : -9,
    flex: 2,
    alignSelf: 'center',
  },
  errorMessage: {
    backgroundColor: colors.errorbg,
    width: 320,
    padding: 4,
    borderRadius: 5,
  },
  wholeFieldStyle: {
    width: deviceWidth - 65,
  },
  textInputField: {
    padding: Platform.OS == 'ios' ? 4 : 7,
  },
  phoneFieldLeftContainer: {
    flexDirection: 'row',
    width: normalize(110),
    justifyContent: 'space-between',
  },
  countryCodeArrowHolder: {
    flexDirection: 'row',
    width: '60%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  downArrowStyle: {
    color: '#fff',
    fontSize: 12,
    alignSelf: 'center',
  },
});
