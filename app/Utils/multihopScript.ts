import Web3 from 'web3';
import client from './apolloClient';
import {gql} from '@apollo/client';

import {erc20_abi, factoryABI, multicall_abi, routerABI} from './ABI';

import {GLOBAL_VARIABLES} from './config';
import {parseUnits} from '@ethersproject/units';

let multicall_address = GLOBAL_VARIABLES.MULTICALL_ADDRESS;

const PromiseHelperAllSettled = (promises: any) => {
  return Promise.all(
    promises.map(function (promise: any) {
      return promise
        .then(function (value: any) {
          return {state: 'fulfilled', value: value};
        })
        .catch(function (reason: any) {
          return {state: 'rejected', reason: reason};
        });
    }),
  );
};

export const returnOptimalTradeUsingSubraph = async (
  from: any,
  to: any,
  amountIn: any,
  flag: boolean,
) => {

  let allEdges: any = [];
  let allNodes: any = [];
  let allNodesSymbols: any = [];
  let pairs: any = [];
  let pairsToken0: any = [];
  let pairsToken1: any = [];

  enum TRADE_STATUS {
    SUCCESS,
    NO_PATH,
    INSUFFICIENT_RESERVES,
  }

  let router_addreess = GLOBAL_VARIABLES.ROUTER_ADDRESS;
  let factoryaddress = GLOBAL_VARIABLES.FACTORY_ADDRESS;

  let trade_status = TRADE_STATUS.SUCCESS;

  const web3 = new Web3(
    new Web3.providers.HttpProvider(GLOBAL_VARIABLES.JSON_RPC),
  );

  const mutilcall_inst = new web3.eth.Contract(
    multicall_abi,
    multicall_address,
  );

  const FACTORY_INSTANCE = new web3.eth.Contract(factoryABI, factoryaddress);

  let allTokens = GLOBAL_VARIABLES.POPULAR_TOKENS;

  allTokens.push(from, to);
  allTokens = [...new Set(allTokens)];
  let subgraphPromiseArr: any = [];

  for (let i = 0; i < allTokens.length - 1; i++) {
    for (let j = i + 1; j < allTokens.length; j++) {
      let data: any;
      data = getPopularPairsData(allTokens[i], allTokens[j], '0', '0');
      subgraphPromiseArr.push(data);
      data = getPopularPairsData(allTokens[j], allTokens[i], '0', '0');
      subgraphPromiseArr.push(data);
    }
  }

  subgraphPromiseArr = await Promise.all(subgraphPromiseArr);
  subgraphPromiseArr = subgraphPromiseArr.filter(
    (d: any) => d.tokenPairs.length !== 0,
  );
  for (const data of subgraphPromiseArr) {
    if (allEdges.length === 0) allEdges = [...data.tokenPairs];
    else allEdges = [...allEdges, ...data.tokenPairs];
  }
  allEdges = allEdges.filter(
    (allEdges: any, index: any, self: any) =>
      index === self.findIndex((t: any) => t.id === allEdges.id),
  );

  for (const iterator of allEdges) {
    allNodes.push(iterator.token0.id, iterator.token1.id);
    allNodesSymbols.push(iterator.token0.symbol, iterator.token1.symbol);
    pairs.push(iterator.id);
    pairsToken0.push(iterator.token0.id);
    pairsToken1.push(iterator.token1.id);
  }

  allNodes = [...new Set(allNodes)];
  allNodesSymbols = [...new Set(allNodesSymbols)];
  const return_paths = async (token0Sno: any, token1Sno: any) => {
    let v: any;

    let adjList: any;

    let paths: any = [];

    let pathsSymbol: any = [];

    let MAX_HOPS = 3;

    const Graph = (vertices: any) => {
      v = vertices;
      initAdjList();
    };

    const initAdjList = () => {
      adjList = new Array(v);
      for (let i = 0; i < v; i++) {
        adjList[i] = [];
      }
    };

    const addEdge = (u: any, v: any) => {
      adjList[u].push(v);
    };

    const printAllPaths = (s: any, d: any) => {
      let isVisited = new Array(v);
      for (let i = 0; i < v; i++) isVisited[i] = false;
      let pathList: any = [];
      pathList.push(s);
      printAllPathsUtil(s, d, isVisited, pathList, s, d);
    };

    const printAllPathsUtil = (
      u: any,
      d: any,
      isVisited: any,
      localPathList: any,
      source: any,
      destination: any,
    ) => {
      if (u === d) {
        let temp: any = [];
        let tempSymbol: any = [];
        localPathList.forEach((element: any) => {
          temp.push(allNodes[element]);
          tempSymbol.push(allNodesSymbols[element]);
        });

        if (temp.length <= MAX_HOPS) {
          paths.push(temp);
          pathsSymbol.push(tempSymbol);
        }
        return;
      }
      isVisited[u] = true;

      for (let i = 0; i < adjList[u].length; i++) {
        if (!isVisited[adjList[u][i]]) {
          localPathList.push(adjList[u][i]);
          printAllPathsUtil(
            adjList[u][i],
            d,
            isVisited,
            localPathList,
            source,
            destination,
          );
          localPathList.splice(localPathList.indexOf(adjList[u][i]), 1);
        }
      }

      isVisited[u] = false;
    };

    const print = (token0Sno: any, token1Sno: any) => {
      Graph(allNodes.length);

      for (let i = 0; i < allEdges.length; i++) {
        addEdge(
          allNodes.indexOf(allEdges[i].token0.id),
          allNodes.indexOf(allEdges[i].token1.id),
        );
        addEdge(
          allNodes.indexOf(allEdges[i].token1.id),
          allNodes.indexOf(allEdges[i].token0.id),
        );
      }

      printAllPaths(token0Sno, token1Sno);

      return [paths, pathsSymbol];
    };

    let [paths_, pathsSymbol_] = print(token0Sno, token1Sno);

    return [paths_, pathsSymbol_];
  };

  const sno1 = allNodes.indexOf(from.toLowerCase());
  const sno2 = allNodes.indexOf(to.toLowerCase());

  let available_paths: any = [];
  let available_path_tokens_symbol: any = [];
  if (sno1 !== sno2 && sno1 !== -1 && sno2 !== -1) {
    [available_paths, available_path_tokens_symbol] = await return_paths(
      sno1,
      sno2,
    );
  } else {
    [available_paths, available_path_tokens_symbol] = [[], []];
  }
  const fromInst = new web3.eth.Contract(erc20_abi, from);
  const toInst = new web3.eth.Contract(erc20_abi, to);
  const fromDecimals = await fromInst.methods.decimals().call();
  const toDecimals = await toInst.methods.decimals().call();

  const getAmountsOut = async (paths: any, amount: any) => {
    let amounts: any = [];
    const router_inst = new web3.eth.Contract(routerABI, router_addreess);
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const data: any = router_inst.methods.getAmountsOut(amount, path).call();
      amounts.push(data);
    }

    amounts = await Promise.all(amounts);

    return amounts;
  };

  const getAmountsIn = async (paths: any, amount: any) => {
    try {
      let amounts: any = [];
      const router_inst = new web3.eth.Contract(routerABI, router_addreess);
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        let data: any = router_inst.methods.getAmountsIn(amount, path).call();
        amounts.push(data);
      }

      let temp = await PromiseHelperAllSettled(amounts);

      amounts = [];

      for (let k = 0; k < temp.length; k++) {
        let iterator = temp[k];
        if (iterator.status !== 'rejected') {
          amounts.push(iterator.value);
        } else {
          amounts.push([]);
        }
      }

      return amounts;
    } catch (err) {}
  };

  let output_with_minimum_amount: any = [];
  let output_with_input_amount: any = [];
  const impact_minimum_amount = 0.00001;
  if (available_paths.length > 0) {
    if (flag) {
      output_with_minimum_amount = await getAmountsOut(
        available_paths,
        convertToWei(impact_minimum_amount, fromDecimals),
      );

      output_with_input_amount = await getAmountsOut(
        available_paths,
        convertToWei(amountIn, fromDecimals),
      );
    } else {
      output_with_minimum_amount = await getAmountsIn(
        available_paths,
        convertToWei(impact_minimum_amount, toDecimals),
      );

      output_with_input_amount = await getAmountsIn(
        available_paths,
        convertToWei(amountIn, toDecimals),
      );
      if (
        output_with_input_amount.length > 0 &&
        output_with_input_amount[0].length === 0 &&
        available_paths.length > 0
      ) {
        trade_status = TRADE_STATUS.INSUFFICIENT_RESERVES;
      }
    }
  } else {
    trade_status = TRADE_STATUS.NO_PATH;
  }

  if (trade_status !== TRADE_STATUS.SUCCESS) {
    return {
      path: available_paths.length > 0 ? available_paths[0][0] : [],
      amounts: [],
      pathPairs: [],
      symbols: [],
      priceImpact: 100,
      trade_status: trade_status,
    };
  }

  const sortResults = (arr: any, prop: string, asc: boolean) => {
    arr.sort(function (a: any, b: any) {
      if (asc) {
        return parseFloat(a[prop]) > parseFloat(b[prop])
          ? 1
          : parseFloat(a[prop]) < parseFloat(b[prop])
          ? -1
          : 0;
      } else {
        return parseFloat(b[prop]) > parseFloat(a[prop])
          ? 1
          : parseFloat(b[prop]) < parseFloat(a[prop])
          ? -1
          : 0;
      }
    });
    return arr;
  };
  let final_trade_data: any = [];

  const impacts = async () => {
    let token0PerToken1ForMinimumImpact: any = [];
    let token0PerToken1ForCurrentImpact: any = [];

    for (let i = 0; i < available_paths.length; i++) {
      if (output_with_input_amount[i].length > 0) {
        let fees = 0;
        let input = 0;
        let output = 0;
        input = output_with_minimum_amount[i][0];
        output =
          output_with_minimum_amount[i][
            output_with_minimum_amount[i].length - 1
          ];
        const minimum_ratio: any = output > 0 ? input / output : 1e18;

        token0PerToken1ForMinimumImpact.push(minimum_ratio);
        input = output_with_input_amount[i][0];
        output =
          output_with_input_amount[i][output_with_input_amount[i].length - 1];
        const actual_ratio = output > 0 ? input / output : 1e18;

        token0PerToken1ForCurrentImpact.push(actual_ratio);
      } else {
        token0PerToken1ForMinimumImpact[i] = 0.000001;
        token0PerToken1ForCurrentImpact[i] = 1000;
      }
    }

    for (let i = 0; i < available_paths.length; i++) {
      const initial_rate = token0PerToken1ForMinimumImpact[i];
      const final_rate = token0PerToken1ForCurrentImpact[i];
      final_trade_data.push({
        path: available_paths[i],
        pathSymbol: available_path_tokens_symbol[i],
        amounts: output_with_input_amount[i],
        output:
          output_with_input_amount[i][output_with_input_amount[i].length - 1],
        priceImpact: ((final_rate - initial_rate) * 100) / initial_rate,
      });
    }
  };

  await impacts();
  final_trade_data = sortResults(final_trade_data, 'output', false);

  const final_path = final_trade_data[0].path;
  const final_price_impact = final_trade_data[0].priceImpact;
  const symbols = final_trade_data[0].pathSymbol;
  const pathPairs = final_trade_data[0].pathPairs;
  const amounts = final_trade_data[0].amounts;

  const inputSymbol = symbols[0];
  const outputSymbol = symbols[symbols.length - 1];

  let maxAmount = amounts[amounts.length - 1];

  return {
    path: final_path,
    amounts: amounts,
    pathPairs: pathPairs,
    symbols: symbols,
    priceImpact: final_price_impact,
    trade_status: trade_status,
  };
};

const getPopularPairsData = async (
  token0: string,
  token1: string,
  reserve0: string,
  reserve1: string,
) => {
  let tokenPairs: any = {};
  try {
    const response = await client.query({
      query: POPULAR_PAIR_FINDING_QUERY,
      variables: {
        token0: token0,
        token1: token1,
        reserve0: reserve0,
        reserve1: reserve1,
      },
    });
    if (!!response && typeof response !== 'undefined') {
      tokenPairs = response.data.tokenPairs;
    }
  } catch (error) {}
  return {tokenPairs: tokenPairs};
};

const POPULAR_PAIR_FINDING_QUERY = gql`
  query pairsData(
    $token0: String
    $token1: String
    $reserve0: String
    $reserve1: String
  ) {
    tokenPairs: pairs(
      where: {
        token0: $token0
        token1: $token1
        reserve0_gt: $reserve0
        reserve1_gt: $reserve1
      }
    ) {
      id
      name
      reserve0
      reserve1
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
    }
  }
`;

export const convertToWei = (data: any, decimals?: any) => {
  decimals = !!decimals ? decimals : 18;
  data = noExponents(data);
  return noExponents(parseUnits(data.toString(), decimals));
};

const noExponents = function (num: any) {
  var data = String(num).split(/[eE]/);
  if (data.length === 1) return data[0];
  var z = '',
    sign = num < 0 ? '-' : '',
    str = data[0].replace('.', ''),
    mag = Number(data[1]) + 1;
  if (mag < 0) {
    z = sign + '0.';
    while (mag++) z += '0';
    return z + str.replace(/^\-/, '');
  }
  mag -= str.length;
  while (mag--) z += '0';
  return str + z;
};

export const optimalRoutePath = async (
  inputToken,
  outputToken,
  amount,
  action: boolean,
) => {
  inputToken = inputToken.toLowerCase();
  outputToken = outputToken.toLowerCase();
  try {
    let xyz = await returnOptimalTradeUsingSubraph(
      inputToken,
      outputToken,
      amount,
      action,
    );
    return xyz;
  } catch (error) {
    return {
      path: [],
      amounts: [],
      pathPairs: undefined,
      symbols: [],
      priceImpact: 100,
      trade_status: 1,
    };
  }
};
