import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Dimensions,
  Platform,
  FlatList,
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {GET_TOKEN_LIST} from '../../GraphqlOperations/query/query';
import {useQuery} from '@apollo/client';

import GradientBackGround from '../../Components/GradientBackGround';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Input from '../../Components/Input';
import {colors} from '../../Styles/theme';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import {termData} from 'app/Utils/termModelContain';

const width = Dimensions.get('screen').width;

export default function TokenSearchScreen({route, navigation}) {
  const {data, refetch, loading} = useQuery(GET_TOKEN_LIST);
  const [value, setValue] = useState<string>('');
  const [filteredTokenArray, setFilteredTokenArray] =
    useState<[{address: string; name: string; decimal: number}]>();
  const [searchedArray, setSearchedArray] = useState<any>();
  const [tokenOutValue, setTokenOutValue] = useState<any>();
  const [screen, setScreen] = useState<string>('');
  const [tokenInValue, setTokenInValue] = useState<{
    address: string;
    name: string;
    decimal: number;
  }>();
  const [selected, setSelected] = useState<string>('');
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  useFocusEffect(() => {
    refetch();
  });

  useEffect(() => {
    const {
      selectedFromRoute,
      tokenOutValueFromRoute,
      tokenInValueFromRoute,
      fromScreen,
    } = route.params;
    setTokenOutValue(tokenOutValueFromRoute);
    setTokenInValue(tokenInValueFromRoute);
    setSelected(selectedFromRoute);
    setScreen(fromScreen);
  }, [route.params]);

  useEffect(() => {
    filterTokenList();
  }, [tokenInValue, tokenOutValue,data]);

  /**Filtered Token list*/
  const filterTokenList = () => {
    let filteredArray;
    if (selected === 'IN') {
      filteredArray = data.getTokens.tokens.filter(
        item => item?.contractAddress !== tokenOutValue?.contractAddress,
      );
      setFilteredTokenArray(filteredArray);
      setSearchedArray(filteredArray);
    } else if (selected === 'OUT') {
      filteredArray = data.getTokens.tokens.filter(
        item => item?.contractAddress !== tokenInValue?.contractAddress,
      );
      setFilteredTokenArray(filteredArray);
      setSearchedArray(filteredArray);
    } else {
      setFilteredTokenArray(data?.getTokens.tokens);
      setSearchedArray(data?.getTokens.tokens);
    }
  };

  /**Component to be render between input fileds in flatlist */
  const phraseSeperator = () => {
    return <View style={styles.phraseSeperatorStyle} />;
  };

  const searchStringInArray = str => {
    if (str) {
      const newdata = filteredTokenArray.filter(item => {
        const itemData = item ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = str.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setSearchedArray(newdata);
    } else {
      setSearchedArray(filteredTokenArray);
    }
  };

  const emptyFlatlistRender = () => {
    if (loading) {
      <ActivityIndicator
        color={'#fff'}
        size="large"
        style={{justifyContent: 'center', height: width}}
      />;
    } else {
      return (
        <View style={styles.emptyListStyle}>
          <Text style={{fontSize: 14, color: '#fff', fontWeight: '500'}}>
            No Token Found !
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
        <View style={styles.subHolder}>
          <Input
            value={value}
            style={styles.textFieldStyle}
            placeholder="Search Token"
            onChangeText={text => {
              setValue(text);
              searchStringInArray(text);
            }}
            leftContainer={
              <AntDesign name="search1" style={styles.iconStyle} />
            }
            rightContainer={
              <TouchableOpacity
                style={{justifyContent: 'center'}}
                onPress={() => {
                  setValue('');
                  filterTokenList();
                }}>
                <AntDesign name="closecircle" style={styles.iconStyleCross} />
              </TouchableOpacity>
            }
          />
          <View style={{maxHeight: width * 1.5}}>
            <FlatList
              data={searchedArray}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    style={styles.tokenHolder}
                    onPress={() => {
                      navigation.navigate({
                        name: screen,
                        params: {
                          selectedToken: item,
                          selectedFromRoute: selected,
                        },
                      });
                    }}>
                    <View style={{flexDirection: 'row', padding: 12}}>
                      <View style={{padding: 0}}>
                        <Image
                          source={{uri:item.logo}}
                          style={{height: 45, width: 45}}
                          resizeMode="contain"
                        />
                      </View>
                      <View style={{paddingLeft: 15, alignSelf: 'center'}}>
                        <Text
                          style={{
                            color: 'rgba(16, 187, 176, 1)',
                            fontWeight: '600',
                            fontSize: 16,
                          }}>
                          {item.symbol}
                        </Text>
                        <Text
                          style={{
                            color: '#fff',
                            fontWeight: '600',
                            fontSize: 15,
                          }}>
                          {item.name}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={item => item.contractAddress}
              ItemSeparatorComponent={phraseSeperator}
              ListHeaderComponent={phraseSeperator}
              ListEmptyComponent={emptyFlatlistRender}
            />
          </View>
        </View>
      </SafeAreaView>
      {showTermsModelMethod()}
    </GradientBackGround>
  );
}
const styles = StyleSheet.create({
  textFieldStyle: {
    width: '100%',
    color: '#fff',
    backgroundColor: 'rgba(2, 18, 38, 0.25)',
    padding: Platform.OS == 'android' ? 0 : 6,
    borderColor: 'rgba(44, 109, 187, 1)',
  },
  subHolder: {
    width: width - 28,
    flex: 1,
    marginTop: Platform.OS == 'android' ? 60 : 0,
  },
  iconStyle: {
    color: colors.white,
    fontSize: 22,
    paddingLeft: 10,
    marginRight: -18,
    flex: 2,
    alignSelf: 'center',
    paddingVertical: 5,
  },
  iconStyleCross: {
    color: 'rgba(255, 255, 255, 0.25)',
    fontSize: 16,
    paddingHorizontal: 9,
  },
  tokenHolder: {
    width: '100%',
    backgroundColor: 'rgba(86, 123, 167, 0.25)',
    borderColor: 'rgba(218, 218, 218, 0.1)',
    borderRadius: 5,
  },
  phraseSeperatorStyle: {
    height: 8,
  },
  emptyListStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
