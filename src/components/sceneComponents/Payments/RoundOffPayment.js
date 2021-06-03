/* eslint-disable no-console */
import React from 'react';
import { Text, Platform } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import PlaidLink from 'react-native-plaid-link-sdk';
import Loader from '../../common/Loader';
// import { wp } from '../../../utils/Dimensions';
import {
  colors,
  // Custompadding,
  typography,
} from '../../../styles/styleSheet';
import { useRoundOffContributionHook } from '../../../app/shared/hooks';
import { dashboard as DASHBOARD_API_END_POINTS } from '../../../app/shared/Hoc/apiEndPoints';

const RoundOffPayment = (props) => {
  const {
    route: { params: { plaidLinkToken = null, missionId } = {} },
  } = props;

  const {
    plaidExchangeToken: { loader: plaidExchangeLoader, onPlaidExchangeToken },
  } = useRoundOffContributionHook(props, {
    onPlaidExchangeTokenSuccess,
    onPlaidExchangeTokenError,
    missionId,
  });

  function onPlaidExchangeTokenSuccess() {
    props.navigation.replace('Mission', {
      from: 'payments',
      missionId,
    });
  }

  function onPlaidExchangeTokenError() {
    props.navigation.navigate('Mission', {
      missionId,
      isError: true,
    });
  }

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
      mission: missionId,
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
    console.log(data, 'exit');
    // if (!data.status) {
    props.navigation.navigate('Mission', {
      missionId,
      isError: false,
    });
    // } else {
    //   alert(JSON.stringify(data));
    // }
  };

  return (
    <Container
      style={{
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {plaidExchangeLoader ? (
        <Loader />
      ) : (
        <PlaidLink
          env="production"
          clientName="Charitable"
          token={plaidLinkToken}
          onSuccess={(data) => handlePlaidSuccess(data)}
          onExit={(data) => handlePlaidExit(data)}
          product={['auth', 'transactions']}
          webhook={DASHBOARD_API_END_POINTS.PLAID_WEBHOOK.url}
        >
          <Text style={[typography.bold.h4, { textAlign: 'center' }]}>
            Link Account
          </Text>
        </PlaidLink>
      )}
    </Container>
  );
};

RoundOffPayment.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};
export default RoundOffPayment;

const Container = styled.View`
  background-color: ${colors.white};
`;
