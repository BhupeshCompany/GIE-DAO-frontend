import {Maybe} from 'yup/lib/types';

export type State = {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: Maybe<User>;
  token: string;
};
export interface User {
  countryCode: string;
  createdAt: string;
  deletedAt: any;
  email: string;
  emailVerifiedAt: string;
  id: string;
  name: string;
  notification: {
    cryptoUpdate: boolean;
    gieTokenUpdate: boolean;
    donationUpdate: boolean;
    warning: boolean;
    gieNotification: boolean;
    isAllNotf: boolean;
  };
  password: any;
  phone: string;
  phoneVerifiedAt: string;
  prefferedLanguage: any;
  role: string;
  status: string;
  updatedAt: string;
}
