import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';

import GradientBackGround from '../../Components/GradientBackGround';
import Input from '../../Components/Input';
import Button from '../../Components/Button';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import {colors} from '../../Styles/theme';
import normalize from 'app/Utils/normalize';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import { termData } from 'app/Utils/termModelContain';
import ErrorShow from 'app/Components/ErrorShow';

/**Regex region start */
const phraseRegex = /^$|^[a-zA-Z]+$/;
/**Regex region end */

const behaviorForKeyboard = Platform.OS === 'ios' ? 'padding' : 'height';
const paddingBasedonOS = Platform.OS === 'ios' ? 10 : 0;
const deviceWidth = Dimensions.get('screen').width;

export default function PhraseVerify({route, navigation}) {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [mnemonicArray, setMnemonicArray] = useState<
    {index: number; word: string}[]
  >(Array(3).fill({index: 0}));
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  useEffect(() => {
    const {mnemonicArrayForRoute, mnemonicForRoute} = route.params;
    setMnemonicArray(mnemonicArrayForRoute);
    setMnemonic(mnemonicForRoute);
  }, [route.params]);

  /**Declearing Object Type for values */
  interface FieldValues {
    firstEntry: string;
    fourthEntry: string;
    secondEntry: string;
  }

  /**Validate the phrases enter by user */
  const validateMnemonic = (values: FieldValues) => {
    const userInputWords = [
      values.firstEntry,
      values.fourthEntry,
      values.secondEntry,
    ];
    if (
      mnemonicArray.length === userInputWords.length &&
      mnemonicArray.every(
        (value, index) => value.word === userInputWords[index],
      )
    ) {
      return true;
    }
    return false;
  };

  /**Method to validate all field using yup library */
  const validationSchema = yup.object().shape({
    firstEntry: yup
      .string()
      .matches(
        phraseRegex,
        'Phrases should not contain space and special character.',
      )
      .required('All fields are required.'),
    fourthEntry: yup
      .string()
      .matches(
        phraseRegex,
        'Phrases should not contain space and special character.',
      )
      .required('All fields are required.'),
    secondEntry: yup
      .string()
      .matches(
        phraseRegex,
        'Phrases should not contain space and special character.',
      )
      .required('All fields are required.'),
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

  /**render warning depend on condition */
  const handelWarning = (errors, touched) => {
    if (showWarning) {
      return <ErrorShow message="Phrases you entered are not correct." />;
    } else if (
      (errors.firstEntry || errors.fourthEntry || errors.secondEntry) &&
      (touched.firstEntry || touched.fourthEntry || touched.secondEntry)
    ) {
      return (
        <ErrorShow
          message={
            errors.firstEntry || errors.fourthEntry || errors.secondEntry
          }
        />
      );
    }
    return null;
  };

  /** on valid phrase entry ,move to next screen */
  const moveToNextScreen = (values: FieldValues) => {
    if (validateMnemonic(values)) {
      navigation.navigate('PasswordCreateScreen', {
        mnemonicFromRoute: mnemonic,
        walletAddTypeFromRoute: 'Created',
      });
      setShowWarning(false);
    } else {
      setShowWarning(true);
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={behaviorForKeyboard}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <GradientBackGround>
          <SafeAreaView>
            <View style={[styles.subHolder, {flex: 1}]}>
              <ScrollView>
                <HeaderTitleHolder
                  headerTitle="Create Wallet"
                  headerSubTitle="The most important thing to understand about 
                  non-custodial wallets is to keep and protect the seed phrase.If you lose your username and password, there is a second level of security through the seed phrase."
                  entypoIconName="wallet"
                />
                <Formik
                  validationSchema={validationSchema}
                  initialValues={{
                    firstEntry: '',
                    fourthEntry: '',
                    secondEntry: '',
                  }}
                  onSubmit={moveToNextScreen}>
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                  }) => (
                    <>
                      <View style={styles.phraseHolder}>
                        <View
                          style={{
                            alignItems: 'center',
                            width: deviceWidth - 50,
                          }}>
                          <View style={{flexDirection: 'row'}}>
                            <Input
                              value={values.firstEntry}
                              onChangeText={handleChange('firstEntry')}
                              onBlur={() => {
                                handleBlur('firstEntry');
                              }}
                              textStyle={styles.textField}
                              autoCapitalize="none"
                              style={{
                                width: 100,
                                margin: 8,
                                padding: paddingBasedonOS,
                              }}
                              errorContainer={
                                <Text style={{color: '#fff', paddingLeft: 10}}>
                                  Phrase Text {mnemonicArray[0].index}
                                </Text>
                              }
                            />
                            <Input
                              value={values.fourthEntry}
                              onChangeText={handleChange('fourthEntry')}
                              onBlur={() => {
                                handleBlur('fourthEntry');
                              }}
                              textStyle={styles.textField}
                              autoCapitalize="none"
                              style={{
                                width: 100,
                                margin: 8,
                                padding: paddingBasedonOS,
                              }}
                              errorContainer={
                                <Text style={{color: '#fff', paddingLeft: 10}}>
                                  Phrase Text {mnemonicArray[1].index}
                                </Text>
                              }
                            />

                            <Input
                              value={values.secondEntry}
                              onChangeText={handleChange('secondEntry')}
                              onBlur={() => {
                                handleBlur('secondEntry');
                              }}
                              textStyle={styles.textField}
                              autoCapitalize="none"
                              style={{
                                width: 100,
                                margin: 8,
                                padding: paddingBasedonOS,
                              }}
                              errorContainer={
                                <Text
                                  style={{color: '#fff', textAlign: 'center'}}>
                                  Phrase Text {mnemonicArray[2].index}
                                </Text>
                              }
                            />
                          </View>
                          <View
                            style={{
                              borderTopWidth: 1,
                              borderTopColor: '#214674',
                              width: '80%',
                              marginTop: 20,
                              marginBottom: 10,
                            }}
                          />
                          {handelWarning(errors, touched)}
                          <View style={styles.infoSubtextHolder}>
                            <Text style={{color: '#fff'}}>
                              Enter the words from your recovery phrase
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Button
                        lable="Continue"
                        labelStyle={styles.labelStyle}
                        onPress={() => {
                          handleSubmit();
                        }}
                        buttonWidth={240}
                        buttonHeight={56}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  phraseHolder: {
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
    marginTop: 25,
    marginBottom: 20,
  },
  labelStyle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  subHolder: {
    width: Dimensions.get('screen').width - 28,
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? normalize(20) : normalize(90),
  },
  textField: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  infoSubtextHolder: {
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 10 : 3,
  },
  errorMessageHolder: {
    marginBottom: 10,
    backgroundColor: colors.errorbg,
    padding: 3,
    borderRadius: 6,
    width: 310,
  },
  errorMessageText: {
    color: '#fff',
    textAlign: 'center',
  },
});
