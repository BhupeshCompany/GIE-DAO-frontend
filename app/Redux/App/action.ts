import {
  GET_USER_TOKEN_LIST_FAIL,
  GET_USER_TOKEN_LIST_START,
  GET_USER_TOKEN_LIST_SUCCESS,
} from './action.types';

export const getUserTokenListStart = (data?: any) =>
  ({
    type: GET_USER_TOKEN_LIST_START,
    payload: data,
  } as const);

export const getUserTokenListSuccess = (data: any) =>
  ({
    type: GET_USER_TOKEN_LIST_SUCCESS,
    payload: data,
  } as const);

export const getUserTokenListFail = (data: any) =>
  ({
    type: GET_USER_TOKEN_LIST_FAIL,
    payload: data,
  } as const);

export type AuthActionsTypes = ReturnType<
  | typeof getUserTokenListStart
  | typeof getUserTokenListSuccess
  | typeof getUserTokenListFail
>;
