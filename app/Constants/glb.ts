import {GLOBAL_VARIABLES} from '../config';
export const privateKeyLength: number = 66;
export const privateKeyRegexPatter: any = /^0x[0-9A-Fa-f]*$/;

//testnet
export const web3ProviderURL: string = GLOBAL_VARIABLES.JSON_RPC;

// //Mainnet
// export const web3ProviderURL: string =
//   'https://polygon-mainnet.infura.io/v3/e821ea96b5f24f01b1566e31f6879d80';
export const rnEncryptedStorageKey: string = '0tyhghf74hehebf';
export const mnemonicPhraseHDpath: string = "m/44'/60'/0'/0/0";
export const tourPageContent = [
  {
    title: 'IMAGINE THE IMPACT',
    paragraph:
      'Discover what’s possible with a digital wallet/decentralized cryptocurrency exchange platform that aligns with your values.\n\nTOGETHER, we can maximize the benefits of cryptocurrencies to make an impact on a local and global scale.',
  },
  {
    title: 'TRUE TO OUR WORDS',
    paragraph:
      'We donate a % of our monthly revenue to one of our nonprofit partners. These contributions from the GIE platform only go to verified local and\n global charities that improve lives and offset cryptocurrencies’ carbon footprints. We welcome you to explore and donate to these causes too. Check out our “Partner” tab for more info.',
  },
  {
    title: 'CRYPTO MADE EASY',
    paragraph:
      'Until now, navigating the world of cryptocurrencies was challenging. We have simplified cryptocurrency processes with tutorial videos and educational content from trading to investing, without forgoing any value,\n so you never have to break a sweat. Check out our “Educational” tab/ “?” Mark boxes for more info.',
  },
];

export const maticNativeAddress = '0xeth';
export const WMATIC_ADDRESS = GLOBAL_VARIABLES.WETH;
