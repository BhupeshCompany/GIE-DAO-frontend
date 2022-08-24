import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import GradientBackGround from '../../Components/GradientBackGround';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import {GET_PARTNERS_LIST} from '../../GraphqlOperations/query/query';
import {useQuery} from '@apollo/client';
import {colors} from '../../Styles/theme';
import LinearGradient from 'react-native-linear-gradient';
import normalize from 'app/Utils/normalize';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import {termData} from 'app/Utils/termModelContain';

const deviceWidth = Dimensions.get('screen').width;
const maxCharacterToDisplay = 20;
const dummyCover = require('../../Assets/Png/partners.png');
export default function PartnersMainScreen({navigation}) {
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [listRefreshing, setListRefreshing] = useState<boolean>(false);
  const [partnerList, setPartnerList] = useState<[] | any>([]);
  const {data, refetch, loading} = useQuery(GET_PARTNERS_LIST, {
    variables: {
      page: numberOfPages,
      sortField: 'order',
      sortType: 'ASC',
    },
  });
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  useEffect(() => {
    let finalArray = data
      ? partnerList.concat(data?.getPartners?.partners)
      : partnerList;
    setPartnerList(finalArray);
    setListRefreshing(false);
  }, [data]);

  useEffect(() => {
    refetch();
  }, [numberOfPages]);

  const onpageChangeofAPI = () => {
    setListRefreshing(true);
    setNumberOfPages(numberOfPages + 1);
  };

  const emptyComponentForPartnerHolder = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={'#fff'}
          size="large"
          style={{justifyContent: 'center', height: deviceWidth}}
        />
      );
    } else {
      return (
        <View
          style={{
            height: deviceWidth,
            justifyContent: 'center',
          }}>
          <Text style={{color: '#fff'}}>
            No partner avaliable. Suggest one now !
          </Text>
        </View>
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
            headerTitle="Partners"
            headerSubTitle="Whether you are new to crypto or an experienced trader, check out the link below for great resources:"
            entypoIconName="briefcase"
          />
          <View style={styles.buttonHolder}>
            <FlatList
              data={partnerList}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    style={styles.renderHolder}
                    onPress={() => {
                      navigation.navigate('PartnersContainer', {
                        allInfoFromRoute: item,
                      });
                    }}>
                    <View style={styles.renderItemStyle}>
                      <Image
                        source={item.logo ? {uri: item.logo} : dummyCover}
                        style={styles.imageStyle}
                        resizeMode="cover"
                      />
                    </View>
                    <View>
                      <Text style={styles.titleHolder}>
                        {item?.name?.slice(0, maxCharacterToDisplay) +
                          (item?.name?.length > maxCharacterToDisplay
                            ? '...'
                            : '')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={item => item.id}
              numColumns={3}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={emptyComponentForPartnerHolder}
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
                  navigation.navigate('SuggestPartner');
                }}>
                <Text style={styles.labelStyle}>Suggest Partner</Text>
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
    justifyContent: 'center',
    height: deviceWidth,
    alignItems: 'center',
    width: deviceWidth - 28,
    marginVertical: 10,
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
  renderItemStyle: {
    backgroundColor: colors.fieldHolderBg,
    borderWidth: 1,
    borderColor: colors.fieldHolderBorder,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    padding:normalize(10)
  },
  renderHolder: {
    alignItems: 'center',
  },
  titleHolder: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 13,
    maxHeight: normalize(45),
    width: normalize(90),
    textAlign: 'center',
  },
  imageStyle: {
    height: normalize(90),
    width: normalize(90),
    borderRadius:45
  },
});
