import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {LoginContext} from '../../Constants/AllContext';
import GradientBackGround from '../../Components/GradientBackGround';
import Clipboard from '@react-native-community/clipboard';
import {colors} from '../../Styles/theme';
import normalize from '../../Utils/normalize';
import DropDown from '../../Components/DropDown';
import Button from '../../Components/Button';
import Model from '../../Components/Model';
import Loader from 'app/Components/Loader';
import Input from '../../Components/Input';
import {erc20_abi} from 'app/Utils/ABI';
import {
  convertToEther,
  convertToWei,
  refactorString,
} from 'app/Utils/conversions';
import MyWallet from 'app/Utils/myWallet';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import {termData} from 'app/Utils/termModelContain';
import { TokenValueRegix } from 'app/Utils/regexPattern';
import useTokenBalance from 'app/Hooks/useTokenBalance';

const deviceWidth = Dimensions.get('screen').width;
const ZERO_AMOUNT = '0';
const EMPTY_AMOUNT = '';
const operatingSytem = Platform.OS;

const SendRecipientAdd = ({navigation, route}) => {
  const {web3Context} = useContext(LoginContext);
  const web3 = web3Context;
  const [dollarValue, setDollarValue] = useState<string>('0.00');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [tokenSelected, setTokenSelected] = useState({});
  const [loggedInUser] = useState<string>(MyWallet.getWallet().address);
  const [privateKey] = useState<string>(MyWallet.getWallet().privateKey);
  const [userBalance, setUserBalance] = useState<string>(ZERO_AMOUNT);
  const [contractInstance, setContractInstance] = useState<string>(null);
  const [amountSend, setAmountSend] = useState<string>(EMPTY_AMOUNT);
  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const [sendStatus, setSendStatus] = useState<boolean>(null);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);
  const [tokenUsdPrice, setTokenUsdPrice] = useState<string>('0');
  const [manualPermissionRequire, setManualPermissionRequire] =
    useState<boolean>(false);
  const {userTokenList} = useTokenBalance();

  const getDollarPrice = token => {
    for (let index = 0; index < userTokenList.length; index++) {
      if (userTokenList[index].contractAddress === token.contractAddress) {
        setTokenUsdPrice(userTokenList[index].priceInUSD.toString());
        break;
      }
    }
  };

  const showModelMethod = () => {
    if (sendStatus === true) {
      return (
        <Model
          source={require('../../Assets/Png/check.png')}
          header="Token Sent successfully"
          subHeader="Successful"
          HeaderStyle={styles.successModelStyle}
          onClose={async () => {
            setSendStatus(null);
            navigation.goBack();
          }}
        />
      );
    } else if (sendStatus === false) {
      return (
        <Model
          source={require('../../Assets/Png/error.png')}
          header="Transaction Status"
          subHeader="Transaction Failed"
          HeaderStyle={styles.failModelStyle}
          onClose={() => setSendStatus(null)}
        />
      );
    } else if (manualPermissionRequire) {
      <Model
        source={require('../../Assets/Png/error.png')}
        header="Go to Setting"
        subHeader="Open setting and grand GIE permission to open camera"
        HeaderStyle={styles.failModelStyle}
        onClose={() => setManualPermissionRequire(false)}
      />;
    }
    if (sendLoading) {
      return (
        <Loader header="Please Wait" subHeader="Transaction in Progress" />
      );
    }
    return null;
  };

  const getUserBalance = async (userAddress, tokenContract, decimals) => {
    try {
      if (tokenContract) {
        const balanceInWei = await tokenContract.methods
          .balanceOf(userAddress)
          .call();
        return convertToEther(balanceInWei, decimals);
      } else {
        const balanceInWei = await web3.eth.getBalance(userAddress);
        return convertToEther(balanceInWei, decimals);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const contractConnection = async (abi, contractAddress) => {
    try {
      return await new web3.eth.Contract(abi, contractAddress);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    const {selectedToken, recipientAddressFromScan} = route.params;
    const onUpdateofDropDown = async () => {
      if (recipientAddressFromScan) {
        setRecipientAddress(recipientAddressFromScan);
      }
      try {
        if (selectedToken) {
          setDollarValue('0');
          setAmountSend('');
          setTokenSelected(selectedToken);
          if (!!selectedToken?.priceInUSD) {
            setTokenUsdPrice(selectedToken.priceInUSD.toString());
          } else {
            getDollarPrice(selectedToken);
          }
          const contract =
            selectedToken.contractAddress === '0xeth'
              ? null
              : await contractConnection(
                  erc20_abi,
                  selectedToken.contractAddress,
                );
          setUserBalance(
            await getUserBalance(
              loggedInUser,
              contract,
              selectedToken.decimals,
            ),
          );
          setContractInstance(contract);
        }
      } catch (error) {
        throw new Error(error);
      }
    };
    onUpdateofDropDown();
  }, [route.params]);

  const calculateDollarValue = inputValue => {
    if (inputValue) {
      setDollarValue(
        refactorString(
          (parseFloat(inputValue) * parseFloat(tokenUsdPrice)).toString(),
        ),
      );
    } else {
      setDollarValue('0.00');
    }
  };

  const checkAddress = () => {
    return web3.utils.isAddress(recipientAddress);
  };

  const handelButtonStatus = () => {
    if (
      tokenSelected &&
      !!parseFloat(amountSend) &&
      parseFloat(amountSend) <= parseFloat(userBalance) &&
      checkAddress()
    ) {
      return false;
    }
    return true;
  };

  const handlleButtonMessage = () => {
    let enterAmountCondition = !!parseFloat(amountSend);
    if (tokenSelected.symbol == null) {
      return 'Select Token';
    } else if (!checkAddress()) {
      return 'Enter valid address';
    } else if (!enterAmountCondition) {
      return 'Enter an amount';
    } else if (!(parseFloat(amountSend) <= parseFloat(userBalance))) {
      return 'Insufficient balance';
    }
    return 'Send Token';
  };

  const sendNativeToken = async () => {
    try {
      const amountInWei = convertToWei(
        amountSend.toString(),
        tokenSelected.decimals,
      );

      const gasLimit = await web3.eth.estimateGas({
        to: recipientAddress,
        from: loggedInUser,
        value: amountInWei,
      });

      const gasPrice = await web3.eth.getGasPrice();
      const transactionFee =
        parseFloat(gasPrice) * parseFloat(gasLimit.toString());

      const overallEth = transactionFee + parseFloat(amountInWei.toString());
      const balanceInWei = await web3.eth.getBalance(loggedInUser);

      let result = overallEth <= parseFloat(balanceInWei) ? true : false;
      if (result) {
        const tx = {
          gas: web3.utils.toHex(gasLimit.toString()),
          to: recipientAddress,
          value: amountInWei.toString(),
          from: loggedInUser,
        };

        const signedTx = await web3.eth.accounts.signTransaction(
          tx,
          privateKey,
        );
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return {status: true, message: 'Transaction successful'};
      } else {
        return {status: false, message: 'Not enough matic for transaction'};
      }
    } catch (error) {
      return {status: false, message: 'Sending Matic transaction failed'};
    }
  };

  const sendERC20Token = async () => {
    try {
      const amountInWei = convertToWei(
        amountSend.toString(),
        tokenSelected.decimals,
      );

      const gasLimit = await contractInstance.methods
        .transfer(recipientAddress, amountInWei)
        .estimateGas({from: loggedInUser});

      const bufferedGasLimit = Math.round(
        Number(gasLimit) + Number(gasLimit) * Number(0.2),
      );

      const encodedData = contractInstance.methods
        .transfer(recipientAddress, amountInWei)
        .encodeABI();

      const gasPrice = await web3.eth.getGasPrice();
      const transactionFee =
        parseFloat(gasPrice) * parseFloat(bufferedGasLimit.toString());

      const balanceInWei = await web3.eth.getBalance(loggedInUser);

      let result = transactionFee <= parseFloat(balanceInWei) ? true : false;
      if (result) {
        const tx = {
          gas: web3.utils.toHex(bufferedGasLimit),
          to: tokenSelected.contractAddress,
          value: '0x00',
          data: encodedData,
          from: loggedInUser,
        };

        const signedTx = await web3.eth.accounts.signTransaction(
          tx,
          privateKey,
        );
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return {status: true, message: 'Transaction successful'};
      } else {
        return {status: false, message: 'Not enough matic for transaction'};
      }
    } catch (error) {
      return {status: false, message: 'Send transaction failed'};
    }
  };

  const handleSendToken = async () => {
    try {
      setSendLoading(true);
      if (tokenSelected.contractAddress === '0xeth') {
        let nativeToken = await sendNativeToken();
        setSendStatus(nativeToken.status);
      } else {
        let erc20Token = await sendERC20Token();
        setSendStatus(erc20Token.status);
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      setSendLoading(false);
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

  const requestCameraPermission = async () => {
    request(
      operatingSytem === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    ).then(result => {
      if (result === 'granted' || result === 'limited') {
        navigation.navigate('CameraScreen', {
          selectedToken: tokenSelected,
        });
      } else {
        setManualPermissionRequire(true);
      }
    });
  };

  const checkCameraPermission = async () => {
    check(
      operatingSytem === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    )
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            break;
          case RESULTS.DENIED:
            requestCameraPermission();
            break;
          case RESULTS.LIMITED:
            break;
          case RESULTS.GRANTED:
            navigation.navigate('CameraScreen', {
              selectedToken: tokenSelected,
            });
            break;
          case RESULTS.BLOCKED:
            setManualPermissionRequire(true);
            break;
        }
      })
      .catch(() => {
        setManualPermissionRequire(true);
      });
  };

  return (
    <GradientBackGround>
      <SafeAreaView>
        <View style={styles.subHolder}>
          <ScrollView>
            <View style={styles.mainContainer}>
              <View style={styles.topDropDownHolder}>
                <View>
                  <Text style={styles.topDropDownHolderText}>Token</Text>
                  <DropDown
                    value={tokenSelected}
                    Style={styles.dropDownStyle}
                    imageStyle={styles.dropdownImageStyle}
                    onTouchField={() => {
                      navigation.navigate('SwapScreenHold', {
                        screen: 'TokenSearchScreen',
                        params: {
                          fromScreen: 'SendRecipientAdd',
                          tokenInValueFromRoute: 'NULL',
                        },
                      });
                    }}
                  />
                </View>
                <View style={styles.dropDownRightHolder}>
                  <Text style={styles.topDropDownHolderText}>
                    Token Balance
                  </Text>
                  <Text style={{textAlign: 'right', color: '#fff'}}>
                    {refactorString(userBalance)}
                  </Text>
                </View>
              </View>
              <View style={styles.addressHolder}>
                <View>
                  <View
                    style={[
                      styles.addressHolder1,
                      {marginBottom: normalize(10)},
                    ]}>
                    <Text style={styles.commonTextStyle}>
                      Recipient Address
                    </Text>
                    <View style={styles.iconHolder}>
                      <Button
                        lable="Paste"
                        onPress={async () => {
                          setRecipientAddress(await Clipboard.getString());
                        }}
                        buttonWidth={60}
                        buttonHeight={25}
                        labelStyle={{color: '#fff', fontSize: 14}}
                        buttonStyle={styles.pasteButtonStyle}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          checkCameraPermission();
                          // requestCameraPermission();
                        }}>
                        <Image
                          source={require('../../Assets/Png/scannerLogo.png')}
                          style={styles.keySideImageStyle}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Input
                    value={recipientAddress}
                    style={[styles.inputFiledStyle, {marginLeft: 0}]}
                    onChangeText={text => {
                      setRecipientAddress(text);
                    }}
                    placeholder="Enter Recipient Address"
                  />
                </View>
              </View>
              <View style={styles.addressHolder}>
                <View style={styles.addressHolder1}>
                  <View
                    style={[styles.addressHolder1, {width: normalize(270)}]}>
                    <Image
                      source={
                        tokenSelected.logo
                          ? {uri: tokenSelected.logo}
                          : require('../../Assets/Png/ethLogo.png')
                      }
                      style={{height: 18, width: 18}}
                      resizeMode="contain"
                    />
                    <Input
                      value={amountSend}
                      style={styles.inputFiledStyle}
                      onChangeText={text => {
                        if (text.match(TokenValueRegix)) {
                          setAmountSend(text);
                          calculateDollarValue(text);
                        }
                      }}
                      placeholder="Enter value"
                      keyboardType="decimal-pad"
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.maxButton}
                    onPress={() => {
                      calculateDollarValue(userBalance);
                      setAmountSend(userBalance);
                    }}>
                    <Text style={styles.commonTextStyle}>Max</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.bottomDollarHolder}>
                <Text style={[styles.dollatText]}>~ ${dollarValue}</Text>
              </View>
              <Button
                lable={handlleButtonMessage()}
                buttonWidth={210}
                buttonHeight={52}
                onPress={() => {
                  handleSendToken();
                }}
                labelStyle={styles.lableStyle}
                buttonStyle={styles.buttonStyle}
                showActivityIndicator={false}
                disabled={handelButtonStatus()}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      {showModelMethod()}
      {showTermsModelMethod()}
    </GradientBackGround>
  );
};

export default SendRecipientAdd;

const styles = StyleSheet.create({
  subHolder: {
    width: deviceWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    width: deviceWidth - 28,
    flex: 1,
    marginTop: Platform.OS == 'ios' ? normalize(20) : normalize(90),
  },
  topDropDownHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: normalize(45),
  },
  dropDownStyle: {
    paddingHorizontal: normalize(0),
    paddingRight: normalize(5),
    paddingVertical: normalize(3),
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderTopLeftRadius: normalize(20),
    borderBottomLeftRadius: normalize(20),
  },
  dropdownImageStyle: {
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  topDropDownHolderText: {
    color: 'rgba(255,255,255,0.5)',
    paddingLeft: normalize(8),
  },
  dropDownRightHolder: {
    justifyContent: 'space-between',
  },
  addressHolder: {
    borderWidth: 1,
    borderColor: colors.fieldHolderBorder,
    backgroundColor: colors.fieldHolderBg,
    borderRadius: 12,
    padding: normalize(18),
    marginTop: normalize(20),
  },
  addressHolder1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commonTextStyle: {
    color: '#fff',
  },
  keySideImageStyle: {
    width: normalize(25),
    height: normalize(25),
  },
  iconHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: normalize(120),
  },
  pasteButtonStyle: {
    marginHorizontal: 5,
    marginVertical: 0,
  },
  maxButton: {
    borderColor: 'rgba(218, 218, 218, 0.1)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: normalize(3),
    paddingHorizontal: normalize(12),
    borderRadius: 8,
    elevation: 1,
    shadowColor: 'rgba(48, 42, 42, 0.25)',
  },
  buttonStyle: {
    marginVertical: normalize(15, 'height'),
    alignSelf: 'center',
  },
  lableStyle: {
    color: '#fff',
    fontWeight: '700',
  },
  successModelStyle: {
    color: '#25BD4F',
    fontSize: 16,
  },
  failModelStyle: {
    color: 'rgba(255, 15, 44, 0.75)',
    fontSize: 16,
  },
  inputFiledStyle: {
    width: '100%',
    backgroundColor: null,
    borderWidth: null,
    marginLeft: normalize(4),
  },
  bottomDollarHolder: {
    marginTop: normalize(5),
    paddingVertical: normalize(10),
    alignItems: 'flex-end',
  },
  dollatText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
