import {all} from 'redux-saga/effects';

import authSaga from './Auth/saga';
import appSaga from './App/saga';

export default function* rootSaga(/* getState */) {
  yield all([authSaga(), appSaga()]);
}
