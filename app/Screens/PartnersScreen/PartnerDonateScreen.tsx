import React, {useState, useEffect, useContext} from 'react';
import {LoginContext} from '../../Constants/AllContext';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import {useMutation, useQuery} from '@apollo/client';
import {
  ADD_DONATION,
  UPDATE_DONATION_STATUS,
} from 'app/GraphqlOperations/mutation/mutation';
import {GET_SETTINGS} from 'app/GraphqlOperations/query/query';
import GradientBackGround from '../../Components/GradientBackGround';
import {GLOBAL_VARIABLES} from '../../config';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import {colors} from '../../Styles/theme';
import DropDown from '../../Components/DropDown';
import MyWallet from '../../Utils/myWallet';
import {
  convertToEther,
  convertToWei,
  refactorString,
} from '../../Utils/conversions';
import {erc20_abi} from '../../Utils/ABI';
import Loader from '../../Components/Loader';
import Model from '../../Components/Model';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import {termData} from 'app/Utils/termModelContain';
import {TokenValueRegix} from 'app/Utils/regexPattern';

const deviceWidth = Dimensions.get('screen').width;
const dummyCover = require('../../Assets/Png/partners.png');
const EMPTY_AMOUNT = '';
const ZERO_AMOUNT = '0';
const checkMark = require('../../Assets/Png/check.png');
const errorPng = require('../../Assets/Png/error.png');

const PartnerDonateScreen = ({navigation, route}) => {
  const {web3Context} = useContext(LoginContext);
  const web3 = web3Context;
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [tokenSelected, setTokenSelected] = useState<{}>({});
  const [partnersDetails, setPartnersDetails] = useState<{}>({});
  const [loggedInUser] = useState<string>(MyWallet.getWallet().address);
  const [privateKey] = useState<string>(MyWallet.getWallet().privateKey);
  const [amountSend, setAmountSend] = useState<string>(EMPTY_AMOUNT);
  const [contractInstance, setContractInstance] = useState<string>(null);
  const [userBalance, setUserBalance] = useState<string>(ZERO_AMOUNT);
  const [usdRate, setUsdRate] = useState<string>(EMPTY_AMOUNT);
  const [transactionFees, setTransactionFees] = useState<any>();
  const [donationAmount, setDonationAmount] = useState<string>(ZERO_AMOUNT);
  const [donateLoading, setDonateLoading] = useState<boolean>(false);
  const [donationStatus, setDonationStatus] = useState<boolean>(null);
  const [modelMessage, setModelMessage] = useState<string>('');
  const [addDonation, {loading, error, data}] = useMutation(ADD_DONATION);
  const [
    updateDonationStatus,
    {loading: updateLoading, error: updateError, data: updateData},
  ] = useMutation(UPDATE_DONATION_STATUS);
  const {
    data: settingData,
    refetch,
    loading: settingLoading,
    error: settingError,
  } = useQuery(GET_SETTINGS);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

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

  const setModalMessageAndStatus = (message, status) => {
    setDonationStatus(status);
    setModelMessage(message);
  };

  const calculatePercentageValues = async () => {
    try {
      const amountInWei = convertToWei(
        amountSend.toString(),
        tokenSelected.decimals,
      );

      const percentAmountForTreasury =
        (parseFloat(amountInWei.toString()) *
          settingData.getSettings.partnerDonationFee) /
        100;
      const percentAmountForDonation =
        parseFloat(amountInWei.toString()) - percentAmountForTreasury;
      const donationResult = await addDonationMethod();
      if (donationResult.data.addDonation.success) {
        if (tokenSelected.contractAddress === '0xeth') {
          let resultOfDonations = await sendNativeToken(
            percentAmountForDonation,
            settingData.getSettings.donationWalletAddress,
          );
          if (resultOfDonations.status) {
            let resultOfTreasury = await sendNativeToken(
              percentAmountForTreasury,
              settingData.getSettings.treasuryWalletAddress,
            );
            await updateDonationStatusMethod(
              donationResult.data.addDonation.donation.id,
              resultOfTreasury.transactionHash,
            );
            setModalMessageAndStatus(
              resultOfTreasury.message,
              resultOfTreasury.status,
            );
          } else {
            setModalMessageAndStatus(
              resultOfDonations.message,
              resultOfDonations.status,
            );
          }
        } else {
          let resultOfDonations = await sendERC20Token(
            percentAmountForDonation,
            settingData.getSettings.donationWalletAddress,
          );
          if (resultOfDonations.status) {
            let resultOfTreasury = await sendERC20Token(
              percentAmountForTreasury,
              settingData.getSettings.treasuryWalletAddress,
            );
            await updateDonationStatusMethod(
              donationResult.data.addDonation.donation.id,
              resultOfTreasury.transactionHash,
            );
            setModalMessageAndStatus(
              resultOfTreasury.message,
              resultOfTreasury.status,
            );
          } else {
            setModalMessageAndStatus(
              resultOfDonations.message,
              resultOfDonations.status,
            );
          }
        }
      } else {
        setModalMessageAndStatus('Internal server error', false);
      }
    } catch {
      setModalMessageAndStatus('Internal server error', false);
    }
  };

  const sendNativeToken = async (percentAmount, receiverAddress) => {
    try {
      const gasLimit = await web3.eth.estimateGas({
        to: receiverAddress,
        from: loggedInUser,
        value: percentAmount.toString(),
      });
      const gasPrice = await web3.eth.getGasPrice();
      const transactionFee =
        parseFloat(gasPrice) * parseFloat(gasLimit.toString());
      const overallEth = transactionFee + parseFloat(percentAmount.toString());
      const balanceInWei = await web3.eth.getBalance(loggedInUser);
      let result = overallEth <= parseFloat(balanceInWei) ? true : false;
      if (result) {
        const tx = {
          gas: web3.utils.toHex(gasLimit.toString()),
          to: receiverAddress,
          value: percentAmount.toString(),
          from: loggedInUser,
        };
        const signedTx = await web3.eth.accounts.signTransaction(
          tx,
          privateKey,
        );
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return {
          status: true,
          message: 'Transaction successful',
          transactionHash: signedTx.transactionHash,
        };
      } else {
        return {status: false, message: 'Not enough matic for transaction'};
      }
    } catch (error) {
      return {status: false, message: 'Sending transaction failed'};
    }
  };

  const sendERC20Token = async (percentAmount, receiverAddress) => {
    try {
      const gasLimit = await contractInstance.methods
        .transfer(receiverAddress, percentAmount.toString())
        .estimateGas({from: loggedInUser});

      const bufferedGasLimit = Math.round(
        Number(gasLimit) + Number(gasLimit) * Number(0.2),
      );

      const encodedData = contractInstance.methods
        .transfer(receiverAddress, percentAmount.toString())
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
        return {
          status: true,
          message: 'Transaction successful',
          transactionHash: signedTx.transactionHash,
        };
      } else {
        return {status: false, message: 'Not enough matic for transaction'};
      }
    } catch (error) {
      return {status: false, message: 'Send transaction failed'};
    }
  };

  const fetchUsdRate = () => {
    setUsdRate('0.5');
  };

  const handelButtonStatus = () => {
    if (
      tokenSelected &&
      !!parseFloat(amountSend) &&
      parseFloat(amountSend) <= parseFloat(userBalance)
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handlleButtonMessage = () => {
    let enterAmountCondition = !!parseFloat(amountSend);
    if (tokenSelected.symbol == null) {
      return 'Select Token';
    } else if (!enterAmountCondition) {
      return 'Enter an amount';
    } else if (!(parseFloat(amountSend) <= parseFloat(userBalance))) {
      return 'Insufficient balance';
    }
    return 'Next';
  };

  useEffect(() => {
    const {selectedToken, partnersInfo} = route.params;
    const onUpdateofDropDown = async () => {
      try {
        if (selectedToken) {
          setTokenSelected(selectedToken);
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
        if (partnersInfo) {
          setPartnersDetails(partnersInfo);
        }
      } catch (error) {
        throw new Error(error);
      }
    };
    onUpdateofDropDown();
  }, [route.params]);

  const calculateDonationAmount = fees => {
    setDonationAmount(
      ((parseFloat(amountSend) * parseFloat(fees)) / 100).toString(),
    );
  };

  const handleDonate = async () => {
    try {
      setDonateLoading(true);
      await calculatePercentageValues();
    } catch (errorData) {
      throw new Error(errorData);
    } finally {
      setDonateLoading(false);
    }
  };

  const addDonationMethod = async () => {
    try {
      return await addDonation({
        variables: {
          token: tokenSelected.name,
          partnerId: partnersDetails.id,
          transactionFee: parseFloat(transactionFees),
          amount: parseFloat(amountSend),
          fromAddress: loggedInUser,
          toAddress: settingData.getSettings.donationWalletAddress,
        },
      });
    } catch {
      setModelMessage('Adding Donation Failed');
    }
  };

  const updateDonationStatusMethod = async (id, transactionHash) => {
    try {
      return await updateDonationStatus({
        variables: {
          id: id,
          status: 'CONFIRMED',
          transactionHash: transactionHash,
        },
      });
    } catch {
      setModelMessage('Adding Donation Failed');
    }
  };

  const feesAndRateRender = () => {
    if (!showDetails) {
      return (
        <View>
          <Button
            lable={handlleButtonMessage()}
            labelStyle={styles.labelStyle}
            buttonWidth={210}
            buttonHeight={52}
            onPress={async () => {
              setButtonLoading(true);
              setTransactionFees(settingData.getSettings.partnerDonationFee);
              fetchUsdRate();
              calculateDonationAmount(
                settingData.getSettings.partnerDonationFee,
              );
              setShowDetails(true);
              setButtonLoading(false);
            }}
            buttonStyle={{marginVertical: 30, alignSelf: 'center'}}
            disabled={handelButtonStatus()}
            showActivityIndicator={buttonLoading}
          />
        </View>
      );
    } else {
      return (
        <View style={{marginTop: -10, zIndex: -1}}>
          <View style={styles.feesHolder}>
            <View style={styles.fieldTextHolder}>
              <View style={styles.showDetailsText}>
                <Text style={styles.rateTextStyle}>USD Rate </Text>
                <Text style={styles.rateTextStyle}>:</Text>
              </View>
              <Text style={styles.rateTextStyle}>{usdRate}</Text>
            </View>
            <View style={styles.fieldTextHolder}>
              <View style={styles.showDetailsText}>
                <Text style={styles.rateTextStyle}>Transaction Fees</Text>
                <Text style={styles.rateTextStyle}>:</Text>
              </View>
              <Text style={styles.rateTextStyle}>{transactionFees}%</Text>
            </View>
            <View style={styles.fieldTextHolder}>
              <View style={styles.showDetailsText}>
                <Text style={styles.rateTextStyle}>Total Donation</Text>
                <Text style={styles.rateTextStyle}>:</Text>
              </View>
              <Text style={styles.rateTextStyle}>
                ~{parseFloat(donationAmount).toFixed(12)}
              </Text>
            </View>
          </View>
          <Button
            lable="Donate"
            labelStyle={styles.labelStyle}
            buttonWidth={210}
            buttonHeight={52}
            buttonStyle={{marginVertical: 30, alignSelf: 'center'}}
            showActivityIndicator={false}
            onPress={() => {
              handleDonate();
            }}
          />
        </View>
      );
    }
  };

  const handelMessageModel = () => {
    if (donationStatus) {
      return (
        <Model
          source={checkMark}
          header="Payment Transfer successfully"
          subHeader={modelMessage}
          HeaderStyle={{color: '#25bd4f'}}
          onClose={() => navigation.goBack()}
        />
      );
    }
    if (donationStatus === false) {
      return (
        <Model
          source={errorPng}
          header="An error occured"
          subHeader={modelMessage}
          HeaderStyle={{color: 'rgba(255, 15, 44, 0.75)'}}
          onClose={() => setDonationStatus(null)}
          messageOnButton="Try again"
        />
      );
    }
    if (donateLoading || loading) {
      return <Loader header="Please Wait" subHeader="In Progress" />;
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
      <StatusBar hidden={false} barStyle="light-content" />
      <SafeAreaView>
        <View style={styles.subHolder}>
          <ScrollView>
            <View style={styles.logoHolder}>
              <View>
                <Image source={dummyCover} style={styles.imageStyle} />
              </View>
              <View style={{paddingLeft: 14}}>
                <View>
                  <Text style={[styles.detailstextStyle, {fontSize: 16}]}>
                    {partnersDetails?.name}
                  </Text>
                </View>
                <View style={styles.detailsHolder}>
                  <Text style={styles.textHeaderStyle}>Reg.No: </Text>
                  <Text style={styles.detailstextStyle}>
                    {partnersDetails?.registrationNumber}
                  </Text>
                </View>
                <View style={styles.detailsHolder}>
                  <Text style={styles.textHeaderStyle}>Phone number: </Text>
                  <Text style={styles.detailstextStyle}>
                    {partnersDetails?.phone}
                  </Text>
                </View>
                <View style={styles.detailsHolder}>
                  <Text style={styles.textHeaderStyle}>Email address: </Text>
                  <Text style={styles.detailstextStyle}>
                    {partnersDetails?.email}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.fieldHolder}>
              <View
                style={{
                  marginVertical: 15,
                }}>
                <View style={styles.subFieldHolder}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <DropDown
                      value={tokenSelected}
                      onTouchField={() => {
                        setShowDetails(false);
                        navigation.navigate('SwapScreenHold', {
                          screen: 'TokenSearchScreen',
                          params: {
                            fromScreen: 'PartnerDonateScreen',
                            tokenInValueFromRoute: 'NULL',
                          },
                        });
                      }}
                    />
                    <Text style={styles.balanceText}>
                      Balance: {refactorString(userBalance)}
                    </Text>
                  </View>
                  <View style={styles.inputFieldHolder}>
                    <Input
                      value={amountSend}
                      style={styles.textFieldStyle}
                      textStyle={styles.textInputStyle}
                      Allstyle={{width: '80%'}}
                      placeholder="Enter Value"
                      keyboardType="decimal-pad"
                      onChangeText={text => {
                        if (text.match(TokenValueRegix)) {
                          setShowDetails(false);
                          setAmountSend(text);
                        }
                      }}
                    />

                    <TouchableOpacity
                      style={styles.maxButton}
                      onPress={() => {
                        setAmountSend(userBalance);
                      }}>
                      <Text style={styles.percentageText}>Max</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {feesAndRateRender()}
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      {handelMessageModel()}
      {showTermsModelMethod()}
    </GradientBackGround>
  );
};

export default PartnerDonateScreen;

const styles = StyleSheet.create({
  subHolder: {
    width: deviceWidth - 28,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginTop: Platform.OS == 'ios' ? 0 : 70,
  },
  fieldHolder: {
    borderColor: colors.fieldHolderBorder,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    width: deviceWidth - 28,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 16,
    backgroundColor: colors.fieldHolderBg,
  },
  labelStyle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  subFieldHolder: {
    backgroundColor: '#426EA1',
    borderRadius: 8,
    width: deviceWidth - 56,
    padding: 16,
    height: 130,
    justifyContent: 'space-between',
  },
  percentageText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 11,
  },
  textFieldStyle: {
    color: '#fff',
    backgroundColor: '#04223C33',
    paddingLeft: 5,
  },
  textInputStyle: {
    padding: Platform.OS == 'ios' ? 7 : 4,
    fontWeight: '500',
  },
  maxButton: {
    borderColor: 'rgba(218, 218, 218, 0.1)',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 1,
    shadowColor: 'rgba(48, 42, 42, 0.25)',
  },
  balanceText: {
    color: '#fff',
    fontWeight: '500',
  },
  rateTextStyle: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  feesHolder: {
    backgroundColor: 'rgba(4, 23, 48, 0.85)',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    width: '100%',
    zIndex: -1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  inputFieldHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldTextHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 295,
  },
  showDetailsText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 130,
    paddingVertical: 2,
  },
  imageStyle: {
    height: 40,
    width: 40,
  },
  logoHolder: {
    flexDirection: 'row',
    paddingVertical: 19,
  },
  textHeaderStyle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  detailstextStyle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  detailsHolder: {
    flexDirection: 'row',
    paddingVertical: 3,
  },
});
