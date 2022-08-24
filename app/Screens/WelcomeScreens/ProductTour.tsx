import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import normalize from 'app/Utils/normalize';
import {termData} from 'app/Utils/termModelContain';
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import GradientBackGround from '../../Components/GradientBackGround';
import {tourPageContent} from '../../Constants/glb';
const deviceWidth = Dimensions.get('screen').width;
const tourSlide1Png = require('../../Assets/Png/tour1.png');
const tourSlide2Png = require('../../Assets/Png/tour2.png');
const tourSlide3Png = require('../../Assets/Png/tour3.png');
const tourSlide4Png = require('../../Assets/Png/tour4.png');

const ProductTour = ({navigation}) => {
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  const buttonRender = displayText => {
    return (
      <TouchableOpacity
        style={{alignSelf: 'flex-end',marginTop:normalize(90)}}
        onPress={() => {
          navigation.navigate('LoginRegisterScreen', {
            screen: 'WelcomeScreen',
          });
        }}>
        <Text
          style={{
            color: '#fff',
            fontWeight: '500',
            fontSize: 16,
            paddingRight: 20,
          }}>
          {displayText}
        </Text>
      </TouchableOpacity>
    );
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
    <GradientBackGround Style={styles.container}>
      <StatusBar hidden={false} barStyle="light-content" />
      <SafeAreaView>
        <View style={styles.subHolder}>
          <ScrollView pagingEnabled={true} horizontal>
            <View
              style={{
                width: Dimensions.get('screen').width - 28,
                alignItems: 'center',
              }}>
              <Image
                source={tourSlide1Png}
                style={styles.imageStyle}
                resizeMode={'contain'}
              />
              <View style={styles.paraHolder}>
                <View>
                  <Text style={styles.headerTitle}>
                    {tourPageContent[0].title}
                  </Text>
                </View>
                <Text style={styles.paraTextStyle}>
                  {tourPageContent[0].paragraph}
                </Text>
              </View>
              {buttonRender('Skip Intro')}
            </View>
            <View
              style={{
                width: Dimensions.get('screen').width - 28,
                alignItems: 'center',
              }}>
              <Image
                source={tourSlide2Png}
                style={styles.imageStyle}
                resizeMode={'contain'}
              />
              <View style={styles.paraHolder}>
                <View>
                  <Text style={styles.headerTitle}>
                    {tourPageContent[1].title}
                  </Text>
                </View>
                <Text style={styles.paraTextStyle}>
                  {tourPageContent[1].paragraph}
                </Text>
              </View>
              {buttonRender('Skip Intro')}
            </View>
            <View
              style={{
                width: Dimensions.get('screen').width - 28,
                alignItems: 'center',
              }}>
              <Image
                source={tourSlide3Png}
                style={styles.imageStyle}
                resizeMode={'contain'}
              />
              <View style={styles.paraHolder}>
                <View>
                  <Text style={styles.headerTitle}>
                    {tourPageContent[2].title}
                  </Text>
                </View>
                <Text style={styles.paraTextStyle}>
                  {tourPageContent[2].paragraph}
                </Text>
              </View>
              {buttonRender('Skip Intro')}
            </View>
            <View
              style={{
                width: Dimensions.get('screen').width - 28,
                alignItems: 'center',
              }}>
              <View>
                <Image
                  source={tourSlide4Png}
                  style={styles.imageStyle}
                  resizeMode={'contain'}
                />
              </View>
              <View style={styles.paraHolder}>
                <View>
                  <Text style={styles.headerTitle}>Intro 04</Text>
                </View>
                <Text style={styles.paraTextStyle}>
                  Let’s get started; create your new account or sign in if you
                  already have an account. Let’s get started; create your new
                  account or sign in if you already have an account.Let’s get
                  started; create your new account or sign in if you already
                  have an account.
                </Text>
              </View>
              {buttonRender('Get Started')}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      {showTermsModelMethod()}
    </GradientBackGround>
  );
};

export default ProductTour;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subHolder: {
    width: Dimensions.get('screen').width - 28,
    alignSelf: 'center',
    flex: 1,
    marginTop: normalize(45),
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
  paraTextStyle: {
    color: '#fff',
    fontWeight: '400',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 25,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 15,
    paddingBottom: 5,
  },
  imageStyle: {
    height: normalize(350),
    width: normalize(350),
  },
  paraHolder: {
    width: deviceWidth - 28,
    height: normalize(240),
  },
});
