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
  Image,
} from 'react-native';
import Loader from '../common/Loader';
import { wp } from '../../utils/Dimensions';
import { typography, colors, Custompadding } from '../../styles/styleSheet';
import Header from '../common/header';
import CustomModal from '../common/modal';
import ConfirmationModal from '../common/ConfirmationModal';
import EmptyState from '../common/EmptyState';
import { useRoundOffAccountsHook } from '../../app/shared/hooks';
import cardDot from '../../assets/images/card_dot.png';

const LinkedAccount = (props) => {
  const { navigation, successToast, errorToast } = props;
  const [selectedAccount, setSelectedAccount] = useState({});
  const [confirmationModal, setConfirmationModal] = useState(false);
  const {
    roundOffAccounts: {
      data: roundOffAccounts,
      loader: roundOffAccountsLoader,
    },
    deleteAccount: { loader: deleteLoader, onDelete },
  } = useRoundOffAccountsHook(props, {
    onRemoveAccountSuccess,
    onRemoveAccountError,
  });

  function onRemoveAccountSuccess() {
    successToast('Account Removed Successfully');
    handleDeleteModal('close');
  }
  function onRemoveAccountError() {
    errorToast('Something went wrong!');
  }
  const handleAccountSelect = (card) => {
    setSelectedAccount(card);
    handleDeleteModal('open');
  };

  const handleDeleteModal = (actionType) => {
    switch (actionType) {
      case 'close':
        setConfirmationModal(false);
        setSelectedAccount(null);
        break;
      case 'open':
        setConfirmationModal(true);
        break;
      case 'confirm':
        onDelete(selectedAccount);
        break;
      default:
    }
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <Container style={[Custompadding.paddingLarge]}>
        <Header
          heading="Linked Accounts"
          backCallback={() => navigation.goBack()}
        />
        {roundOffAccountsLoader ? (
          <Loader />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ marginTop: wp(2.63) }}
          >
            {/* <View
              style={[
                Custompadding.paddingTopBottomSmall,
                { width: '100%', height: wp(40) },
              ]}
            >
              <Image
                source={cardLogo}
                alt="card"
                style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
              ></Image>
            </View> */}

            {roundOffAccounts && roundOffAccounts.length ? (
              roundOffAccounts.map((account) => (
                <TouchableOpacity
                  style={[
                    Custompadding.paddingTopBottomSmall,
                    Custompadding.paddingLeftRightXLarge,
                    {
                      borderColor:
                        selectedAccount && selectedAccount.id === account.id
                          ? colors.GREEN.C2
                          : colors.GREYS.C11,
                      borderWidth:
                        selectedAccount && selectedAccount.id === account.id
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
                  <View
                    style={[
                      Custompadding.paddingTopBottomXLarge,
                      {
                        width: '100%',
                        height: wp(40),
                        backgroundColor: colors.GREEN.C6,
                        borderRadius: 12,
                        marginBottom: wp(3.2),
                        paddingHorizontal: wp(8),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        typography.bold.h4,
                        {
                          color: colors.white,
                          textTransform: 'uppercase',
                          letterSpacing: 1.03,
                          marginBottom: wp(2.13),
                        },
                      ]}
                    >
                      {account &&
                        account.account &&
                        account.account.source &&
                        account.account.source.bank_name}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: wp(4.8),
                      }}
                    >
                      <View style={{ width: wp(50), height: wp(8) }}>
                        <Image
                          source={cardDot}
                          alt="card"
                          style={{
                            height: '100%',
                            width: '100%',
                            resizeMode: 'contain',
                          }}
                        ></Image>
                      </View>
                      <Text
                        style={[
                          typography.regular.h6,
                          {
                            color: colors.white,
                            textTransform: 'uppercase',
                            letterSpacing: 1.03,
                            marginLeft: wp(6.4),
                          },
                        ]}
                      >
                        {account &&
                          account.account &&
                          account.account.source &&
                          account.account.source.last4}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View>
                        <Text
                          style={[
                            typography.regular.h9,
                            {
                              color: colors.white,
                              textTransform: 'capitalize',
                              marginBottom: wp(1.73),
                            },
                          ]}
                        >
                          {account && account.account && account.account.name}
                        </Text>
                        {/* <View style={{ backgroundColor: colors.GREEN.C7, borderRadius: 4, height: wp(2.13), width: wp(27.2) }}></View> */}
                      </View>
                      {/* <View>
                          <Text style={[typography.regular.h9, { color: colors.white, textTransform: 'capitalize', marginBottom: wp(1.73) }]}>type</Text>
                          <View style={{ backgroundColor: colors.GREEN.C7, borderRadius: 4, height: wp(2.13), width: wp(9.33) }}></View>
                        </View> */}
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <EmptyState message="No Linked Accounts" />
            )}
          </ScrollView>
        )}
      </Container>
      <CustomModal
        noClose
        visible={confirmationModal}
        closeCallback={() => handleDeleteModal('close')}
      >
        <ConfirmationModal
          customText="Are you sure you want to delete the selected account? "
          confirmText={deleteLoader ? 'deleting' : 'delete'}
          onConfirm={!deleteLoader ? () => handleDeleteModal('confirm') : null}
          onClose={() => handleDeleteModal('close')}
        />
      </CustomModal>
    </SafeAreaView>
  );
};
LinkedAccount.propTypes = {
  navigation: PropTypes.object,
  successToast: PropTypes.func,
  errorToast: PropTypes.func,
};

export default LinkedAccount;
const Container = styled.View`
  background-color: ${colors.white};
  flex: 1;
`;
