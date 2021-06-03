import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { wp } from '../../utils/Dimensions';
import { typography, colors, Custompadding } from '../../styles/styleSheet';
import Header from '../common/header';
import Button from '../common/button';
import cardDot from '../../assets/images/card_dot.png';
import { currency } from '../../app/shared/utils/config';
import {
  useCardListHook,
  useOneTimeContributionHooks,
  useRecurringContributionHooks,
} from '../../app/shared/hooks';

const CardList = (props) => {
  const {
    route: {
      params: {
        missionId = null,
        amount = null,
        type = 'onetime',
        customPayload = {},
        subscriptionType = '',
      } = {},
    },
    navigation,
  } = props;
  const [selectedCard, setSelectedCard] = useState({});
  const [error, setError] = useState(null);

  const {
    cardList: { data: cards },
  } = useCardListHook(props, {});

  const {
    oneTimeContribution: { onOneTimeSubmit, loader: submitLoader },
  } = useOneTimeContributionHooks(props, {
    oneTimeContributeSuccess,
    oneTimeContributeError,
  });

  function oneTimeContributeSuccess({ data: { data }, isNew }) {
    if (isNew) {
      props.navigation.navigate('CustomCardScreen', {
        paymentInfo: data,
        missionId,
      });
    } else {
      props.navigation.replace('Mission', {
        from: 'payments',
        missionId,
        paymentInfo: data,
      });
    }
  }
  function oneTimeContributeError() {
    props.errorToast('Something went wrong try again!');
  }

  const {
    recurringContribution: { onSubscriptionSubmit, loader: subscriptionLoader },
  } = useRecurringContributionHooks(props, {
    onRecurringContributeSuccess,
    onRecurringContributeError,
    missionId,
  });

  function onRecurringContributeSuccess() {
    props.navigation.replace('Mission', {
      from: 'payments',
      missionId,
    });
  }

  function onRecurringContributeError() {
    props.errorToast('Something went wrong try again!');
  }

  const handleCardSelect = (card) => {
    setSelectedCard(card);
    setError(null);
  };

  const handlePayment = () => {
    if (!(selectedCard && selectedCard.id)) {
      setError('Select a card to make a payment or add a new one');
    } else if (type === 'onetime') {
      const oneTimePayload = {
        mission: missionId,
        amount,
        currency,
        payment_method: selectedCard.id,
        off_session: true,
      };
      onOneTimeSubmit({ customPayload: oneTimePayload, isNew: false });
    } else if (type === 'recurring') {
      const recurringPayload = {
        ...customPayload,
        mission: missionId,
        unit_amount: amount,
        payment_method: selectedCard.id,
      };
      onSubscriptionSubmit({ customPayload: recurringPayload, isNew: false });
    }
  };

  const handleNewCard = () => {
    if (type === 'onetime') {
      const payload = {
        mission: missionId,
        amount,
        currency: 'usd',
      };
      onOneTimeSubmit({ customPayload: payload, isNew: true });
    } else {
      const recurringPayload = {
        ...customPayload,
        mission: missionId,
        unit_amount: amount,
      };
      props.navigation.navigate('RecurringPayment', {
        recurringPayload,
        missionId,
      });
    }
  };

  let buttonTitle = `Pay $${amount}`;
  if (type === 'recurring') {
    buttonTitle = `Subscribe $${amount} per ${subscriptionType}`;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <Container style={[Custompadding.paddingLarge]}>
        <Header
          heading="Select a card"
          backCallback={() => navigation.goBack()}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: wp(2.63) }}
        >
          {cards &&
            cards.data.length &&
            cards.data.map((card) => (
              <TouchableOpacity
                style={[
                  Custompadding.paddingTopBottomSmall,
                  Custompadding.paddingLeftRightXLarge,
                  {
                    borderColor:
                      selectedCard && selectedCard.id === card.id
                        ? colors.GREEN.C2
                        : colors.GREYS.C11,
                    borderWidth:
                      selectedCard && selectedCard.id === card.id ? 2 : 1,
                    borderRadius: 22,
                    marginBottom: wp(5.33),
                    // backgroundColor: category.itemSelected
                    //   ? colors.background
                    //   : colors.white,
                  },
                ]}
                onPress={() => handleCardSelect(card)}
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
                    {card.card.brand}
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
                    >{`${card.card.last4}`}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View>
                      {/* <Text style={[typography.regular.h9, { color: colors.white, textTransform: 'capitalize', marginBottom: wp(1.73) }]}>account holder</Text> */}
                      <View
                        style={{
                          backgroundColor: colors.GREEN.C7,
                          borderRadius: 4,
                          height: wp(2.13),
                          width: wp(27.2),
                        }}
                      ></View>
                    </View>
                    <View>
                      {/* <Text style={[typography.regular.h9, { color: colors.white, textTransform: 'capitalize', marginBottom: wp(1.73) }]}>type</Text> */}
                      <View
                        style={{
                          backgroundColor: colors.GREEN.C7,
                          borderRadius: 4,
                          height: wp(2.13),
                          width: wp(9.33),
                        }}
                      ></View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          {/* {cards &&
            cards.data &&
            cards.data.length &&
            cards.data.map((card) => (
              <TouchableOpacity
                style={[
                  Custompadding.paddingTopBottomSmall,
                  Custompadding.paddingLeftRightXLarge,
                  {
                    borderColor:
                      selectedCard && selectedCard.id === card.id
                        ? colors.GREEN.C2
                        : colors.GREYS.C11,
                    borderWidth:
                      selectedCard && selectedCard.id === card.id ? 2 : 1,
                    borderRadius: 22,
                    marginBottom: wp(5.33),
                    // backgroundColor: category.itemSelected
                    //   ? colors.background
                    //   : colors.white,
                  },
                ]}
                onPress={() => handleCardSelect(card)}
              >
                <View>
                  <Text
                    style={[typography.bold.h3, { marginBottom: wp(3.46) }]}
                  >
                    {`XXXX XXXX XXXX ${card.card.last4}`}
                  </Text>
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
                    {card.card.brand}
                  </Text>
                </View>
              </TouchableOpacity>
            ))} */}
        </ScrollView>
        {error && (
          <View style={{ marginTop: wp(4) }}>
            <Text
              style={[
                typography.regular.h6,
                { color: colors.error, textAlign: 'center' },
              ]}
            >
              {error}
            </Text>
          </View>
        )}
        <View style={{ marginTop: wp(2.64) }}>
          <Button
            type="link"
            title={
              submitLoader || subscriptionLoader ? 'Processing' : 'add new card'
            }
            callback={handleNewCard}
            disable={submitLoader || subscriptionLoader}
          />
        </View>
        <View style={{ marginTop: wp(2.64) }}>
          <Button
            title={
              submitLoader || subscriptionLoader ? 'Processing' : buttonTitle
            }
            width={wp(88)}
            callback={handlePayment}
            disable={submitLoader || subscriptionLoader}
          />
        </View>
      </Container>
    </SafeAreaView>
  );
};

CardList.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
  errorToast: PropTypes.func,
};
export default CardList;
const Container = styled.View`
  background-color: ${colors.white};
  flex: 1;
`;
