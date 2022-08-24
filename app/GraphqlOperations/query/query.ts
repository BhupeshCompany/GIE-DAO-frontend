/**Apollo imports as required */
import {gql} from '@apollo/client';

/**API to get user profile data */
export const GET_MY_PROFILE = gql`
  query myProfile {
    getProfile {
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
        gieNotification
      }
      updatedAt
      createdAt
    }
  }
`;

export const GET_TOKEN_LIST = gql`
  query myTokensList {
    getTokens(input: {}) {
      tokens {
        id
        name
        decimals
        contractAddress
        symbol
        logo
        order
        status
        createdAt
        updatedAt
        deletedAt
      }
      count
    }
  }
`;

export const GET_EDU_CONTENT = gql`
  query myEduList(
    $page: Float
    $sortType: String
    $limit: Float
    $sortField: String
    $searchKeyword: String
    $status: String
  ) {
    getEducationalContents(
      input: {
        page: $page
        sortType: $sortType
        limit: $limit
        sortField: $sortField
        searchKeyword: $searchKeyword
        status: $status
      }
    ) {
      contents {
        id
        order
        englishTitle
        spanishTitle
        englishDescription
        spanishDescription
        englishVideo
        spanishVideo
        url
        status
        userId
        rejectedComment
        createdAt
        updatedAt
        deletedAt
      }
      count
    }
  }
`;

export const GET_PARTNERS_LIST = gql`
  query getPartnersList(
    $page: Float
    $sortType: String
    $limit: Float
    $sortField: String
    $searchKeyword: String
    $status: String
  ) {
    getPartners(
      input: {
        page: $page
        sortType: $sortType
        limit: $limit
        sortField: $sortField
        searchKeyword: $searchKeyword
        status: $status
      }
    ) {
      partners {
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
      count
    }
  }
`;

export const GET_SETTINGS = gql`
  query getSetting {
    getSettings {
      id
      partnerDonationFee
      treasuryWalletAddress
      donationWalletAddress
      createdAt
      updatedAt
    }
  }
`;

export const GET_NOTIFICATION_LIST = gql`
  query getNotifications($page: Float, $limit: Float) {
    getNotifications(input: {page: $page, limit: $limit}) {
      notifications {
        id
        email
        phone
        countryCode
        otp
        englishTitle
        spanishTitle
        englishDescription
        spanishDescription
        type
        userIds {
          userId
        }
        createdAt
        updatedAt
        deletedAt
      }
      count
    }
  }
`;
