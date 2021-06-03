import { useMemo, useEffect, useState } from 'react';
import moment from 'moment';

export const useRoundOffAccountsHook = (
  {
    Dash_hoc: {
      actions: {
        GET_ROUND_OFF_LINKED_ACCOUNTS_CALL,
        GET_ROUND_OFF_TRANSACTIONS_CALL,
        DELETE_ROUND_OFF_ACCOUNT_API_CALL,
      },
    },
    Dash_data: {
      GET_ROUND_OFF_LINKED_ACCOUNTS,
      GET_ROUND_OFF_TRANSACTIONS,
      DELETE_ROUND_OFF_ACCOUNT_API,
    },
    getData,
  },
  {
    onRemoveAccountError = null,
    onRemoveAccountSuccess = null,
    onGetRoundOffSuccess = null,
  },
) => {
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  useEffect(() => {
    getAccounts();
  }, []);

  const getAccounts = () => {
    GET_ROUND_OFF_LINKED_ACCOUNTS_CALL({
      callback: {
        successCallback: ({ data: { data } }) => {
          if (data && data.length) {
            if (onGetRoundOffSuccess) onGetRoundOffSuccess();
            const payload = {
              access_token: data[0].access_token,
              start_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
              end_date: moment().format('YYYY-MM-DD'),
            };
            GET_ROUND_OFF_TRANSACTIONS_CALL({
              request: { payload },
              callback: {
                successCallback: () => {
                  // if (transactionData && transactionData.length) {
                  //   setTransactions(
                  //     transactionData.map((trans) => ({
                  //       ...trans,
                  //       isSelected: false,
                  //     })),
                  //   );
                  // }
                },
              },
            });
          }
        },
      },
    });
  };

  const handleDeleteAccount = (selectedAccount) => {
    if (selectedAccount && selectedAccount.access_token)
      DELETE_ROUND_OFF_ACCOUNT_API_CALL({
        request: {
          query: {
            access_token: selectedAccount.access_token,
          },
        },
        callback: {
          successCallback: ({ res, data, message, status }) => {
            getAccounts();
            onRemoveAccountSuccess({ res, data, message, status });
          },
          errorCallback: ({
            error,
            errorData: responseErrorParser,
            message,
            status,
            errors,
          }) => {
            onRemoveAccountError({
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

  const handleSelectedTransaction = (selectedAccount) => {
    const transactionCopy = [...selectedTransactions];
    // console.log(transactionCopy, 'transactionCopy');
    // console.log(selectedAccount.account_id, 'selectedAccount');
    if (transactionCopy.includes(selectedAccount.transaction_id)) {
      transactionCopy.map((trans, index) => {
        // console.log(trans, 'trans');
        if (trans === selectedAccount.transaction_id) {
          transactionCopy.splice(index, 1);
        }
        return null;
      });
    } else {
      transactionCopy.push(selectedAccount.transaction_id);
    }
    setSelectedTransactions(transactionCopy);
  };

  const roundOffAccounts = useMemo(() => {
    const accounts = getData(GET_ROUND_OFF_LINKED_ACCOUNTS, [], true);
    return accounts;
  }, [GET_ROUND_OFF_LINKED_ACCOUNTS]);

  const roundOffTransactions = useMemo(() => {
    const accounts = getData(GET_ROUND_OFF_TRANSACTIONS, {}, false);
    return accounts;
  }, [GET_ROUND_OFF_TRANSACTIONS]);

  const deleteAccount = useMemo(() => {
    const accounts = getData(DELETE_ROUND_OFF_ACCOUNT_API, {}, false);
    return accounts;
  }, [DELETE_ROUND_OFF_ACCOUNT_API]);

  return {
    roundOffAccounts: {
      data: roundOffAccounts.data,
      loader: roundOffAccounts.loader,
      getAccounts,
    },
    roundOffTransactions: {
      data: roundOffTransactions.data,
      loader: roundOffTransactions.loader,
      selectedTransactions,
      onSelectTransaction: handleSelectedTransaction,
    },
    deleteAccount: {
      data: deleteAccount.data,
      loader: deleteAccount.loader,
      onDelete: handleDeleteAccount,
    },
  };
};
