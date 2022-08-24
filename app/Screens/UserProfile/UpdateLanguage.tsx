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
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {GET_MY_PROFILE} from '../../GraphqlOperations/query/query';
import {UPDATE_PROFILE} from '../../GraphqlOperations/mutation/mutation';
import {useQuery, useMutation} from '@apollo/client';
import {useFocusEffect} from '@react-navigation/native';

import GradientBackGround from '../../Components/GradientBackGround';
import Loader from '../../Components/Loader';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import Button from '../../Components/Button';
import Model from '../../Components/Model';
import normalize from 'app/Utils/normalize';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import { termData } from 'app/Utils/termModelContain';

const enFlagPng = require('../../Assets/Png/english.png');
const spFlagPng = require('../../Assets/Png/spain.png');
const checkImage = require('../../Assets/Png/check.png');
const errorPng = require('../../Assets/Png/error.png');
const deviceWidth = Dimensions.get('screen').width;

const UpdateLanguage = ({navigation}) => {
  const [language, setLanguage] = useState<string>('');
  const [, setMessage] = useState<string>('');
  const [showModel, setShowModel] = useState<boolean>(false);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  const {
    data,
    refetch,
    loading: loadingB,
    error: errorB,
  } = useQuery(GET_MY_PROFILE, {
    onCompleted: () => {
      setLanguage(data?.getProfile?.prefferedLanguage);
    },
  });
  const [updateProfile, {loading: loadingA}] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [GET_MY_PROFILE, 'myProfile'],
  });
  useFocusEffect(() => {
    refetch();
  });

  /**API call to uodate language */
  const updateLAnguage = () => {
    try {
      updateProfile({
        variables: {
          name: null,
          phone: null,
          email: null,
          prefferedLanguage: language || null,
          emailOtp: null,
          phoneOtp: null,
        },
      }).then(() => {
        setShowModel(true);
      });
    } catch (e) {
      setMessage(e.message);
    }
  };

  const handelLoadingAndError = () => {
    if (loadingB) {
      return (
        <Loader
          header="Please Wait"
          subHeader="Wait while we fetch you data securely"
        />
      );
    }
    if (errorB) {
      return (
        <Model
          source={errorPng}
          header="An error occured"
          subHeader={errorB?.message}
          HeaderStyle={{color: 'rgba(255, 15, 44, 0.75)'}}
          onClose={() => navigation.goBack()}
          messageOnButton="Go Back"
        />
      );
    }
    if (showModel) {
      return (
        <Model
          source={checkImage}
          header="Language Changed successfully"
          subHeader="Your account language has been changed successfully"
          HeaderStyle={{color: '#25BD4F', fontSize: 16}}
          onClose={() => {
            setShowModel(false);
            navigation.goBack();
          }}
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
    <GradientBackGround>
      <SafeAreaView>
        <StatusBar hidden={false} barStyle="light-content" />
        <View style={styles.subHolder}>
          <HeaderTitleHolder
            entypoIconName="language"
            headerTitle="Change - Language"
            headerSubTitle="Update your preferred language"
          />
          <View style={styles.buttonHolder}>
            <View style={styles.flagHolder}>
              <Image source={enFlagPng} style={{height: 44, width: 44}} />
              <Text style={{color: '#fff', fontWeight: '500'}}>English</Text>
              <CheckBox
                value={language === 'EN' ? true : false}
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
              <Image source={spFlagPng} style={{height: 44, width: 44}} />
              <Text style={{color: '#fff', fontWeight: '500'}}>Español</Text>
              <CheckBox
                value={language === 'SP' ? true : false}
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
            lable="Change Language"
            labelStyle={styles.labelStyle}
            onPress={() => {
              updateLAnguage();
            }}
            buttonWidth={240}
            buttonHeight={56}
            showActivityIndicator={loadingA}
            disabled={loadingA}
          />
        </View>
      </SafeAreaView>
      {loadingB && (
        <Loader
          header="Please Wait"
          subHeader="Wait while we fetch you data securely"
        />
      )}
      {handelLoadingAndError()}
      {showTermsModelMethod()}
    </GradientBackGround>
  );
};

export default UpdateLanguage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subHolder: {
    width: deviceWidth - 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS == 'ios' ? normalize(25) : normalize(80),
  },
  buttonHolder: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 221,
    width: Dimensions.get('screen').width - 28,
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
