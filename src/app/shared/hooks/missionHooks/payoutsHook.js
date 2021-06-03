import { useMemo, useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export const usePayoutsHook = (
  {
    Dash_hoc: {
      actions: {
        PAYOUT_TRANSACTIONS_API_CALL,
        PAYOUT_TO_BANK_ACCOUNT_API_CALL,
      },
    },
    Dash_data: {
      PAYOUT_TRANSACTIONS_API,
      PAYOUT_TO_BANK_ACCOUNT_API,
      userProfile = {},
    },
    getData,
  },
  {
    onPayoutToBankError = null,
    onPayoutToBankSuccess = null,
    mission = null,
  } = {},
) => {
  const [accountBalance, setAccountBalance] = useState(0);
  useFocusEffect(
    useCallback(() => {
      if (userProfile && userProfile.id) {
        const query = {
          user: userProfile && userProfile.id,
        };
        PAYOUT_TRANSACTIONS_API_CALL({
          request: {
            query,
          },
        });
      }
    }, [userProfile]),
  );

  const handlePayoutToBank = () => {
    const payload = {
      mission: mission.id,
      user: userProfile && userProfile.id,
      amount: accountBalance,
      // status: 'succeeded',
    };
    PAYOUT_TO_BANK_ACCOUNT_API_CALL({
      request: {
        payload,
      },
      callback: {
        successCallback: ({ res, data, message, status }) => {
          onPayoutToBankSuccess({ res, data, message, status });
        },
        errorCallback: ({
          error,
          errorData: responseErrorParser,
          message,
          status,
          errors,
        }) => {
          onPayoutToBankError({
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

  const getAccountBalance = (missionInfo, payoutsList) => {
    let balance = 0;
    let transferredAmount = 0;
    const totalDonation = missionInfo ? +missionInfo.total_donation : 0;
    if (payoutsList && payoutsList.length) {
      transferredAmount = payoutsList
        .filter((payout) => payout.status === 'succeeded')
        .reduce((acc, curr) => +curr.amount + acc, 0);
    }
    if (transferredAmount < totalDonation) {
      balance = +totalDonation - transferredAmount;
    }
    return balance;
  };

  const payoutsList = useMemo(() => {
    const payoutInfo = getData(PAYOUT_TRANSACTIONS_API, [], true);
    const balance = getAccountBalance(mission, payoutInfo.data);
    setAccountBalance(balance);
    return payoutInfo;
  }, [PAYOUT_TRANSACTIONS_API]);

  const payoutToBank = useMemo(() => {
    const payoutInfo = getData(PAYOUT_TO_BANK_ACCOUNT_API, {}, false);
    return payoutInfo;
  }, [PAYOUT_TO_BANK_ACCOUNT_API]);

  return {
    payoutsList: {
      data: payoutsList.data,
      loader: payoutsList.loader,
      lastUpdated: payoutsList.lastUpdated,
    },
    payoutToBank: {
      loader: payoutToBank.loader,
      onPayout: handlePayoutToBank,
    },
    accountBalance,
  };
};
