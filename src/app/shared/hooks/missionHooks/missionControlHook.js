/* eslint-disable indent */
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export const useMissionControlHook = ({
  Dash_hoc: {
    actions: { GET_MY_MISSION_API_CALL, GET_MY_MISSION_API_CANCEL },
  },
  Dash_data: { GET_MY_MISSION_API, userProfile = {} },
  getData,
}) => {
  const [activeMissions, setActiveMissions] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let query = {};
      if (userProfile && userProfile.id)
        query = {
          owner__id: userProfile && userProfile.id,
        };
      if (Object.keys(query).length) {
        GET_MY_MISSION_API_CALL({
          request: {
            query,
          },
        });
      }
    }, []),
  );

  useEffect(
    () => () => {
      GET_MY_MISSION_API_CANCEL();
    },
    [],
  );

  const userMissionList = useMemo(() => {
    const userMissions = getData(GET_MY_MISSION_API, [], false);
    if (
      userMissions &&
      userMissions.data &&
      userMissions.data.length &&
      userProfile &&
      userProfile.id
    ) {
      const missionCopy = userMissions.data;
      const active = missionCopy.filter((mission) => mission.is_active);
      if (active.length) setActiveMissions(active);
    } else {
      setActiveMissions([]);
    }
    return userMissions;
  }, [GET_MY_MISSION_API]);

  return {
    userMissionList: {
      data: userMissionList.data,
      loader: userMissionList.loader,
      lastUpdated: userMissionList.lastUpdated,
    },
    activeMissions,
  };
};
