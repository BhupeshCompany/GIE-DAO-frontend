import {gql} from '@apollo/client';

/**API call to send OTP on phone */
export const SEND_PHONE_OTP = gql`
  mutation sendVerificationPhone(
    $resendOTP: Boolean!
    $requestType: String!
    $countryCode: String!
    $phone: String!
  ) {
    sendVerificationPhone(
      input: {
        resendOTP: $resendOTP
        requestType: $requestType
        countryCode: $countryCode
        phone: $phone
      }
    ) {
      message
    }
  }
`;

/**API call to send OTP on Email */
export const SEND_EMAIL_OTP = gql`
  mutation sendVerificationEmail(
    $resendOTP: Boolean!
    $requestType: String!
    $email: String!
  ) {
    sendVerificationEmail(
      input: {resendOTP: $resendOTP, requestType: $requestType, email: $email}
    ) {
      message
    }
  }
`;

/**API call to send OTP on Email and Phone both */
export const SEND_PHONE_EMAIL_OTP = gql`
  mutation sendOtpforEmailandPhone(
    $resendOTP: Boolean!
    $requestType: String!
    $email: String!
    $countryCode: String!
    $phone: String!
  ) {
    sendOtpforEmailandPhone(
      input: {
        resendOTP: $resendOTP
        requestType: $requestType
        email: $email
        countryCode: $countryCode
        phone: $phone
      }
    ) {
      message
    }
  }
`;

/**API call to create user (signup user) */
export const CREATE_USER = gql`
  mutation signup(
    $name: String!
    $email: String!
    $phone: String!
    $password: String!
    $emailOtp: String!
    $phoneOtp: String!
  ) {
    signup(
      input: {
        name: $name
        email: $email
        phone: $phone
        password: $password
        emailOtp: $emailOtp
        phoneOtp: $phoneOtp
      }
    ) {
      user {
        id
        name
        email
        phone
        password
        role
        prefferedLanguage
        status
        deletedAt
        emailVerifiedAt
        phoneVerifiedAt
        countryCode
        notification {
          cryptoUpdate
          gieTokenUpdate
          donationUpdate
          warning
        }
        updatedAt
        createdAt
      }
      token
    }
  }
`;

/**API call to login user */
export const LOGIN_USER = gql`
  mutation login($emailOrPhone: String!, $password: String!) {
    login(input: {emailOrPhone: $emailOrPhone, password: $password}) {
      user {
        id
        name
        email
        phone
        password
        role
        prefferedLanguage
        status
        deletedAt
        emailVerifiedAt
        phoneVerifiedAt
        countryCode
        notification {
          cryptoUpdate
          gieTokenUpdate
          donationUpdate
          warning
        }
        updatedAt
        createdAt
      }
      token
    }
  }
`;

/**API call to change password */
export const CHANGE_PASSWORD = gql`
  mutation changePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(
      input: {oldPassword: $oldPassword, newPassword: $newPassword}
    ) {
      message
      success
    }
  }
`;

/**API call to Update Profile */
export const UPDATE_PROFILE = gql`
  mutation updateProfile(
    $name: String
    $email: String
    $phone: String
    $prefferedLanguage: String
    $emailOtp: String
    $phoneOtp: String
  ) {
    updateProfile(
      input: {
        name: $name
        email: $email
        phone: $phone
        prefferedLanguage: $prefferedLanguage
        emailOtp: $emailOtp
        phoneOtp: $phoneOtp
      }
    ) {
      message
      success
    }
  }
`;

/**API call to reset password as forget password */
export const FORGET_PASSWORD = gql`
  mutation forgetPassword(
    $email: String!
    $emailOtp: String!
    $password: String!
  ) {
    forgetPassword(
      input: {email: $email, emailOtp: $emailOtp, password: $password}
    ) {
      message
      success
    }
  }
`;

/**Eductional Content Suggest API call */
export const ADD_EDU_SUGGEST_CONTENT = gql`
  mutation suggestEducationalContent(
    $title: String!
    $description: String!
    $url: String!
  ) {
    suggestEducationalContent(
      input: {title: $title, description: $description, url: $url}
    ) {
      message
      success
    }
  }
`;

/**Suggest partner API call */
export const PARTNER_SUGGEST = gql`
  mutation suggestPartner(
    $name: String!
    $email: String
    $phone: String
    $address: String
    $logo: String
    $bannerImage: String
    $registrationNumber: String
    $englishDescription: String
    $spanishDescription: String
    $url: String
  ) {
    suggestPartner(
      input: {
        name: $name
        email: $email
        phone: $phone
        address: $address
        logo: $logo
        bannerImage: $bannerImage
        registrationNumber: $registrationNumber
        englishDescription: $englishDescription
        spanishDescription: $spanishDescription
        url: $url
      }
    ) {
      id
      order
      name
      email
      userId
      phone
      address
      registrationNumber
      englishDescription
      spanishDescription
      logo
      bannerImage
      url
      status
      rejectedComment
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const GET_PRESIGNED_URL = gql`
  mutation generatePresignedURL(
    $fileName: String!
    $folderPath: String!
    $contentType: String!
  ) {
    generatePresignedURL(
      input: {
        fileName: $fileName
        folderPath: $folderPath
        contentType: $contentType
      }
    ) {
      presignedURL
      key
    }
  }
`;

export const ADD_DONATION = gql`
  mutation addDonation(
    $token: String!
    $partnerId: String!
    $transactionFee: Float!
    $amount: Float!
    $fromAddress: String!
    $toAddress: String!
  ) {
    addDonation(
      input: {
        token: $token
        partnerId: $partnerId
        transactionFee: $transactionFee
        amount: $amount
        fromAddress: $fromAddress
        toAddress: $toAddress
      }
    ) {
      message
      success
      donation {
        id
      }
    }
  }
`;

export const ADD_VOTE = gql`
  mutation addVote($transactionHash: String!, $partnerId: String!) {
    addVote(input: {transactionHash: $transactionHash, partnerId: $partnerId}) {
      message
      success
    }
  }
`;

export const UPDATE_DONATION_STATUS = gql`
  mutation updateDonationStatus(
    $id: String!
    $status: String!
    $transactionHash: String!
  ) {
    updateDonationStatus(
      input: {id: $id, status: $status, transactionHash: $transactionHash}
    ) {
      message
      success
    }
  }
`;

export const UPDATE_NOTF_PREFERENCE = gql`
  mutation updateNotificationPreference(
    $cryptoUpdate: Boolean
    $gieTokenUpdate: Boolean
    $donationUpdate: Boolean
    $gieNotification: Boolean
  ) {
    updateNotificationPreference(
      input: {
        cryptoUpdate: $cryptoUpdate
        gieTokenUpdate: $gieTokenUpdate
        donationUpdate: $donationUpdate
        gieNotification: $gieNotification
      }
    ) {
      message
      success
    }
  }
`;
