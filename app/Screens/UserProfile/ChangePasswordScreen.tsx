import React, {useState} from 'react';
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
  Image
} from 'react-native';
import {useMutation} from '@apollo/client';
import {CHANGE_PASSWORD} from '../../GraphqlOperations/mutation/mutation';
import {Formik} from 'formik';
import * as yup from 'yup';

import FieldWarning from '../../Components/FieldWarning';
import GradientBackGround from '../../Components/GradientBackGround';
import Button from '../../Components/Button';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import {passwordRegex} from '../../Utils/regexPattern';
import Input from '../../Components/Input';
import {colors} from '../../Styles/theme';
import Model from '../../Components/Model';
import Loader from '../../Components/Loader';
/**icon import from Antdesign */
import AntDesign from 'react-native-vector-icons/AntDesign';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import {termData} from 'app/Utils/termModelContain';
import ErrorShow from 'app/Components/ErrorShow';
import normalize from 'app/Utils/normalize';

const deviceWidth = Dimensions.get('screen').width;
const checkImage = require('../../Assets/Png/check.png');
const errorPng = require('../../Assets/Png/error.png');

export default function ChangePasswordScreen({navigation}) {
  const [, setErrorMessage] = useState<string>('');
  const [isSucess, setIsSucess] = useState<boolean>(null);
  const [changePassword, {loading, error}] = useMutation(CHANGE_PASSWORD);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  /**Declearing Object Type for values */
  interface FieldValuesForPassword {
    oldPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
  }

  /**On submit click, the user will be able to change password */
  const onPasswordChange = async (values: FieldValuesForPassword) => {
    try {
      await changePassword({
        variables: {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
      }).then(() => {
        setIsSucess(true);
      });
    } catch (e) {
      setErrorMessage(e.message);
      setIsSucess(false);
    }
  };

  /**Method to validate all field using yup library */
  const validationSchema = yup.object().shape({
    oldPassword: yup.string().required('This field is required'),
    newPassword: yup
      .string()
      .matches(
        passwordRegex,
        'Password should contain one uppercase letter,one lowercase letter, one numeric value and one special character.',
      )
      .min(8, ({min}) => `Password must be at least ${min} characters.`)
      .required('Password is required'),
    newPasswordConfirm: yup
      .string()
      .oneOf([yup.ref('newPassword'), null], 'Password must match.')
      .required('Field Required'),
  });
  const showModelMethod = () => {
    if (isSucess == true) {
      return (
        <Model
          source={checkImage}
          header="Password Changed successfully"
          subHeader="Your account password has been changed successfully"
          HeaderStyle={{color: '#25BD4F', fontSize: 16}}
          onClose={() => {
            navigation.navigate('UserProfileScreen');
          }}
          messageOnButton="Okay"
        />
      );
    }
    if (isSucess == false) {
      return (
        <Model
          source={errorPng}
          header="An error occured"
          subHeader={error?.message}
          HeaderStyle={{color: 'rgba(255, 15, 44, 0.75)'}}
          onClose={() => setIsSucess(null)}
          messageOnButton="Okay"
        />
      );
    }
    if (loading) {
      return (
        <Loader
          header="Please Wait"
          subHeader="Changing your account password"
        />
      );
    }
    return null;
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
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <GradientBackGround>
          <SafeAreaView>
            <View style={[styles.subHolder, {flex: 1}]}>
              <ScrollView>
                <HeaderTitleHolder
                  antDesign="lock"
                  headerTitle={'Change Password'}
                  headerSubTitle={
                    'Change password to keep your wallet safe. We will use you password to keep your account safe.'
                  }
                />
                <Formik
                  validationSchema={validationSchema}
                  initialValues={{
                    oldPassword: '',
                    newPassword: '',
                    newPasswordConfirm: '',
                  }}
                  onSubmit={onPasswordChange}>
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
                            height: deviceWidth / 1.5,
                            justifyContent: 'space-around',
                            width: '93%',
                          }}>
                          <Text style={styles.fieldHeaderText}>
                            Enter Password below
                          </Text>
                          <Input
                            value={values.oldPassword}
                            onChangeText={handleChange('oldPassword')}
                            onBlur={() => {
                              handleBlur('oldPassword');
                            }}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            leftContainer={
                              <AntDesign name="lock" style={styles.iconStyle} />
                            }
                            secureTextEntry={true}
                            placeholder="Old Password"
                            errorContainer={
                              errors.oldPassword &&
                              touched.oldPassword && (
                                <FieldWarning title={errors.oldPassword} />
                              )
                            }
                          />
                          <Input
                            value={values.newPassword}
                            onChangeText={handleChange('newPassword')}
                            onBlur={() => {
                              handleBlur('newPassword');
                            }}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            leftContainer={
                              <AntDesign name="lock" style={styles.iconStyle} />
                            }
                            secureTextEntry={true}
                            placeholder="New Password"
                            errorContainer={
                              errors.newPassword &&
                              touched.newPassword && (
                                <FieldWarning title={errors.newPassword} />
                              )
                            }
                          />
                          <Input
                            value={values.newPasswordConfirm}
                            onChangeText={handleChange('newPasswordConfirm')}
                            onBlur={() => {
                              handleBlur('newPasswordConfirm');
                            }}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            leftContainer={
                              <AntDesign name="lock" style={styles.iconStyle} />
                            }
                            secureTextEntry={true}
                            placeholder="Confirm Password"
                            errorContainer={
                              errors.newPasswordConfirm &&
                              touched.newPasswordConfirm && (
                                <FieldWarning
                                  title={errors.newPasswordConfirm}
                                />
                              )
                            }
                          />
                          {error?.message ? (
                            <ErrorShow message={error?.message} />
                          ) : (
                            <View style={{flexDirection:"row"}}>
                              <Image
                                source={require('../../Assets/Png/error.png')}
                                style={styles.errorPngStyle}
                              />
                              <Text
                                style={{
                                  color: 'rgba(255,255,255,1)',
                                  fontSize: 11,
                                }}>
                                Set a strong and unique password for security
                                purpose
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>

                      <Button
                        lable="Change Password"
                        labelStyle={styles.labelStyle}
                        onPress={() => {
                          handleSubmit();
                        }}
                        buttonWidth={240}
                        buttonHeight={56}
                        showActivityIndicator={loading}
                        disabled={loading}
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
    marginVertical: 35,
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
    color: 'rgba(255,255,255,1)',
    fontSize: 22,
    paddingLeft: 10,
    marginRight: Platform.OS === 'android' ? -18 : -9,
    flex: 2,
    alignSelf: 'center',
  },
  wholeFieldStyle: {
    width: '100%',
  },
  textInputField: {
    padding: Platform.OS == 'ios' ? 4 : 7,
  },
  fieldHeaderText: {
    color: '#fff',
    alignSelf: 'flex-start',
  },
  errorPngStyle: {
    width: normalize(15),
    height: normalize(15),
    alignSelf: 'flex-start',
    marginHorizontal: normalize(8),
    marginTop: Platform.OS === 'android' ? normalize(4) : 0,
  },
});
