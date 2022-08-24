import {config} from 'app/Config';
import Axios from 'axios';

const Authorization = 'Authorization';
export const axios = Axios.create({
  baseURL: config.apiBaseUrl,
});

export const axiosRequest = axios.request;

axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    const message = error.response?.data?.message || error.message;
    const statusCode =
      error?.response?.data?.statusCode || error?.response?.status;
    const errorRes = error.response;

    return Promise.reject(error);
  },
);

export const setAuthToken = (token: string) => {
  // put token from localStorage into Auth Bearer header

  if (token) {
    axios.defaults.headers.common[Authorization] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common[Authorization];
  }
};
