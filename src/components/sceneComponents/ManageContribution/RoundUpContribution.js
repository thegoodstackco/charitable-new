import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import PlaidLink from 'react-native-plaid-link-sdk';
import { wp } from '../../../utils/Dimensions';
import { colors, typography, Custompadding } from '../../../styles/styleSheet';
import { GetIcon } from '../../../utils/Icons';
import Loader from '../../common/Loader';
import plaidLogo from '../../../assets/images/plaid-logo.png';
import { dashboard as DASHBOARD_API_END_POINTS } from '../../../app/shared/Hoc/apiEndPoints';

const RoundUpContribution = ({
  backCallback,
  linkToken,
  onPlaidSuccess,
  onPlaidExit,
}) => (
  <>
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
      <TouchableOpacity onPress={backCallback}>
        {GetIcon('chevron-left|FontAwesome5', colors.black, wp(6))}
      </TouchableOpacity>
    </View>
    <View
      style={{
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          height: wp(33),
          width: wp(12.8),
        }}
      >
        <Image
          source={plaidLogo}
          alt="plaid"
          style={{
            height: '100%',
            width: '100%',
            resizeMode: 'contain',
          }}
        />
      </View>
      <Title
        style={[
          typography.bold.h4,
          {
            marginBottom: wp(4.8),
            color: colors.black,
            textTransform: 'capitalize',
          },
        ]}
      >
        Share your spare charge
      </Title>
      <Title
        style={[
          typography.bold.h4,
          {
            color: colors.black,
            marginBottom: wp(4.8),
            lineHeight: wp(5.86),
            textAlign: 'center',
          },
        ]}
      >
        Using our secure banking partners Plaid, link a bank account and
        round-up your purchase to the nearest dollar amount, adding to your
        contribution.
      </Title>
      {false ? (
        <Loader />
      ) : (
        <View style={{ marginTop: wp(4) }}>
          <PlaidLink
            env="production"
            clientName="Charitable"
            token={linkToken}
            onSuccess={(data) => onPlaidSuccess(data)}
            onExit={(data) => onPlaidExit(data)}
            product={['auth', 'transactions']}
            webhook={DASHBOARD_API_END_POINTS.PLAID_WEBHOOK.url}
          >
            <View
              style={[
                Custompadding.paddingTopBottomXLarge,
                {
                  backgroundColor: colors.secondaryColor,
                  width: wp(88),
                  borderRadius: wp(4),
                },
              ]}
            >
              <Text
                style={[
                  typography.bold.h6,
                  { textAlign: 'center', color: colors.white },
                ]}
              >
                Link Bank Account
              </Text>
            </View>
          </PlaidLink>
        </View>
      )}
    </View>
  </>
);

RoundUpContribution.propTypes = {
  // plaidExchangeToken: PropTypes.object,
  linkToken: PropTypes.string,
  backCallback: PropTypes.func,
  // closeContributionModal: PropTypes.func,
  onPlaidSuccess: PropTypes.func,
  onPlaidExit: PropTypes.func,
};

export default RoundUpContribution;

const Title = styled.Text``;
