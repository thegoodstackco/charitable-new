import { useMemo, useEffect } from 'react';

export const useRoundOffLinkAchAccountHook = (
  {
    Dash_hoc: {
      actions: { PLAID_LINK_ACH_ACCOUNT_CALL },
    },
    Dash_data: { PLAID_LINK_ACH_ACCOUNT },
    getData,
  },
  { onPlaidLinkAchSuccess = null, onPlaidLinkAchError = null },
) => {
  useEffect(() => {}, []);

  const onPlaidLinkAchAccount = (account, itemId) => {
    const payload = {
      account_id: account.account_id,
      name: account.name,
      plaid_item: itemId,
    };
    PLAID_LINK_ACH_ACCOUNT_CALL({
      request: {
        payload,
      },
      callback: {
        successCallback: ({ res, data, message, status }) => {
          onPlaidLinkAchSuccess({
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
          onPlaidLinkAchError({
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

  const plaidLinkAch = useMemo(() => {
    const linkAch = getData(PLAID_LINK_ACH_ACCOUNT, {}, false);
    return linkAch;
  }, [PLAID_LINK_ACH_ACCOUNT]);

  return {
    plaidLinkAch: {
      data: plaidLinkAch.data,
      loader: plaidLinkAch.loader,
      onLink: onPlaidLinkAchAccount,
    },
  };
};
