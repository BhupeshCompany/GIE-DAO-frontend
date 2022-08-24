import {put, takeEvery, all, fork} from '@redux-saga/core/effects';

import {GET_USER_START} from './action.types';
import * as actions from './action';
import {client} from 'app/App';
import {GET_MY_PROFILE} from 'app/GraphqlOperations/query/query';
import storageString from 'app/Constants/webStorageString';
import EncryptedStorage from 'react-native-encrypted-storage';
export function* getUser() {
  yield takeEvery(GET_USER_START, function* () {
    try {
      const response = yield client.query({
        query: GET_MY_PROFILE,
        variables: {},
        fetchPolicy: 'no-cache',
      });

      let data = response?.data?.getProfile;
      let isAllNotf = yield EncryptedStorage.getItem(
        storageString.isAllAllowNotf,
      );

      if (isAllNotf) {
        if (isAllNotf === 'true') {
          isAllNotf = true;
        } else {
          isAllNotf = false;
        }
      } else {
        isAllNotf = true;
      }
      data = {...data, notification: {...data['notification'], isAllNotf}};
      yield put(actions.getUserSuccess(data));
    } catch (error) {
      yield put(actions.getUserFail(error));
    }
  });
}
export default function* rootSaga() {
  yield all([fork(getUser)]);
}
