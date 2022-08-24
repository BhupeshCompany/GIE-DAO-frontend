import {Reducer} from 'redux';

import {
  GET_USER_TOKEN_LIST_FAIL,
  GET_USER_TOKEN_LIST_START,
  GET_USER_TOKEN_LIST_SUCCESS,
} from './action.types';
import {AuthActionsTypes} from './action';
import {State} from './types';

const initState: State = {
  isUserTokenListLoading: false,
  userTokenList: [],
  totalUserBalance: 0,
  chartDataObj: {},
};

const reducer: Reducer<State, AuthActionsTypes> = (
  state = initState,
  action,
) => {
  switch (action.type) {
    case GET_USER_TOKEN_LIST_START:
      return {
        ...state,
        isCategoryFilterLoading: true,
      };

    case GET_USER_TOKEN_LIST_SUCCESS: {
      const {payload} = action;

      return {
        ...state,
        categoryFilterList: payload,
        isCategoryFilterLoading: false,
      };
    }

    case GET_USER_TOKEN_LIST_FAIL: {
      return {
        ...state,
        isCategoryFilterLoading: false,
      };
    }

    default:
      return state;
  }
};

export default reducer;
