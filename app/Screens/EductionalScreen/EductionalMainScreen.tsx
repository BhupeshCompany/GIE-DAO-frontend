import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  Platform,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import Button from '../../Components/Button';
import GradientBackGround from '../../Components/GradientBackGround';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import {GET_EDU_CONTENT} from '../../GraphqlOperations/query/query';
import {useQuery} from '@apollo/client';
import {colors} from '../../Styles/theme';
import LinearGradient from 'react-native-linear-gradient';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import {termData} from 'app/Utils/termModelContain';

const deviceWidth = Dimensions.get('screen').width;
const maxCharacterToDisplay = 100;

export default function EductionalMainScreen({navigation}) {
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [listRefreshing, setListRefreshing] = useState<boolean>(false);
  const [eductionList, setEductionList] = useState<[] | any>([]);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  const {data, refetch, loading} = useQuery(GET_EDU_CONTENT, {
    variables: {
      page: numberOfPages,
      sortField: 'order',
      sortType: 'ASC',
    },
  });

  useEffect(() => {
    let finalArray = data
      ? eductionList.concat(data?.getEducationalContents?.contents)
      : eductionList;
    setEductionList(finalArray);
    setListRefreshing(false);
  }, [data]);

  useEffect(() => {
    refetch();
  }, [numberOfPages]);

  const tabSeperater = () => {
    return <View style={{height: 8}} />;
  };

  const onpageChangeofAPI = () => {
    setListRefreshing(true);
    setNumberOfPages(numberOfPages + 1);
  };

  const emptyComponentForEductionHolder = () => {
    if (loading) {
      return <ActivityIndicator color={'#fff'} size="small" />;
    } else {
      return (
        <Text style={{color: '#fff'}}>
          No content avaliable. Suggest one now !
        </Text>
      );
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
    <GradientBackGround>
      <SafeAreaView>
        <StatusBar hidden={false} barStyle="light-content" />
        <View style={styles.subHolder}>
          <HeaderTitleHolder
            headerTitle="Education"
            headerSubTitle="Whether you are new to crypto or an experienced trader, check out the link below for great resources:"
            entypoIconName="graduation-cap"
          />
          <View style={styles.buttonHolder}>
            <FlatList
              data={eductionList}
              renderItem={({item}) => {
                return (
                  <Button
                    lable={
                      item?.englishTitle?.slice(0, maxCharacterToDisplay) +
                      (item?.englishTitle?.length > maxCharacterToDisplay
                        ? '...'
                        : '')
                    }
                    labelStyle={styles.labelStyle}
                    onPress={() => {
                      navigation.navigate('EductionalContainScreen', {
                        dataFromRoute: item,
                      });
                    }}
                    buttonWidth={deviceWidth - 50}
                    buttonHeight={51}
                    buttonStyle={{elevation: null}}
                    mainStyle={{
                      shadowRadius: 0,
                      shadowOffset: {
                        width: 0,
                        height: 0,
                      },
                    }}
                  />
                );
              }}
              keyExtractor={item => JSON.stringify(item?.id)}
              ItemSeparatorComponent={tabSeperater}
              ListEmptyComponent={emptyComponentForEductionHolder}
              refreshing={listRefreshing}
              onEndReached={onpageChangeofAPI}
              onEndReachedThreshold={0.5}
            />
          </View>
          <View style={{marginTop: 40}}>
            <LinearGradient
              colors={['#002E5E', '#092038']}
              style={styles.suggestContainer}>
              <TouchableOpacity
                style={[
                  {justifyContent: 'center', alignItems: 'center'},
                  {width: '100%', height: 51},
                ]}
                onPress={() => {
                  navigation.navigate('EductionSuggest');
                }}>
                <Text style={styles.labelStyle}>Suggest Content</Text>
              </TouchableOpacity>
            </LinearGradient>
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
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: Platform.OS == 'ios' ? 20 : 80,
  },
  labelStyle: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 15,
  },
  buttonHolder: {
    borderColor: colors.fieldHolderBorder,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: deviceWidth - 28,
    maxHeight: deviceWidth / 1.2,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 16,
    backgroundColor: colors.fieldHolderBg,
    marginTop: 25,
    paddingVertical: 20,
  },
  suggestContainer: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0)',
    width: deviceWidth - 50,
    borderRadius: 8,
    alignContent: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(1,1,1,1)',
  },
});
