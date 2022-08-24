import Web3 from 'web3';
import {web3ProviderURL, rnEncryptedStorageKey} from '../Constants/glb';
import React, {useEffect, useContext, useState} from 'react';
import {Image, Platform, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import {LoginContext} from '../Constants/AllContext';
import SplashScreen from 'react-native-splash-screen';
import Entypo from 'react-native-vector-icons/Entypo';
/**Screen Import from HomeScreen */
import HomeScreen from '../Screens/HomeScreenMain/HomeScreen';
/**Swap Screen */
import Swap from '../Screens/SwapScreens/Swap';
import TokenSearchScreen from '../Screens/SwapScreens/TokenSearchScreen';
/**Screen Import from CreateImport Wallet*/
import ConnectWalletScreen from '../Screens/CreateImportWallet/ConnectWalletScreen';
import MnemonicPhraseCreate from '../Screens/CreateImportWallet/MnemonicPhraseCreate';
import PasswordCreateScreen from '../Screens/CreateImportWallet/PasswordCreateScreen';
import WalletImportTypeSelectScreen from '../Screens/CreateImportWallet/WalletImportTypeSelectScreen';
import PhraseImportType from '../Screens/CreateImportWallet/PhraseImportType';
import PrivatekeyImportType from '../Screens/CreateImportWallet/PrivateKeyImportType';
import PhraseVerify from '../Screens/CreateImportWallet/PhraseVerify';
import LoadingScreen from '../Screens/CreateImportWallet/LoadingScreen';
/**Screen Import from LoginRegister*/
import WelcomeScreen from '../Screens/LoginRegister/WelcomeScreen';
import UserRegistrationScreen from '../Screens/LoginRegister/UserRegistrationScreen';
import VerifyOtpScreen from '../Screens/LoginRegister/VerifyOtpScreen';
import UserLoginScreen from '../Screens/LoginRegister/UserLoginScreen';
import ForgotPasswordScreen from '../Screens/LoginRegister/ForgotPasswordScreen';
import ResetPasswordScreen from '../Screens/LoginRegister/ResetPasswordScreen';
/**Screen Import from UserProfile */
import UserProfileScreen from '../Screens/UserProfile/UserProfileScreen';
import ChangePasswordScreen from '../Screens/UserProfile/ChangePasswordScreen';
import UpdateProfile from '../Screens/UserProfile/UpdateProfile';
import OtpProfileUpdate from '../Screens/UserProfile/OtpProfileUpdate';
import UpdateLanguage from '../Screens/UserProfile/UpdateLanguage';
import PrivateKeyShowScreen from 'app/Screens/UserProfile/PrivateKeyShowScreen';
/**Screen Import from WelcomeScreen */
import ChooseLanguage from '../Screens/WelcomeScreens/ChooseLanguage';
import ProductTour from '../Screens/WelcomeScreens/ProductTour';
import WalletAccessByPassword from '../Screens/WalletAccess/WalletAccessByPassword';
import {Routes} from './Routes';
import {PortfolioHome, PortfolioTokenDetail} from 'app/Screens/Portfolio';
/**Screen Import for Eduction Screen */
import EductionalMainScreen from '../Screens/EductionalScreen/EductionalMainScreen';
import EductionalContainScreen from '../Screens/EductionalScreen/EductionalContainScreen';
import EductionSuggest from '../Screens/EductionalScreen/EductionSuggest';
import OfflineScreen from '../Screens/OtherScreens/OfflineScreen';
import PartnersMainScreen from '../Screens/PartnersScreen/PartnersMainScreen';
import PartnersContainer from '../Screens/PartnersScreen/PartnersContainer';
import SuggestPartner from '../Screens/PartnersScreen/SuggestPartner';
import PartnerDonateScreen from '../Screens/PartnersScreen/PartnerDonateScreen';
import SendTokenHomeScreen from '../Screens/SendReceiveToken/SendTokenHomeScreen';
import SendRecipientAdd from '../Screens/SendReceiveToken/SendRecipientAdd';
import CameraScreen from 'app/Screens/SendReceiveToken/CameraScreen';
import {
  NotificationDetail,
  NotificationHome,
  NotificationSettings,
} from 'app/Screens';
import VotingMainScreen from 'app/Screens/VotingScreen/VotingMainScreen';
import ScreenHeader from 'app/Components/ScreenHeader';

const Stack = createNativeStackNavigator();
const CreateImportWalletStack = createNativeStackNavigator();
const LoginRegisterStack = createNativeStackNavigator();
const WelcomeStack = createNativeStackNavigator();
const BottomTabStack = createBottomTabNavigator();
const SwapScreenStack = createNativeStackNavigator();
const HomeScreenStack = createNativeStackNavigator();

/**header with left image */
const headerWithLeftLogo = () => {
  return (
    <Image
      source={require('../Assets/Png/logo.png')}
      style={{height: 30, width: 30}}
    />
  );
};

/**Stack that hold all screen for create and import wallet */
const CreateImportWalletScreen = () => (
  <CreateImportWalletStack.Navigator
    screenOptions={{
      headerBackTitleVisible: false,
      headerTransparent: true,
      title: '',
      headerStyle: {
        backgroundColor: 'rgba(6, 33, 66, 0.25)',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'normal',
      },
      animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
      headerTitleAlign: 'center',
    }}>
    <CreateImportWalletStack.Screen
      name="ConnectWalletScreen"
      component={ConnectWalletScreen}
      options={{
        headerLeft: () => headerWithLeftLogo(),
        headerTitleAlign: 'center',
      }}
    />
    <CreateImportWalletStack.Screen
      name="MnemonicPhraseCreate"
      component={MnemonicPhraseCreate}
    />
    <CreateImportWalletStack.Screen
      name="PhraseVerify"
      component={PhraseVerify}
    />
    <CreateImportWalletStack.Screen
      name="PasswordCreateScreen"
      component={PasswordCreateScreen}
      initialParams={{
        mnemonicFromRoute: null,
        privateKeyFromRoute: null,
      }}
    />
    <CreateImportWalletStack.Screen
      name="WalletImportTypeSelectScreen"
      component={WalletImportTypeSelectScreen}
    />
    <CreateImportWalletStack.Screen
      name="PhraseImportType"
      component={PhraseImportType}
    />
    <CreateImportWalletStack.Screen
      name="PrivatekeyImportType"
      component={PrivatekeyImportType}
      options={{
        title: 'Private Key',
      }}
    />
    <CreateImportWalletStack.Screen
      name="LoadingScreen"
      component={LoadingScreen}
      options={{
        presentation: 'modal',
        headerShown: false,
        animation: 'default',
      }}
    />
  </CreateImportWalletStack.Navigator>
);

/**Stack that hold all screen for login and register user flow */
const LoginRegisterScreen = () => (
  <LoginRegisterStack.Navigator
    screenOptions={{
      headerBackTitleVisible: false,
      headerTransparent: true,
      title: '',
      headerStyle: {
        backgroundColor: 'rgba(6, 33, 66, 0.25)',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
    }}>
    <LoginRegisterStack.Screen
      name="WelcomeScreen"
      component={WelcomeScreen}
      options={{
        headerLeft: () => headerWithLeftLogo(),
      }}
    />
    <LoginRegisterStack.Screen
      name="UserRegistrationScreen"
      component={UserRegistrationScreen}
    />
    <LoginRegisterStack.Screen
      name="VerifyOtpScreen"
      component={VerifyOtpScreen}
    />
    <LoginRegisterStack.Screen
      name="UserLoginScreen"
      component={UserLoginScreen}
    />
    <LoginRegisterStack.Screen
      name="ForgotPasswordScreen"
      component={ForgotPasswordScreen}
    />
    <LoginRegisterStack.Screen
      name="ResetPasswordScreen"
      component={ResetPasswordScreen}
    />
  </LoginRegisterStack.Navigator>
);

/**Stack that hold all screen for Welcomeflow */
const WelcomeStackScreen = () => (
  <WelcomeStack.Navigator
    screenOptions={{
      headerBackTitleVisible: false,
      headerTransparent: true,
      title: '',
      headerStyle: {
        backgroundColor: 'rgba(6, 33, 66, 0.25)',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
    }}>
    <WelcomeStack.Screen name="ChooseLanguage" component={ChooseLanguage} />
    <WelcomeStack.Screen
      name="ProductTour"
      component={ProductTour}
      options={{title: ''}}
    />
  </WelcomeStack.Navigator>
);

const SwapScreenHold = () => (
  <SwapScreenStack.Navigator
    screenOptions={{
      headerBackTitleVisible: false,
      headerTransparent: true,
      title: 'Swap Token',
      headerStyle: {
        backgroundColor: 'rgba(6, 33, 66, 0.25)',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'normal',
      },
      headerTitleAlign: 'center',
      animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
    }}
    initialRouteName="Swap">
    <SwapScreenStack.Screen
      name="Swap"
      component={Swap}
      options={{
        headerLeft: () => headerWithLeftLogo(),
      }}
      initialParams={{
        selectedToken: null,
        selectedFromRoute: '',
      }}
    />
    <SwapScreenStack.Screen
      name="TokenSearchScreen"
      component={TokenSearchScreen}
      options={{title: 'Select Token'}}
      initialParams={{
        fromScreen: null,
        tokenInValueFromRoute: null,
        tokenOutValueFromRoute: null,
        selectedFromRoute: null,
      }}
    />
  </SwapScreenStack.Navigator>
);

const HomeScreenStackHolder = () => (
  <HomeScreenStack.Navigator
    initialRouteName="HomeScreen"
    screenOptions={{
      headerBackTitleVisible: false,
      headerTransparent: true,
      title: '',
      headerStyle: {
        backgroundColor: 'rgba(6, 33, 66, 0.25)',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'normal',
      },
      headerTitleAlign: 'center',
      animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
    }}>
    <HomeScreenStack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        title: '',
        headerLeft: () => headerWithLeftLogo(),
      }}
    />
    <HomeScreenStack.Screen
      name="EductionalMainScreen"
      component={EductionalMainScreen}
      options={{
        title: '',
      }}
    />
    <HomeScreenStack.Screen
      name="EductionalContainScreen"
      component={EductionalContainScreen}
      options={{
        title: 'Education',
      }}
    />
    <HomeScreenStack.Screen
      name="EductionSuggest"
      component={EductionSuggest}
      options={{
        title: 'Education',
      }}
    />
    <HomeScreenStack.Screen
      name="PartnersMainScreen"
      component={PartnersMainScreen}
      options={{
        title: '',
      }}
    />
    <HomeScreenStack.Screen
      name="PartnersContainer"
      component={PartnersContainer}
      options={{
        title: 'Partners',
      }}
    />
    <HomeScreenStack.Screen
      name="SuggestPartner"
      component={SuggestPartner}
      options={{
        title: 'Partners',
      }}
    />
    <HomeScreenStack.Screen
      name="PartnerDonateScreen"
      component={PartnerDonateScreen}
      options={{
        title: 'Partners',
      }}
      initialParams={{
        selectedToken: null,
        partnersInfo: null,
      }}
    />
    <HomeScreenStack.Screen
      name="SendTokenHomeScreen"
      component={SendTokenHomeScreen}
      options={{
        title: 'Token',
      }}
    />
    <HomeScreenStack.Screen
      name="SendRecipientAdd"
      component={SendRecipientAdd}
      options={{
        title: 'Send Token',
      }}
      initialParams={{
        selectedToken: null,
        recipientAddressFromScan: null,
      }}
    />
    <HomeScreenStack.Screen
      name="CameraScreen"
      component={CameraScreen}
      options={{
        title: 'Scan & Send',
      }}
    />
    <HomeScreenStack.Screen
      name="UserProfileScreen"
      component={UserProfileScreen}
      options={{
        title: 'Profile',
      }}
    />
    <HomeScreenStack.Screen
      name="ChangePasswordScreen"
      component={ChangePasswordScreen}
      options={{
        title: 'Change Password',
      }}
    />
    <HomeScreenStack.Screen
      name="UpdateProfile"
      component={UpdateProfile}
      options={{
        title: 'Profile',
      }}
    />
    <HomeScreenStack.Screen
      name="OtpProfileUpdate"
      component={OtpProfileUpdate}
      options={{
        title: 'Verify OTP',
      }}
    />
    <HomeScreenStack.Screen
      name="PrivateKeyShowScreen"
      component={PrivateKeyShowScreen}
      options={{
        title: '',
      }}
    />
    <HomeScreenStack.Screen
      name="UpdateLanguage"
      component={UpdateLanguage}
      options={{
        title: 'Language',
      }}
    />
    <HomeScreenStack.Screen
      name="VotingMainScreen"
      component={VotingMainScreen}
      options={{
        title: 'Vote',
      }}
    />
  </HomeScreenStack.Navigator>
);

/**Bottom tab Stack to hold all authorized stacks */
const BottomTab = () => (
  <BottomTabStack.Navigator
    initialRouteName="HomeScreenStackHolder"
    screenOptions={({route}) => ({
      tabBarIcon: () => {
        let iconName: string;
        if (route.name === 'HomeScreenStackHolder') {
          iconName = 'home';
        } else if (route.name === 'SwapScreenHold') {
          iconName = 'swap';
        } else if (route.name === 'EductionalScreen') {
          iconName = 'graduation-cap';
        }
        return <Entypo name={iconName} size={22} color={'#fff'} />;
      },
      title: route.name,
      headerShown: false,
      tabBarStyle: {
        backgroundColor: 'rgba(255,255,255,0.18)',
        position: 'absolute',
        borderWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: Platform.OS === 'ios' ? 0 : 1,
        borderColor: '#ffffff',
        borderRadius: 5,
        marginBottom: Platform.OS === 'ios' ? 0 : 5,
        marginHorizontal: Platform.OS === 'ios' ? 0 : 5,
        borderLeftWidth: Platform.OS === 'ios' ? 0 : 1,
        borderRightWidth: Platform.OS === 'ios' ? 0 : 1,
        height: Platform.OS === 'ios' ? 80 : 60,
        display: getTabBarVisibility(route),
      },
      tabBarActiveTintColor: '#fff',
      tabBarHideOnKeyboard: true,
    })}>
    <BottomTabStack.Screen
      name="HomeScreenStackHolder"
      component={HomeScreenStackHolder}
      options={{title: 'Home'}}
    />

    <BottomTabStack.Screen
      name="SwapScreenHold"
      component={SwapScreenHold}
      options={{title: 'Swap'}}
      initialParams={{selectedToken: null, selectedFromRoute: ''}}
    />
  </BottomTabStack.Navigator>
);

const getTabBarVisibility = route => {
  if (route?.params?.screen === 'EductionalMainScreen') {
    return 'flex';
  } else if (route?.name === 'HomeScreenStackHolder') {
    return 'none';
  }
  return 'flex';
};

function AppNavigator() {
  const [offlineStatus, setOfflineStatus] = useState<boolean>(false);
  const {
    token,
    setToken,
    setWeb3Context,
    isWalletPasswordEntered,
    rnEW,
    setRnEW,
  } = useContext(LoginContext);

  useEffect(() => {
    SplashScreen.hide();
    const web3: any = new Web3(web3ProviderURL);
    setWeb3Context(web3);
    const unsubscribe = NetInfo.addEventListener(state => {
      setOfflineStatus(state.isConnected && state.isInternetReachable);
    });
    try {
      AsyncStorage.getItem('token').then(data => {
        setToken(data);
      });
      EncryptedStorage.getItem(rnEncryptedStorageKey).then(result => {
        setRnEW(result);
      });
    } catch (error) {}
    return () => unsubscribe();
  }, [setRnEW, setToken, setWeb3Context]);

  return (
    /**main stack that holds all other stack */
    <NavigationContainer>
      {offlineStatus ? (
        token ? (
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
            }}>
            {rnEW && !isWalletPasswordEntered ? (
              <Stack.Screen
                name="WalletAccessByPassword"
                component={WalletAccessByPassword}
                options={{
                  headerShown: true,
                  headerTransparent: true,
                  headerLeft: () => headerWithLeftLogo(),
                  title: '',
                  headerStyle: {backgroundColor: 'rgba(6, 33, 66, 0.25)'},
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerTitleAlign: 'center',
                }}
              />
            ) : rnEW && isWalletPasswordEntered ? (
              <Stack.Screen
                name="BottomTab"
                component={BottomTab}
                options={{
                  animation:
                    Platform.OS === 'ios' ? 'default' : 'slide_from_right',
                }}
              />
            ) : (
              <>
                <Stack.Screen
                  name="CreateImportWalletScreen"
                  component={CreateImportWalletScreen}
                  options={{title: ''}}
                />
              </>
            )}
            <Stack.Screen
              name={Routes.portfolioHome}
              component={PortfolioHome}
            />
            <Stack.Screen
              name={Routes.portfolioTokenDetail}
              component={PortfolioTokenDetail}
            />
            <Stack.Screen
              name={Routes.notificationHome}
              component={NotificationHome}
            />
            <Stack.Screen
              name={Routes.notificationDetail}
              component={NotificationDetail}
            />
            <Stack.Screen
              name={Routes.notificationSettings}
              component={NotificationSettings}
            />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen
              name="WelcomeStackScreen"
              component={WelcomeStackScreen}
            />
            <Stack.Screen
              name="LoginRegisterScreen"
              component={LoginRegisterScreen}
            />
          </Stack.Navigator>
        )
      ) : (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen
            name="OfflineScreen"
            component={OfflineScreen}
            options={{
              animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default AppNavigator;
