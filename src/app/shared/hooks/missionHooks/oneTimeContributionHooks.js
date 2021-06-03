import { useState, useCallback, useMemo } from 'react';
import { currency } from '../../utils/config';

export const useOneTimeContributionHooks = (
  {
    Dash_hoc: {
      actions: {
        CREATE_ONE_TIME_CONTRIBUTION_API_CALL,
        UPDATE_ONE_TIME_PAYMENT_API_CALL,
      },
    },
    Dash_data: { CREATE_ONE_TIME_CONTRIBUTION_API },
    getData,
  },
  {
    missionId = null,
    oneTimeContributeSuccess = null,
    oneTimeContributeError = null,
  },
) => {
  const [amount, setAmount] = useState(0);
  const [amountError, setAmountError] = useState('');

  const onChangeAmount = (e) => {
    const value = getPlatformBasedFieldValue(e);
    if (amountError) {
      setAmountError('');
    }
    if (Number(value) === 0 || Number(value)) setAmount(+value);
  };
  const onClearAmount = () => {
    if (amountError) {
      setAmountError('');
    }
    setAmount(0);
  };

  const onBlurAmount = useCallback(
    (e) => {
      e.preventDefault();
      const error = validate(amount, 'amount');
      if (error) setAmountError(error);
    },
    [amount],
  );

  const validatePayment = () => {
    const formError = [];
    const isAmountError = validate(amount, 'amount');
    if (isAmountError) {
      formError.push(null);
      setAmountError(isAmountError);
    }
    return formError.length;
  };

  const handelOneTimePayment = ({
    customPayload = null,
    isNew = false,
  } = {}) => {
    let payload = {};
    if (customPayload) {
      payload = { ...customPayload, amount: customPayload.amount * 100 };
    } else {
      payload = {
        amount: amount * 100,
        mission: missionId,
        currency,
      };
    }
    CREATE_ONE_TIME_CONTRIBUTION_API_CALL({
      request: { payload },
      callback: {
        successCallback: ({ res, data, message, status }) => {
          oneTimeContributeSuccess({ res, data, message, status, isNew });
        },
        errorCallback: ({
          error,
          errorData: responseErrorParser,
          message,
          status,
          errors,
        }) => {
          oneTimeContributeError({
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

  const updateOneTimePayment = (paymentInfo, mission) => {
    const payload = {
      mission,
      client_secret: paymentInfo.client_secret,
      is_anonymous: false,
    };
    UPDATE_ONE_TIME_PAYMENT_API_CALL({
      request: { payload },
      // callback: {
      //   successCallback: ({ res, data, message, status }) => {
      //     oneTimeContributeSuccess({ res, data, message, status });
      //   },
      //   errorCallback: ({
      //     error,
      //     errorData: responseErrorParser,
      //     message,
      //     status,
      //     errors,
      //   }) => {
      //     oneTimeContributeError({
      //       error,
      //       responseErrorParser,
      //       message,
      //       status,
      //       errors,
      //     });
      //   },
      // },
    });
  };

  const oneTimeContribution = useMemo(
    () => getData(CREATE_ONE_TIME_CONTRIBUTION_API, {}, false),
    [CREATE_ONE_TIME_CONTRIBUTION_API],
  );

  return {
    amount: {
      value: amount,
      onChange: onChangeAmount,
      onClear: onClearAmount,
      error: amountError,
      onBlur: onBlurAmount,
    },
    oneTimeContribution: {
      onOneTimeSubmit: handelOneTimePayment,
      loader: oneTimeContribution.loader,
      data: oneTimeContribution.data,
      validatePayment,
    },
    updateOneTimePayment,
  };
};

// Helpers
function getPlatformBasedFieldValue(e) {
  return typeof e === 'object' ? e.target.value : e;
}

function validate(value, fieldTitle) {
  switch (fieldTitle) {
    case 'amount': {
      if (!value) return 'Please enter the amount';
      if (value && +value < 0.5)
        return 'Amount must be greater than or equal to 0.5$';
      return '';
    }
    default:
      return '';
  }
}
