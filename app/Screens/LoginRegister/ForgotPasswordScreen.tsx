import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useMutation} from '@apollo/client';

import FieldWarning from '../../Components/FieldWarning';
import Button from '../../Components/Button';
import GradientBackGround from '../../Components/GradientBackGround';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import {SEND_EMAIL_OTP} from '../../GraphqlOperations/mutation/mutation';
import Input from '../../Components/Input';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors} from '../../Styles/theme';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import {termData} from 'app/Utils/termModelContain';
import ErrorShow from 'app/Components/ErrorShow';
import normalize from 'app/Utils/normalize';

const deviceWidth = Dimensions.get('screen').width;

export default function ForgotPasswordScreen({navigation}) {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  const [sendEmailOtp, {loading}] = useMutation(SEND_EMAIL_OTP);

  /**Method to validate all data in field using yup library */
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email Address is Required'),
  });

  /**Declearing Object Type for values */
  interface FieldValuesForEmailOtp {
    email: string;
  }

  /** Call on valid input field entry */
  const sendEmailOtpSubmit = (values: FieldValuesForEmailOtp) => {
    try {
      sendEmailOtp({
        variables: {
          resendOTP: false,
          requestType: 'FORGET_PASSWORD',
          email: values.email,
        },
      })
        .then(() => {
          navigation.navigate('ResetPasswordScreen', {
            emailFromRoute: values.email,
          });
        })
        .catch(error => setErrorMessage(error.message));
    } catch (error) {
      setErrorMessage(error.message);
    }
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

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <GradientBackGround>
          <SafeAreaView>
            <View style={[styles.subHolder, {flex: 1}]}>
              <ScrollView>
                <Formik
                  validationSchema={validationSchema}
                  initialValues={{
                    email: '',
                  }}
                  onSubmit={sendEmailOtpSubmit}>
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                  }) => (
                    <>
                      <HeaderTitleHolder
                        antDesign="user"
                        headerTitle="Forgot Password"
                        headerSubTitle="Please enter registered email to reset your password."
                      />
                      <View style={[styles.fieldHolder]}>
                        <View
                          style={{
                            maxHeight: deviceWidth/2,
                            justifyContent: 'space-around',
                            width: '92%',
                          }}>
                          <Text
                            style={{
                              color: '#fff',
                              alignSelf: 'flex-start',
                              marginBottom:normalize(10)
                            }}>
                            Email Address
                          </Text>

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
                            placeholder="Enter Email ID"
                            errorContainer={
                              errors.email && touched.email ? (
                                <FieldWarning title={errors.email} />
                              ) : (
                                <Text> </Text>
                              )
                            }
                          />
                          <ErrorShow message={errorMessage} />
                        </View>
                      </View>
                      <Button
                        lable="Submit"
                        buttonWidth={240}
                        buttonHeight={56}
                        labelStyle={styles.labelStyle}
                        buttonStyle={{alignSelf: 'center'}}
                        onPress={() => {
                          handleSubmit();
                        }}
                        showActivityIndicator={loading}
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
    width: deviceWidth - 28,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 16,
    backgroundColor: colors.fieldHolderBg,
    paddingTop: 10,
    marginVertical: 25,
  },
  subHolder: {
    width: deviceWidth - 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS == 'ios' ? 20 : 90,
  },
  iconStyle: {
    color: colors.white,
    fontSize: 22,
    paddingLeft: 10,
    marginRight: Platform.OS === 'android' ? -18 : -9,
    flex: 2,
    alignSelf: 'center',
  },
  wholeFieldStyle: {
    width:'100%'
  },
  textInputField: {
    padding: Platform.OS == 'ios' ? 4 : 7,
  },
});
