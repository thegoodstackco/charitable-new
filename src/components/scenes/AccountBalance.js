/* eslint-disable indent */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView } from 'react-native';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import Header from '../common/header';
import Tabs from '../common/tabs';
import { colors, Custompadding, typography } from '../../styles/styleSheet';
import { wp } from '../../utils/Dimensions';
import { usePayoutsHook } from '../../app/shared/hooks';

const tabItems = [
  {
    value: 'withdrawls',
    key: 'withdrawls',
  },
  {
    value: 'contributions',
    key: 'contributions',
  },
];

const getDate = (date) => {
  const day = new Date(date);
  const formatedDate = moment(day).format('MMMM Do YYYY');
  return formatedDate;
};

const AccountBalance = (props) => {
  const {
    navigation,
    route: { params: { mission = null } = {} },
  } = props;

  const [activeTab, setActiveTab] = useState(tabItems[0].key);

  const handleTabClick = (clickedTab) => {
    setActiveTab(clickedTab.key);
  };

  const handleTransferBank = () => {
    navigation.navigate('TransferBalance', { mission });
  };

  const {
    payoutsList: { data: payoutsList, loader: payoutListLoader, lastUpdated },
    accountBalance,
  } = usePayoutsHook(props, { mission });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <Container style={[Custompadding.paddingLarge]}>
        <Header
          backCallback={() => {
            navigation.goBack();
          }}
        />
        {mission && mission.title && (
          <Text style={[typography.regular.h2, { textAlign: 'center' }]}>
            {mission.title}
          </Text>
        )}
        {/* <Text
          style={[
            typography.regular.h4,
            {
              textAlign: 'center',
              textTransform: 'capitalize',
              marginBottom: wp(6),
              //   backgroundColor: 'red',
            },
          ]}
        >
          admin account
        </Text> */}
        <Amount
          style={{
            fontFamily: 'Bariol-Regular',
            fontSize: wp(11.2),
            textAlign: 'center',
            textTransform: 'capitalize',
            // backgroundColor: 'blue',
          }}
        >
          {`$${accountBalance}`}
        </Amount>
        <Tag
          style={[
            Custompadding.paddingLeftRightXLarge,
            Custompadding.paddingTopBottomRegular,
            { marginTop: wp(3), marginBottom: wp(2.64) },
          ]}
          onPress={handleTransferBank}
        >
          <Text
            style={[
              typography.regular.h6,
              { textAlign: 'center', textTransform: 'capitalize' },
            ]}
          >
            transfer balance
          </Text>
        </Tag>
        <Tabs
          details={tabItems}
          activeTab={activeTab}
          onTabClick={handleTabClick}
        />
        {activeTab === 'withdrawls' && (
          <>
            {!lastUpdated && payoutListLoader ? (
              <Loader />
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {payoutsList &&
                payoutsList.length &&
                payoutsList.filter(
                  (payoutInfo) => payoutInfo.status === 'succeeded',
                ).length ? (
                  payoutsList
                    .filter((payoutInfo) => payoutInfo.status === 'succeeded')
                    .map((payout) => (
                      <View
                        style={[
                          Custompadding.paddingBottomRegular,
                          {
                            borderBottomColor: colors.borderColor,
                            borderBottomWidth: 1,
                            marginTop: wp(4),
                          },
                        ]}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: wp(1),
                          }}
                        >
                          <View>
                            <Text style={[typography.regular.h7]}>
                              Bank Account #
                            </Text>
                            <Text style={[typography.regular.h7]}>
                              {getDate(payout.created_at)}
                            </Text>
                          </View>
                          <View>
                            <Text style={[typography.regular.h7]}>
                              {`$${payout.amount}`}
                            </Text>
                            {/* <Text style={[typography.regular.h7]}>
                            {payout.paymentMode}
                          </Text> */}
                          </View>
                        </View>
                      </View>
                    ))
                ) : (
                  <EmptyState message="No withdrawals" />
                )}
              </ScrollView>
            )}
          </>
        )}
        {activeTab === 'contributions' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {mission.contributions && mission.contributions.length ? (
              mission.contributions.map((contribution) => (
                <View
                  style={[
                    Custompadding.paddingBottomRegular,
                    {
                      borderBottomColor: colors.borderColor,
                      borderBottomWidth: 1,
                      marginTop: wp(4),
                    },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: wp(1),
                    }}
                  >
                    <View>
                      <Text style={[typography.regular.h7]}>
                        {!contribution.is_anonymous
                          ? contribution.user.name
                          : 'Anonymous'}
                      </Text>
                      <Text style={[typography.regular.h7]}>
                        {getDate(contribution.created_at)}
                      </Text>
                    </View>
                    <View>
                      <Text style={[typography.regular.h7]}>
                        {`$${contribution.amount}`}
                      </Text>
                      <Text style={[typography.regular.h7]}>
                        {contribution.type_of_method}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <EmptyState message="No contributions" />
            )}
          </ScrollView>
        )}
      </Container>
    </SafeAreaView>
  );
};
export default AccountBalance;

AccountBalance.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const Container = styled.View`
  background-color: ${colors.white};
  flex: 1;
`;
const Tag = styled.TouchableOpacity`
  background-color: ${colors.background};
  border-radius: 11px;
  align-self: center;
`;
const Amount = styled.Text``;
