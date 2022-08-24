import React from 'react';
import GradientFill from 'app/Components/GradientFill';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenHeader from 'app/Components/ScreenHeader';
import {appStyles, colors} from 'app/Styles/theme';
import styles from './PortfolioHome.style';
import normalize from 'app/Utils/normalize';
import {useNavigation} from '@react-navigation/native';
import {Routes} from 'app/NavigationContainers/Routes';

import {LineChart} from 'app/Components/LineChart';

import {reshapeValues} from 'app/Utils/utilities';

import useTokenBalance from 'app/Hooks/useTokenBalance';
import TokenLoader from './TokenLoader';
const navList = [
  {
    title: 'Send /\nReceive',
    icon: require('app/Assets/Png/asset-send.png'),
    moveTo: 'SendTokenHomeScreen',
  },
  {
    title: 'Buy & Sell',
    icon: require('app/Assets/Png/asset-sell.png'),
    moveTo: '',
  },
  {
    title: 'Swap',
    icon: require('app/Assets/Png/asset-swap.png'),
    moveTo: 'SwapScreenHold',
  },
  {
    title: 'Education',
    icon: require('app/Assets/Png/asset-education.png'),
    moveTo: 'EductionalMainScreen',
  },
];

const PortfolioHome = () => {
  const navigation: any = useNavigation();
  const {userTokenList, totalUserBalance, chartDataObj, isLoading} =
    useTokenBalance();

  const renderTokenItem = ({item, index}) => {
    const chartData = chartDataObj[item?.contractAddress]
      ? chartDataObj[item?.contractAddress].map(item2 => item2[1])
      : [];

    const isMarketUp = item?.priceChange24h >= 0;
    return (
      <TouchableOpacity
        key={index}
        style={styles.tokenItemWrapper}
        onPress={() =>
          navigation.navigate(Routes.portfolioTokenDetail, {
            data: {...item, totalUserBalance, chartData},
          })
        }>
        <View style={appStyles.flexRowACenter}>
          <Image source={{uri: item?.logo}} style={styles.coinIcon} />
          <Text style={styles.coinText}>{item?.symbol}</Text>
        </View>

        <View>
          {chartData.length > 0 ? (
            <LineChart
              data={{
                labels: [],
                datasets: [
                  {
                    data: chartData,
                  },
                ],
              }}
              width={normalize(70)} // from react-native
              height={normalize(28)}
              chartConfig={{
                fillShadowGradient: 'rgba(255, 0, 0,0)',
                fillShadowGradientOpacity: 0,
                backgroundColor: '#e26a00',
                backgroundGradientFrom: '#567BA7',
                backgroundGradientTo: '#567BA7',
                backgroundGradientToOpacity: 0,
                backgroundGradientFromOpacity: 0,

                decimalPlaces: 2, // optional, defaults to 2dp
                color: () => colors.white,

                style: {
                  borderRadius: 16,
                },
              }}
              style={styles.chartStyle}
              withDots={false}
              withInnerLines={false}
              withVerticalLabels={false}
              withHorizontalLabels={false}
              withVerticalLines={false}
              withHorizontalLines={false}
              fillColor={isMarketUp ? colors.green : colors.red}
              bezier
            />
          ) : null}
        </View>
        <View>
          <Text style={styles.coinValueTxt}>
            ${reshapeValues(item?.priceInUSD, 2)}
          </Text>
          <View style={[appStyles.flexRowACenter, appStyles.mt5]}>
            {item?.priceChange24h >= 0 ? (
              <Image
                source={require('app/Assets/Png/asset-market-up.png')}
                style={styles.marketIcon}
              />
            ) : (
              <Image
                source={require('app/Assets/Png/asset-market-down.png')}
                style={styles.marketIcon}
              />
            )}
            <Text
              style={[
                styles.marketValueTxt,
                isMarketUp ? {color: colors.green} : {color: colors.red},
              ]}>
              ${reshapeValues(Math.abs(item?.priceChange24h), 2)}(
              {isMarketUp
                ? `+${reshapeValues(
                    Math.abs(item?.percentagePriceChange24h),
                    2,
                  )}`
                : `-${reshapeValues(
                    Math.abs(item?.percentagePriceChange24h),
                    2,
                  )}`}
              %)
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <GradientFill>
      <ScreenHeader title="Portfolio" />
      <SafeAreaView style={styles.container}>
        <View style={styles.topContent}>
          <Text style={styles.walletBlText}>Wallet Balance</Text>
          <Text style={styles.walletAmtText}>
            ${reshapeValues(totalUserBalance, 2)}
          </Text>
          <View style={styles.navBtnWrapper}>
            {navList.map((item, i) => (
              <TouchableOpacity
                onPress={() => navigation.navigate(item.moveTo)}
                key={i}
                style={[
                  styles.navBtn,
                  navList.length - 1 !== i ? styles.mr7 : null,
                ]}>
                <Image source={item.icon} style={styles.navIcon} />
                <View style={appStyles.flex1} />
                <Text style={styles.navTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.bottomContent}>
          <View style={styles.bcTitleWrapper}>
            <Text style={styles.bcTitle}>Tokens</Text>
            <Text style={styles.bcTitle}>View All</Text>
          </View>
          <FlatList
            data={userTokenList}
            contentContainerStyle={styles.tokenContainer}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderTokenItem}
            ItemSeparatorComponent={() => <View style={styles.h8} />}
            ListEmptyComponent={() => (isLoading ? <TokenLoader /> : null)}
          />
        </View>
      </SafeAreaView>
    </GradientFill>
  );
};

export default PortfolioHome;
