import {popularTokens_MUMBAI, popularTokens_POLYGON} from './popularTokens';

let network = 'matic';
let GET_GLOBAL_VARIABLES = '';

const GLOBAL_VARIABLES_POLYGON: any = {
  NETWORK: 'matic',
  EXCHANGE: 'sushiswap',
  JSON_RPC:
    'https://polygon-mainnet.infura.io/v3/e821ea96b5f24f01b1566e31f6879d80',
  SUBGRAPH_URL:
    'https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange',
  ROUTER_ADDRESS: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506',
  FACTORY_ADDRESS: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
  MULTICALL_ADDRESS: '0xdcbff8b2fe085ea9a57384a15a2b1b7db48b8bc1',
  POPULAR_TOKENS: popularTokens_POLYGON,
};

const GLOBAL_VARIABLES_MUMBAI: any = {
  NETWORK: 'mumbai',
  EXCHANGE: 'sushiswap',
  JSON_RPC:
    'https://polygon-mumbai.infura.io/v3/e821ea96b5f24f01b1566e31f6879d80',
  SUBGRAPH_URL:
    'https://api.thegraph.com/subgraphs/name/bhupesh-98/polygon-mumbai-sushiswap-exchange',
  ROUTER_ADDRESS: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506',
  FACTORY_ADDRESS: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
  MULTICALL_ADDRESS: '0xc3a47ff9cab108cc898ed9d7a20625e74c81e31d',
  POPULAR_TOKENS: popularTokens_MUMBAI,
};

switch (network) {
  case 'mumbai':
    GET_GLOBAL_VARIABLES = GLOBAL_VARIABLES_MUMBAI;
    break;
  case 'matic':
    GET_GLOBAL_VARIABLES = GLOBAL_VARIABLES_POLYGON;
    break;
  default:
}

export const GLOBAL_VARIABLES: any = GET_GLOBAL_VARIABLES;
