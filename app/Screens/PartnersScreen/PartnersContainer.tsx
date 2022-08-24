import React, {useState, useEffect} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  Platform,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import GradientBackGround from '../../Components/GradientBackGround';
import {colors} from '../../Styles/theme';
import Button from '../../Components/Button';
import Loader from '../../Components/Loader';
import Model from '../../Components/Model';
import normalize from 'app/Utils/normalize';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import { termData } from 'app/Utils/termModelContain';

const deviceWidth = Dimensions.get('screen').width;
const dummyCover = require('../../Assets/Png/partners.png');
const dummyBanner = require('../../Assets/Png/banner.png');

export default function PartnersContainer({navigation, route}) {
  const [partnerInfo, setPartnerInfo] = useState<{}>();
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  useEffect(() => {
    const {allInfoFromRoute} = route.params;
    setPartnerInfo(allInfoFromRoute);
  }, [route.params]);

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
            <View style={styles.logoHolder}>
              <Image
                source={
                  partnerInfo?.logo ? {uri: partnerInfo.logo} : dummyCover
                }
                style={styles.imageStyle}
              />
              <Text style={styles.imageHolderText}>{partnerInfo?.name}</Text>
            </View>
            <View style={styles.bannerHolder}>
              <View style={styles.bannerImageHolder}>
                <Image
                  source={
                    partnerInfo?.bannerImage
                      ? {uri: partnerInfo?.bannerImage}
                      : dummyBanner
                  }
                  style={styles.bannerImageStyle}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.textAndButtonHolder}>
                <View style={styles.subTextAndButtonHolder}>
                  <Text style={styles.textNearButton}>Support Our futures</Text>
                  <Button
                    buttonWidth={80}
                    buttonHeight={30}
                    lable="Donate"
                    labelStyle={styles.labelStyle}
                    onPress={() =>
                      navigation.navigate('PartnerDonateScreen', {
                        partnersInfo: partnerInfo,
                      })
                    }
                  />
                </View>
              </View>
            </View>
            <View style={{width: deviceWidth - 32}}>
              <View style={styles.aboutUsHolder}>
                <Text
                  style={[
                    styles.detailstextStyle,
                    {
                      fontWeight: '700',
                      fontSize: 15,
                      marginBottom: normalize(5),
                    },
                  ]}>
                  About us
                </Text>
                <Text style={[styles.textHeaderStyle]}>
                  {partnerInfo?.englishDescription}
                </Text>
              </View>
              <View style={{paddingHorizontal: normalize(9)}}>
                <View>
                  <View style={styles.detailsHolder}>
                    <Text style={styles.textHeaderStyle}>Reg.No: </Text>
                    <Text style={styles.detailstextStyle}>
                      {partnerInfo?.registrationNumber}
                    </Text>
                  </View>
                  <View style={styles.detailsHolder}>
                    <Text style={styles.textHeaderStyle}>Phone number: </Text>
                    <Text style={styles.detailstextStyle}>
                      {partnerInfo?.phone}
                    </Text>
                  </View>
                  <View style={styles.detailsHolder}>
                    <Text style={styles.textHeaderStyle}>Email address: </Text>
                    <Text style={styles.detailstextStyle}>
                      {partnerInfo?.email}
                    </Text>
                  </View>
                  <View style={styles.detailsHolder}>
                    <Text style={styles.textHeaderStyle}>Address: </Text>
                    <Text style={styles.detailstextStyle}>
                      {partnerInfo?.address}
                    </Text>
                  </View>
                </View>
              </View>
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
    justifyContent: 'flex-start',
    marginTop: Platform.OS == 'ios' ? 20 : 80,
  },
  logoHolder: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    marginBottom: 5,
  },
  imageStyle: {
    height: normalize(80),
    width: normalize(80),
    borderRadius:35
  },
  imageHolderText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  bannerHolder: {
    width: deviceWidth - 28,
    marginVertical: 10,
  },
  bannerImageHolder: {
    backgroundColor: colors.fieldHolderBg,
    borderRadius: 7,
    borderColor: colors.fieldHolderBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(10),
    paddingVertical: normalize(7),
  },
  bannerImageStyle: {
    width: deviceWidth - 56,
    height: normalize(165),
  },
  labelStyle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  textAndButtonHolder: {
    backgroundColor: colors.fieldHolderBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    borderColor: colors.fieldHolderBorder,
  },
  subTextAndButtonHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: deviceWidth - 56,
    margin: 8,
  },
  textNearButton: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  textHeaderStyle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  detailstextStyle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    width:'90%',
    lineHeight:20
  },
  detailsHolder: {
    flexDirection: 'row',
    paddingVertical: 3,
  },
  aboutUsHolder: {
    minHeight: normalize(80),
    maxHeight: normalize(280),
  },
});
