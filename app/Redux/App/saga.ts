import {put, takeEvery, all, fork} from '@redux-saga/core/effects';

import {GET_USER_TOKEN_LIST_START} from './action.types';
import * as actions from './action';

// import {client} from 'app/App';
// import {GET_PRODUCT_CATEGORIES} from 'app/GraphqlOperations/query';

export function* getUserTokenList() {
  yield takeEvery(GET_USER_TOKEN_LIST_START, function* () {
    try {
      // const response = yield client.query({
      //   query: GET_PRODUCT_CATEGORIES,
      //   variables: {},
      //   fetchPolicy: 'no-cache',
      // });
      // console.log({response});
      // const categoryOptions =
      //   response?.data?.getProductCategories?.categories
      //     ?.filter(item => item.status === 'active')
      //     .map(item => ({
      //       name: item.name,
      //       value: item.name,
      //       id: item?._id,
      //     })) || [];

      // if (categoryOptions) {
      //   yield put(
      //     actions.getUserTokenListSuccess([
      //       {name: 'All', value: null, id: null},
      //       ...categoryOptions,
      //     ]),
      //   );
      // }
    } catch (error) {
      yield put(actions.getUserTokenListFail(error));
    }
  });
}
export default function* rootSaga() {
  yield all([fork(getUserTokenList)]);
}
