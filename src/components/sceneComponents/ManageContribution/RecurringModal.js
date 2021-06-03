import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import SwitchToggle from '@dooboo-ui/native-switch-toggle';
import Button from '../../common/button';
import Tabs from '../../common/tabs';
import { wp } from '../../../utils/Dimensions';
import { colors, typography, Custompadding } from '../../../styles/styleSheet';
import { GetIcon } from '../../../utils/Icons';
import { currency } from '../../../app/shared/utils/config';
import { useRecurringContributionHooks } from '../../../app/shared/hooks';

const getDateFromTimeStamp = (subs) => {
  let date = null;
  if (subs.interval === 'month') {
    date = moment.unix(subs.subscription.start_date).format();
  } else if (subs.interval === 'week') {
    date = moment.unix(subs.subscription.start_date).format('d');
  }
  return date;
};

const tabItems = [
  {
    value: 'monthly',
    key: 'month',
  },
  {
    value: 'weekly',
    key: 'week',
  },
];
const weekConfig = [
  { label: 'sunday', key: 0 },
  { label: 'monday', key: 1 },
  { label: 'tuesday', key: 2 },
  { label: 'Wednesday', key: 3 },
  { label: 'Thursday', key: 4 },
  { label: 'Friday', key: 5 },
  { label: 'Saturday', key: 6 },
];
const RecurringModal = (props) => {
  const amountRef = useRef(null);
  const [activeTab, setActiveTab] = useState(tabItems[0].key);
  const [disableFields, setDisableFields] = useState(false);
  const [initialDate, setInitialDate] = useState(new Date());
  const {
    cards,
    closeContributionModal,
    navigation,
    cardLoader,
    missionId,
    backCallback,
    activeSubscription,
    cancelSubscriptionCB,
    // errorToast,
  } = props;

  useEffect(() => {
    const subId =
      activeSubscription &&
      activeSubscription.subscription &&
      activeSubscription.subscription.id;
    if (subId) {
      const tab = tabItems.find(
        (tabData) => tabData.key === activeSubscription.interval,
      );
      if (tab.key) setActiveTab(tab.key);
      setDisableFields(true);
      setInitialDate(getDateFromTimeStamp(activeSubscription));
    }
  }, [activeSubscription]);

  const {
    amount,
    onTabChange,
    dayError,
    month: { onDateSelect, selectedDate },
    day: { onDaySelect, selectedDay },
    recurringContribution: {
      // onSubscriptionSubmit,
      loader: subscriptionLoader,
      validatePayment,
      getCurrentTabTimeStamp,
    },
    cancelSubscribtion: { loader: cancelSubscriptionLoader, onCancel },
  } = useRecurringContributionHooks(props, {
    onRecurringContributeSuccess,
    onRecurringContributeError,
    onCancelSubscriptionSuccess,
    onCancelSubscriptionError,
    missionId,
    activeSubscription,
  });

  function onRecurringContributeSuccess({ data: { data } }) {
    navigation.navigate('CustomCardScreen', {
      paymentInfo: data,
      missionId,
    });
  }

  function onRecurringContributeError() {}

  function onCancelSubscriptionSuccess() {
    cancelSubscriptionCB();
  }

  function onCancelSubscriptionError() {
    alert('Something went wrong');
  }

  const handleTabClick = (clickedTab) => {
    setActiveTab(clickedTab.key);
    if (Keyboard) Keyboard.dismiss();
    onTabChange();
  };
  const handleDateSelect = (clickedDay) => {
    onDateSelect(clickedDay);
    if (amountRef.current) amountRef.current.focus();
  };
  const handleDaySelect = (clickedDay) => {
    if (amountRef.current) amountRef.current.focus();
    onDaySelect(clickedDay);
  };

  const getDisabledDate = (current) =>
    current && current.isBefore(moment().subtract(1, 'days'));

  const handleScheduleContribution = () => {
    const isError = validatePayment(activeTab);
    if (!isError) {
      closeContributionModal();
      const timeStamp = getCurrentTabTimeStamp(
        activeTab,
        activeTab === 'month' ? selectedDate : selectedDay.key,
      );
      const customPayload = {
        interval: activeTab,
        interval_count: 6,
        billing_cycle_anchor: timeStamp,
        currency,
      };
      if (cards && cards.data && cards.data.length) {
        navigation.navigate('CardList', {
          type: 'recurring',
          amount: amount.value,
          missionId,
          customPayload,
          subscriptionType: activeTab,
        });
      } else {
        const recurringPayload = {
          ...customPayload,
          mission: missionId,
          unit_amount: amount.value,
        };
        navigation.navigate('RecurringPayment', {
          recurringPayload,
          missionId,
        });
      }
    }
  };

  const handleCancelSubsription = () => {
    const subId =
      activeSubscription &&
      activeSubscription.subscription &&
      activeSubscription.subscription.id;
    onCancel(subId);
  };
  const [switchOn, setSwitchOn] = useState(false);

  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <TouchableOpacity onPress={backCallback}>
          {GetIcon('chevron-left|FontAwesome5', colors.black, wp(6))}
        </TouchableOpacity>
        <Title
          style={[
            typography.bold.h4,
            {
              marginBottom: wp(2),
              textTransform: 'capitalize',
              textAlign: 'center',
              marginLeft: wp(12),
            },
          ]}
        >
          recurring
        </Title>
      </View>
      <Tabs
        details={tabItems}
        activeTab={activeTab}
        onTabClick={!disableFields ? handleTabClick : null}
      />
      <View
        style={{
          marginVertical: wp(4),
        }}
      >
        {activeTab === 'month' ? (
          <CalendarPicker
            startFromMonday
            previousTitle={
              !disableFields ? (
                <Text>
                  {GetIcon('chevron-left|Feather', colors.black, wp(6))}
                </Text>
              ) : null
            }
            nextTitle={
              !disableFields ? (
                <Text>
                  {GetIcon('chevron-right|Feather', colors.black, wp(6))}
                </Text>
              ) : null
            }
            todayBackgroundColor="#fff"
            todayTextStyle={{
              color: moment().isSame(selectedDate || initialDate, 'day')
                ? '#05C976'
                : colors.black,
            }}
            selectedDayTextColor="#05C976"
            selectedDayStyle={{
              backgroundColor: colors.white,
            }}
            disabledDatesTextStyle={{ color: '#AAAAAA' }}
            dayLabelsWrapper={{
              borderTopWidth: 0,
              borderBottomWidth: 0,
              paddingTop: wp(4),
              paddingBottom: wp(4),
            }}
            weekdays={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
            disabledDates={!disableFields ? getDisabledDate : null}
            onDateChange={handleDateSelect}
            enableDateChange={!disableFields}
            initialDate={initialDate}
            selectedStartDate={initialDate}
          />
        ) : (
          <View>
            {!disableFields && (
              <Text
                style={[
                  typography.regular.h4,
                  { textAlign: 'center', marginBottom: wp(6.66) },
                ]}
              >
                Select which day of the week
              </Text>
            )}
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              {weekConfig.map((day) => (
                <TouchableOpacity
                  style={[
                    Custompadding.paddingTopBottomLarge,
                    {
                      borderWidth:
                        selectedDay && selectedDay.key === day.key ? 2 : 1,
                      borderColor:
                        selectedDay && selectedDay.key === day.key
                          ? colors.GREEN.C1
                          : colors.GREYS.C11,
                      borderRadius: 20,
                      width: wp(38),
                      marginHorizontal: wp(2.66),
                      marginBottom: wp(5.33),
                    },
                  ]}
                  onPress={!disableFields ? () => handleDaySelect(day) : null}
                >
                  <Text
                    style={[
                      selectedDay && selectedDay.key === day.key
                        ? typography.bold.h6
                        : typography.regular.h6,
                      {
                        textAlign: 'center',
                        textTransform: 'capitalize',
                        color:
                          selectedDay && selectedDay.key === day.key
                            ? colors.GREEN.C1
                            : colors.black,
                      },
                    ]}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
      <View
        style={[
          Custompadding.paddingTopBottomRegular,
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomColor: 'rgba(112,112,112,0.3)',
            borderTopColor: 'rgba(112,112,112,0.3)',
            borderTopWidth: 1,
            borderBottomWidth: 1,
          },
        ]}
      >
        <Text style={[typography.regular.h6, { textTransform: 'capitalize' }]}>
          amount
        </Text>
        <View
          style={{
            marginHorizontal: wp(2.06),
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: wp(4.26),
              fontFamily: 'Bariol-Bold',
              color: colors.GREEN.C1,
            }}
          >
            $
          </Text>
          <TextInput
            editable={!disableFields}
            placeholderTextColor={amount.error ? colors.error : colors.GREEN.C1}
            placeholder={amount.value ? `${amount.value}` : '0'}
            selectionColor={colors.black}
            style={{
              fontSize: wp(4.26),
              // lineHeight: wp(5.33),
              // alignSelf: 'flex-start',
              fontFamily: 'Bariol-Bold',
              color: colors.GREEN.C1,
              paddingHorizontal: wp(0.5),
              // width: 'auto',
              // backgroundColor: 'red'
            }}
            onChangeText={amount.onChange}
            onBlur={amount.onBlur}
            value={amount.value}
            defaultValue={amount.value}
            errorText={amount.error}
            keyboardType="numeric"
            ref={amountRef}
            returnKeyType="done"
            // onSubmitEditing={() => {
            //   if (Keyboard) Keyboard.dismiss();
            //   if (!cardLoader || !subscriptionLoader)
            //     handleScheduleContribution();
            // }}
          />
        </View>
      </View>
      {amount.error ? (
        <Text
          style={[
            typography.bold.h6,
            { color: colors.error, marginTop: wp(4), textAlign: 'center' },
          ]}
        >
          {amount.error}
        </Text>
      ) : null}
      {dayError ? (
        <Text
          style={[
            typography.bold.h6,
            { color: colors.error, marginTop: wp(4), textAlign: 'center' },
          ]}
        >
          {dayError}
        </Text>
      ) : null}
      <View style={{ marginTop: wp(4) }}>
        {activeSubscription && Object.keys(activeSubscription).length ? (
          <Button
            title={
              cancelSubscriptionLoader ? 'Cancelling' : 'Cancel Subscription'
            }
            width={wp(88)}
            callback={handleCancelSubsription}
            disable={cancelSubscriptionLoader}
            type="danger"
          />
        ) : (
          <Button
            width={wp(88)}
            title={
              subscriptionLoader || cardLoader
                ? 'Processing '
                : 'schedule contribution'
            }
            disable={subscriptionLoader || cardLoader}
            callback={handleScheduleContribution}
          />
        )}
      </View>
      <TouchableOpacity
        style={[
          Custompadding.paddingTopLarge,
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
          },
        ]}
      >
        <Text style={[typography.bold.h5, { textTransform: 'capitalize' }]}>
          anonymously
        </Text>
        <SwitchToggle
          containerStyle={{
            width: wp(12.26),
            height: wp(7.2),
            borderRadius: 25,
            backgroundColor: '#ccc',
            padding: 1,
          }}
          circleStyle={{
            width: wp(6.66),
            height: wp(6.66),
            borderRadius: 19,
            backgroundColor: 'white',
          }}
          switchOn={switchOn}
          onPress={() => setSwitchOn(!switchOn)}
          backgroundColorOn="#00C470"
          circleColorOff="white"
          circleColorOn="white"
          duration={500}
        />
      </TouchableOpacity>
      {/* <Text
        numberOfLines={3}
        style={[typography.regular.h8, Custompadding.paddingTopBottomSmall]}
      >
        $5 minimum. If you select a day that doesn’t happen every month, like
        the 31st in January, then the payment would go through on the first of
        the following month.
      </Text> */}
    </>
  );
};
RecurringModal.propTypes = {
  // closeCallback: PropTypes.func,
  backCallback: PropTypes.func,
  missionId: PropTypes.number,
  closeContributionModal: PropTypes.func,
  cancelSubscriptionCB: PropTypes.func,
  // errorToast: PropTypes.func,
  cards: PropTypes.array,
  cardLoader: PropTypes.bool,
  navigation: PropTypes.object,
  activeSubscription: PropTypes.object,
};
export default RecurringModal;
const Title = styled.Text``;
