import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';

import {colors} from '../../Styles/theme';
import Button from '../../Components/Button';
import GradientBackGround from '../../Components/GradientBackGround';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import normalize from 'app/Utils/normalize';
import TermsModel from 'app/Components/TermsModel';
import QuestionLogo from 'app/Components/QuestionLogo';
import { termData } from 'app/Utils/termModelContain';

const deviceWidth = Dimensions.get('screen').width;

export default function WalletImportTypeSelectScreen({navigation}) {
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

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
          <ScrollView>
            <HeaderTitleHolder
              headerTitle="Import Wallet"
              headerSubTitle="Select how would you like to import your wallet, from options below."
              entypoIconName="wallet"
            />
            <View style={styles.buttonHolder}>
              <Button
                lable="Seed Phrase"
                labelStyle={styles.labelStyle}
                buttonWidth={240}
                buttonHeight={54}
                onPress={() => {
                  navigation.navigate('PhraseImportType');
                }}
              />
              <Button
                lable="Private Key"
                labelStyle={styles.labelStyle}
                buttonWidth={240}
                buttonHeight={54}
                onPress={() => {
                  navigation.navigate('PrivatekeyImportType');
                }}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      {showTermsModelMethod()}
    </GradientBackGround>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  labelStyle: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  buttonHolder: {
    borderColor: colors.fieldHolderBorder,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: deviceWidth / 2.1,
    width: deviceWidth - 28,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 16,
    backgroundColor: colors.fieldHolderBg,
    marginVertical: 35,
  },
  subHolder: {
    width: deviceWidth - 28,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: Platform.OS === 'ios' ? normalize(20) : normalize(90),
  },
});
