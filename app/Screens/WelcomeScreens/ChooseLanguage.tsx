import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  Text,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import GradientBackGround from '../../Components/GradientBackGround';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import Button from '../../Components/Button';
import normalize from 'app/Utils/normalize';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import { termData } from 'app/Utils/termModelContain';

const ChooseLanguage = ({navigation}) => {
  const [language, setLanguage] = useState<string>('EN');
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
        <StatusBar hidden={false} barStyle="light-content" />
        <View style={styles.subHolder}>
          <ScrollView>
            <HeaderTitleHolder
              entypoIconName="language"
              headerTitle="Welcome to Global Investment Crypto Exchange App"
              headerSubTitle="Choose Your Preferred Language"
            />
            <View style={styles.buttonHolder}>
              <View style={styles.flagHolder}>
                <Image
                  source={require('../../Assets/Png/english.png')}
                  style={{height: 44, width: 44}}
                  resizeMode="contain"
                />
                <Text style={{color: '#fff', fontWeight: '500'}}>English</Text>
                <CheckBox
                  value={language == 'EN' ? true : false}
                  onValueChange={() => setLanguage('EN')}
                  boxType="square"
                  lineWidth={2}
                  onCheckColor="#000"
                  hideBox={true}
                  tintColors={{true: '#fff', false: '#fff'}}
                  style={styles.checkBoxStyle}
                />
              </View>
              <View style={styles.flagHolder}>
                <Image
                  source={require('../../Assets/Png/spain.png')}
                  style={{height: 44, width: 44}}
                  resizeMode="contain"
                />
                <Text style={{color: '#fff', fontWeight: '500'}}>Español</Text>
                <CheckBox
                  value={language == 'SP' ? true : false}
                  onValueChange={() => setLanguage('SP')}
                  boxType="square"
                  lineWidth={2}
                  onCheckColor="#000"
                  hideBox={true}
                  tintColors={{true: '#fff', false: '#fff'}}
                  style={styles.checkBoxStyle}
                />
              </View>
            </View>
            <Button
              lable="Continue"
              labelStyle={styles.labelStyle}
              onPress={() => {
                navigation.navigate('ProductTour');
              }}
              buttonStyle={{alignSelf:"center"}}
              buttonWidth={240}
              buttonHeight={56}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
      {showTermsModelMethod()}
    </GradientBackGround>
  );
};

export default ChooseLanguage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subHolder: {
    width: Dimensions.get('screen').width - 28,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginTop: Platform.OS == 'ios' ? normalize(25) : normalize(80),
  },
  buttonHolder: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: Dimensions.get('screen').width - 28,
    paddingVertical: normalize(65),
  },
  labelStyle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  flagHolder: {
    height: 112,
    width: 112,
    backgroundColor: '#04223C',
    borderRadius: 8,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#020A11',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 4,
    shadowOpacity: 0.8,
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
      : {},
});
