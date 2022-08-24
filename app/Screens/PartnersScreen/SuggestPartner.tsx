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
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useMutation} from '@apollo/client';
import Model from '../../Components/Model';
import Loader from '../../Components/Loader';
import {launchImageLibrary} from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  PARTNER_SUGGEST,
  GET_PRESIGNED_URL,
} from '../../GraphqlOperations/mutation/mutation';
import GradientBackGround from '../../Components/GradientBackGround';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import {colors} from '../../Styles/theme';
import FieldWarning from '../../Components/FieldWarning';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import {termData} from 'app/Utils/termModelContain';
import normalize from 'app/Utils/normalize';
import CountryCodeModal from 'app/Components/CountryCodeModal';

/**constants */
const behaviorForKeyboard = Platform.OS === 'ios' ? 'padding' : 'height';
const deviceWidth = Dimensions.get('screen').width;
const defaultLogo = require('../../Assets/Png/defaultLogo.png');
const checkMark = require('../../Assets/Png/check.png');
const errorPng = require('../../Assets/Png/error.png');

const SuggestPartner = ({navigation}) => {
  const [bannerUri, setBannerUri] = useState<{}>(null);
  const [logoUri, setLogoUri] = useState<{}>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadingStatus, setUploadingStatus] = useState<boolean>(null);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);
  const [uploadProgressForLogo, setUploadProgressForLogo] = useState<number>(0);
  const [uploadProgressForBanner, setUploadProgressForBanner] =
    useState<number>(0);
  const [logoKey, setLogoKey] = useState<string>('');
  const [bannerKey, setBannerKey] = useState<string>('');
  const [indeterminateForLogo, setIndeterminateForLogo] =
    useState<boolean>(false);
  const [indeterminateForBanner, setIndeterminateForBanner] =
    useState<boolean>(false);
  const [progressColorForLogo, setProgressColorForLogo] = useState<string>(
    'rgba(0, 156, 54, 1)',
  );
  const [progressColorForBanner, setProgressColorForBanner] = useState<string>(
    'rgba(0, 156, 54, 1)',
  );
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [showCountryCodeModal, setShowCountryCodeModal] =
    useState<boolean>(false);

  const [suggestPartner, {error}] = useMutation(PARTNER_SUGGEST);
  const [generatePresignedURL] = useMutation(GET_PRESIGNED_URL);

  const handleBannerChoosePhoto = async () => {
    setUploadProgressForBanner(0);
    const options = {
      mediaType: 'photo',
    };
    launchImageLibrary(options)
      .then(async response => {
        if (response.assets) {
          setBannerUri(response.assets[0]);
          await handleSubmitImagesForBanner(response.assets[0]);
        }
      })
      .catch(() => {
        setLoading(false);
        setUploadingStatus(false);
      });
  };

  const handleLogoChoosePhoto = async () => {
    setUploadProgressForLogo(0);
    const options = {
      mediaType: 'photo',
    };
    launchImageLibrary(options)
      .then(async response => {
        if (response.assets) {
          setLogoUri(response.assets[0]);
          await handleSubmitImagesForLogo(response.assets[0]);
        }
      })
      .catch(error => {
        setLoading(false);
        setUploadingStatus(false);
      });
  };

  const handleSubmitImagesForLogo = async logoData => {
    setIndeterminateForLogo(true);
    generatePresignedURL({
      variables: {
        fileName: logoData.fileName,
        folderPath: 'PARTNER/LOGO',
        contentType: logoData.type,
      },
    })
      .then(async result => {
        let preSignedUrl = result.data.generatePresignedURL.presignedURL;
        setLogoKey(result.data.generatePresignedURL.key);

        fetch(preSignedUrl, {
          method: 'PUT',
          body: logoData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then(() => {
          setIndeterminateForLogo(false);
          setUploadProgressForLogo(100);
        });
      })
      .catch(() => {
        setProgressColorForLogo(colors.errorbg);
        setUploadProgressForLogo(50);
        setLoading(false);
        setUploadingStatus(false);
      });
  };

  const handleSubmitImagesForBanner = async bannerData => {
    setIndeterminateForBanner(true);
    generatePresignedURL({
      variables: {
        fileName: bannerData.fileName,
        folderPath: 'PARTNER/BANNER',
        contentType: bannerData.type,
      },
    })
      .then(async result => {
        let preSignedUrl = result.data.generatePresignedURL.presignedURL;
        setBannerKey(result.data.generatePresignedURL.key);

        fetch(preSignedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: bannerData,
        }).then(() => {
          setIndeterminateForBanner(false);
          setUploadProgressForBanner(100);
        });
      })
      .catch(() => {
        setProgressColorForBanner(colors.errorbg);
        setUploadProgressForBanner(50);
        setLoading(false);
        setUploadingStatus(false);
      });
  };

  /**Declearing Object Type for values */
  interface FieldValuesForPartnersSuggestion {
    name: string;
    phoneNumber: string;
    emailAddress: string;
    registrationNumber: string;
    website: string;
    address: string;
    description: string;
  }

  /** API call to add Suggested Partner*/
  const addPartnerSuggest = (values: FieldValuesForPartnersSuggestion) => {
    setLoading(true);
    suggestPartner({
      variables: {
        name: values.name,
        phone: values.phoneNumber || null,
        email: values.emailAddress || null,
        registrationNumber: values.registrationNumber || null,
        url: values.website || null,
        address: values.address || null,
        logo: logoKey || null,
        bannerImage: bannerKey || null,
        englishDescription: values.description || null,
        spanishDescription: null,
      },
    })
      .then(() => {
        setLoading(false);
        setUploadingStatus(true);
      })
      .catch(() => {
        setLoading(false);
        setUploadingStatus(false);
      });
  };

  /**Method to validate all data in field using yup library */
  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    phoneNumber: yup
      .string()
      .min(10, () => 'Phone Number must be 10 character')
      .max(10, () => 'Phone Number must be 10 character'),
    emailAddress: yup.string().email('Please enter valid email'),
    registrationNumber: yup.string(),
    website: yup.string().required('Website is required'),
    address: yup.string(),
    description: yup.string(),
  });

  const handelMessageModel = () => {
    if (uploadingStatus == true) {
      return (
        <Model
          source={checkMark}
          header="Partner information submitted successfully"
          subHeader="This makes GIE a great place."
          HeaderStyle={{color: '#25bd4f'}}
          onClose={() => navigation.goBack()}
        />
      );
    }
    if (uploadingStatus == false) {
      return (
        <Model
          source={errorPng}
          header="An error occured"
          subHeader={error?.message}
          HeaderStyle={{color: 'rgba(255, 15, 44, 0.75)'}}
          onClose={() => setUploadingStatus(null)}
          messageOnButton="Go Back"
        />
      );
    }
    if (loading) {
      return <Loader header="Please Wait" subHeader="Adding your suggestion" />;
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
      style={styles.keyboardAvoidingHolder}
      behavior={behaviorForKeyboard}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <GradientBackGround>
          <SafeAreaView>
            <View style={[styles.subHolder]}>
              <Text
                style={[styles.headetTileTextStyle, {alignSelf: 'flex-start'}]}>
                Suggest Partner
              </Text>
              <ScrollView>
                <View style={styles.headingHolder}>
                  <Text style={styles.subHeaderStyle}>
                    Suggest partners those are relevant to crypto. Best partner
                    will be featured.
                  </Text>
                </View>
                <Formik
                  validationSchema={validationSchema}
                  initialValues={{
                    name: '',
                    phoneNumber: '',
                    emailAddress: '',
                    registrationNumber: '',
                    website: '',
                    address: '',
                    description: '',
                  }}
                  onSubmit={addPartnerSuggest}>
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
                            justifyContent: 'space-around',
                          }}>
                          <View style={styles.logoHolder}>
                            <TouchableOpacity
                              style={styles.imageLogoHolder}
                              onPress={() => {
                                setIndeterminateForLogo(false);
                                setUploadProgressForLogo(0);
                                handleLogoChoosePhoto();
                              }}>
                              <Image
                                source={
                                  logoUri ? {uri: logoUri.uri} : defaultLogo
                                }
                                style={styles.logoImageStyle}
                                resizeMode={logoUri ? 'cover' : 'center'}
                              />
                            </TouchableOpacity>
                            <View style={styles.addLogoAndProgressBarHolder}>
                              <Text style={styles.fieldHeaderText}>
                                Add logo
                              </Text>
                              <View>
                                <ProgressBar
                                  progress={uploadProgressForLogo}
                                  indeterminate={indeterminateForLogo}
                                  width={200}
                                  borderWidth={0}
                                  unfilledColor="rgba(217, 217, 217, 1)"
                                  color={progressColorForLogo}
                                />
                              </View>
                            </View>
                          </View>
                          <View style={styles.titleHolder}>
                            <Text style={styles.suggestTextStyle}>
                              Upload Banner Image
                            </Text>
                            <TouchableOpacity
                              style={styles.browseButtonStyle}
                              onPress={() => {
                                setIndeterminateForBanner(false);
                                setUploadProgressForBanner(0);
                                handleBannerChoosePhoto();
                              }}>
                              <ImageBackground
                                source={bannerUri ? {uri: bannerUri.uri} : null}
                                resizeMode="cover"
                                style={styles.imagebackStyle}>
                                <Text style={styles.browseTextStyle}>
                                  Browse
                                </Text>
                              </ImageBackground>
                            </TouchableOpacity>
                            <View style={styles.addLogoAndProgressBarHolder}>
                              <View style={{paddingTop: normalize(10)}}>
                                <ProgressBar
                                  progress={uploadProgressForBanner}
                                  indeterminate={indeterminateForBanner}
                                  width={200}
                                  borderWidth={0}
                                  unfilledColor="rgba(217, 217, 217, 1)"
                                  color={progressColorForBanner}
                                />
                              </View>
                            </View>
                          </View>
                          <View style={styles.titleHolder}>
                            <Text style={styles.suggestTextStyle}>Name*</Text>
                            <Input
                              value={values.name}
                              onChangeText={handleChange('name')}
                              onBlur={() => {
                                handleBlur('name');
                              }}
                              style={styles.textInputStyle}
                              Allstyle={styles.wholeFieldStyle}
                              textStyle={styles.textInputField}
                              placeholder="Enter Name"
                              errorContainer={
                                errors.name &&
                                touched.name && (
                                  <FieldWarning title={errors.name} />
                                )
                              }
                            />
                          </View>
                          <View style={styles.titleHolder}>
                            <Text style={styles.suggestTextStyle}>
                              Phone Number
                            </Text>
                            <Input
                              value={values.phoneNumber}
                              onChangeText={handleChange('phoneNumber')}
                              onBlur={() => {
                                handleBlur('phoneNumber');
                              }}
                              style={styles.textInputStyle}
                              Allstyle={styles.wholeFieldStyle}
                              textStyle={styles.textInputField}
                              keyboardType="phone-pad"
                              placeholder="Phone Number"
                              errorContainer={
                                errors.phoneNumber &&
                                touched.phoneNumber && (
                                  <FieldWarning title={errors.phoneNumber} />
                                )
                              }
                              leftContainer={
                                <TouchableOpacity
                                  style={styles.phoneFieldLeftContainer}
                                  onPress={() => {
                                    setShowCountryCodeModal(
                                      !showCountryCodeModal,
                                    );
                                  }}>
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
                            />
                          </View>
                          <View style={styles.titleHolder}>
                            <Text style={styles.suggestTextStyle}>
                              Email Address
                            </Text>
                            <Input
                              value={values.emailAddress}
                              onChangeText={handleChange('emailAddress')}
                              onBlur={() => {
                                handleBlur('emailAddress');
                              }}
                              style={styles.textInputStyle}
                              Allstyle={styles.wholeFieldStyle}
                              textStyle={styles.textInputField}
                              keyboardType="email-address"
                              placeholder="Email address"
                              errorContainer={
                                errors.emailAddress &&
                                touched.emailAddress && (
                                  <FieldWarning title={errors.emailAddress} />
                                )
                              }
                            />
                          </View>
                          <View style={styles.titleHolder}>
                            <Text style={styles.suggestTextStyle}>
                              Registration Number
                            </Text>
                            <Input
                              value={values.registrationNumber}
                              onChangeText={handleChange('registrationNumber')}
                              onBlur={() => {
                                handleBlur('registrationNumber');
                              }}
                              style={styles.textInputStyle}
                              Allstyle={styles.wholeFieldStyle}
                              textStyle={styles.textInputField}
                              keyboardType="default"
                              placeholder="Registration Number"
                              errorContainer={
                                errors.registrationNumber &&
                                touched.registrationNumber && (
                                  <FieldWarning
                                    title={errors.registrationNumber}
                                  />
                                )
                              }
                            />
                          </View>
                          <View style={styles.titleHolder}>
                            <Text style={styles.suggestTextStyle}>
                              Website/URL*
                            </Text>
                            <Input
                              value={values.website}
                              onChangeText={handleChange('website')}
                              onBlur={() => {
                                handleBlur('website');
                              }}
                              style={styles.textInputStyle}
                              Allstyle={styles.wholeFieldStyle}
                              textStyle={styles.textInputField}
                              keyboardType="default"
                              placeholder="https://www.xyz.com"
                              errorContainer={
                                errors.website &&
                                touched.website && (
                                  <FieldWarning title={errors.website} />
                                )
                              }
                            />
                          </View>
                          <View style={styles.titleHolder}>
                            <Text style={styles.suggestTextStyle}>Address</Text>
                            <Input
                              value={values.address}
                              onChangeText={handleChange('address')}
                              onBlur={() => {
                                handleBlur('address');
                              }}
                              style={styles.textInputStyle}
                              Allstyle={styles.wholeFieldStyle}
                              textStyle={styles.textInputField}
                              keyboardType="default"
                              placeholder="Address"
                              errorContainer={
                                errors.address &&
                                touched.address && (
                                  <FieldWarning title={errors.address} />
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
                                  height: 60,
                                  alignItems: 'flex-start',
                                },
                              ]}
                              Allstyle={styles.wholeFieldStyle}
                              textStyle={styles.textInputField}
                              keyboardType="default"
                              multiline={true}
                              placeholder="Description"
                              errorContainer={
                                errors.description &&
                                touched.description && (
                                  <FieldWarning title={errors.description} />
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
                        buttonStyle={{alignSelf: 'center'}}
                      />
                    </>
                  )}
                </Formik>
              </ScrollView>
            </View>
          </SafeAreaView>
          {handelMessageModel()}
          {showTermsModelMethod()}
          {showCountryCodeModal ? (
            <CountryCodeModal
              onPressTile={item => {
                setShowCountryCodeModal(false);
                setCountryCode(item.countryCode);
              }}
            />
          ) : null}
        </GradientBackGround>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SuggestPartner;

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
    flex: 1,
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
    paddingLeft: 8,
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
    alignSelf: 'center',
    fontSize: 12,
    paddingVertical: normalize(7),
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
    flexDirection: 'row',
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
    width: deviceWidth - 65,
    paddingBottom: 2,
  },
  textInputField: {
    padding: Platform.OS == 'ios' ? 4 : 7,
  },
  suggestTextStyle: {
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    fontSize: 14,
    paddingBottom: 3,
  },
  titleHolder: {
    paddingVertical: 2,
  },
  headingHolder: {
    width: deviceWidth - 28,
  },
  subHeaderStyle: {
    color: '#fff',
    fontWeight: '400',
    fontSize: 14,
    marginTop: 4,
  },
  headetTileTextStyle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    paddingBottom: normalize(5),
  },
  logoHolder: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoImageStyle: {
    height: normalize(60),
    width: normalize(60),
    borderRadius: 25,
  },
  imageLogoHolder: {
    backgroundColor: 'rgba(196, 196, 196, 1)',
    borderRadius: 30,
    height: normalize(60),
    width: normalize(60),
  },
  addLogoAndProgressBarHolder: {
    justifyContent: 'space-around',
    paddingVertical: normalize(3),
    alignItems: 'center',
  },
  browseButtonStyle: {
    width: deviceWidth - 65,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 7,
    alignItems: 'center',
    height: normalize(60),
    borderColor: 'rgba(107, 96, 96, 0.1)',
    borderWidth: 1,
  },
  browseTextStyle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  imagebackStyle: {
    width: '100%',
    height: '100%',
    opacity: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFieldLeftContainer: {
    flexDirection: 'row',
    width: normalize(80),
    justifyContent: 'space-between',
  },
  countryCodeArrowHolder: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    marginLeft: 4,
  },
  downArrowStyle: {
    color: '#fff',
    fontSize: 12,
    alignSelf: 'center',
  },
});
