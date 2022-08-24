import * as React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';

import GradientBackGround from '../../Components/GradientBackGround';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import Button from '../../Components/Button';
import {colors} from '../../Styles/theme';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import { termData } from 'app/Utils/termModelContain';

const deviceWidth = Dimensions.get('screen').width;

const WelcomeScreen = ({navigation}) => {
  const [showTermsModel, setShowTermModel] = React.useState<boolean>(false);

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
      <StatusBar hidden={false} barStyle="light-content" />
      <SafeAreaView>
        <View style={styles.subHolder}>
          <ScrollView>
            <HeaderTitleHolder
              antDesign="login"
              headerTitle="Welcome to Global Investment Crypto Exchange App"
              headerSubTitle="GICE is a free, client-side interface helping you interact with the blockchain."
            />
            <View style={styles.buttonHolder}>
              <Button
                lable="New User"
                labelStyle={styles.labelStyle}
                onPress={() => {
                  navigation.navigate('UserRegistrationScreen');
                }}
                buttonWidth={240}
                buttonHeight={56}
              />
              <Button
                lable="Existing User"
                labelStyle={styles.labelStyle}
                onPress={() => {
                  navigation.navigate('UserLoginScreen');
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
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subHolder: {
    width: deviceWidth - 28,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: Platform.OS == 'ios' ? 20 : 90,
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
  labelStyle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
