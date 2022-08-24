import {formatUnits, parseUnits} from '@ethersproject/units';
import {BigNumber} from 'bignumber.js';

export const noExponents = function (num: any) {
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

export const convertToEther = (data: any, decimals?: any): any => {
  decimals = !!decimals ? decimals : 18;
  data = noExponents(data);
  return noExponents(formatUnits(data.toString(), decimals));
};

export const convertToWei = (data: any, decimals?: any) => {
  decimals = !!decimals ? decimals : 18;
  data = noExponents(data);
  return noExponents(parseUnits(data.toString(), decimals));
};

export const toWei = (data: any): any => {
  let x = new BigNumber(data);
  x = x.multipliedBy(1e18);
  return x;
};

const sliceString = value => {
  if (!value) {
    return '0';
  }
  let result = '';
  for (let index = 0; index < value.length; index++) {
    result += value[index];
    if (!!parseFloat(result)) {
      return result;
    }
  }
};

export const refactorString = value => {
  if (!!parseFloat(value)) {
    const result = value.split('.');
    const stringAfterDecimal = sliceString(result[1]);
    return !!parseFloat(stringAfterDecimal)
      ? result[0] + '.' + stringAfterDecimal
      : result[0];
  } else {
    return '0';
  }
};
