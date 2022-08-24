import React, {useEffect, useContext, useState} from 'react';
import {LoginContext} from '../../Constants/AllContext';
import {
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import Web3 from 'web3';
/**Custome component import */
import Button from '../../Components/Button';
import Web3Connection from '../../Utils/web3Connection';
import {web3ProviderURL} from '../../Constants/glb'; /**import constant URL for web3 connection */
import GradientBackGround from '../../Components/GradientBackGround';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import {colors} from '../../Styles/theme';
import TermsModel from '../../Components/TermsModel';
import normalize from 'app/Utils/normalize';
import { termData } from 'app/Utils/termModelContain';
import QuestionLogo from 'app/Components/QuestionLogo';

const deviceWidth = Dimensions.get('screen').width;

export default function ConnectWalletScreen({navigation}) {
  const {setWeb3Context} = useContext(LoginContext);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);
  useEffect(() => {
    webConnection();
  }, []);

  /* Establish Connection between project and web3 **/
  const webConnection = () => {
    const web3: any = new Web3(web3ProviderURL);
    setWeb3Context(web3);
    Web3Connection.setConnection(web3);
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
        <StatusBar hidden={false} barStyle="light-content" />
        <View style={styles.subHolder}>
          <ScrollView>
            <HeaderTitleHolder
              headerTitle="Connect Wallet"
              headerSubTitle="Select if you want to Create or Import wallet to connect with us."
              entypoIconName="wallet"
            />
            <View style={styles.buttonHolder}>
              <Button
                lable="Create Wallet"
                labelStyle={styles.labelStyle}
                onPress={() => {
                  navigation.navigate('MnemonicPhraseCreate');
                }}
                buttonWidth={240}
                buttonHeight={56}
              />
              <Button
                lable="Import Wallet"
                labelStyle={styles.labelStyle}
                onPress={() => {
                  navigation.navigate('WalletImportTypeSelectScreen');
                }}
                buttonWidth={240}
                buttonHeight={56}
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
    alignItems: 'center',
  },
  subHolder: {
    width: deviceWidth - 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? normalize(20) : normalize(90),
    flex:1
  },
  labelStyle: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  buttonHolder: {
    borderColor: colors.fieldHolderBorder,
    borderWidth: 1,
    borderRadius: 5,
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
});
