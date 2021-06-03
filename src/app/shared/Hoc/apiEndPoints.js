import BASE_URL from '../utils/BaseUrl';
export const API_BASE_URL = BASE_URL;

// const TEST_API = {
//   url: 'https://jsonplaceholder.typicode.com/posts/',
//   method: 'GET',
//   responseStatusCode: [900],
//   responseStatusKey: 'code',
//   responseDataKey: 'data',
//   responseMessageKey: 'message',
// };

/* ******  Authentication APIs Start ****** */
const GET_PROFILE_API = {
  url: ({ userId }) => `${API_BASE_URL}user/update/profile/${userId}`,
  method: 'GET',
};
const CREATE_PROFILE_API = {
  url: `${API_BASE_URL}user/create/profile/`,
  method: 'POST',
};
const UPDATE_PROFILE_API = {
  url: ({ userId }) => `${API_BASE_URL}user/update/profile/${userId}`,
  method: 'PATCH',
};
const LOGIN_API = {
  url: `${API_BASE_URL}user/login/`,
  method: 'POST',
};
const LOGIN_EMAIL_API = {
  url: `${API_BASE_URL}login/`,
  method: 'POST',
};
const REGISTER_DEVICE_TOKEN_API = {
  url: `${API_BASE_URL}payment/device_token/`,
  method: 'POST',
};
/* ******  Authentication APIs End ****** */

/* ******  Missions APIs Start ****** */

// Missions
const CREATE_MISSION_API = {
  url: `${API_BASE_URL}mission/mission/`,
  method: 'POST',
};
const GET_ALL_MISSIONS_API = {
  url: `${API_BASE_URL}mission/mission/`,
  method: 'GET',
};
const GET_MY_MISSION_API = {
  url: `${API_BASE_URL}mission/mission/`,
  method: 'GET',
};
const GET_USER_MISSIONS_API = {
  url: `${API_BASE_URL}mission/user_missions/`,
  method: 'GET',
};
const GET_USER_MISSIONS_CONTRIBUTION_API = {
  url: `${API_BASE_URL}mission/user_missions/`,
  method: 'GET',
};
const UPDATE_MISSION_API = {
  url: ({ missionId }) => `${API_BASE_URL}mission/mission/${missionId}/`,
  method: 'PATCH',
};
const GET_MISSION_BY_ID_API = {
  url: ({ missionId }) => `${API_BASE_URL}mission/mission/${missionId}`,
  method: 'GET',
};
const GET_MISSION_CATEGORIES_API = {
  url: `${API_BASE_URL}mission/mission_category/`,
  method: 'GET',
};
const GET_NEAREST_MISSION_API = {
  url: `${API_BASE_URL}mission/nearest_mission/`,
  method: 'GET',
};

// Milestones
const GET_MISSION_MILESTONES_API = {
  url: ({ missionId }) =>
    `${API_BASE_URL}mission/mission_milestone/${missionId}`,
  method: 'GET',
};
const ADD_MISSION_MILESTONE_API = {
  url: `${API_BASE_URL}mission/mission_milestone/`,
  method: 'POST',
};
const UPDATE_MISSION_MILESTONE_API = {
  url: ({ milestoneId }) =>
    `${API_BASE_URL}mission/mission_milestone/${milestoneId}`,
  method: 'PATCH',
};
const DELETE_MISSION_MILESTONE_API = {
  url: ({ milestoneId }) =>
    `${API_BASE_URL}mission/mission_milestone/${milestoneId}`,
  method: 'DELETE',
};
// Content
const ADD_MISSION_FILES_API = {
  url: () => `${API_BASE_URL}mission/mission_files/`,
  method: 'POST',
};
const DELETE_MISSION_FILES_API = {
  url: ({ contentId }) => `${API_BASE_URL}mission/mission_files/${contentId}`,
  method: 'DELETE',
};
// PAYMENT
const CREATE_ONE_TIME_CONTRIBUTION_API = {
  url: `${API_BASE_URL}payment/donate/`,
  method: 'POST',
};
const CREATE_RECURRING_CONTRIBUTION_API = {
  url: `${API_BASE_URL}payment/subscription/`,
  method: 'POST',
};
const CANCEL_RECURRING_CONTRIBUTION_API = {
  url: `${API_BASE_URL}payment/subscription/cancel_subscription/`,
  method: 'POST',
};
const GET_MISSION_CONTRIBUTION_PDF_API = {
  url: `${API_BASE_URL}mission/contribution_record_pdf/`,
  method: 'GET',
};
const UPDATE_ONE_TIME_PAYMENT_API = {
  url: `${API_BASE_URL}payment/donate/payment_succeed/`,
  method: 'POST',
};
const GET_CONTRIBUTION_HISTORY_API = {
  url: `${API_BASE_URL}mission/mission_contribution/`,
  method: 'GET',
};
const GET_USER_CONTRIBUTION_API = {
  url: `${API_BASE_URL}mission/user_contributions`,
  method: 'GET',
};
const GET_CARD_LIST_API = {
  url: `${API_BASE_URL}payment/payment_method/`,
  method: 'GET',
};
const DELETE_CARD_API = {
  url: `${API_BASE_URL}payment/payment_method/delete_method/`,
  method: 'DELETE',
};
const GET_PLAID_PUBLIC_TOKEN = {
  url: `${API_BASE_URL}payment/plaid/get_link_token/`,
  method: 'GET',
};
const GET_ROUND_OFF_DETAILS = {
  url: `${API_BASE_URL}payment/plaid/get_roundoff_details/`,
  method: 'GET',
};
const GET_ROUND_OFF_LINKED_ACCOUNTS = {
  url: `${API_BASE_URL}payment/plaid/get_plaid_items/`,
  method: 'GET',
};
const GET_ROUND_OFF_TRANSACTIONS = {
  url: `${API_BASE_URL}payment/plaid/get_transactions/`,
  method: 'POST',
};
const DELETE_ROUND_OFF_ACCOUNT_API = {
  url: `${API_BASE_URL}payment/plaid/delete_plaid_item/`,
  method: 'DELETE',
};
const PLAID_WEBHOOK = {
  url: `${API_BASE_URL}plaid/webhook/`,
  method: 'GET',
};
const PLAID_LINK_ACH_ACCOUNT = {
  url: `${API_BASE_URL}payment/plaid/link_ach_account/`,
  method: 'POST',
};
const PLAID_EXCHANGE_TOKEN = {
  url: `${API_BASE_URL}payment/plaid/create_plaid_item/`,
  method: 'POST',
};
const ADD_EDIT_BANK_ACCOUNT_API = {
  url: `${API_BASE_URL}payment/bank_account/`,
  method: 'POST',
};
const PAYOUT_TO_BANK_ACCOUNT_API = {
  url: `${API_BASE_URL}payment/payout_request/`,
  method: 'POST',
};
const PAYOUT_TRANSACTIONS_API = {
  url: `${API_BASE_URL}payment/payout_request/`,
  method: 'GET',
};
const GET_BANK_ACCOUNT_API = {
  url: `${API_BASE_URL}payment/bank_account/`,
  method: 'GET',
};
/* ******  Missions APIs End ****** */
export const dashboard = {
  /* ****** Authentication APIs Start ****** */
  GET_PROFILE_API,
  CREATE_PROFILE_API,
  UPDATE_PROFILE_API,
  LOGIN_API,
  LOGIN_EMAIL_API,
  /* ******  Authentication APIs End ****** */
  /* ******  Missions APIs Start ****** */
  CREATE_MISSION_API,
  UPDATE_MISSION_API,
  GET_ALL_MISSIONS_API,
  GET_MY_MISSION_API,
  GET_USER_MISSIONS_API,
  GET_USER_MISSIONS_CONTRIBUTION_API,
  GET_MISSION_BY_ID_API,
  GET_MISSION_MILESTONES_API,
  ADD_MISSION_MILESTONE_API,
  GET_MISSION_CATEGORIES_API,
  GET_NEAREST_MISSION_API,
  UPDATE_MISSION_MILESTONE_API,
  DELETE_MISSION_MILESTONE_API,
  ADD_MISSION_FILES_API,
  DELETE_MISSION_FILES_API,
  /* ******  Missions APIs End ****** */
  /* ****** Payments APIs Start ****** */
  CREATE_ONE_TIME_CONTRIBUTION_API,
  CREATE_RECURRING_CONTRIBUTION_API,
  CANCEL_RECURRING_CONTRIBUTION_API,
  GET_MISSION_CONTRIBUTION_PDF_API,
  UPDATE_ONE_TIME_PAYMENT_API,
  GET_CONTRIBUTION_HISTORY_API,
  GET_USER_CONTRIBUTION_API,
  GET_CARD_LIST_API,
  DELETE_CARD_API,
  GET_PLAID_PUBLIC_TOKEN,
  GET_ROUND_OFF_DETAILS,
  GET_ROUND_OFF_LINKED_ACCOUNTS,
  GET_ROUND_OFF_TRANSACTIONS,
  DELETE_ROUND_OFF_ACCOUNT_API,
  PLAID_LINK_ACH_ACCOUNT,
  PLAID_WEBHOOK,
  PLAID_EXCHANGE_TOKEN,
  ADD_EDIT_BANK_ACCOUNT_API,
  GET_BANK_ACCOUNT_API,
  PAYOUT_TO_BANK_ACCOUNT_API,
  PAYOUT_TRANSACTIONS_API,
  REGISTER_DEVICE_TOKEN_API,
  /* ****** Payments APIs End ****** */
};

export const authentication = {
  // TEST_API,
};
