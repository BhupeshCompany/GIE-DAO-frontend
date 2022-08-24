import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
  Image
} from 'react-native';

import Button from '../../Components/Button';
import GradientBackGround from '../../Components/GradientBackGround';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import Input from '../../Components/Input';
import {getMnemoic, randomPhraseSelecter} from '../../Utils/utilities';
import {colors} from '../../Styles/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import normalize from 'app/Utils/normalize';
import TermsModel from 'app/Components/TermsModel';
import { termData } from 'app/Utils/termModelContain';
import QuestionLogo from 'app/Components/QuestionLogo';

/**Constant */
const deviceWidth = Dimensions.get('screen').width;

export default function MnemonicPhraseCreate({navigation}) {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [mnemonicRandomIndex, setMnemonicRandomIndex] = useState<number[]>([
    0, 0, 0,
  ]);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  useEffect(() => {
    setMnemonic(
      getMnemoic,
    ); /**Set mnemoic phrase in state using function at utilities file */
    setMnemonicRandomIndex(
      randomPhraseSelecter,
    ); /**Set 3 random number in array state using function at utilities file */
  }, []);

  /**Component to be render between input fileds in flatlist */
  const phraseSeperator = () => {
    return <View style={styles.phraseSeperatorStyle} />;
  };

  /**pick 3 phrases from state as per number generate in randomPhraseSelecter method and move to next screen */
  const onContinueButton = () => {
    let stringToArray = mnemonic.split(' ');
    navigation.navigate('PhraseVerify', {
      mnemonicArrayForRoute: [
        {
          word: stringToArray[mnemonicRandomIndex[0] - 1],
          index: mnemonicRandomIndex[0],
        },
        {
          word: stringToArray[mnemonicRandomIndex[1] - 1],
          index: mnemonicRandomIndex[1],
        },
        {
          word: stringToArray[mnemonicRandomIndex[2] - 1],
          index: mnemonicRandomIndex[2],
        },
      ],
      mnemonicForRoute: mnemonic,
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
    <GradientBackGround>
      <SafeAreaView>
        <View style={styles.subHolder}>
          <HeaderTitleHolder
            headerTitle="Create Wallet"
            headerSubTitle="The most important thing to understand about 
            non-custodial wallets is to keep and protect the seed phrase.If you lose your username and password, there is a second level of security through the seed phrase."
            entypoIconName="wallet"
          />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={[styles.textColor, {fontSize: 14, fontWeight: '600'}]}>
              Your recovery phrase
            </Text>
            <View style={styles.phraseHolder}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: deviceWidth - 50,
                }}>
                <FlatList
                  data={mnemonic.split(' ')}
                  renderItem={({item, index}) => {
                    return (
                      <Input
                        style={styles.flatListRenderItem}
                        value={item}
                        leftContainer={
                          <Text style={styles.inputFieldLeftContainer}>
                            {index + 1}.
                          </Text>
                        }
                        textStyle={styles.textColor}
                        editable={false}
                      />
                    );
                  }}
                  keyExtractor={item => JSON.stringify(item)}
                  numColumns={3}
                  ItemSeparatorComponent={phraseSeperator}
                  scrollEnabled={false}
                />
                <View style={{marginTop: 19,flexDirection:'row'}}>
                  <Image
                    source={require('../../Assets/Png/error.png')}
                    style={styles.errorPngStyle}
                  />
                  <Text style={[styles.textColor]}>
                    Never share recovery phrase with anyone.Store it Securely
                  </Text>
                </View>
              </View>
            </View>
            <Button
              lable="Continue"
              labelStyle={styles.labelStyle}
              onPress={() => onContinueButton()}
              buttonWidth={240}
              buttonHeight={56}
            />
          </View>
        </View>
      </SafeAreaView>
      {showTermsModelMethod()}
    </GradientBackGround>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subHolder: {
    width: deviceWidth - 28,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: Platform.OS === 'ios' ? normalize(45) : normalize(85),
    flex: 0.95,
  },
  phraseHolder: {
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
    paddingVertical: 14,
    marginVertical: 14,
  },
  labelStyle: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  textColor: {
    color: colors.white,
    fontSize: 12,
  },
  inputFieldLeftContainer: {
    color: colors.white,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    flex: 4,
    fontSize: 12,
  },
  flatListRenderItem: {
    width: deviceWidth / 3.8,
    margin: 5,
    height: 42,
  },
  infoSubtextHolder: {
    alignItems: 'center',
  },
  phraseSeperatorStyle: {
    height: 5,
  },
  errorPngStyle: {
    width: normalize(15),
    height: normalize(15),
    alignSelf: 'flex-start',
    marginHorizontal: normalize(8),
    marginTop: Platform.OS === 'android' ? normalize(4) : 0,
  },
});
