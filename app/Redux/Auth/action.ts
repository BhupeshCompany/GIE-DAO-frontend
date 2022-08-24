import {
  GET_USER_FAIL,
  GET_USER_START,
  GET_USER_SUCCESS,
  SAVE_AUTH_TOKEN,
} from './action.types';

export const getUserStart = (data?: any) =>
  ({
    type: GET_USER_START,
    payload: data,
  } as const);

export const getUserSuccess = (data: any) =>
  ({
    type: GET_USER_SUCCESS,
    payload: data,
  } as const);

export const getUserFail = (data: any) =>
  ({
    type: GET_USER_FAIL,
    payload: data,
  } as const);

export const saveAuthToken = (data?: string) =>
  ({
    type: SAVE_AUTH_TOKEN,
    payload: data,
  } as const);

export type AuthActionsTypes = ReturnType<
  | typeof getUserStart
  | typeof getUserSuccess
  | typeof getUserFail
  | typeof saveAuthToken
>;
