import { useState, useCallback, useMemo, useEffect } from 'react';
import moment from 'moment';
import { currency } from '../../utils/config';

const getTimeStamp = (selectedDay) => {
  const currentDay = moment().isoWeekday();
  let selectedDaysDate = '';
  if (+currentDay <= +selectedDay) {
    selectedDaysDate = moment().isoWeekday(selectedDay);
  } else {
    selectedDaysDate = moment().add(1, 'weeks').isoWeekday(selectedDay);
  }
  return moment(selectedDaysDate).unix();
};

const getDateFromTimeStamp = (subs) => {
  let date = null;
  if (subs.interval === 'month') {
    date = moment.unix(subs.subscription.start_date).format();
  } else if (subs.interval === 'week') {
    const key = moment.unix(subs.subscription.start_date).format('d');
    const label = moment.unix(subs.subscription.start_date).format('dddd');
    date = { key: +key, label };
  }
  return date;
};

export const useRecurringContributionHooks = (
  {
    Dash_hoc: {
      actions: {
        CREATE_RECURRING_CONTRIBUTION_API_CALL,
        CANCEL_RECURRING_CONTRIBUTION_API_CALL,
        UPDATE_ONE_TIME_PAYMENT_API_CALL,
      },
    },
    Dash_data: {
      CREATE_RECURRING_CONTRIBUTION_API,
      CANCEL_RECURRING_CONTRIBUTION_API,
    },
    getData,
  },
  {
    missionId = null,
    onRecurringContributeSuccess = null,
    onRecurringContributeError = null,
    onCancelSubscriptionSuccess = null,
    onCancelSubscriptionError = null,
    activeSubscription = null,
  },
) => {
  const [amount, setAmount] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayError, setDayError] = useState('');
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    const subId =
      activeSubscription &&
      activeSubscription.subscription &&
      activeSubscription.subscription.id;
    if (subId && activeSubscription && activeSubscription.interval === 'week') {
      setSelectedDay(getDateFromTimeStamp(activeSubscription));
    }
    if (subId && activeSubscription && activeSubscription.unit_amount) {
      setAmount(activeSubscription.unit_amount);
    }
  }, [activeSubscription]);

  const onChangeAmount = (e) => {
    const value = getPlatformBasedFieldValue(e);
    if (amountError) {
      setAmountError('');
    }
    if (Number(value) === 0 || Number(value)) setAmount(+value);
  };

  const onTabChange = () => {
    setAmountError();
    setSelectedDay(null);
    setSelectedDate('');
    setDayError('');
  };

  const onBlurAmount = useCallback(
    (e) => {
      e.preventDefault();
      const error = validate(amount, 'amount');
      if (error) setAmountError(error);
    },
    [amount],
  );

  const handleDateSelect = (clickedDay) => {
    setDayError('');
    setSelectedDate(clickedDay);
  };
  const handleDaySelect = (clickedDay) => {
    setDayError('');
    setSelectedDay(clickedDay);
  };

  const validatePayment = (activeTab) => {
    const formError = [];
    const isAmountError = validate(amount, 'amount');
    if (isAmountError) {
      formError.push(null);
      setAmountError(isAmountError);
    }
    if (activeTab === 'month' && !selectedDate) {
      formError.push(null);
      setDayError('Please select which date of the month');
    } else if (activeTab === 'week' && !selectedDay) {
      formError.push(null);
      setDayError('Please select which day of the week');
    }
    return formError.length;
  };

  const getCurrentTabTimeStamp = (activeTab, choosenDate) => {
    let timeStamp = '';
    if (activeTab === 'month') {
      // timeStamp = moment(selectedDate).toDate().getTime();
      timeStamp = moment(choosenDate).unix();
    } else {
      timeStamp = getTimeStamp(choosenDate);
    }
    return timeStamp;
  };

  const handelRecurringPayment = ({
    customPayload = null,
    isNew = false,
    activeTab,
  } = {}) => {
    let payload = {};
    if (customPayload) {
      payload = customPayload;
    } else {
      const timeStamp = getCurrentTabTimeStamp(
        activeTab,
        activeTab === 'month' ? selectedDate : selectedDay && selectedDay.key,
      );
      // if (activeTab === 'month') {
      //   // timeStamp = moment(selectedDate).toDate().getTime();
      //   timeStamp = moment(selectedDate).unix();
      // } else {
      //   timeStamp = getTimeStamp(selectedDay.key);
      // }
      payload = {
        // payment_method: 'card_1H0WhEAU5Ztqc65wWo4nx3xe',
        mission: missionId,
        currency,
        unit_amount: amount,
        interval: activeTab,
        interval_count: 6,
        billing_cycle_anchor: timeStamp,
      };
    }
    CREATE_RECURRING_CONTRIBUTION_API_CALL({
      request: { payload },
      callback: {
        successCallback: ({ res, data, message, status }) => {
          onRecurringContributeSuccess({ res, data, message, status, isNew });
        },
        errorCallback: ({
          error,
          errorData: responseErrorParser,
          message,
          status,
          errors,
        }) => {
          onRecurringContributeError({
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

  const updateRecurringPayment = (paymentInfo, mission) => {
    const payload = {
      mission,
      client_secret: paymentInfo.client_secret,
      is_anonymous: false,
    };
    UPDATE_ONE_TIME_PAYMENT_API_CALL({
      request: { payload },
    });
  };

  const handleCancelSubscription = (subscriptionId) => {
    const payload = {
      subscription_id: subscriptionId,
    };
    CANCEL_RECURRING_CONTRIBUTION_API_CALL({
      request: { payload },
      callback: {
        successCallback: ({ res, data, message, status }) => {
          onCancelSubscriptionSuccess({ res, data, message, status });
        },
        errorCallback: ({
          error,
          errorData: responseErrorParser,
          message,
          status,
          errors,
        }) => {
          onCancelSubscriptionError({
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

  const recurringContribution = useMemo(
    () => getData(CREATE_RECURRING_CONTRIBUTION_API, {}, false),
    [CREATE_RECURRING_CONTRIBUTION_API],
  );

  const cancelRecurringContribution = useMemo(
    () => getData(CANCEL_RECURRING_CONTRIBUTION_API, {}, false),
    [CANCEL_RECURRING_CONTRIBUTION_API],
  );

  return {
    amount: {
      value: amount,
      onChange: onChangeAmount,
      error: amountError,
      onBlur: onBlurAmount,
    },
    month: { onDateSelect: handleDateSelect, selectedDate },
    day: { onDaySelect: handleDaySelect, selectedDay },
    recurringContribution: {
      onSubscriptionSubmit: handelRecurringPayment,
      loader: recurringContribution.loader,
      data: recurringContribution.data,
      validatePayment,
      getCurrentTabTimeStamp,
    },
    cancelSubscribtion: {
      onCancel: handleCancelSubscription,
      data: cancelRecurringContribution.data,
      loader: cancelRecurringContribution.loader,
    },
    dayError,
    onTabChange,
    updateRecurringPayment,
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
      if (value && value < 5) return 'Amount should be more than 5$';
      return '';
    }
    default:
      return '';
  }
}
