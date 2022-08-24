/* eslint-disable @typescript-eslint/no-unused-vars */
import bip39 from 'bip39js';
import EncryptedStorage from 'react-native-encrypted-storage';
import Web3Connection from './web3Connection'; /**web3 connection import */
import {rnEncryptedStorageKey} from '../Constants/glb';
import MyWallet from './myWallet';

/**this is used by bip39 library */
export function getEntropy() {
  return bip39.genEntropy(128);
}

/** Generate mnemonic phrases using bip39 library*/
export const getMnemoic = () => {
  return bip39.genMnemonic(getEntropy());
};

/** generate array with random number between 1 to 12 non repeating */
export const randomPhraseSelecter = () => {
  const range = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  let uniqueValues = [];
  for (var a = range, i = a.length; i--; ) {
    var random = a.splice(Math.floor(Math.random() * (i + 1)), 1)[0];
    uniqueValues.push(random);
  }
  return uniqueValues.splice(0, 3);
};

/** encrypt generated wallet using password*/
export const encryptWallet = async (
  privateKey: string,
  walletPassword: string,
) => {
  const web3 = Web3Connection.getConnection();
  const result = await web3.eth.accounts.encrypt(privateKey, walletPassword);
  await EncryptedStorage.setItem(rnEncryptedStorageKey, JSON.stringify(result));
  const wallet = web3.eth.accounts.wallet.add(privateKey);
  MyWallet.setWallet(wallet);
};

/** Validate phrases entered by user if success move user to homescreen*/
export const validateMnemonic = async (phraseArray: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        phraseArray.includes('') ||
        phraseArray.includes(null) ||
        phraseArray.includes(undefined)
      ) {
        resolve(true);
      } else {
        const mnemonicPhrase = phraseArray.join(' ');
        const valid = await bip39.validMnemonic(mnemonicPhrase);
        if (valid) {
          resolve(mnemonicPhrase);
        } else {
          resolve(true);
        }
      }
    } catch (error) {
      resolve(true);
    }
  });
};

export function reshapeValues(n: number, decimals = 4) {
  if (n) {
    var parts = parseFloat(n.toString())
      .toFixed(decimals)
      .toString()
      .split('.');

    return (
      parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
      (parts[1] ? '.' + parts[1] : '')
    );
  }
  return '0.00';
}
export function trxReshapeValues(n: number, decimals = 4) {
  var parts = parseFloat(n.toString()).toFixed(decimals).toString();

  return parts;
}

export const convertToLowerCase = (value: string) => {
  return value.toLowerCase().toString();
};

export const updateArray = (loadedArray: any[], newArray: any[]) => {
  let arr = loadedArray;

  newArray.map(item1 => {
    const storedArr = arr.find(item2 => item2?.id === item1?.id);
    if (!storedArr) {
      arr.push(item1);
    }
  });
  return arr;
};
