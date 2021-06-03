/* eslint-disable indent */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SafeAreaView } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Image,
  RefreshControl,
} from 'react-native';
import { GetIcon } from '../../utils/Icons';
import Loader from '../common/Loader';
import { colors, Custompadding, typography } from '../../styles/styleSheet';
import { wp, hp } from '../../utils/Dimensions';
import MenuModal from '../sceneComponents/Landing/MenuModal';
import ContributionCard from '../sceneComponents/Landing/ContributionCard';
import ContributionModal from '../sceneComponents/ManageContribution/ContributionModal';
import {
  useUserContributionHook,
  useRoundOffDetailHook,
} from '../../app/shared/hooks';
import banner1 from '../../assets/images/find_mission.png';

const ROUND_OFF_AMOUNT = 5;
const initialContribution = [
  { name: 'One time donation', key: 'one_time_donation', isSelected: false },
  {
    name: 'Recurring',
    subtitle: null,
    key: 'recurring',
    isSelected: false,
  },
  { name: 'round ups', key: 'round_ups', isSelected: false },
];

const Landing = (props) => {
  const { navigation, route, ...restProps } = props;
  // const { params: { isRefresh = true } = {} } = route;

  const [menuModal, setMenuModal] = useState(false);
  const [contributeModal, setContributeModal] = useState(false);
  const [clickedMission, setClickedMission] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const {
    userMissions: {
      data: userMissions,
      loader,
      getAllMissionContribtion,
      lastUpdated,
    },
  } = useUserContributionHook(props, {
    pageType: 'dashboard',
    isRefresh: refreshing,
  });


  const {
    roundOffDetails: { data: roundOffDetails, loader: roundOffLoader },
  } = useRoundOffDetailHook(props, {
    pageType: 'dashboard',
    isRefresh: refreshing,
  });

  const wait = (timeout) =>
    new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(1000).then(() => setRefreshing(false));
  }, []);

  const handleEditProfile = () => {
    setMenuModal(false);
    navigation.navigate('Profile', {
      emailInfo: '',
      password: '',
      showEmail: true,
      showPhone: true,
      isEdit: true,
    });
  };

  const handleCardClick = (missionId) => {
    navigation.navigate('Mission', {
      missionId,
    });
  };

  const handleContribtionClick = (contribution) => {
    setClickedMission(contribution);
    setContributeModal(true);
  };

  const handleContribtionClose = () => {
    // setClickedMission(null);
    setContributeModal(false);
  };

  const onCancelSubscriptionCB = () => {
    getAllMissionContribtion();
    setContributeModal(false);
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Container style={[Custompadding.paddingTopLarge]}>
            <FixedHeader
              style={[
                Custompadding.paddingBottomXLarge,
                Custompadding.paddingLeftRightLarge,
                { alignItems: 'center' },
              ]}
            >
              <TouchableOpacity onPress={() => setMenuModal(true)}>
                <Text>{GetIcon('bars|FontAwesome5', colors.black, wp(8))}</Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: wp(10.66),
                  fontFamily: 'Strawberry Blossom',
                  textTransform: 'capitalize',
                  // textAlign: 'center',
                  marginLeft: wp(30),
                }}
              >
                doosit
              </Text>
            </FixedHeader>
            {!lastUpdated && loader ? (
              <Loader />
            ) : (
              <>
                {userMissions && userMissions.length ? (
                  <>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={onRefresh}
                        />
                      }
                    >
                      {userMissions.map((contribution) => (
                        <ContributionCard
                          cardCallBack={() => handleCardClick(contribution.id)}
                          contributionCallback={() =>
                            handleContribtionClick(contribution)
                          }
                          contribution={contribution}
                        />
                      ))}
                    </ScrollView>
                    {/* {!roundOffLoader &&
                      roundOffDetails &&
                      roundOffDetails.active_roundoff && (
                        <Stripe
                          onPress={() => navigation.navigate('RoundUps')}
                          style={[Custompadding.paddingRegular]}
                        >
                          <Text>{`${
                            ROUND_OFF_AMOUNT -
                            (ROUND_OFF_AMOUNT / 100) *
                              roundOffDetails.current_roundoff_progress
                          } until your next round-up`}</Text>
                          <TouchableOpacity onPress={() => setMenuModal(true)}>
                            <Text>
                              {GetIcon(
                                'arrow-right|FontAwesome5',
                                colors.black,
                                wp(4),
                              )}
                            </Text>
                          </TouchableOpacity>
                        </Stripe>
                      )} */}
                  </>
                ) : (
                  <View
                    style={[
                      Custompadding.paddingLeftRightLarge,
                      {
                        height: hp(80),
                        justifyContent: 'space-around',
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <View style={{ height: hp(20), width: wp(100) }}>
                      <Image
                        source={banner1}
                        alt="banner1"
                        style={{
                          height: '100%',
                          width: '100%',
                          resizeMode: 'contain',
                        }}
                      ></Image>
                    </View>
                    <View>
                      <Text style={[typography.regular.h2]}>
                        Your dashboard is empty. You are not part of any
                        missions.
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('FindMission', { from: 'menu' })
                        }
                        style={[
                          Custompadding.paddingTopBottomLarge,
                          {
                            backgroundColor: colors.GREEN.C3,
                            borderRadius: 30,
                            borderColor: colors.GREEN.C4,
                            borderWidth: 6,
                            marginTop: wp(6),
                          },
                        ]}
                      >
                        <Text
                          style={[
                            typography.bold.h4,
                            { color: colors.white, textAlign: 'center' },
                          ]}
                        >
                          Find a Mission
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </>
            )}
          </Container>
        </ScrollView>
        {!roundOffLoader && roundOffDetails && roundOffDetails.active_roundoff && (
          <Stripe
            onPress={() => navigation.navigate('RoundUps')}
            style={[Custompadding.paddingRegular]}
          >
            <Text>{`$${
              ROUND_OFF_AMOUNT -
              (ROUND_OFF_AMOUNT / 100) *
                roundOffDetails.current_roundoff_progress
            } until your next round-up`}</Text>
            <Text>
              {GetIcon('arrow-right|FontAwesome5', colors.black, wp(4))}
            </Text>
          </Stripe>
        )}
      </SafeAreaView>
      <Modal
        isVisible={menuModal}
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
        animationInTiming={500}
        animationOutTiming={500}
        onBackdropPress={() => setMenuModal(false)}
        onRequestClose={() => setMenuModal(false)}
        onBackButtonPress={() => setMenuModal(false)}
        hideModalContentWhileAnimating
        style={{
          margin: 0,
          justifyContent: 'flex-start',
        }}
      >
        <MenuModal
          onEditProfile={handleEditProfile}
          menu={[
            {
              menuItem: 'Find a Mission',
              onPress: () => {
                setMenuModal(false);
                navigation.navigate('FindMission', { from: 'menu' });
              },
            },
            {
              menuItem: 'Contribution History',
              onPress: () => {
                setMenuModal(false);
                navigation.navigate('History');
              },
            },
            {
              menuItem: 'Mission Control',
              onPress: () => {
                setMenuModal(false);
                navigation.navigate('MissionControl');
              },
            },
            {
              menuItem: 'Settings',
              onPress: () => {
                setMenuModal(false);
                navigation.navigate('Settings');
              },
            },
          ]}
          {...restProps}
        />
      </Modal>
      {contributeModal && (
        <ContributionModal
          navigation={props.navigation}
          closeCallback={handleContribtionClose}
          isVisible={contributeModal}
          missionDetail={clickedMission}
          initialContribution={initialContribution}
          userContributions={
            clickedMission && clickedMission.user_contributions
          }
          cancelSubscriptionCB={onCancelSubscriptionCB}
          {...props}
        />
      )}
    </>
  );
};
Landing.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
export default Landing;
const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;
const FixedHeader = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Stripe = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${colors.yellow};
`;
