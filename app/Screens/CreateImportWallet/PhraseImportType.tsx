import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
/**custome components */
import GradientBackGround from '../../Components/GradientBackGround';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import {validateMnemonic} from '../../Utils/utilities';
import {colors} from '../../Styles/theme';
import normalize from 'app/Utils/normalize';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import { termData } from 'app/Utils/termModelContain';
import ErrorShow from 'app/Components/ErrorShow';

const deviceWidth = Dimensions.get('screen').width;

export default function PhraseImportType({navigation}) {
  const [phraseArray, setPhraseArray] = useState<string[]>(Array(12).fill(''));
  const [messageShow, setMessageShow] = useState<boolean>(false);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  /**Component to be render between input fileds in flatlist */
  const phraseSeperator = () => {
    return <View style={styles.phraseSeperatorStyle} />;
  };

  /**Validate mnemonic phrase enter by user and move to next screen on validate */
  const validMnemonicNavigation = async () => {
    const result: any = await validateMnemonic(phraseArray);
    const responseType = typeof result;
    if (responseType === 'string') {
      navigation.navigate('PasswordCreateScreen', {
        mnemonicFromRoute: result,
        walletAddTypeFromRoute: 'Imported',
      });
    } else {
      setMessageShow(result);
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
    <KeyboardAvoidingView
      style={styles.keyboardAvovidingHolder}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <GradientBackGround>
          <SafeAreaView>
            <ScrollView nestedScrollEnabled={true}>
              <View style={styles.subHolder}>
                <HeaderTitleHolder
                  entypoIconName="wallet"
                  headerTitle="Import Phrase"
                  headerSubTitle="The most important thing to understand about non-custodial wallets is to keep and protect the seed phrase.If you lose your username and password, there is a second level of security through the seed phrase."
                />
                <View
                  style={{
                    alignItems: 'center',
                    height: deviceWidth,
                    justifyContent: 'space-between',
                    marginVertical: 6,
                  }}>
                  <Text
                    style={[
                      styles.textColor,
                      {fontSize: 14, fontWeight: '600'},
                    ]}>
                    Enter your recovery phrase
                  </Text>
                  <View style={styles.phraseHolder}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '96%',
                      }}>
                      <FlatList
                        data={phraseArray}
                        renderItem={({item, index}) => {
                          return (
                            <Input
                              style={styles.flatListRenderStyle}
                              value={item}
                              onChangeText={text => {
                                let regex =
                                  /^$|^[a-zA-Z]+$/; /**regex to check only alpha values are entered */
                                if (text.match(regex)) {
                                  let markers = [...phraseArray];
                                  markers[index] = text;
                                  setPhraseArray(markers);
                                }
                              }}
                              leftContainer={
                                <Text style={styles.inputFieldLeftContainer}>
                                  {index + 1}.
                                </Text>
                              }
                              textStyle={styles.textColor}
                            />
                          );
                        }}
                        keyExtractor={(item, index) => JSON.stringify(index)}
                        numColumns={3}
                        ItemSeparatorComponent={phraseSeperator}
                        scrollEnabled={false}
                        nestedScrollEnabled={false}
                      />
                      <View
                        style={{
                          marginTop: 19,
                        }}>
                        {messageShow ? (
                          <ErrorShow message="Invalid Phrase, try again" />
                        ) : (
                          <View style={{flexDirection:'row'}}>
                            <Image
                              source={require('../../Assets/Png/error.png')}
                              style={styles.errorPngStyle}
                            />
                            <Text style={[styles.textColor,{textAlignVertical:"bottom"}]}>
                              Never share recovery phrase with anyone.Store it
                              Securely
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  <Button
                    lable="Import Wallet"
                    buttonWidth={240}
                    buttonHeight={56}
                    labelStyle={styles.labelStyle}
                    onPress={() => {
                      validMnemonicNavigation();
                    }}
                  />
                </View>
              </View>
            </ScrollView>
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

  subHolder: {
    width: deviceWidth - 28,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: Platform.OS === 'ios' ? normalize(20) : normalize(90),
  },
  phraseHolder: {
    borderColor: colors.fieldHolderBorder,
    borderWidth: 1,
    borderRadius: 10,
    height: deviceWidth / 1.35,
    alignItems: 'center',
    width: deviceWidth - 28,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 16,
    backgroundColor: colors.fieldHolderBg,
    paddingVertical: 10,
  },
  labelStyle: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  inputFieldLeftContainer: {
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    flex: 4,
  },
  infoTextHolder: {
    borderTopWidth: 1,
    borderTopColor: '#214674',
    width: '80%',
    padding: 10,
  },
  flatListRenderStyle: {
    width: deviceWidth / 3.9,
    margin: 5,
    height: deviceWidth / 9.5,
  },
  textColor: {
    color: '#fff',
    fontSize: 12,
  },
  infoSubtextHolder: {
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 10 : 3,
  },
  errorText: {
    color: '#FF9494',
    marginBottom: 10,
  },
  phraseSeperatorStyle: {
    height: 5,
  },
  keyboardAvovidingHolder: {
    flex: 1,
  },
  errorPngStyle: {
    width: normalize(15),
    height: normalize(15),
    alignSelf: 'flex-start',
    marginHorizontal: normalize(8),
    marginTop: Platform.OS === 'android' ? normalize(4) : 0,
  },
});
