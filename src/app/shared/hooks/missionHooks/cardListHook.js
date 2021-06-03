import { useMemo, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export const useCardListHook = (
  {
    Dash_hoc: {
      actions: { GET_CARD_LIST_API_CALL, DELETE_CARD_API_CALL },
    },
    Dash_data: { GET_CARD_LIST_API, DELETE_CARD_API },
    getData,
  },
  { pageType = null, onRemoveCardError = null, onRemoveCardSuccess = null },
) => {
  const query = {
    type: 'card',
  };

  const getCards = () => {
    GET_CARD_LIST_API_CALL({
      request: {
        query,
      },
    });
  };

  useEffect(() => {
    // if (cardList && !cardList.lastUpdated) getCards();
    getCards();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (pageType === 'linked') {
        getCards();
      }
    }, []),
  );

  const handleDeleteCard = (selectedCard) => {
    DELETE_CARD_API_CALL({
      request: {
        query: {
          payment_method: selectedCard.id,
        },
      },
      callback: {
        successCallback: ({ res, data, message, status }) => {
          getCards();
          onRemoveCardSuccess({ res, data, message, status });
        },
        errorCallback: ({
          error,
          errorData: responseErrorParser,
          message,
          status,
          errors,
        }) => {
          onRemoveCardError({
            error,
            responseErrorParser,
            message,
            status,
            errors,
          });
        },
      },
    });
  };

  const cardList = useMemo(() => {
    const cards = getData(GET_CARD_LIST_API, {}, true);
    return cards;
  }, [GET_CARD_LIST_API]);

  const deleteCard = useMemo(() => {
    const cards = getData(DELETE_CARD_API, {}, false);
    return cards;
  }, [DELETE_CARD_API]);

  return {
    cardList: {
      data: cardList.data,
      loader: cardList.loader,
    },
    deleteCard: {
      data: deleteCard.data,
      loader: deleteCard.loader,
      onDelete: handleDeleteCard,
    },
  };
};
