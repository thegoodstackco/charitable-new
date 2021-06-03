/* eslint-disable react/no-unescaped-entities */
import React, { useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { wp } from '../../utils/Dimensions';
import { typography, colors, Custompadding } from '../../styles/styleSheet';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import Header from '../common/header';
import cardDot from '../../assets/images/card_dot.png';

// import Button from '../common/button';
import CustomModal from '../common/modal';
import ConfirmationModal from '../common/ConfirmationModal';
import { useCardListHook } from '../../app/shared/hooks';

const LinkedCards = (props) => {
  const {
    navigation,
    route: { params: { from = '' } = {} },
    successToast,
    errorToast,
  } = props;
  const [selectedCard, setSelectedCard] = useState({});
  const [confirmationModal, setConfirmationModal] = useState(false);

  const {
    cardList: { data: cards, loader: listLoader },
    deleteCard: { loader: deleteLoader, onDelete },
  } = useCardListHook(props, {
    pageType: 'linked',
    onRemoveCardSuccess,
    onRemoveCardError,
  });

  function onRemoveCardSuccess() {
    successToast('Card Removed Successfully');
    handleDeleteModal('close');
  }
  function onRemoveCardError() {
    errorToast('Something went wrong!');
  }

  useFocusEffect(
    useCallback(() => {
      if (from === 'stripe') {
        successToast('Your card  successfully saved');
      }
    }, [from]),
  );

  const handleCardSelect = (card) => {
    setSelectedCard(card);
    handleDeleteModal('open');
  };

  // const handleNewCard = () => {
  //   navigation.navigate('SaveCard');
  // };

  const handleDeleteModal = (actionType) => {
    switch (actionType) {
      case 'close':
        setConfirmationModal(false);
        setSelectedCard(null);
        break;
      case 'open':
        setConfirmationModal(true);
        break;
      case 'confirm':
        onDelete(selectedCard);
        break;
      default:
    }
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <Container style={[Custompadding.paddingLarge]}>
        <Header
          heading="Linked Cards"
          backCallback={() => navigation.goBack()}
        />
        {listLoader ? (
          <Loader />
        ) : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ marginTop: wp(2.63) }}
            >
              {cards && cards.data && cards.data.length ? (
                cards.data.map((card) => (
                  <TouchableOpacity
                    style={[
                      {
                        borderRadius: 22,
                        marginBottom: wp(5.33),
                        //   ? colors.background
                        //   : colors.white,
                      },
                    ]}
                    onPress={() => handleCardSelect(card)}
                  >
                    {/* <View>
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
                    </View> */}
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
                          borderColor:
                            selectedCard && selectedCard.id === card.id
                              ? 'red'
                              : colors.GREYS.C11,
                          borderWidth:
                            selectedCard && selectedCard.id === card.id ? 2 : 1,
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
                        >
                          {card.card.last4}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        {/* <View>
                          <Text style={[typography.regular.h9, { color: colors.white, textTransform: 'capitalize', marginBottom: wp(1.73) }]}>{account && account.account && account.account.name}</Text>
                          <View style={{ backgroundColor: colors.GREEN.C7, borderRadius: 4, height: wp(2.13), width: wp(27.2) }}></View>
                        </View>
                        <View>
                          <Text style={[typography.regular.h9, { color: colors.white, textTransform: 'capitalize', marginBottom: wp(1.73) }]}>type</Text>
                          <View style={{ backgroundColor: colors.GREEN.C7, borderRadius: 4, height: wp(2.13), width: wp(9.33) }}></View>
                        </View> */}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <EmptyState message="No Linked Cards" />
              )}
            </ScrollView>
            {/* <View style={{ marginTop: wp(2.64) }}>
              <Button
                title="add new card"
                width={wp(88)}
                callback={handleNewCard}
                disable={listLoader || deleteLoader}
              />
            </View> */}
          </>
        )}
      </Container>
      <CustomModal
        noClose
        visible={confirmationModal}
        closeCallback={() => handleDeleteModal('close')}
      >
        <ConfirmationModal
          customText="Are you sure you want to delete the selected card? "
          confirmText={deleteLoader ? 'deleting' : 'delete'}
          onConfirm={!deleteLoader ? () => handleDeleteModal('confirm') : null}
          onClose={() => handleDeleteModal('close')}
        />
      </CustomModal>
    </SafeAreaView>
  );
};

LinkedCards.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
  successToast: PropTypes.func,
  errorToast: PropTypes.func,
};
export default LinkedCards;
const Container = styled.View`
  background-color: ${colors.white};
  flex: 1;
`;
