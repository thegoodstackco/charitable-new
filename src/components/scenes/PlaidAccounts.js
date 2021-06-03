/* eslint-disable indent */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { wp } from '../../utils/Dimensions';
import { typography, colors, Custompadding } from '../../styles/styleSheet';
import Header from '../common/header';
import CustomModal from '../common/modal';
import ConfirmationModal from '../common/ConfirmationModal';
import EmptyState from '../common/EmptyState';
import { useRoundOffLinkAchAccountHook } from '../../app/shared/hooks';

const PlaidAccounts = (props) => {
  const {
    navigation,
    successToast,
    errorToast,
    route: { params: { accounts = '', itemId = null } = {} },
  } = props;
  const [selectedAccount, setSelectedAccount] = useState({});
  const [confirmationModal, setConfirmationModal] = useState(false);

  const {
    plaidLinkAch: { loader: achAccountLinkLoader, onLink },
  } = useRoundOffLinkAchAccountHook(props, {
    onPlaidLinkAchSuccess,
    onPlaidLinkAchError,
  });

  function onPlaidLinkAchSuccess() {
    successToast('Account Linked Successfully');
    handleLinkModal('close');
    navigation.navigate('Landing');
  }
  function onPlaidLinkAchError() {
    errorToast('Something went wrong!');
  }
  const handleAccountSelect = (card) => {
    setSelectedAccount(card);
    handleLinkModal('open');
  };

  const handleLinkModal = (actionType) => {
    switch (actionType) {
      case 'close':
        setConfirmationModal(false);
        setSelectedAccount(null);
        break;
      case 'open':
        setConfirmationModal(true);
        break;
      case 'confirm':
        onLink(selectedAccount, itemId);
        break;
      default:
    }
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <Container style={[Custompadding.paddingLarge]}>
        <Header
          heading="Link Account"
          backCallback={() => navigation.goBack()}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: wp(2.63) }}
        >
          {accounts && accounts.length ? (
            accounts.map((account) => (
              <TouchableOpacity
                style={[
                  Custompadding.paddingTopBottomSmall,
                  Custompadding.paddingLeftRightXLarge,
                  {
                    borderColor:
                      selectedAccount &&
                      selectedAccount.account_id === account.account_id
                        ? colors.GREEN.C2
                        : colors.GREYS.C11,
                    borderWidth:
                      selectedAccount &&
                      selectedAccount.account_id === account.account_id
                        ? 2
                        : 1,
                    borderRadius: 22,
                    marginBottom: wp(5.33),
                    // backgroundColor: category.itemSelected
                    //   ? colors.background
                    //   : colors.white,
                  },
                ]}
                onPress={() => handleAccountSelect(account)}
              >
                <View>
                  <Text
                    style={[typography.bold.h3, { marginBottom: wp(3.46) }]}
                  >
                    {account.name}
                  </Text>
                  {/* <Text
                        style={[typography.bold.h3, { marginBottom: wp(6.66) }]}
                      >
                        …X 4553
                      </Text> */}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: wp(2.64),
                  }}
                >
                  <Text
                    style={[
                      typography.regular.h4,
                      { textTransform: 'capitalize' },
                    ]}
                  >
                    {account.type}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <EmptyState message="No Accounts" />
          )}
        </ScrollView>
      </Container>
      <CustomModal
        noClose
        visible={confirmationModal}
        closeCallback={() => handleLinkModal('close')}
      >
        <ConfirmationModal
          customText="Are you sure you want to link this account? "
          confirmText={achAccountLinkLoader ? 'Linking' : 'Link'}
          onConfirm={
            !achAccountLinkLoader ? () => handleLinkModal('confirm') : null
          }
          onClose={() => handleLinkModal('close')}
        />
      </CustomModal>
    </SafeAreaView>
  );
};
PlaidAccounts.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
  successToast: PropTypes.func,
  errorToast: PropTypes.func,
};
export default PlaidAccounts;
const Container = styled.View`
  background-color: ${colors.white};
  flex: 1;
`;
