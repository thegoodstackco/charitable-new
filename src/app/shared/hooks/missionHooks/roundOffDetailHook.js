import { useMemo, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export const useRoundOffDetailHook = (
  {
    Dash_hoc: {
      actions: { GET_ROUND_OFF_DETAILS_CALL },
    },
    Dash_data: { GET_ROUND_OFF_DETAILS },
    getData,
  },
  { pageType = null, isRefresh = null } = {},
) => {
  const getRoundOffDetails = () => {
    GET_ROUND_OFF_DETAILS_CALL();
  };

  useFocusEffect(
    useCallback(() => {
      if (pageType === 'dashboard') getRoundOffDetails();
    }, []),
  );

  useEffect(() => {
    getRoundOffDetails();
  }, [isRefresh]);

  const roundOffDetails = useMemo(() => {
    const roundOffInfo = getData(GET_ROUND_OFF_DETAILS, {}, true);
    return roundOffInfo;
  }, [GET_ROUND_OFF_DETAILS]);

  return {
    roundOffDetails: {
      data: roundOffDetails.data,
      loader: roundOffDetails.loader,
      lastUpdated: roundOffDetails.lastUpdated,
      getRoundOffDetails,
    },
  };
};
