import { useMemo, useEffect } from 'react';
import groupBy from 'lodash/groupBy';
// import orderBy from 'lodash/orderBy';

const sortAndGroupData = (data) => {
  const groupedData = groupBy(data, (info) => {
    const dateInfo = new Date(info.created_at);
    const year = dateInfo.getFullYear();
    return year;
  });
  // const orderedData = orderBy(groupedData);
  return groupedData;
};
export const useContributionHistoryHook = (
  {
    Dash_hoc: {
      actions: {
        GET_CONTRIBUTION_HISTORY_API_CALL,
        GET_MISSION_CONTRIBUTION_PDF_API_CALL,
      },
    },
    Dash_data: {
      GET_CONTRIBUTION_HISTORY_API,
      GET_MISSION_CONTRIBUTION_PDF_API,
      userProfile = {},
    },
    getData,
  },
  {
    type = null,
    missionId = null,
    onPdfSuccess = null,
    onPdfError = null,
    isRefresh,
    activeTab,
  },
) => {
  useEffect(() => {
    let query = {};
    if (type === 'history') {
      query = {
        user__id: userProfile && userProfile.id,
      };
    } else if (type === 'mission' && missionId) {
      query = {
        mission__id: missionId,
      };
    }
    GET_CONTRIBUTION_HISTORY_API_CALL({
      request: {
        query,
      },
    });
  }, [type]);

  useEffect(() => {
    if (isRefresh) {
      let query = {};
      if (type === 'history') {
        query = {
          user__id: userProfile.id,
        };
      } else if (type === 'mission' && missionId) {
        query = {
          mission__id: missionId,
        };
      }
      if (activeTab === '501_3C') {
        query.mission__c5013 = true;
      } else {
        delete query.mission__c5013;
      }
      GET_CONTRIBUTION_HISTORY_API_CALL({
        request: {
          query,
        },
      });
    }
  }, [isRefresh, type]);

  const onTabClick = (key) => {
    const query = {
      user__id: userProfile && userProfile.id,
    };
    if (key === '501_3C') {
      query.mission__c5013 = true;
    }
    GET_CONTRIBUTION_HISTORY_API_CALL({
      request: {
        query,
      },
    });
  };

  const onDownloadPdf = () => {
    // const query = {
    //   user_id: userProfile && userProfile.id,
    // };
    // GET_MISSION_CONTRIBUTION_PDF_API_CALL({
    //   request: {
    //     query,
    //   },
    //   callback: {
    //     successCallback: ({ res, data, message, status }) => {
    //       onPdfSuccess({ res, data, message, status });
    //     },
    //     errorCallback: ({
    //       error,
    //       errorData: responseErrorParser,
    //       message,
    //       status,
    //       errors,
    //     }) => {
    //       onPdfError({ error, responseErrorParser, message, status, errors });
    //     },
    //   },
    // });
  };

  const contributions = useMemo(() => {
    const contributionInfo = getData(GET_CONTRIBUTION_HISTORY_API, [], true);
    return contributionInfo;
  }, [GET_CONTRIBUTION_HISTORY_API]);

  const contributionPdf = useMemo(() => {
    const contributionInfo = getData(
      GET_MISSION_CONTRIBUTION_PDF_API,
      {},
      false,
    );
    return contributionInfo;
  }, [GET_MISSION_CONTRIBUTION_PDF_API]);

  return {
    contributions: {
      data:
        type === 'history'
          ? sortAndGroupData(contributions.data, 'created_at')
          : contributions.data,
      loader: contributions.loader,
    },
    onTabClick,
    contributionPdf: {
      loader: contributionPdf.loader,
      onDownloadPdf,
    },
  };
};
