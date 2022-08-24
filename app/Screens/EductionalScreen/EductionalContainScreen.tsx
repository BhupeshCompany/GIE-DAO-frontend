import React, {useState, useEffect} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  Platform,
  Text,
  ScrollView,
} from 'react-native';

import GradientBackGround from '../../Components/GradientBackGround';
import Loader from '../../Components/Loader';
import Video from 'react-native-video';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import {termData} from 'app/Utils/termModelContain';
import RenderHTML from 'react-native-render-html';
import normalize from 'app/Utils/normalize';

const deviceWidth = Dimensions.get('screen').width;

export default function EductionalContainScreen({route, navigation}) {
  const [eductionalContent, setEductionalContent] = useState<{}>();
  const [loading, setLoading] = useState<boolean>(false);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  useEffect(() => {
    const {dataFromRoute} = route.params;
    setEductionalContent(dataFromRoute);
  }, []);

  const handelLoadingAndError = () => {
    if (loading) {
      return (
        <Loader header="Please Wait" subHeader="Wait while we fetch data" />
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

        <View style={styles.container}>
          <View style={styles.questionHolder}>
            <Text style={styles.questionText}>
              {eductionalContent?.englishTitle}
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={true}
            indicatorStyle="white"
            nestedScrollEnabled={true}
            scrollEnabled={true}
            style={{paddingHorizontal: 12}}>
            {(eductionalContent?.englishVideo ||
              eductionalContent?.spanishVideo) && (
              <View style={styles.videoHolder}>
                <Video
                  source={{uri: eductionalContent?.englishVideo}}
                  style={{
                    width: '100%',
                    height: normalize(300),
                    borderRadius: 7,
                    backgroundColor: '#000',
                  }}
                  controls={true}
                  playInBackground={false}
                  preventsDisplaySleepDuringVideoPlayback={true}
                  resizeMode="contain"
                  playWhenInactive={false}
                  paused
                />
              </View>
            )}
            <View style={styles.containHolder}>
              <RenderHTML
                contentWidth={deviceWidth}
                source={{
                  html: `${eductionalContent?.englishDescription}`,
                }}
                tagsStyles={{
                  p: {color: '#fff', backgroundColor: 'rgba(0,0,0,0)'},
                  h2: {color: '#000'},
                }}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      {handelLoadingAndError()}
      {showTermsModelMethod()}
    </GradientBackGround>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? 20 : 65,
  },
  questionHolder: {
    width: deviceWidth - 28,
    padding: 4,
    paddingBottom: 9,
  },
  questionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  videoHolder: {
    width: deviceWidth - 28,
    borderRadius: 8,
  },
  containHolder: {
    width: deviceWidth - 28,
  },
  containText: {
    color: '#FFF',
    textAlign: 'justify',
    lineHeight: 19,
  },
  readMoreText: {
    color: '#fff',
    textDecorationLine: 'underline',
    alignSelf: 'flex-end',
    fontSize: 14,
    fontWeight: '500',
  },
  readMoreHolder: {
    width: deviceWidth - 28,
    marginHorizontal: 10,
  },
});
