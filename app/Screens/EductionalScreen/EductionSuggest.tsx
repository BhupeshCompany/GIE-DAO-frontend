import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  Platform,
  Text,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useMutation} from '@apollo/client';

import {ADD_EDU_SUGGEST_CONTENT} from '../../GraphqlOperations/mutation/mutation';
import GradientBackGround from '../../Components/GradientBackGround';
import {colors} from '../../Styles/theme';
import Input from '../../Components/Input';
import FieldWarning from '../../Components/FieldWarning';
import Button from '../../Components/Button';
import Model from '../../Components/Model';
import Loader from '../../Components/Loader';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import { termData } from 'app/Utils/termModelContain';

const behaviorForKeyboard = Platform.OS === 'ios' ? 'padding' : 'height';
const deviceWidth = Dimensions.get('screen').width;
const smilePng = require('../../Assets/Png/smile.png');
const errorPng = require('../../Assets/Png/error.png');

export default function EductionSuggest({navigation}) {
  const [suggestEducationalContent, {loading, error, data}] = useMutation(
    ADD_EDU_SUGGEST_CONTENT,
  );
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  const validationSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    url: yup.string().required('URL is required'),
  });

  const handelMessageModel = () => {
    if (data?.suggestEducationalContent?.success) {
      return (
        <Model
          source={smilePng}
          header="Thank you
      for your suggestion"
          subHeader="This makes GIE a great place to learn and discover."
          HeaderStyle={{color: '#25bd4f'}}
          onClose={() => navigation.goBack()}
        />
      );
    }
    if (error) {
      return (
        <Model
          source={errorPng}
          header="An error occured"
          subHeader={error?.message}
          HeaderStyle={{color: 'rgba(255, 15, 44, 0.75)'}}
          onClose={() => navigation.goBack()}
          messageOnButton="Go Back"
        />
      );
    }
    if (loading) {
      return <Loader header="Please Wait" subHeader="Adding your suggestion" />;
    }
    return null;
  };

  interface FieldValuesForsuggestion {
    title: string;
    description: string;
    url: string;
  }

  const addContentSuggestion = (values: FieldValuesForsuggestion) => {
    suggestEducationalContent({
      variables: {
        title: values.title,
        description: values.description,
        url: values.url,
      },
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

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingHolder}
      behavior={behaviorForKeyboard}>
      <GradientBackGround>
        <SafeAreaView>
          <StatusBar hidden={false} barStyle="light-content" />
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.headingHolder}>
                <Text style={styles.suggestTextStyle}>Suggest content</Text>
                <Text style={styles.subHeaderStyle}>
                  Suggest content that is relevant to crypto. Best content will
                  be featured.
                </Text>
              </View>
              <Formik
                validationSchema={validationSchema}
                initialValues={{
                  title: '',
                  description: '',
                  url: '',
                }}
                onSubmit={addContentSuggestion}>
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
                      <View style={{paddingVertical: 10}}>
                        <View style={styles.titleHolder}>
                          <Text style={styles.suggestTextStyle}>Title</Text>
                          <Input
                            value={values.title}
                            onChangeText={handleChange('title')}
                            onBlur={() => {
                              handleBlur('title');
                            }}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            placeholder="Title"
                            errorContainer={
                              errors.title && touched.title ? (
                                <FieldWarning title={errors.title} />
                              ) : (
                                <Text> </Text>
                              )
                            }
                          />
                        </View>
                        <View style={styles.titleHolder}>
                          <Text style={styles.suggestTextStyle}>
                            Description
                          </Text>
                          <Input
                            value={values.description}
                            onChangeText={handleChange('description')}
                            onBlur={() => {
                              handleBlur('description');
                            }}
                            style={[
                              styles.textInputStyle,
                              {
                                height: deviceWidth / 2.3,
                                alignItems: 'flex-start',
                              },
                            ]}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            placeholder="Description"
                            multiline={true}
                            errorContainer={
                              errors.description && touched.description ? (
                                <FieldWarning title={errors.description} />
                              ) : (
                                <Text> </Text>
                              )
                            }
                          />
                        </View>
                        <View style={styles.titleHolder}>
                          <Text style={styles.suggestTextStyle}>
                            Website/URL
                          </Text>
                          <Input
                            value={values.url}
                            onChangeText={handleChange('url')}
                            onBlur={() => {
                              handleBlur('url');
                            }}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            placeholder="https://www.xyz.com"
                            errorContainer={
                              errors.url && touched.url ? (
                                <FieldWarning title={errors.url} />
                              ) : (
                                <Text> </Text>
                              )
                            }
                          />
                        </View>
                      </View>
                    </View>
                    <Button
                      lable="Submit"
                      labelStyle={styles.labelStyle}
                      onPress={() => {
                        handleSubmit();
                      }}
                      buttonWidth={240}
                      buttonHeight={56}
                      showActivityIndicator={false}
                      buttonStyle={{alignSelf: 'center'}}
                    />
                  </>
                )}
              </Formik>
            </View>
          </ScrollView>
        </SafeAreaView>
      </GradientBackGround>
      {handelMessageModel()}
      {showTermsModelMethod()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS == 'ios' ? 20 : 65,
  },
  keyboardAvoidingHolder: {
    flex: 1,
  },
  headingHolder: {
    width: deviceWidth - 28,
  },
  suggestTextStyle: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 15,
    paddingBottom: 3,
  },
  subHeaderStyle: {
    color: '#fff',
    fontWeight: '400',
    fontSize: 14,
    marginTop: 4,
  },
  fieldHolder: {
    backgroundColor: colors.fieldHolderBg,
    borderRadius: 8,
    borderColor: colors.fieldHolderBorder,
    width: deviceWidth - 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  titleHolder: {
    paddingVertical: 2,
  },
  textInputStyle: {
    width: '100%',
    padding: Platform.OS === 'ios' ? 9 : 0,
    paddingRight: 9,
    color: '#fff',
    paddingLeft: 0,
  },
  wholeFieldStyle: {
    width: deviceWidth - 65,
  },
  textInputField: {
    padding: Platform.OS == 'ios' ? 4 : 7,
  },
  labelStyle: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 15,
  },
});
