/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import * as Progress from 'react-native-progress';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Loader from '../common/Loader';
import Header from '../common/header';
import { colors, typography, Custompadding } from '../../styles/styleSheet';
import { wp } from '../../utils/Dimensions';
import { GetIcon } from '../../utils/Icons';
import {
  useRoundOffDetailHook,
  useRoundOffAccountsHook,
} from '../../app/shared/hooks';

const ROUND_OFF_AMOUNT = 5;

const RoundUps = (props) => {
  const {
    roundOffDetails: { data: roundOffDetails, loader: roundOffLoader },
  } = useRoundOffDetailHook(props, { pageType: 'dashboard' });

  const {
    roundOffAccounts: {
      data: roundOffAccounts,
      loader: roundOffAccountsLoader,
    },
    roundOffTransactions: {
      data: roundOffTransactions,
      // loader: roundOffTransactionsLoader,
      onSelectTransaction,
      // selectedTransactions,
    },
  } = useRoundOffAccountsHook(props, { pageType: 'dashboard' });
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <View
          style={[
            Custompadding.paddingLeftRightLarge,
            Custompadding.paddingTopLarge,
          ]}
        >
          <Header
            heading="your round-ups"
            backCallback={() => props.navigation.goBack()}
          />
        </View>
        {roundOffLoader || roundOffAccountsLoader ? (
          <Loader />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Container style={[Custompadding.paddingRegular]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  marginBottom: wp(4),
                }}
              >
                <View>
                  <Text style={[typography.bold.h6, { textAlign: 'center' }]}>
                    {roundOffDetails.roundoffs_made}
                  </Text>
                  <Text
                    style={[typography.regular.h6, { textAlign: 'center' }]}
                  >
                    round-ups made
                  </Text>
                </View>
                <View>
                  <Text style={[typography.bold.h6, { textAlign: 'center' }]}>
                    {`$${roundOffDetails.total_roundoff_amount}`}
                  </Text>
                  <Text
                    style={[typography.regular.h6, { textAlign: 'center' }]}
                  >
                    total round-ups
                  </Text>
                </View>
              </View>
              <View
                style={[
                  Custompadding.paddingTopSmall,
                  {
                    borderTopColor: colors.GREYS.C12,
                    borderTopWidth: 1,
                    marginBottom: wp(2.63),
                  },
                ]}
              >
                <Text
                  style={[
                    typography.bold.h7,
                    {
                      color: colors.GREYS.C8,
                    },
                  ]}
                >
                  Waiting to be contributed
                </Text>
              </View>
              <View
                style={[
                  Custompadding.paddingTopBottomLarge,
                  {
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: colors.GREYS.C12,
                    marginBottom: wp(4),
                  },
                ]}
              >
                <Progress.Bar
                  progress={roundOffDetails.current_roundoff_progress / 100}
                  width={wp(88)}
                  height={wp(4.2)}
                  color={colors.GREEN.C1}
                  unfilledColor={colors.GREYS.C7}
                  borderWidth={1}
                  borderColor={colors.GREYS.C7}
                  borderRadius={12}
                  style={{ marginBottom: wp(4) }}
                />
                <Text style={[typography.regular.h7]}>
                  We’ll transfer this money from your bank account into your
                  mission once it reaches at least ${ROUND_OFF_AMOUNT}
                </Text>
              </View>
              {roundOffAccounts && roundOffAccounts.length ? (
                <>
                  <TouchableOpacity
                    onPress={() => props.navigation.navigate('LinkedAccount')}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: wp(2.63),
                    }}
                  >
                    <Text
                      style={[
                        typography.regular.h7,
                        { textTransform: 'capitalize' },
                      ]}
                    >
                      {roundOffAccounts.length} linked account
                    </Text>
                    {GetIcon('arrow-right|Feather', colors.GREYS.C11, wp(6))}
                  </TouchableOpacity>
                  {roundOffTransactions &&
                    roundOffTransactions.plaid_response &&
                    roundOffTransactions.plaid_response.transactions.length &&
                    roundOffTransactions.plaid_response.transactions.map(
                      (transaction) => (
                        <TouchableOpacity
                          style={[
                            Custompadding.paddingTopBottomRegular,
                            {
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              borderTopWidth: 1,
                              borderTopColor: colors.GREYS.C12,
                            },
                          ]}
                          onPress={() => onSelectTransaction(transaction)}
                        >
                          <View
                            style={{
                              width: wp(70),
                            }}
                          >
                            {/* <View
                          style={{
                            height: wp(9.33),
                            width: wp(9.33),
                            backgroundColor: selectedTransactions.includes(
                              transaction.transaction_id,
                            )
                              ? colors.GREEN.C1
                              : 'transparent',
                            borderColor: selectedTransactions.includes(
                              transaction.transaction_id,
                            )
                              ? colors.GREEN.C1
                              : colors.GREYS.C8,
                            borderWidth: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 100,
                            marginRight: wp(4),
                          }}
                        >
                          {selectedTransactions.includes(
                                transaction.transaction_id,
                              ) ? (
                                <Text>
                                  {GetIcon(
                                    'check|Feather',
                                    colors.white,
                                    wp(7),
                                  )}
                                </Text>
                              ) : (
                                <Text>
                                  {GetIcon(
                                    'plus|Feather',
                                    colors.GREYS.C8,
                                    wp(2.63),
                                  )}
                                </Text>
                              )}
                        </View> */}
                            <View>
                              <Text
                                style={[
                                  typography.regular.h7,
                                  { textTransform: 'capitalize' },
                                ]}
                              >
                                {transaction.name}
                              </Text>
                              <Text
                                style={[
                                  typography.regular.h7,
                                  { paddingTop: wp(2) },
                                ]}
                              >
                                {`$ ${transaction.amount}`}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              // alignSelf: 'center',
                              alignItems: 'flex-end',
                              width: wp(20),
                            }}
                          >
                            <Text style={[typography.regular.h7]}>
                              {`$ ${
                                transaction.amount > 0 && transaction.amount % 1
                                  ? (1 - (transaction.amount % 1)).toFixed(2)
                                  : 0
                              }`}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ),
                    )}
                </>
              ) : null}
            </Container>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
};
RoundUps.propTypes = {
  navigation: PropTypes.object,
};
export default RoundUps;
const Container = styled.View`
  background-color: ${colors.white};
  flex: 1;
`;
