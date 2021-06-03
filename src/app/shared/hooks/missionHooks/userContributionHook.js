import { useMemo, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { setJWTToken, getJWTToken } from '../../utils/token';

export const useUserContributionHook = (
  {
    Dash_hoc: {
      actions: {
        GET_USER_MISSIONS_API_CALL,
        GET_USER_MISSIONS_CONTRIBUTION_API_CALL,
      },
    },
    Dash_data: {
      GET_USER_MISSIONS_API,
      GET_USER_MISSIONS_CONTRIBUTION_API,
      isLoggedIn,
    },
    getData,
  },
  { pageType = null, isRefresh = null } = {},
) => {
  const getAllMissionContribtion = () => {
    GET_USER_MISSIONS_API_CALL();
  };

  useFocusEffect(
    useCallback(() => {
      if (pageType === 'dashboard') getAllMissionContribtion();
    }, []),
  );

  useEffect(() => {
    getAllMissionContribtion();
  }, [isRefresh]);

  const getUserContribution = (missionId) => {
    console.log(3737,missionId);
    const query = {
      mission: missionId,
    };
    if (isLoggedIn){
      GET_USER_MISSIONS_CONTRIBUTION_API_CALL({
        request: {
          query,
        },
      })
    };
  };

  const userMissions = useMemo(() => {
    const contributionInfo = getData(GET_USER_MISSIONS_API, [], true);
    return contributionInfo;
  }, [GET_USER_MISSIONS_API]);

  const contributions = useMemo(() => {
    const contributionInfo = getData(
      GET_USER_MISSIONS_CONTRIBUTION_API,
      [],
      false,
    );
    return contributionInfo;
  }, [GET_USER_MISSIONS_CONTRIBUTION_API]);

  return {
    userMissions: {
      data: userMissions.data,
      loader: userMissions.loader,
      lastUpdated: userMissions.lastUpdated,
      getAllMissionContribtion,
    },
    contributions: {
      data: contributions.data,
      loader: contributions.loader,
      getUserContribution,
    },
  };
};
