import { useMemo, useEffect } from 'react';

export const useRoundOffContributionHook = (
  {
    Dash_hoc: {
      actions: { GET_PLAID_PUBLIC_TOKEN_CALL, PLAID_EXCHANGE_TOKEN_CALL },
    },
    Dash_data: { GET_PLAID_PUBLIC_TOKEN, PLAID_EXCHANGE_TOKEN },
    getData,
  },
  {
    onPlaidLinkTokenSuccess = null,
    onPlaidLinkTokenError = null,
    onPlaidExchangeTokenSuccess = null,
    onPlaidExchangeTokenError = null,
    // missionId,
  },
) => {
  useEffect(() => {}, []);

  const getPlaidToken = (selectedKey) => {
    GET_PLAID_PUBLIC_TOKEN_CALL({
      callback: {
        successCallback: ({ res, data, message, status }) => {
          onPlaidLinkTokenSuccess({ res, data, message, status, selectedKey });
        },
        errorCallback: ({
          error,
          errorData: responseErrorParser,
          message,
          status,
          errors,
        }) => {
          onPlaidLinkTokenError({
            error,
            responseErrorParser,
            message,
            status,
            errors,
            selectedKey,
          });
        },
      },
    });
  };

  const onPlaidExchangeToken = ({ payload }) => {
    PLAID_EXCHANGE_TOKEN_CALL({
      request: {
        payload,
      },
      callback: {
        successCallback: ({ res, data, message, status }) => {
          onPlaidExchangeTokenSuccess({
            res,
            data,
            message,
            status,
          });
        },
        errorCallback: ({
          error,
          errorData: responseErrorParser,
          message,
          status,
          errors,
        }) => {
          onPlaidExchangeTokenError({
            error,
            responseErrorParser,
            message,
            status,
            errors,
          });
        },
      },
    });
  };

  const plaidLinkToken = useMemo(() => {
    const contributionInfo = getData(GET_PLAID_PUBLIC_TOKEN, {}, false);
    return contributionInfo;
  }, [GET_PLAID_PUBLIC_TOKEN]);

  const plaidExchangeToken = useMemo(() => {
    const contributionInfo = getData(PLAID_EXCHANGE_TOKEN, {}, false);
    return contributionInfo;
  }, [PLAID_EXCHANGE_TOKEN]);

  return {
    plaidLinkToken: {
      data: plaidLinkToken.data,
      loader: plaidLinkToken.loader,
      getPlaidToken,
    },
    plaidExchangeToken: {
      data: plaidExchangeToken.data,
      loader: plaidExchangeToken.loader,
      onPlaidExchangeToken,
    },
  };
};
