import React, {useState, useEffect} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  Platform,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {GET_PARTNERS_LIST} from '../../GraphqlOperations/query/query';
import {ADD_VOTE} from 'app/GraphqlOperations/mutation/mutation';

import GradientBackGround from '../../Components/GradientBackGround';
import Model from '../../Components/Model';
import Loader from '../../Components/Loader';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import {termData} from 'app/Utils/termModelContain';
import {colors} from 'app/Styles/theme';
import normalize from 'app/Utils/normalize';
import {useQuery, useMutation} from '@apollo/client';

const deviceWidth = Dimensions.get('screen').width;
const errorPng = require('../../Assets/Png/error.png');
const dummyCover = require('../../Assets/Png/partners.png');
const voteBox = require('../../Assets/Png/voteBox.png');
const maxCharacterToDisplay = 40;

export default function VotingMainScreen({navigation, route}) {
  const [idToShow, setIdToShow] = useState<string>('');
  const [isSucess, setisSucess] = useState<boolean>(null);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);
  const [modelMessage, setModelMessage] = useState<string>('');
  const [numberOfPages, setNumberOfPages] = useState<number>(1);
  const [listRefreshing, setListRefreshing] = useState<boolean>(false);
  const [partnerList, setPartnerList] = useState<[] | any>([]);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [addVote, {loading: voteLoading, error: voteError, data: voteDta}] =
    useMutation(ADD_VOTE);
  const {
    data,
    refetch,
    loading: apiLoading,
  } = useQuery(GET_PARTNERS_LIST, {
    variables: {
      page: numberOfPages,
      sortField: 'order',
      sortType: 'ASC',
    },
  });

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
    if (apiLoading) {
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

  const handelLoadingAndError = () => {
    if (voteLoading) {
      return <Loader header="Please Wait" subHeader="Saving your vote" />;
    }
    if (isSucess == true) {
      return (
        <Model
          source={voteBox}
          header="Thank you for voting"
          subHeader="One of our partners.  Watch your notifications for our GIE donation."
          HeaderStyle={{color: '#25BD4F'}}
          onClose={() => navigation.navigate('HomeScreen')}
          messageOnButton="Done"
        />
      );
    } else if (isSucess == false) {
      return (
        <Model
          source={errorPng}
          header="An error occur"
          subHeader={modelMessage}
          HeaderStyle={{color: 'rgba(255, 15, 44, 0.75)'}}
          onClose={() => setisSucess(null)}
          messageOnButton="Okay"
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

  useEffect(() => {
    const {transactionHashFromRoute} = route.params;
    setTransactionHash(transactionHashFromRoute);

    navigation.setOptions({
      headerRight: () => (
        <QuestionLogo onTouchField={() => setShowTermModel(!showTermsModel)} />
      ),
    });
  }, []);

  const addVoteMethod = async partnerId => {
    addVote({
      variables: {
        transactionHash: transactionHash,
        partnerId: partnerId,
      },
    })
      .then(() => {
        setisSucess(true);
      })
      .catch(error => {
        setisSucess(false);
        setModelMessage(error?.message);
      });
  };

  const renderItemViewOnClick = item => {
    return (
      <View style={styles.renderItemOnClickStyle}>
        <View style={{width: '90%', alignSelf: 'center'}}>
          <Image
            source={
              item?.bannerImage
                ? {uri: item.bannerImage}
                : require('../../Assets/Png/banner.png')
            }
            style={styles.bannerImageStyle}
            resizeMode="cover"
          />
          <View style={styles.aboutUsHolder}>
            <Text
              style={[
                styles.detailstextStyle,
                {
                  fontWeight: '700',
                  fontSize: 15,
                  marginVertical: normalize(5),
                },
              ]}>
              About us
            </Text>
            <Text style={[styles.textHeaderStyle]}>
              {item.englishDescription}
            </Text>
          </View>
          <View>
            <View>
              <View style={styles.detailsHolder}>
                <Text style={styles.textHeaderStyle}>Reg.No: </Text>
                <Text style={styles.detailstextStyle}>
                  {item.registrationNumber}
                </Text>
              </View>
              <View style={styles.detailsHolder}>
                <Text style={styles.textHeaderStyle}>Phone number: </Text>
                <Text style={styles.detailstextStyle}>{item.phone}</Text>
              </View>
              <View style={styles.detailsHolder}>
                <Text style={styles.textHeaderStyle}>Email address: </Text>
                <Text style={styles.detailstextStyle}>{item.email}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <GradientBackGround>
      <SafeAreaView>
        <StatusBar hidden={false} barStyle="light-content" />

        <View style={styles.container}>
          <FlatList
            data={partnerList}
            renderItem={({item}) => {
              return (
                <View>
                  <View style={styles.mainRender}>
                    <View style={styles.renderSubHolder}>
                      <View style={styles.partnerInfoHolderForLogoAndName}>
                        <Image
                          source={item.logo ? {uri: item.logo} : dummyCover}
                          style={styles.imageStyle}
                          resizeMode="contain"
                        />
                        <Text style={styles.partnerTitleText}>
                          {item?.name?.slice(0, maxCharacterToDisplay) +
                            (item?.name?.length > maxCharacterToDisplay
                              ? '...'
                              : '')}
                        </Text>
                      </View>
                      <View style={styles.partnerInfoHolder}>
                        <TouchableOpacity
                          style={styles.voteTouchStyle}
                          onPress={() => addVoteMethod(item.id)}>
                          <View style={styles.borderStyle}>
                            <Image
                              source={require('../../Assets/Png/voteHand.png')}
                              style={styles.voteHandImage}
                              resizeMode="contain"
                            />
                          </View>
                          <Text style={styles.voteTextStyle}>Vote</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            idToShow == item.id
                              ? setIdToShow('')
                              : setIdToShow(item.id)
                          }>
                          {idToShow === item.id ? (
                            <Image
                              source={require('../../Assets/Png/arrowDown.png')}
                              style={styles.downArrowImage}
                              resizeMode="contain"
                            />
                          ) : (
                            <Image
                              source={require('../../Assets/Png/arrowRight.png')}
                              style={styles.downArrowImage}
                              resizeMode="contain"
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  {idToShow === item.id ? renderItemViewOnClick(item) : null}
                </View>
              );
            }}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => (
              <View style={{height: normalize(9)}} />
            )}
            ListEmptyComponent={emptyComponentForPartnerHolder}
            refreshing={listRefreshing}
            onEndReached={onpageChangeofAPI}
            onEndReachedThreshold={0.5}
          />
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
    marginTop: Platform.OS == 'ios' ? normalize(26) : normalize(72),
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
  mainRender: {
    backgroundColor: colors.fieldHolderBg,
    borderRadius: 6,
    borderColor: colors.fieldHolderBorder,
    borderWidth: 1,
    width: deviceWidth - 28,
  },
  renderSubHolder: {
    flexDirection: 'row',
    marginHorizontal: normalize(18),
    paddingVertical: normalize(10),
    justifyContent: 'space-between',
  },
  partnerInfoHolder: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: normalize(100),
    justifyContent: 'space-between',
  },
  imageStyle: {
    height: normalize(40),
    width: normalize(40),
    borderRadius:20,
    marginRight:10
  },
  partnerTitleText: {
    color: '#fff',
    fontSize: 14,
  },
  voteHandImage: {
    height: normalize(18),
    width: normalize(18),
  },
  voteTextStyle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    marginLeft: normalize(8),
  },
  downArrowImage: {
    height: normalize(20),
    width: normalize(20),
  },
  borderStyle: {
    borderWidth: 2,
    borderRadius: 30,
    padding: normalize(6.5),
    borderColor: 'rgba(78, 125, 184, 1)',
  },
  textHeaderStyle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    lineHeight: 20,
  },
  detailstextStyle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    width: '90%',
    lineHeight: 20,
  },
  detailsHolder: {
    flexDirection: 'row',
    paddingVertical: 3,
  },
  aboutUsHolder: {
    minHeight: normalize(80),
    maxHeight: normalize(280),
  },
  renderItemOnClickStyle: {
    width: deviceWidth - 28,
    backgroundColor: 'rgba(86, 123, 167, 0.25)',
    borderRadius: 6,
    paddingVertical: normalize(10),
    marginTop: normalize(4),
  },
  bannerImageStyle: {
    width: '100%',
    height: normalize(165),
    borderRadius: 10,
  },
  voteTouchStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerInfoHolderForLogoAndName: {
    flexDirection: 'row',
    alignItems: 'center',
    width: normalize(180),
  },
});
