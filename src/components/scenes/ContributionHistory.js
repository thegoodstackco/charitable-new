import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import Header from '../common/header';
import Tabs from '../common/tabs';
import { colors, Custompadding, typography } from '../../styles/styleSheet';
import { wp } from '../../utils/Dimensions';
import { GetIcon } from '../../utils/Icons';
import { useContributionHistoryHook } from '../../app/shared/hooks';

const getDate = (date) => {
  const day = new Date(date);
  let dd = day.getDate();

  let mm = day.getMonth() + 1;
  const yyyy = day.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }

  if (mm < 10) {
    mm = `0${mm}`;
  }
  return `${mm}/${dd}/${yyyy}`;
};

const tabItems = [
  {
    value: 'all missions',
    key: 'all_missions',
  },
  {
    value: '501 3C',
    key: '501_3C',
  },
];

const ContributionHistory = (props) => {
  const [activeTab, setActiveTab] = useState(tabItems[0].key);
  const [refreshing, setRefreshing] = useState(false);

  const {
    contributions: { data: contributions, loader },
    contributionPdf: { loader: pdfLoader, onDownloadPdf },
    onTabClick,
  } = useContributionHistoryHook(props, {
    type: 'history',
    onPdfSuccess,
    onPdfError,
    isRefresh: refreshing,
    activeTab,
  });

  function onPdfSuccess({ data: { data } }) {
    if (data.url) {
      props.navigation.navigate('ViewPDF', {
        pdfUrl: data.url,
      });
      // Linking.openURL(`${data.url}`);
    } else {
      onPdfError();
    }
  }
  function onPdfError() {
    props.errorToast('Something went wrong');
  }
  const handleTabClick = (clickedTab) => {
    setActiveTab(clickedTab.key);
    onTabClick(clickedTab.key);
  };
  const handleGeneratePDF = () => {
    //onDownloadPdf();
  };

  const wait = (timeout) =>
    new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(1000).then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Container style={[Custompadding.paddingLarge]}>
          <Header
            heading="contribution history"
            backCallback={() => {
              props.navigation.goBack();
            }}
            rightHeading={
              !pdfLoader ? GetIcon('upload|Feather', colors.black, wp(5)) : null
            }
            loader={pdfLoader}
            textCallback={!pdfLoader ? handleGeneratePDF : null}
          />
          <Tabs
            details={tabItems}
            activeTab={activeTab}
            onTabClick={!pdfLoader ? handleTabClick : null}
          />
          {loader ? (
            <Loader />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {Object.entries(contributions).length ? (
                Object.entries(contributions).map(([key, value]) => (
                  <>
                    <YearTag
                      style={{
                        paddingVertical: wp(2),
                        marginVertical: wp(5.33),
                      }}
                    >
                      <Text
                        style={[typography.bold.h7, { textAlign: 'center' }]}
                      >
                        {key}
                      </Text>
                    </YearTag>
                    {value.map((history) => (
                      <View
                        style={[
                          Custompadding.paddingBottomRegular,
                          {
                            borderBottomColor: colors.GREYS.C8,
                            borderBottomWidth: 1,
                            marginTop: wp(4),
                          },
                        ]}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: wp(1),
                          }}
                        >
                          <Text
                            style={[
                              typography.bold.h6,
                              { color: colors.GREYS.C8 },
                            ]}
                          >
                            {history.mission.title}
                          </Text>
                          <Text
                            style={[
                              typography.regular.h6,
                              { color: colors.GREYS.C8 },
                            ]}
                          >
                            {`$${history.amount}`}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Text
                            style={[
                              typography.regular.h6,
                              { color: colors.GREYS.C8 },
                            ]}
                          >
                            {history.type_of_method}
                          </Text>
                          <Text
                            style={[
                              typography.regular.h6,
                              { color: colors.GREYS.C8 },
                            ]}
                          >
                            {getDate(history.created_at)}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </>
                ))
              ) : (
                <EmptyState message="You haven't made any contributions" />
              )}
            </ScrollView>
          )}
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
};
ContributionHistory.propTypes = {
  navigation: PropTypes.object,
  errorToast: PropTypes.func,
};
export default ContributionHistory;
const Container = styled.View`
  background-color: ${colors.white};
  flex: 1;
`;
const YearTag = styled.View`
  background-color: ${colors.GREYS.C7};
  border-radius: 17px;
`;
