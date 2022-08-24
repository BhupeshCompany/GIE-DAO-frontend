import {Reducer} from 'redux';

import {
  GET_USER_FAIL,
  GET_USER_START,
  GET_USER_SUCCESS,
  SAVE_AUTH_TOKEN,
} from './action.types';
import {AuthActionsTypes} from './action';
import {State} from './types';
import {setAuthToken} from 'app/Utils/axios';

const initState: State = {
  user: null,
  isLoading: false,
  isLoggedIn: false,
  token: '',
};

const reducer: Reducer<State, AuthActionsTypes> = (
  state = initState,
  action,
) => {
  switch (action.type) {
    case GET_USER_START:
      return {
        ...state,
        isLoading: true,
      };

    case GET_USER_SUCCESS: {
      const {payload} = action;

      return {
        ...state,
        user: payload,
      };
    }

    case GET_USER_FAIL: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case SAVE_AUTH_TOKEN: {
      const {payload} = action;

      setAuthToken(payload);
      return {
        ...state,
        token: payload,
      };
    }

    default:
      return state;
  }
};

export default reducer;
