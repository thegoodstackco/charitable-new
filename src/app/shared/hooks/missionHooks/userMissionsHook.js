import { useMemo, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export const useUserMissionsHook = (
  {
    Dash_hoc: {
      actions: { GET_USER_MISSIONS_API_CALL },
    },
    Dash_data: { GET_USER_MISSIONS_API, isLoggedIn },
    getData,
  },
  { pageType = 'dashboard' } = null,
) => {
  useEffect(() => {
    if (pageType === 'dashboard') GET_USER_MISSIONS_API_CALL();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (pageType === 'dashboard') GET_USER_MISSIONS_API_CALL();
    }, []),
  );

  const getUserContribution = (missionId) => {
    const query = {
      mission: missionId,
    };
    if (isLoggedIn)
      GET_USER_MISSIONS_API_CALL({
        request: {
          query,
        },
      });
  };

  const contributions = useMemo(() => {
    const contributionInfo = getData(GET_USER_MISSIONS_API, [], true);
    return contributionInfo;
  }, [GET_USER_MISSIONS_API]);

  return {
    contributions: {
      data: contributions.data,
      loader: contributions.loader,
      getUserContribution,
    },
  };
};
