import { useMemo, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export const useBankAccountHook = (
  {
    Dash_hoc: {
      actions: { GET_BANK_ACCOUNT_API_CALL, ADD_EDIT_BANK_ACCOUNT_API_CALL },
    },
    Dash_data: {
      GET_BANK_ACCOUNT_API,
      ADD_EDIT_BANK_ACCOUNT_API,
      userProfile = {},
    },
    getData,
  },
  { onUpdateBankAccountError = null, onUpdateBankAccountSuccess = null } = {},
) => {
  const [name, setName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [bankName, setBankName] = useState('');
  const [comments, setComments] = useState('');
  const [routing, setRouteName] = useState('');
  const [venmo, setVenmo] = useState('');
  const [paypal, setPaypal] = useState('');
  const [cashapp, setCashapp] = useState('');
  const [nameError, setNameError] = useState('');
  const [accountNoError, setAccountNoError] = useState('');
  const [bankNameError, setBankNameError] = useState('');
  const [routeError, setRouteError] = useState('');
  const [venmoError, setVenmoError] = useState('');
  const [cashappError, setCashappError] = useState('');
  const [paypalError, setPayPalError] = useState('');

  const getBankAccountDetail = (userId) => {
    const query = {
      user: userId,
    };
    GET_BANK_ACCOUNT_API_CALL({
      request: {
        query,
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (userProfile && userProfile.id) {
        getBankAccountDetail(userProfile.id);
      }
    }, [userProfile]),
  );

  const onChangeName = (e) => {
    const value = getPlatformBasedFieldValue(e);
    if (nameError) {
      setNameError('');
    }
    setName(value);
  };

  const onBlurName = useCallback(
    (e) => {
      e.preventDefault();
      const error = validate(name, 'name');
      if (error) setNameError(error);
    },
    [name],
  );

  const onChangeAccountNo = (e) => {
    const value = getPlatformBasedFieldValue(e);
    if (accountNoError) {
      setAccountNoError('');
    }
    if (Number(value) === 0 || Number(value)) setAccountNo(value);
  };

  const onBlurAccountNo = useCallback(
    (e) => {
      e.preventDefault();
      const error = validate(accountNo, 'accountNo');
      if (error) setAccountNoError(error);
    },
    [accountNo],
  );

  const onChangeBankName = (e) => {
    const value = getPlatformBasedFieldValue(e);
    if (bankNameError) {
      setBankNameError('');
    }
    setBankName(value);
  };

  const onChangeRouting = (e) => {
    const value = getPlatformBasedFieldValue(e);
    if (routeError) {
      setRouteError('');
    }
    setRouteName(value);
  };

  const onChangeVenmo = (e) => {
    const value = getPlatformBasedFieldValue(e);
    if (venmoError) {
      setVenmoError('');
    }
    setVenmo(value);
  };

  const onChangeCashapp = (e) => {
    const value = getPlatformBasedFieldValue(e);
    if (cashappError) {
      setCashappError('');
    }
    setCashapp(value);
  };

  const onChangePaypal = (e) => {
    const value = getPlatformBasedFieldValue(e);
    if (paypalError) {
      setPayPalError('');
    }
    setPaypal(value);
  };

  const onBlurBankName = useCallback(
    (e) => {
      e.preventDefault();
      const error = validate(bankName, 'bankName');
      if (error) setBankNameError(error);
    },
    [bankName],
  );

  const onChangeComments = (e) => {
    const value = getPlatformBasedFieldValue(e);
    setComments(value);
  };

  // const onBlurComments = useCallback(
  //   (e) => {
  //     e.preventDefault();
  //     const error = validate(bankName, 'bankName');
  //     if (error) setBankNameError(error);
  //   },
  //   [bankName],
  // );

  const handleAddUpdateBankAccount = ({ isTransfer = true }) => {
    const payload = {
      user: userProfile && userProfile.id,
      holder_name: name,
      account_number: accountNo,
      bank_name: bankName,
      address: comments,
      routing,
      venmo,
      paypal,
      cashapp,
    };
    if (name.trim().length !== 0 || bankName.trim().length !== 0 || 
    accountNo.trim().length !== 0 || comments.trim().length !== 0 || routing.trim().length !== 0  || venmo.trim().length !== 0  || paypal.trim().length !== 0 || cashapp.trim().length !== 0) {
      ADD_EDIT_BANK_ACCOUNT_API_CALL({
        request: {
          payload,
        },
        callback: {
          successCallback: ({ res, data, message, status }) => {
            onUpdateBankAccountSuccess({
              res,
              data,
              message,
              status,
              isTransfer,
            });
            if (!isTransfer)
              getBankAccountDetail(userProfile && userProfile.id);
          },
          errorCallback: ({
            error,
            errorData: responseErrorParser,
            message,
            status,
            errors,
          }) => {
            onUpdateBankAccountError({
              error,
              responseErrorParser,
              message,
              status,
              errors,
              isTransfer,
            });
          },
        },
      });
    }else{
      onUpdateBankAccountError({
        message: 'Please fill atlease one field value.'
      });
    }
  };

  const bankAccounts = useMemo(() => {
    const accountInfo = getData(GET_BANK_ACCOUNT_API, [], true);
    if (accountInfo.data && accountInfo.data.length) {
      const accountData = accountInfo.data[accountInfo.data.length - 1];
      setName(accountData.holder_name);
      setAccountNo(accountData.account_number);
      setBankName(accountData.bank_name);
      setComments(accountData.address);
      setRouteName(accountData.routing);
      setVenmo(accountData.venmo);
      setPaypal(accountData.paypal);
      setCashapp(accountData.cashapp);
    }
    return accountInfo;
  }, [GET_BANK_ACCOUNT_API]);

  const updateBankAccount = useMemo(() => {
    const payoutInfo = getData(ADD_EDIT_BANK_ACCOUNT_API, {}, false);
    return payoutInfo;
  }, [ADD_EDIT_BANK_ACCOUNT_API]);

  return {
    bankAccounts: {
      data: bankAccounts.data,
      loader: bankAccounts.loader,
      lastUpdated: bankAccounts.lastUpdated,
    },
    updateBankAccount: {
      loader: updateBankAccount.loader,
      onUpdate: handleAddUpdateBankAccount,
    },
    name: {
      value: name,
      onChange: onChangeName,
      onBlur: onBlurName,
      error: nameError,
    },
    accountNo: {
      value: accountNo,
      onChange: onChangeAccountNo,
      error: accountNoError,
      onBlur: onBlurAccountNo,
    },
    bankName: {
      value: bankName,
      onChange: onChangeBankName,
      error: bankNameError,
      onBlur: onBlurBankName,
    },
    routing: {
      value: routing,
      onChange: onChangeRouting,
      error: routeError,
      // onBlur: onBlurRouteName,
    },
    paypal: {
      value: paypal,
      onChange: onChangePaypal,
      error: paypalError,
    },
    venmo: {
      value: venmo,
      onChange: onChangeVenmo,
      error: venmoError,
    },
    cashapp: {
      value: cashapp,
      onChange: onChangeCashapp,
      error: cashappError,
    },
    comments: {
      value: comments,
      onChange: onChangeComments,
      // onBlur: onBlurComments,
    },
  };
};

function getPlatformBasedFieldValue(e) {
  return typeof e === 'object' ? e.target.value : e;
}

function validate(value, fieldName) {
  switch (fieldName) {
    case 'name': {
      if (!value) return 'Please enter account holder name';
      return '';
    }
    default:
      if (!value) return 'This field is required';
      return '';
  }
}
