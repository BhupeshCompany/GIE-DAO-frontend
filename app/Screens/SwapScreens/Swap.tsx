import React, {useState, useEffect, useContext} from 'react';
import {LoginContext} from '../../Constants/AllContext';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Text,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {BigNumber} from 'bignumber.js';
import {GET_TOKEN_LIST} from '../../GraphqlOperations/query/query';
import {useQuery} from '@apollo/client';
import {GLOBAL_VARIABLES} from '../../config';

import GradientBackGround from '../../Components/GradientBackGround';
import {colors} from '../../Styles/theme';
import Input from '../../Components/Input';
import DropDown from '../../Components/DropDown';
import Button from '../../Components/Button';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Model from '../../Components/Model';
import Loader from '../../Components/Loader';
import {TokenValueRegix} from '../../Utils/regexPattern';

import {erc20_abi} from '../../Utils/ABI';
import {swapContractDetails} from '../../ABIs/swapContract';
import {optimalRoutePath} from '../../Utils/multihopScript';
import MyWallet from '../../Utils/myWallet';
import {
  convertToEther,
  convertToWei,
  refactorString,
} from '../../Utils/conversions';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import {termData} from 'app/Utils/termModelContain';
import normalize from 'app/Utils/normalize';

const ACTION_IN = 'IN';
const ACTION_OUT = 'OUT';
const ZERO_AMOUNT = '0';
const EMPTY_AMOUNT = '';
const BUTTON_DISABLE = true;
const BUTTON_ENABLE = false;
const SWAP = 'Swap';
const INSUFFICIENT_BALANCE = 'Insufficient balance';
const TOKEN_PAIR_NOT_EXISTS = 'Token pair not exists';
const PRICE_IMPACT_HIGH = 'Price impact too high';
const ENTER_AN_AMOUNT = 'Enter an amount';
const CONFIRM = 'CONFIRM';
const ETH_ADDRESS = '0xeth';
const ETHER_ADDRESS = GLOBAL_VARIABLES.WETH;
const SLIPPAGE_DEDUCTED_PERCENT = '0.995';
const ETH_DECIMALS = '18';
const approvalAmount = '9999999999999999999999999999999999999999999999999';
const deviceWidth = Dimensions.get('screen').width;
const GIE_APP_FEES_CONTRACT = GLOBAL_VARIABLES.GIE_APP_FEES_CONTRACT;

const Swap = ({navigation, route}) => {
  const {web3Context} = useContext(LoginContext);
  const web3 = web3Context;

  const [inputPercentage, setInputPercentage] = useState(0);
  const [tokenIn, setTokenIn] = useState({symbol: ''});
  const [tokenOut, setTokenOut] = useState({symbol: ''});
  const [instanceOfSwapContract, setInstanceOfSwapContract] = useState({});
  const [instanceOfInputTokenContract, setInstanceOfInputTokenContract] =
    useState({});
  const [inputTokenBalance, setInputTokenBalance] = useState(ZERO_AMOUNT);
  const [inputAmountToSwap, setInputAmountToSwap] = useState(EMPTY_AMOUNT);
  const [outputAmountToSwap, setOutputAmountToSwap] = useState(EMPTY_AMOUNT);
  const [transactionFees, setTransactionFees] = useState(ZERO_AMOUNT);
  const [transactionFeesAmount, setTransactionFeesAmount] =
    useState(ZERO_AMOUNT);

  const [inputEquivalentOfOneOutput, setInputEquivalentOfOneOutput] =
    useState(ZERO_AMOUNT);
  const [swapAction, setSwapAction] = useState(ACTION_IN);
  const [tokenRoutesPath, setTokenRoutesPath] = useState(null);
  const [feeRoutesPath, setFeeRoutesPath] = useState(null);
  const [buttonStatus, setButtonStatus] = useState(BUTTON_DISABLE);
  const [buttonMessage, setButtonMessage] = useState(ENTER_AN_AMOUNT);
  const [isSuccess, setIsSuccess] = useState(null);
  const [nativeToken, setNativeToken] = useState(false);
  const [loader, setLoader] = useState(false);
  const [transactionLoadingMessage, setTransactionLoadingMessage] =
    useState(EMPTY_AMOUNT);
  const [modelsubheaderMessage, setModelsubheaderMessage] =
    useState(EMPTY_AMOUNT);
  const [transactionLoader, setTransactionLoader] = useState(false);
  const {data, refetch, loading} = useQuery(GET_TOKEN_LIST);
  const [loggedInUser] = useState<string>(MyWallet.getWallet().address);
  const [privateKey] = useState<string>(MyWallet.getWallet().privateKey);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>('');

  const contractConnection = (abi, contractAddress) => {
    try {
      return new web3.eth.Contract(abi, contractAddress);
    } catch (error) {
      throw new Error(error);
    }
  };

  const getUserBalance = async (contractInstance, decimals) => {
    try {
      let balanceInWei;
      if (contractInstance) {
        balanceInWei = await contractInstance.methods
          .balanceOf(loggedInUser)
          .call();
      } else {
        balanceInWei = await web3.eth.getBalance(loggedInUser);
      }
      return await convertToEther(balanceInWei, decimals);
    } catch (error) {
      throw new Error(error);
    }
  };

  const getTransactionFees = async instance => {
    try {
      let fees = await instance.methods.gieAppFees().call();
      let feesDecimals = await instance.methods.gieAppFeesDecimals().call();
      return (Number(fees) / Number(feesDecimals)).toString();
    } catch (error) {
      throw new Error(error);
    }
  };

  const calculateTransactionAmount = async (
    inputAmount,
    tokenPath,
    decimals,
  ) => {
    try {
      let fees;
      const amount = convertToWei(inputAmount, decimals);
      let result = await instanceOfSwapContract.methods
        .calculateFeesForTransaction(amount)
        .call();
      if (tokenPath.length === 0) {
        return convertToEther(result, decimals);
      } else {
        fees = await instanceOfSwapContract.methods
          .getAmountsOut(result, tokenPath)
          .call();
      }
      return convertToEther(fees[fees.length - 1], ETH_DECIMALS);
    } catch (error) {
      throw new Error(error);
    }
  };

  const calculateTransactionAmountForWraps = async inputAmount => {
    try {
      const amount = convertToWei(inputAmount, ETH_DECIMALS);
      let result = await instanceOfSwapContract.methods
        .calculateFeesForTransaction(amount)
        .call();
      return convertToEther(result, ETH_DECIMALS);
    } catch (error) {
      throw new Error(error);
    }
  };

  const initializeStates = () => {
    setInputAmountToSwap(EMPTY_AMOUNT);
    setOutputAmountToSwap(EMPTY_AMOUNT);
    setButtonMessage(ENTER_AN_AMOUNT);
    setButtonStatus(BUTTON_DISABLE);
    setInputEquivalentOfOneOutput(ZERO_AMOUNT);
    setTransactionFeesAmount(ZERO_AMOUNT);
  };

  const calculatePercentValue = percentage => {
    try {
      if (!!parseFloat(inputTokenBalance)) {
        const balanceInWei = convertToWei(inputTokenBalance, tokenIn.decimals);
        const result =
          (parseFloat(balanceInWei.toString()) *
            parseFloat(percentage.toString())) /
          parseFloat('100');
        return convertToEther(result, tokenIn.decimals);
      } else {
        return ZERO_AMOUNT;
      }
    } catch (error) {
      throw new Error('Error in calculating percent value');
    }
  };

  const checkTokenPairExists = async (
    inputToken,
    outputToken,
    inputAmount,
    indicator,
  ) => {
    try {
      if (inputToken === ETH_ADDRESS) {
        inputToken = ETHER_ADDRESS;
      } else if (outputToken === ETH_ADDRESS) {
        outputToken = ETHER_ADDRESS;
      }

      if (inputToken === ETHER_ADDRESS && outputToken === ETHER_ADDRESS) {
        return {
          path: [],
          amounts: [],
          pathPairs: undefined,
          symbols: [],
          priceImpact: 0,
          trade_status: 0,
        };
      } else {
        return await optimalRoutePath(
          inputToken,
          outputToken,
          inputAmount,
          indicator,
        );
      }
    } catch (error) {
      throw new Error('Error in multi hop path');
    }
  };

  const checkBothPairs = async (
    inputAmount,
    inputToken,
    outputToken,
    indicator,
  ) => {
    try {
      let feesPairResult;
      const tokenPairResult = await checkTokenPairExists(
        inputToken,
        outputToken,
        inputAmount,
        indicator,
      );
      if (outputToken === ETHER_ADDRESS || outputToken === ETH_ADDRESS) {
        feesPairResult = tokenPairResult;
      } else {
        feesPairResult = await checkTokenPairExists(
          inputToken,
          ETHER_ADDRESS,
          inputAmount,
          true,
        );
      }
      return {
        firstPair: tokenPairResult,
        secondPair: feesPairResult,
        status:
          tokenPairResult.trade_status === 0 &&
          feesPairResult.trade_status === 0
            ? 0
            : 1,
      };
    } catch (error) {
      throw new Error(error);
    }
  };

  const updateStatesForChangeInInputField = (output, message, status) => {
    if (output != null) {
      setOutputAmountToSwap(output);
    }
    setButtonMessage(message);
    setButtonStatus(status);
  };

  const calculateEquivalentAmount = async (
    amount,
    actionOfSwap,
    tokensPath,
  ) => {
    try {
      let result;
      if (actionOfSwap === ACTION_IN) {
        result = await instanceOfSwapContract.methods
          .getAmountsOut(amount, tokensPath)
          .call();
      } else {
        result = await instanceOfSwapContract.methods
          .getAmountsIn(amount, tokensPath)
          .call();
      }
      if (result[result.length - 1] === ZERO_AMOUNT) {
        return ZERO_AMOUNT;
      }
      let test = new BigNumber(result[0])
        .dividedBy(new BigNumber(result[result.length - 1]))
        .toFixed()
        .toString();
      return test;
    } catch (error) {
      throw new Error(error);
    }
  };

  const updateStatesForChangeInOutputField = (input, message, status) => {
    if (input != null) {
      setInputAmountToSwap(input);
    }
    setButtonMessage(message);
    setButtonStatus(status);
  };

  const createDeadline = () => {
    return Math.floor(new Date().getTime() / 1000.0) + 1800;
  };

  const checkAllowance = async tokenContractInstance => {
    try {
      let inputInWei = convertToWei(inputAmountToSwap, tokenIn.decimals);
      let allowance = await tokenContractInstance.methods
        .allowance(loggedInUser, swapContractDetails.contractAddress)
        .call();
      return parseFloat(allowance) >= parseFloat(inputInWei) ? true : false;
    } catch (error) {
      throw new Error(error);
    }
  };

  const approveToSwapContract = async () => {
    try {
      const amountHex = web3.utils.toHex(approvalAmount);

      const gasLimit = await instanceOfInputTokenContract.methods
        .approve(swapContractDetails.contractAddress, approvalAmount)
        .estimateGas({from: loggedInUser});

      const encodedData = instanceOfInputTokenContract.methods
        .approve(swapContractDetails.contractAddress, amountHex)
        .encodeABI();

      const gasPrice = await web3.eth.getGasPrice();
      const transactionFee = parseFloat(gasPrice) * parseFloat(gasLimit);
      const balanceInWei = await web3.eth.getBalance(loggedInUser);
      const result = transactionFee <= parseFloat(balanceInWei) ? true : false;

      if (result) {
        const tx = {
          gas: web3.utils.toHex(gasLimit),
          to: tokenIn.contractAddress,
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
          message: `${tokenIn.symbol} approved successfully`,
        };
      } else {
        return {status: false, message: 'Not enough ether for approval'};
      }
    } catch (error) {
      return {status: false, message: 'Approval Transaction failed'};
    }
  };

  const executeTransaction = async (
    bufferedGasLimit,
    totalEthInWei,
    encodedData,
  ) => {
    try {
      const gasPrice = await web3.eth.getGasPrice();
      const transactionFee =
        parseFloat(gasPrice) * parseFloat(bufferedGasLimit);
      const balanceInWei = await web3.eth.getBalance(loggedInUser);
      const overallEth = parseFloat(totalEthInWei) + transactionFee;
      if (overallEth <= parseFloat(balanceInWei)) {
        const tx = {
          gas: web3.utils.toHex(bufferedGasLimit),
          to: swapContractDetails.contractAddress,
          value: totalEthInWei.toString(),
          data: encodedData,
          from: loggedInUser,
        };

        const signedTx = await web3.eth.accounts.signTransaction(
          tx,
          privateKey,
        );
        setTransactionHash(signedTx.transactionHash);
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return {status: true, message: 'Swapped successfully'};
      } else {
        return {status: false, message: 'Not enough matic for swapping'};
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const executeTransactionForWrappers = async (
    bufferedGasLimit,
    totalEthInWei,
    encodedData,
  ) => {
    try {
      const gasPrice = await web3.eth.getGasPrice();
      const transactionFee =
        parseFloat(gasPrice) * parseFloat(bufferedGasLimit);
      const balanceInWei = await web3.eth.getBalance(loggedInUser);
      const overallEth = parseFloat(totalEthInWei) + transactionFee;
      if (overallEth <= parseFloat(balanceInWei)) {
        const tx = {
          gas: web3.utils.toHex(bufferedGasLimit.toString()),
          to: ETHER_ADDRESS,
          value: totalEthInWei.toString(),
          data: encodedData,
          from: loggedInUser,
        };

        const signedTx = await web3.eth.accounts.signTransaction(
          tx,
          privateKey,
        );
        setTransactionHash(signedTx.transactionHash);
        const check = await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction,
        );
        if (check && check.status) {
          const result = await sendGieAppFees(transactionFeesAmount);
          if (result && result.status) {
            return {status: true, message: 'Swapped successfully'};
          } else {
            return {status: false, message: 'Not enough matic for swapping'};
          }
        }
        return {status: false, message: 'Not enough matic for swapping'};
      } else {
        return {status: false, message: 'Not enough matic for swapping'};
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const sendGieAppFees = async feeAmount => {
    try {
      const amountInWei = convertToWei(feeAmount.toString(), ETH_DECIMALS);

      const gasLimit = await web3.eth.estimateGas({
        to: GIE_APP_FEES_CONTRACT,
        from: loggedInUser,
        value: amountInWei,
      });
      const bufferedGasLimit = calculateGasLimit(gasLimit);

      const gasPrice = await web3.eth.getGasPrice();
      const transactionFee =
        parseFloat(gasPrice.toString()) *
        parseFloat(bufferedGasLimit.toString());
      const balanceInWei = await web3.eth.getBalance(loggedInUser);

      let result =
        transactionFee <= parseFloat(balanceInWei.toString()) ? true : false;
      if (result) {
        const tx = {
          gas: web3.utils.toHex(gasLimit.toString()),
          to: GIE_APP_FEES_CONTRACT,
          value: amountInWei.toString(),
          from: loggedInUser,
        };

        const signedTx = await web3.eth.accounts.signTransaction(
          tx,
          privateKey,
        );
        const transaction = await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction,
        );
        return {status: true, message: 'Transaction successfull'};
      } else {
        return {status: false, message: 'Not enough matic for transaction'};
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const calculateGasLimit = gasLimit => {
    return Math.round(Number(gasLimit) + Number(gasLimit) * Number(0.2));
  };

  const swapExactTokensForETHMethod = async () => {
    try {
      const path = tokenRoutesPath.path;
      const deadline = createDeadline();
      const slipageAmount =
        parseFloat(outputAmountToSwap) * parseFloat(SLIPPAGE_DEDUCTED_PERCENT);

      const amountInWei = convertToWei(
        inputAmountToSwap.toString(),
        tokenIn.decimals,
      );
      const slippageInWei = convertToWei(
        slipageAmount.toFixed(6),
        tokenOut.decimals,
      );
      const totalEthInWei = convertToWei(
        transactionFeesAmount.toString(),
        ETH_DECIMALS,
      );

      const gasLimit = await instanceOfSwapContract.methods
        .swapExactTokensForETH(
          amountInWei,
          slippageInWei,
          path,
          loggedInUser,
          deadline,
        )
        .estimateGas({
          from: loggedInUser,
          value: totalEthInWei,
        });

      const bufferedGasLimit = calculateGasLimit(gasLimit);

      const encodedData = instanceOfSwapContract.methods
        .swapExactTokensForETH(
          amountInWei,
          slippageInWei,
          path,
          loggedInUser,
          deadline,
        )
        .encodeABI();

      return await executeTransaction(
        bufferedGasLimit,
        totalEthInWei,
        encodedData,
      );
    } catch (error) {
      return {status: false, message: 'Swap Transaction failed'};
    }
  };

  const swapTokensForExactETHMethod = async () => {
    try {
      const path = tokenRoutesPath.path;
      const deadline = createDeadline();

      const amountInWei = convertToWei(
        inputAmountToSwap.toString(),
        tokenIn.decimals,
      );
      const outputAmountInWei = convertToWei(
        outputAmountToSwap.toString(),
        tokenOut.decimals,
      );
      const totalEthInWei = convertToWei(
        transactionFeesAmount.toString(),
        ETH_DECIMALS,
      );

      const gasLimit = await instanceOfSwapContract.methods
        .swapTokensForExactETH(
          outputAmountInWei,
          amountInWei,
          path,
          loggedInUser,
          deadline,
        )
        .estimateGas({
          from: loggedInUser,
          value: totalEthInWei,
        });

      const bufferedGasLimit = calculateGasLimit(gasLimit);

      const encodedData = instanceOfSwapContract.methods
        .swapTokensForExactETH(
          outputAmountInWei,
          amountInWei,
          path,
          loggedInUser,
          deadline,
        )
        .encodeABI();

      return await executeTransaction(
        bufferedGasLimit,
        totalEthInWei,
        encodedData,
      );
    } catch (error) {
      return {status: false, message: 'Swap transaction failed'};
    }
  };

  const swapExactETHForTokensMethod = async () => {
    try {
      const path = tokenRoutesPath.path;
      const deadline = createDeadline();
      const slipageAmount =
        parseFloat(outputAmountToSwap) * parseFloat(SLIPPAGE_DEDUCTED_PERCENT);
      const totalEth =
        parseFloat(inputAmountToSwap) + parseFloat(transactionFeesAmount);

      const amountInWei = convertToWei(
        inputAmountToSwap.toString(),
        tokenIn.decimals,
      );
      const slippageInWei = convertToWei(
        slipageAmount.toFixed(6),
        tokenOut.decimals,
      );
      const totalEthInWei = convertToWei(
        totalEth.toFixed(18),
        tokenIn.decimals,
      );

      const gasLimit = await instanceOfSwapContract.methods
        .swapExactETHForTokens(
          amountInWei,
          slippageInWei,
          path,
          loggedInUser,
          deadline,
        )
        .estimateGas({from: loggedInUser, value: totalEthInWei});

      const bufferedGasLimit = calculateGasLimit(gasLimit);

      const encodedData = instanceOfSwapContract.methods
        .swapExactETHForTokens(
          amountInWei,
          slippageInWei,
          path,
          loggedInUser,
          deadline,
        )
        .encodeABI();

      return await executeTransaction(
        bufferedGasLimit,
        totalEthInWei,
        encodedData,
      );
    } catch (error) {
      return {status: false, message: 'Swap transaction failed'};
    }
  };

  const swapETHForExactTokensMethod = async () => {
    try {
      const path = tokenRoutesPath.path;
      const deadline = createDeadline();
      const totalEth =
        parseFloat(inputAmountToSwap) + parseFloat(transactionFeesAmount);

      const amountInWei = convertToWei(
        inputAmountToSwap.toString(),
        tokenIn.decimals,
      );
      const outputAmountInWei = convertToWei(
        outputAmountToSwap.toString(),
        tokenOut.decimals,
      );
      const totalEthInWei = convertToWei(totalEth.toFixed(18), ETH_DECIMALS);

      const gasLimit = await instanceOfSwapContract.methods
        .swapETHForExactTokens(
          amountInWei,
          outputAmountInWei,
          path,
          loggedInUser,
          deadline,
        )
        .estimateGas({from: loggedInUser, value: totalEthInWei});

      const bufferedGasLimit = calculateGasLimit(gasLimit);

      const encodedData = instanceOfSwapContract.methods
        .swapETHForExactTokens(
          amountInWei,
          outputAmountInWei,
          path,
          loggedInUser,
          deadline,
        )
        .encodeABI();

      return await executeTransaction(
        bufferedGasLimit,
        totalEthInWei,
        encodedData,
      );
    } catch (error) {
      return {status: false, message: 'Swap transaction failed'};
    }
  };

  const swapExactTokensForTokensMethod = async () => {
    try {
      const path = tokenRoutesPath.path;
      const feePath = feeRoutesPath.path;

      const deadline = createDeadline();
      const slipageAmount =
        parseFloat(outputAmountToSwap) * parseFloat(SLIPPAGE_DEDUCTED_PERCENT);

      const amountInWei = convertToWei(
        inputAmountToSwap.toString(),
        tokenIn.decimals,
      );
      const slippageInWei = convertToWei(
        slipageAmount.toFixed(6),
        tokenOut.decimals,
      );
      const totalEthInWei = convertToWei(
        transactionFeesAmount.toString(),
        ETH_DECIMALS,
      );

      const gasLimit = await instanceOfSwapContract.methods
        .swapExactTokensForTokens(
          amountInWei,
          slippageInWei,
          path,
          feePath,
          loggedInUser,
          deadline,
        )
        .estimateGas({
          from: loggedInUser,
          value: totalEthInWei,
        });

      const bufferedGasLimit = calculateGasLimit(gasLimit);

      const encodedData = instanceOfSwapContract.methods
        .swapExactTokensForTokens(
          amountInWei,
          slippageInWei,
          path,
          feePath,
          loggedInUser,
          deadline,
        )
        .encodeABI();

      return await executeTransaction(
        bufferedGasLimit,
        totalEthInWei,
        encodedData,
      );
    } catch (error) {
      return {status: false, message: 'Swap transaction failed'};
    }
  };

  const swapTokensForExactTokensMethod = async () => {
    try {
      const path = tokenRoutesPath.path;
      const feePath = feeRoutesPath.path;
      const deadline = createDeadline();

      const amountInWei = convertToWei(
        inputAmountToSwap.toString(),
        tokenIn.decimals,
      );
      const outputAmountInWei = convertToWei(
        outputAmountToSwap.toString(),
        tokenOut.decimals,
      );
      const totalEthInWei = convertToWei(
        transactionFeesAmount.toString(),
        ETH_DECIMALS,
      );

      const gasLimit = await instanceOfSwapContract.methods
        .swapTokensForExactTokens(
          outputAmountInWei,
          amountInWei,
          path,
          feePath,
          loggedInUser,
          deadline,
        )
        .estimateGas({
          from: loggedInUser,
          value: totalEthInWei,
        });

      const bufferedGasLimit = calculateGasLimit(gasLimit);

      const encodedData = instanceOfSwapContract.methods
        .swapTokensForExactTokens(
          outputAmountInWei,
          amountInWei,
          path,
          feePath,
          loggedInUser,
          deadline,
        )
        .encodeABI();

      return await executeTransaction(
        bufferedGasLimit,
        totalEthInWei,
        encodedData,
      );
    } catch (error) {
      return {status: false, message: 'Swap transaction failed'};
    }
  };

  const unwrapWmatic = async () => {
    try {
      const amountInWei = convertToWei(
        inputAmountToSwap.toString(),
        ETH_DECIMALS,
      );

      const wmaticContract = contractConnection(erc20_abi, ETHER_ADDRESS);

      const gasLimit = await wmaticContract.methods
        .withdraw(amountInWei)
        .estimateGas({
          from: loggedInUser,
        });

      const bufferedGasLimit = calculateGasLimit(gasLimit);

      const encodedData = wmaticContract.methods
        .withdraw(amountInWei)
        .encodeABI();
      return await executeTransactionForWrappers(
        bufferedGasLimit,
        '0',
        encodedData,
      );
    } catch (error) {
      return {status: false, message: 'Swap transaction failed'};
    }
  };

  const wrapMatic = async () => {
    try {
      const amountInWei = convertToWei(
        inputAmountToSwap.toString(),
        ETH_DECIMALS,
      );

      const wmaticContract = contractConnection(erc20_abi, ETHER_ADDRESS);

      const gasLimit = await wmaticContract.methods.deposit().estimateGas({
        from: loggedInUser,
        value: amountInWei,
      });

      const bufferedGasLimit = calculateGasLimit(gasLimit);

      const encodedData = wmaticContract.methods.deposit().encodeABI();

      return await executeTransactionForWrappers(
        bufferedGasLimit,
        amountInWei,
        encodedData,
      );
    } catch (error) {
      return {status: false, message: 'Swap transaction failed'};
    }
  };

  const isForMaticAndWmatic = () => {
    if (
      (tokenIn.contractAddress == ETHER_ADDRESS &&
        tokenOut.contractAddress == ETH_ADDRESS) ||
      (tokenIn.contractAddress == ETH_ADDRESS &&
        tokenOut.contractAddress == ETHER_ADDRESS)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const checkForMaticAndWmatic = async amount => {
    setInputEquivalentOfOneOutput('1');
    setInputAmountToSwap(amount);
    setOutputAmountToSwap(amount);
    if (parseFloat(amount) <= parseFloat(inputTokenBalance)) {
      setButtonMessage(SWAP);
      setButtonStatus(BUTTON_ENABLE);
    } else {
      setButtonMessage(INSUFFICIENT_BALANCE);
      setButtonStatus(BUTTON_DISABLE);
    }
    return 0;
  };

  const setSwappingCase = async () => {
    setTransactionLoadingMessage('Transaction in process');
    try {
      if (
        tokenIn.contractAddress === ETHER_ADDRESS &&
        tokenOut.contractAddress === ETH_ADDRESS
      ) {
        const swapResult = await unwrapWmatic();
        setModelsubheaderMessage(swapResult.message);
        if (swapResult.status) {
          setIsSuccess(true);
          setInputTokenBalance(
            await getUserBalance(
              instanceOfInputTokenContract,
              tokenIn.decimals,
            ),
          );
        } else {
          setIsSuccess(false);
        }
      } else if (
        tokenIn.contractAddress === ETH_ADDRESS &&
        tokenOut.contractAddress === ETHER_ADDRESS
      ) {
        const swapResult = await wrapMatic();
        setModelsubheaderMessage(swapResult.message);
        if (swapResult.status) {
          setIsSuccess(true);
          setInputTokenBalance(
            await getUserBalance(
              instanceOfInputTokenContract,
              tokenIn.decimals,
            ),
          );
        } else {
          setIsSuccess(false);
        }
      } else if (
        (tokenIn.contractAddress === ETH_ADDRESS ||
          tokenIn.contractAddress === ETHER_ADDRESS) &&
        nativeToken
      ) {
        if (swapAction === ACTION_IN) {
          const result = await swapExactETHForTokensMethod();
          setModelsubheaderMessage(result.message);
          if (result.status) {
            setIsSuccess(true);
          } else {
            setIsSuccess(false);
          }
        } else {
          const result = await swapETHForExactTokensMethod();
          setModelsubheaderMessage(result.message);
          if (result.status) {
            setIsSuccess(true);
          } else {
            setIsSuccess(false);
          }
        }
      } else if (
        (tokenOut.contractAddress === ETH_ADDRESS ||
          tokenOut.contractAddress === ETHER_ADDRESS) &&
        !nativeToken
      ) {
        let result = await checkAllowance(instanceOfInputTokenContract);
        if (swapAction === ACTION_IN) {
          if (result) {
            const swapResult = await swapExactTokensForETHMethod();
            setModelsubheaderMessage(swapResult.message);
            if (swapResult.status) {
              setIsSuccess(true);
            } else {
              setIsSuccess(false);
            }
          } else {
            const approveResult = await approveToSwapContract();
            setTransactionLoadingMessage(approveResult.message);
            if (approveResult.status) {
              const swapResult = await swapExactTokensForETHMethod();
              setModelsubheaderMessage(swapResult.message);
              if (swapResult.status) {
                setIsSuccess(true);
              } else {
                setIsSuccess(false);
              }
            } else {
              setModelsubheaderMessage(approveResult.message);
              setIsSuccess(false);
            }
          }
        } else {
          if (result) {
            const swapResult = await swapTokensForExactETHMethod();
            setModelsubheaderMessage(swapResult.message);
            if (swapResult.status) {
              setIsSuccess(true);
            } else {
              setIsSuccess(false);
            }
          } else {
            const approveResult = await approveToSwapContract();
            setTransactionLoadingMessage(approveResult.message);
            if (approveResult.status) {
              const swapResult = await swapTokensForExactETHMethod();
              setModelsubheaderMessage(swapResult.message);
              if (swapResult.status) {
                setIsSuccess(true);
              } else {
                setIsSuccess(false);
              }
            } else {
              setModelsubheaderMessage(approveResult.message);
              setIsSuccess(false);
            }
          }
        }
      } else {
        let result = await checkAllowance(instanceOfInputTokenContract);
        if (swapAction === ACTION_IN) {
          if (result) {
            const swapResult = await swapExactTokensForTokensMethod();
            setModelsubheaderMessage(swapResult.message);
            if (swapResult) {
              setIsSuccess(true);
            } else {
              setIsSuccess(false);
            }
          } else {
            const approveResult = await approveToSwapContract();
            setTransactionLoadingMessage(approveResult.message);
            if (approveResult) {
              const swapResult = await swapExactTokensForTokensMethod();
              setModelsubheaderMessage(swapResult.message);
              if (swapResult.status) {
                setIsSuccess(true);
              } else {
                setIsSuccess(false);
              }
            } else {
              setModelsubheaderMessage(approveResult.message);
              setIsSuccess(false);
            }
          }
        } else {
          if (result) {
            const swapResult = await swapTokensForExactTokensMethod();
            setModelsubheaderMessage(swapResult.message);
            if (swapResult.status) {
              setIsSuccess(true);
            } else {
              setIsSuccess(false);
            }
          } else {
            const approveResult = await approveToSwapContract();
            setTransactionLoadingMessage(approveResult.message);
            if (approveResult) {
              const swapResult = await swapTokensForExactTokensMethod();
              setModelsubheaderMessage(swapResult.message);
              if (swapResult.status) {
                setIsSuccess(true);
              } else {
                setIsSuccess(false);
              }
            } else {
              setModelsubheaderMessage(approveResult.message);
              setIsSuccess(false);
            }
          }
        }
      }
    } catch (error) {
      setIsSuccess(false);
      throw new Error(error);
    } finally {
      setInputTokenBalance(
        await getUserBalance(instanceOfInputTokenContract, tokenIn.decimals),
      );
    }
  };

  const onChangeOfInputFieldOfInputToken = async (inputAmount, percentage) => {
    setLoader(true);
    setSwapAction(ACTION_IN);
    try {
      setInputPercentage(percentage);
      if (percentage !== 0) {
        inputAmount = calculatePercentValue(percentage);
      }
      setInputAmountToSwap(inputAmount);
      let value = !!parseFloat(inputAmount);
      if (value) {
        if (isForMaticAndWmatic()) {
          return checkForMaticAndWmatic(inputAmount);
        }
        if (parseFloat(inputTokenBalance) >= parseFloat(inputAmount)) {
          const result = await checkBothPairs(
            inputAmount,
            tokenIn.contractAddress,
            tokenOut.contractAddress,
            true,
          );
          if (result.status === 0) {
            if (Math.abs(result.firstPair.priceImpact) <= 15) {
              setTokenRoutesPath(result.firstPair);
              setFeeRoutesPath(result.secondPair);
              if (
                result.firstPair.amounts[
                  result.firstPair.amounts.length - 1
                ] === ZERO_AMOUNT
              ) {
                updateStatesForChangeInInputField(
                  null,
                  PRICE_IMPACT_HIGH,
                  BUTTON_DISABLE,
                );
              } else {
                updateStatesForChangeInInputField(null, SWAP, BUTTON_ENABLE);
              }
            } else {
              updateStatesForChangeInInputField(
                null,
                PRICE_IMPACT_HIGH,
                BUTTON_DISABLE,
              );
            }
            setOutputAmountToSwap(
              convertToEther(
                result.firstPair.amounts[result.firstPair.amounts.length - 1],
                tokenOut.decimals,
              ),
            );
            setInputEquivalentOfOneOutput(
              await calculateEquivalentAmount(
                result.firstPair.amounts[0],
                ACTION_IN,
                result.firstPair.path,
              ),
            );
          } else {
            updateStatesForChangeInInputField(
              EMPTY_AMOUNT,
              result.status === 1 ? PRICE_IMPACT_HIGH : TOKEN_PAIR_NOT_EXISTS,
              BUTTON_DISABLE,
            );
          }
        } else {
          updateStatesForChangeInInputField(
            EMPTY_AMOUNT,
            INSUFFICIENT_BALANCE,
            BUTTON_DISABLE,
          );
        }
      } else {
        updateStatesForChangeInInputField(
          EMPTY_AMOUNT,
          ENTER_AN_AMOUNT,
          BUTTON_DISABLE,
        );
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      setLoader(false);
    }
  };

  const onChangeOfInputFieldOfOutputToken = async outputAmount => {
    setLoader(true);
    setSwapAction(ACTION_OUT);
    try {
      setInputPercentage(0);
      setOutputAmountToSwap(outputAmount);
      let value = !!parseFloat(outputAmount);
      if (value) {
        if (isForMaticAndWmatic()) {
          return checkForMaticAndWmatic(outputAmount);
        }
        const result = await checkBothPairs(
          outputAmount,
          tokenIn.contractAddress,
          tokenOut.contractAddress,
          false,
        );
        if (result.status === 0) {
          if (Math.abs(result.firstPair.priceImpact) <= 15) {
            if (
              parseFloat(inputTokenBalance) >=
              parseFloat(
                convertToEther(result.firstPair.amounts[0], tokenIn.decimals),
              )
            ) {
              setTokenRoutesPath(result.firstPair);
              setFeeRoutesPath(result.secondPair);
              updateStatesForChangeInOutputField(null, SWAP, BUTTON_ENABLE);
            } else {
              updateStatesForChangeInOutputField(
                null,
                INSUFFICIENT_BALANCE,
                BUTTON_DISABLE,
              );
            }
          } else {
            updateStatesForChangeInOutputField(
              null,
              PRICE_IMPACT_HIGH,
              BUTTON_DISABLE,
            );
          }
          setInputAmountToSwap(
            convertToEther(result.firstPair.amounts[0], tokenIn.decimals),
          );
          setInputEquivalentOfOneOutput(
            await calculateEquivalentAmount(
              result.firstPair.amounts[result.firstPair.amounts.length - 1],
              ACTION_OUT,
              result.firstPair.path,
            ),
          );
        } else {
          updateStatesForChangeInOutputField(
            EMPTY_AMOUNT,
            TOKEN_PAIR_NOT_EXISTS,
            BUTTON_DISABLE,
          );
        }
      } else {
        updateStatesForChangeInOutputField(
          EMPTY_AMOUNT,
          ENTER_AN_AMOUNT,
          BUTTON_DISABLE,
        );
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      setLoader(false);
    }
  };

  const onSelectOfInputToken = async inputToken => {
    try {
      setLoader(true);
      if (!inputToken) {
        let outputToken = tokenIn;
        inputToken = tokenOut;
        setTokenOut(outputToken);
      }
      setTokenIn(inputToken);
      let tokenInstance =
        inputToken.contractAddress === ETH_ADDRESS
          ? null
          : await contractConnection(erc20_abi, inputToken.contractAddress);
      setInstanceOfInputTokenContract(tokenInstance);
      setInputTokenBalance(
        await getUserBalance(tokenInstance, inputToken.decimals),
      );
      setNativeToken(inputToken.contractAddress === ETH_ADDRESS ? true : false);
      initializeStates();
    } catch (error) {
      throw new Error(error);
    } finally {
      setLoader(false);
    }
  };

  const onSelectOfOutputToken = outputToken => {
    setLoader(true);
    setTokenOut(outputToken);
    initializeStates();
    setLoader(false);
  };

  const onClickOfSwapButton = async () => {
    try {
      setLoader(true);
      if (buttonMessage === CONFIRM) {
        setTransactionLoader(BUTTON_DISABLE);
        await setSwappingCase();
      } else {
        if (isForMaticAndWmatic()) {
          setTransactionFeesAmount(
            await calculateTransactionAmountForWraps(inputAmountToSwap),
          );
        } else {
          setTransactionFeesAmount(
            await calculateTransactionAmount(
              inputAmountToSwap,
              feeRoutesPath.path,
              tokenIn.decimals,
            ),
          );
        }

        setButtonMessage(CONFIRM);
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      setLoader(false);
      setTransactionLoader(BUTTON_ENABLE);
    }
  };

  useEffect(() => {
    const {selectedToken, selectedFromRoute} = route.params;
    if (selectedToken) {
      const onUpdateDropDownList = async () => {
        if (selectedFromRoute === ACTION_IN) {
          await onSelectOfInputToken(selectedToken);
        } else if (selectedFromRoute === ACTION_OUT) {
          onSelectOfOutputToken(selectedToken);
        }
      };
      onUpdateDropDownList();
    }
    initializeStates();
  }, [route.params]);

  useEffect(() => {
    if (data) {
      try {
        setLoader(true);
        const initializeStatesOfSwap = async () => {
          const inputToken = data?.getTokens?.tokens[0];
          setSwapAction(ACTION_IN);
          setTokenIn(inputToken);
          setTokenOut(data?.getTokens?.tokens[1]);
          const tokenInInstance =
            inputToken.contractAddress === ETH_ADDRESS
              ? null
              : await contractConnection(erc20_abi, inputToken.contractAddress);
          setInstanceOfInputTokenContract(tokenInInstance);
          setInputTokenBalance(
            await getUserBalance(tokenInInstance, inputToken.decimals),
          );
          const swapInstance = await contractConnection(
            swapContractDetails.abi,
            swapContractDetails.contractAddress,
          );
          setInstanceOfSwapContract(swapInstance);
          setTransactionFees(await getTransactionFees(swapInstance));
        };
        initializeStatesOfSwap();
      } catch (error) {
        throw new Error(error);
      } finally {
        setLoader(false);
      }
    }
  }, [data]);

  /**Render to switch between swap and continue */
  const feesAndRateRender = () => {
    if (buttonMessage !== CONFIRM) {
      return (
        <View>
          <View style={styles.rateHolder}>
            <Text style={styles.rateTextStyle}>
              1 {tokenOut?.symbol} = {inputEquivalentOfOneOutput}{' '}
              {tokenIn?.symbol}
            </Text>
          </View>
          <Button
            lable={buttonMessage}
            labelStyle={styles.labelStyle}
            buttonWidth={210}
            buttonHeight={52}
            onPress={async () => {
              onClickOfSwapButton();
            }}
            buttonStyle={{marginVertical: 30, alignSelf: 'center'}}
            disabled={buttonStatus}
            showActivityIndicator={loader}
          />
        </View>
      );
    } else if (buttonMessage === CONFIRM) {
      return (
        <View>
          <View style={styles.feesHolder}>
            <View style={styles.fieldTextHolder}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: 130,
                }}>
                <Text style={styles.rateTextStyle}>Transaction Fees </Text>
                <Text style={styles.rateTextStyle}>:</Text>
              </View>
              <Text style={styles.rateTextStyle}>{transactionFees}%</Text>
            </View>
            <View style={styles.fieldTextHolder}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: 130,
                }}>
                <Text style={styles.rateTextStyle}>Rate</Text>
                <Text style={styles.rateTextStyle}>:</Text>
              </View>
              <Text style={styles.rateTextStyle}>
                {refactorString(transactionFeesAmount)}
              </Text>
            </View>
          </View>
          <Button
            lable="Confirm"
            labelStyle={styles.labelStyle}
            buttonWidth={210}
            buttonHeight={52}
            onPress={async () => {
              onClickOfSwapButton();
            }}
            buttonStyle={{marginVertical: 30, alignSelf: 'center'}}
            showActivityIndicator={loader}
          />
        </View>
      );
    }
  };

  /**Handel model */
  const showModelMethod = () => {
    if (isSuccess) {
      return (
        <Model
          source={require('../../Assets/Png/check.png')}
          header="Swap Transaction Status"
          subHeader={modelsubheaderMessage}
          HeaderStyle={{color: '#25BD4F', fontSize: 16}}
          onClose={async () => {
            setIsSuccess(null);
            initializeStates();
            navigation.navigate('HomeScreenStackHolder', {
              screen: 'VotingMainScreen',
              params: {
                transactionHashFromRoute: transactionHash,
              },
            });
          }}
        />
      );
    } else if (isSuccess === false) {
      return (
        <Model
          source={require('../../Assets/Png/error.png')}
          header="Swap Transaction Status"
          subHeader="Swap Transaction Failed"
          HeaderStyle={{color: 'rgba(255, 15, 44, 0.75)', fontSize: 16}}
          onClose={() => setIsSuccess(null)}
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
            <View style={styles.fieldHolder}>
              <View
                style={{
                  height: 295,
                  justifyContent: 'space-between',
                  marginTop: 15,
                }}>
                <View style={styles.subFieldHolder}>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <DropDown
                        value={tokenIn}
                        onTouchField={() => {
                          navigation.navigate('TokenSearchScreen', {
                            fromScreen: 'Swap',
                            tokenInValueFromRoute: null,
                            tokenOutValueFromRoute: tokenOut,
                            selectedFromRoute: ACTION_IN,
                          });
                        }}
                      />
                      <Text style={styles.balanceText}>
                        Balance:
                        {' ' + refactorString(inputTokenBalance)}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        paddingVertical: 6,
                      }}>
                      <TouchableOpacity
                        style={[
                          styles.percentageHolder,
                          {
                            backgroundColor:
                              inputPercentage == 25
                                ? '#04223C'
                                : 'rgba(4, 34, 60, 0.2)',
                          },
                        ]}
                        onPress={() => {
                          onChangeOfInputFieldOfInputToken(
                            inputAmountToSwap,
                            25,
                          );
                        }}>
                        <Text style={styles.percentageText}>25%</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.percentageHolder,
                          {
                            backgroundColor:
                              inputPercentage == 50
                                ? '#04223C'
                                : 'rgba(4, 34, 60, 0.2)',
                          },
                        ]}
                        onPress={() => {
                          onChangeOfInputFieldOfInputToken(
                            inputAmountToSwap,
                            50,
                          );
                        }}>
                        <Text style={styles.percentageText}>50%</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.percentageHolder,
                          {
                            backgroundColor:
                              inputPercentage == 75
                                ? '#04223C'
                                : 'rgba(4, 34, 60, 0.2)',
                          },
                        ]}
                        onPress={() => {
                          onChangeOfInputFieldOfInputToken(
                            inputAmountToSwap,
                            75,
                          );
                        }}>
                        <Text style={styles.percentageText}>75%</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.percentageHolder,
                          {
                            backgroundColor:
                              inputPercentage == 100
                                ? '#04223C'
                                : 'rgba(4, 34, 60, 0.2)',
                          },
                        ]}
                        onPress={() => {
                          onChangeOfInputFieldOfInputToken(
                            inputAmountToSwap,
                            100,
                          );
                        }}>
                        <Text style={styles.percentageText}>100%</Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View>
                        <Input
                          value={
                            inputAmountToSwap ? inputAmountToSwap : EMPTY_AMOUNT
                          }
                          style={styles.textFieldStyle}
                          textStyle={styles.textInputStyle}
                          placeholder="Enter Value"
                          onChangeText={text => {
                            if (text.match(TokenValueRegix)) {
                              setInputAmountToSwap(text);
                              onChangeOfInputFieldOfInputToken(text, 0);
                            }
                          }}
                          keyboardType="decimal-pad"
                        />
                      </View>
                      <View>
                        <TouchableOpacity
                          style={styles.maxButton}
                          onPress={() => {
                            onChangeOfInputFieldOfInputToken(
                              inputAmountToSwap,
                              100,
                            );
                          }}>
                          <Text style={styles.percentageText}>Max</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={async () => {
                    await onSelectOfInputToken(null);
                  }}
                  style={{
                    height: 30,
                    width: 30,
                    backgroundColor: 'rgba(9, 32, 56, 1)',
                    borderRadius: 30,
                    position: 'absolute',
                    top: 133,
                    left: 160,
                    zIndex: 3,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <AntDesign
                      name="arrowdown"
                      style={{
                        color: '#fff',
                        fontSize: 15,
                        position: 'absolute',
                        top: 8,
                        left: 3,
                      }}
                    />
                    <AntDesign
                      name="arrowup"
                      style={{
                        color: '#fff',
                        fontSize: 15,
                        position: 'absolute',
                        top: 6,
                        left: 12,
                      }}
                    />
                  </View>
                </TouchableOpacity>
                <View style={[styles.subFieldHolder]}>
                  <View
                    style={{height: '100%', justifyContent: 'space-between'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <DropDown
                        value={tokenOut}
                        onTouchField={() => {
                          navigation.navigate('TokenSearchScreen', {
                            fromScreen: 'Swap',
                            tokenInValueFromRoute: tokenIn,
                            tokenOutValueFromRoute: null,
                            selectedFromRoute: ACTION_OUT,
                          });
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View>
                        <Input
                          value={
                            outputAmountToSwap
                              ? outputAmountToSwap
                              : EMPTY_AMOUNT
                          }
                          style={styles.textFieldStyle}
                          textStyle={styles.textInputStyle}
                          placeholder="Enter Value"
                          onChangeText={text => {
                            if (text.match(TokenValueRegix)) {
                              setOutputAmountToSwap(text);
                              onChangeOfInputFieldOfOutputToken(text);
                            }
                          }}
                          keyboardType="decimal-pad"
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              {feesAndRateRender()}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      {showModelMethod()}
      {showTermsModelMethod()}
      {transactionLoader && (
        <Loader header="Please Wait" subHeader={transactionLoadingMessage} />
      )}
      {loading && (
        <Loader header="Please Wait" subHeader="Wait while we fetch tokens" />
      )}
    </GradientBackGround>
  );
};

export default Swap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subHolder: {
    width: Dimensions.get('screen').width - 28,
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
    height: Dimensions.get('screen').width * 1.3,
    width: Dimensions.get('screen').width - 28,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 16,
    backgroundColor: colors.fieldHolderBg,
    marginBottom: 25,
  },
  labelStyle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  subFieldHolder: {
    backgroundColor: '#426EA1',
    borderRadius: 8,
    width: deviceWidth - 55,
    padding: 16,
    height: 140,
  },
  percentageHolder: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 9,
    backgroundColor: 'rgba(4, 34, 60, 0.2)',
    borderColor: 'rgba(217, 217, 217, 0.15)',
    marginLeft: 6,
    borderWidth: 1,
  },
  percentageText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 11,
  },
  textFieldStyle: {
    width: normalize(270),
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
  dropDownStyle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 9,
    borderRadius: 8,
    shadowColor: 'rgba(48, 42, 42, 0.25)',
    justifyContent: 'space-around',
  },
  rateHolder: {
    borderRadius: 8,
    borderColor: 'rgba(217, 217, 217, 0.15)',
    borderWidth: 1,
    width: deviceWidth - 56,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  rateTextStyle: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  feesHolder: {
    backgroundColor: 'rgba(4, 23, 48, 0.85)',
    borderRadius: 8,
    width: deviceWidth - 56,
    height: 60,
    marginTop: 10,
    zIndex: -1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldTextHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 295,
  },
});
