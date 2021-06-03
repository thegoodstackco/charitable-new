/* eslint-disable indent */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Text, View, TouchableOpacity, Platform } from 'react-native';
import moment from 'moment';
// import Button from '../../common/button';
import Loader from '../../common/Loader';
import CustomModal from '../../common/modal';
import { wp } from '../../../utils/Dimensions';
import { colors, typography, Custompadding } from '../../../styles/styleSheet';
import { GetIcon } from '../../../utils/Icons';
import OneTimeContribution from './OneTimeContribution';
import RoundUpContribution from './RoundUpContribution';
import RecurringModal from './RecurringModal';
import ConfirmationModal from '../../common/ConfirmationModal';
import {
  useOneTimeContributionHooks,
  useCardListHook,
  useRoundOffContributionHook,
  useUserContributionHook,
  useRoundOffAccountsHook,
} from '../../../app/shared/hooks';

// const getNumberWithOrdinal = (n) => {
//   const s = ['th', 'st', 'nd', 'rd'];
//   const v = n % 100;
//   return n + (s[(v - 20) % 10] || s[v] || s[0]);
// };

const getDateFromTimeStamp = (subs) => {
  let date = null;
  if (subs.interval === 'month') {
    date = moment.unix(subs.subscription.billing_cycle_anchor).format('Do');
  } else if (subs.interval === 'week') {
    date = moment.unix(subs.subscription.billing_cycle_anchor).format('dddd');
  }
  return date;
};

const ContributionModal = (props) => {
  const {
    userContributions,
    initialContribution,
    missionDetail,
    closeCallback,
    navigation,
    isVisible,
    cancelSubscriptionCB,
    // cancelRoundOffCB
    successToast,
    errorToast,
  } = props;

  const [paymentMethod, setPaymentMethod] = useState(initialContribution);
  const [confirmedMethod, setConfirmedMethod] = useState('');
  const [showClose, setShowClose] = useState(false);
  // const [error, setError] = useState('');
  const [activeSubscription, setActiveSubscription] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [activeRoundOff, setActiveRoundOff] = useState(null);

  useEffect(() => {
    setPaymentMethod(initialContribution);
  }, [initialContribution]);

  useEffect(() => {
    if (
      userContributions &&
      userContributions.subscriptions &&
      userContributions.subscriptions.length
    ) {
      let subsDate = null;
      const userSubscriptionCopy = userContributions.subscriptions;
      const activeSub = userSubscriptionCopy.find(
        (subs) => subs.subscription && subs.subscription.status === 'active',
      );
      // const activeSub = userSubscriptionCopy.find(
      //   (subs) =>
      //     subs.interval === 'week' &&
      //     subs.subscription &&
      //     subs.subscription.status === 'active',
      // );
      if (activeSub) {
        subsDate = `Every ${getDateFromTimeStamp(activeSub)}`;
        setActiveSubscription(activeSub);
        const paymentCopy = [...paymentMethod];
        const selectedItems = paymentCopy.map((data) => ({
          ...data,
          isSelected: data.key === 'recurring' || data.isSelected,
          subtitle: data.key === 'recurring' ? subsDate : null,
        }));
        setPaymentMethod(selectedItems);
      }
    }
    if (
      userContributions &&
      userContributions.roundoffs &&
      userContributions.roundoffs.is_active
    ) {
      const paymentCopy = [...paymentMethod];
      const selectedItems = paymentCopy.map((data) => ({
        ...data,
        isSelected: data.key === 'round_ups' || data.isSelected,
      }));
      setPaymentMethod(selectedItems);

      setActiveRoundOff(userContributions.roundoffs.is_active);
    }
  }, [userContributions]);

  const { amount, oneTimeContribution } = useOneTimeContributionHooks(props, {
    oneTimeContributeSuccess,
    oneTimeContributeError,
    missionId: missionDetail.id,
  });

  const {
    cardList: { data: cards, loader: cardLoader },
  } = useCardListHook(props, {});

  const {
    contributions: { loader: userContributionsLoader },
    userMissions: { getAllMissionContribtion },
  } = useUserContributionHook(props);

  const {
    plaidLinkToken: { loader: plaidLoader, getPlaidToken, data: linkToken },
    plaidExchangeToken: { onPlaidExchangeToken, loader: plaidExchangeLoader },
  } = useRoundOffContributionHook(props, {
    onPlaidLinkTokenSuccess,
    onPlaidLinkTokenError,
    onPlaidExchangeTokenSuccess,
    onPlaidExchangeTokenError,
    missionId: missionDetail.id,
  });

  function oneTimeContributeSuccess({ data: { data } }) {
    closePaymentMethod();
    closeCallback();
    navigation.navigate('CustomCardScreen', {
      paymentInfo: data,
      missionId: missionDetail.id,
    });
  }
  function oneTimeContributeError() {}

  function onPlaidExchangeTokenSuccess({ data: { data: plaidData } }) {
    closeContributionModal();
    let depositoryAccounts = [];
    if (
      plaidData.available_accounts &&
      plaidData.available_accounts.accounts &&
      plaidData.available_accounts.accounts.length
    ) {
      depositoryAccounts = plaidData.available_accounts.accounts.filter(
        (acc) => acc.type === 'depository',
      );
    }
    navigation.navigate('PlaidAccounts', {
      accounts: depositoryAccounts,
      itemId: plaidData.id,
    });
    // successToast('Bank Account Linked Succesfuuly');
  }

  function onPlaidExchangeTokenError() {
    closeContributionModal();
    errorToast('Something went wrong');
  }

  function onPlaidLinkTokenSuccess({ selectedKey }) {
    setConfirmedMethod(selectedKey);
    setShowClose(true);
    // closeCallback();
  }

  function onPlaidLinkTokenError() {}

  const {
    roundOffAccounts: {
      data: roundOffAccounts,
      loader: roundOffAccountsLoader,
    },
    deleteAccount: { loader: deleteLoader, onDelete },
  } = useRoundOffAccountsHook(props, {
    onRemoveAccountSuccess,
    onRemoveAccountError,
    onGetRoundOffSuccess,
  });

  function onGetRoundOffSuccess() {
    // setConfirmedMethod('cancel_round_up');
  }
  function onRemoveAccountError() {
    errorToast('Something went wrong!');
  }

  // const handleItemSelect = (payment) => {
  //   // For Multi Select
  //   // const paymentCopy = [...paymentMethod];
  //   // const selectedItems = paymentCopy.find((d) => d.key === payment.key);
  //   // selectedItems.isSelected = !payment.isSelected;
  //   // setPaymentMethod(paymentCopy);
  //   // For Single Select
  //   setError('');
  //   const paymentCopy = [...paymentMethod];
  //   const selectedItems = paymentCopy.map((data) => ({
  //     ...data,
  //     // isSelected: data.key === payment.key ? !payment.isSelected : false,
  //     isSelected: data.key === payment.key || data.isSelected,
  //   }));
  //   setPaymentMethod(selectedItems);
  //   // handleNext(selectedItems);
  //   handleNext(payment);
  // };

  const handleNext = (selectedItem = {}) => {
    // const selectedItem = selectedMethod.find((d) => d.isSelected === true);
    if (selectedItem) {
      if (selectedItem.key === 'round_ups') {
        if (!activeRoundOff) {
          getPlaidToken(selectedItem.key);
        } else {
          setConfirmedMethod('cancel_round_up');
          // getAccounts();
        }
      } else {
        setConfirmedMethod(selectedItem.key);
        setShowClose(true);
      }
    }
    // else {
    //   setError('Select a payment method');
    //   successToast('Select a payment method');
    // }
  };

  const closePaymentMethod = () => {
    setConfirmedMethod('');
    setShowClose(false);
    // setPaymentMethod(initialContribution);
    // setActiveSubscription(null);
    // setActiveRoundOff(null);
  };

  const closeContributionModal = () => {
    closeCallback();
    closePaymentMethod();
  };

  const handlePlaidSuccess = (data) => {
    // eslint-disable-next-line no-console
    console.log(data, 'plaid data');
    const accounts = [];
    let institutionId = '';
    let institutionName = '';

    if (Platform.OS === 'ios') {
      data.accounts.map((account) => accounts.push(account.id));
      institutionId = data.institution && data.institution.institution_id;
      institutionName = data.institution && data.institution.name;
    } else {
      data.metadata.accounts.map((account) =>
        accounts.push(account.account_id),
      );
      institutionId = data.metadata.institution_id;
      institutionName = data.metadata.institution_name;
    }
    const payload = {
      mission: missionDetail.id,
      public_token: data.public_token,
      accounts,
      institution_id: institutionId,
      institution_name: institutionName,
      default_account: accounts[0],
      is_anonymous: false,
    };
    onPlaidExchangeToken({ payload });
  };

  const handlePlaidExit = (data) => {
    // eslint-disable-next-line no-console
    console.log(data, 'exit');
    // if (!data.status) {
    closeContributionModal();
    // } else {
    //   alert(JSON.stringify(data));
    // }
  };

  const handleDeleteRoundOff = () => {
    if (roundOffAccounts.length) onDelete(roundOffAccounts[0]);
  };

  function onRemoveAccountSuccess() {
    getAllMissionContribtion();
    setConfirmedMethod(false);
    successToast('Roundups Deleted Successfully');
    setShowClose(false);
    closeContributionModal();
    closePaymentMethod();
    // handleDeleteModal('close');
  }

  return (
    <>
      <CustomModal
        visible={isVisible}
        closeCallback={closeContributionModal}
        noClose={showClose}
      >
        {confirmedMethod === 'one_time_donation' ? (
          <OneTimeContribution
            backCallback={closePaymentMethod}
            oneTimeContribution={oneTimeContribution}
            closeContributionModal={closeContributionModal}
            amount={amount}
            cards={cards}
            cardLoader={cardLoader}
            missionId={missionDetail.id}
          />
        ) : confirmedMethod === 'cancel_round_up' ? (
          <ConfirmationModal
            customText="Are you sure you want to delete the Roundup for this mission? "
            confirmText={deleteLoader ? 'deleting' : 'Yes, delete'}
            onConfirm={!deleteLoader ? handleDeleteRoundOff : null}
            onClose={closeContributionModal}
          />
        ) : confirmedMethod === 'recurring' ? (
          <RecurringModal
            backCallback={closePaymentMethod}
            cards={cards}
            cardLoader={cardLoader}
            missionId={missionDetail.id}
            closeContributionModal={closeContributionModal}
            activeSubscription={activeSubscription}
            cancelSubscriptionCB={cancelSubscriptionCB}
            {...props}
          />
        ) : confirmedMethod === 'round_ups' &&
          !plaidLoader &&
          !plaidExchangeLoader ? (
          <RoundUpContribution
            backCallback={closePaymentMethod}
            linkToken={linkToken ? linkToken.link_token : null}
            onPlaidSuccess={handlePlaidSuccess}
            onPlaidExit={handlePlaidExit}
          />
        ) : (
          <>
            <ModalHeader style={{ marginBottom: wp(12) }}>
              <Title style={[typography.bold.h4, { marginBottom: wp(2) }]}>
                {`Contribute to the ${missionDetail.title}`}
              </Title>
              {/* <Subtitle style={[typography.regular.h6]}>
                Select one or more ways to give
              </Subtitle> */}
            </ModalHeader>
            {roundOffAccountsLoader ||
            plaidExchangeLoader ||
            plaidLoader ||
            userContributionsLoader ? (
              <Loader />
            ) : (
              <>
                {paymentMethod.map((payment) => (
                  <ModalBody
                    // onPress={() => {
                    // handleItemSelect(payment);
                    //   /*eslint-disable */
                    //   // payment.key === 'one_time_donation'
                    //   //   ? setOneTimeContriModal(true)
                    //   //   : payment.key === 'recurring'
                    //   //   ? setRecurringModal(true)
                    //   //   : payment.key === 'round_ups'
                    //   //   ? navigation.navigate('RoundUps')
                    //   //   : closeCallback();
                    // }}
                    onPress={() => handleNext(payment)}
                    style={[
                      Custompadding.paddingLeftRightLarge,
                      Custompadding.paddingTopBottomRegular,
                      {
                        marginBottom: wp(2.64),
                        borderColor: payment.isSelected
                          ? colors.background
                          : 'transparent',
                        backgroundColor: colors.white,
                        borderWidth: 2,
                        borderRadius: 300,
                        shadowColor: '#9b9b9b',
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 10,
                      },
                    ]}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                        style={{
                          height: wp(8),
                          width: wp(8),
                          backgroundColor: payment.isSelected
                            ? colors.GREEN.C1
                            : colors.background,
                          borderWidth: 3,
                          borderColor: colors.GREYS.C7,
                          borderRadius: 100,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: wp(6.66),
                        }}
                        onPress={() => {
                          // handleItemSelect(payment);
                          handleNext(payment);
                        }}
                      >
                        {payment.isSelected && (
                          <Text>
                            {GetIcon('check|FontAwesome5', colors.white, wp(4))}
                          </Text>
                        )}
                      </TouchableOpacity>

                      <View>
                        <Text
                          style={[
                            payment.isSelected
                              ? typography.bold.h6
                              : typography.regular.h6,
                            { textTransform: 'capitalize' },
                          ]}
                        >
                          {payment.name}
                        </Text>
                        {payment.subtitle && (
                          <Text style={[typography.regular.h8]}>
                            {payment.subtitle}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View>
                      {GetIcon(
                        'chevron-right|FontAwesome5',
                        colors.GREYS.C8,
                        wp(4),
                      )}
                    </View>
                  </ModalBody>
                ))}
                {/* {error ? (
                  <Text
                    style={[typography.regular.h6, { color: colors.error }]}
                  >
                    {error}
                  </Text>
                ) : null} */}
                <Text
                  numberOfLines={3}
                  style={[
                    typography.regular.h8,
                    Custompadding.paddingTopBottomSmall,
                  ]}
                >
                  {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum. */}
                </Text>
              </>
            )}
          </>
        )}
      </CustomModal>
    </>
  );
};

ContributionModal.propTypes = {
  navigation: PropTypes.object,
  missionDetail: PropTypes.object,
  userContributions: PropTypes.object,
  navigate: PropTypes.func,
  closeCallback: PropTypes.func,
  onNextClick: PropTypes.func,
  cancelSubscriptionCB: PropTypes.func,
  successToast: PropTypes.func,
  errorToast: PropTypes.func,
  isVisible: PropTypes.bool,
  initialContribution: PropTypes.array,
};
export default ContributionModal;

const ModalHeader = styled.View`
  justify-content: center;
  align-items: center;
`;
const Title = styled.Text``;
// const Subtitle = styled.Text``;
const ModalBody = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
