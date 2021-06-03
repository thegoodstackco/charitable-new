/* eslint-disable no-alert */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  ScrollView,
  TouchableOpacity,
  Platform,
  Clipboard,
} from 'react-native';
import Image from 'react-native-image-progress';
import { useFocusEffect } from '@react-navigation/native';
import { wp } from '../../utils/Dimensions';
import { colors, Custompadding } from '../../styles/styleSheet';
// import puppy from '../../assets/images/puppy.png';
import MissionDetails from '../sceneComponents/MissionPreview/MissionDetail';
import MilestoneCarousel from '../sceneComponents/MissionPreview/MilestoneCarousel';
import { GetIcon } from '../../utils/Icons';
import ButtonSection from '../sceneComponents/PublishedMission/ButtonSection';
import OverlayModal from '../sceneComponents/PublishedMission/OverlayModal';
import CustomModal from '../common/modal';
import Loader from '../common/Loader';
import { shareUrl } from '../../app/shared/utils/shareHelper';
import ContributionModal from '../sceneComponents/ManageContribution/ContributionModal';
import Login from '../sceneComponents/HomePage/Login';
import {
  useMissionDetailHook,
  useContributionHistoryHook,
  useOneTimeContributionHooks,
  useUserContributionHook,
  useLoginHook,
} from '../../app/shared/hooks';

const BASE_URL = `charitable.app/`;

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

const PublishedMission = (props) => {
  const [openModal, setOpenModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [contributeModal, setContributeModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { onLogin, loginLoader } = useLoginHook(props, {
    onLoginSuccess,
    onLoginError,
  });

  function onLoginSuccess() {
    setShowAuthModal(false);
    // props.navigation.navigate('Landing');
  }
  function onLoginError(error) {
    // eslint-disable-next-line no-console
    console.log(error); // TODO handle error
  }

  const {
    Dash_data: { isLoggedIn },
    route: {
      params: {
        missionId = null,
        isCreate = false,
        paymentInfo = null,
        from = '',
        isError = false,
      } = {},
    },
    errorToast,
    successToast,
  } = props;

  const {
    missionDetail: { data: missionDetail, loader: detailLoader, milestoneList },
  } = useMissionDetailHook(props, {
    missionId,
  });

  const { updateOneTimePayment } = useOneTimeContributionHooks(props, {});

  const {
    contributions: {
      data: userContributions,
      // loader: userContributionsLoader,
      getUserContribution,
    },
  } = useUserContributionHook(props);

  useFocusEffect(
    useCallback(() => {
      getUserContribution(missionId);
      if (from === 'payments' && missionId) {
        successToast(
          'Congratulations! Your contribution to the mission is successfull',
        );
      }
      if (isError) errorToast('Something went wrong! Try Again');
      if (missionId && paymentInfo) {
        updateOneTimePayment(paymentInfo, missionId); // TODO update payment
      }
      props.navigation.setParams({
        from: '',
        missionId,
        paymentInfo: null,
        isError: false,
        isCreate: false,
      });
    }, [from, paymentInfo, isError]),
  );

  const {
    contributions: { data: contributions, loader: contributionLoader },
  } = useContributionHistoryHook(props, { type: 'mission', missionId });

  const MISSION_URL = `${BASE_URL}mission/${missionId}`;

  useEffect(() => {
    if (isCreate) setOpenModal(true);
  }, [isCreate]);

  const handleBack = () => {
    if (isCreate) {
      props.navigation.navigate('MissionControl');
    } else {
      props.navigation.goBack();
    }
  };

  const handleCopyUrl = () => {
    Clipboard.setString(MISSION_URL);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 5000);
    props.successToast('Copied mission url to clipboard.');
  };

  const handleShareMission = () => {
    shareUrl({ url: MISSION_URL });
  };

  const handleContributeModal = () => {
    if (isLoggedIn) {
      setContributeModal(true);
    } else {
      props.dispatch({
        type: 'SET_AFTER_LOGIN_ROUTE',
        payload: {
          afterLoginRoute: 'Mission',
          afterLoginParam: {
            missionId,
          },
        },
      });
      setShowAuthModal(true);
    }
  };

  const onCancelSubscriptionCB = () => {
    getUserContribution(missionId);
    setContributeModal(false);
  };

  return (
    <>
      {detailLoader || contributionLoader ? (
        <Loader />
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ backgroundColor: colors.white }}
            style={{ flex: 1 }}
          >
            <ImageWrapper
              style={{
                height: wp(85.33),
                width: wp(100),
                position: 'relative',
              }}
            >
              <Image
                source={{
                  uri:
                    missionDetail.image && missionId
                      ? missionDetail.image
                      : missionDetail.image && missionDetail.image.uri,
                }}
                alt="puppy"
                style={{
                  height: '100%',
                  width: '100%',
                  resizeMode: 'cover',
                }}
              />
            </ImageWrapper>
            <TouchableOpacity
              onPress={handleBack}
              style={{
                position: 'absolute',
                top: Platform.OS === 'android' ? 20 : 50,
                left: 20,
              }}
            >
              {GetIcon('arrow-left|FontAwesome5', colors.white, wp(8))}
            </TouchableOpacity>
            <Container
              style={[
                Custompadding.paddingRegular,
                { paddingBottom: wp(2.64) },
              ]}
            >
              <MissionDetails
                missionDetail={missionDetail}
                missionId={missionId}
                contributions={contributions}
              />
              <MilestoneCarousel milestones={milestoneList} />
            </Container>
          </ScrollView>
          <ButtonSection
            navigation={props.navigation}
            onShareMission={handleShareMission}
            onContribute={handleContributeModal}
            isVisible={contributeModal}
            onClose={() => setContributeModal(false)}
          />
        </>
      )}
      <CustomModal
        overlay
        noClose
        visible={openModal}
        closeCallback={() => {
          setOpenModal(false);
          props.navigation.navigate('MissionControl');
        }}
      >
        <OverlayModal
          url={MISSION_URL}
          missionDetail={missionDetail}
          onCopyURL={handleCopyUrl}
          onShareMission={handleShareMission}
          isCopied={isCopied}
        />
      </CustomModal>

      {/* <CustomModal
        visible={contributeModal}
        closeCallback={() => setContributeModal(false)}
      > */}
      {contributeModal && (
        <ContributionModal
          navigation={props.navigation}
          closeCallback={() => setContributeModal(false)}
          isVisible={contributeModal}
          missionDetail={missionDetail}
          initialContribution={initialContribution}
          userContributions={
            userContributions &&
            userContributions.length &&
            userContributions[0].user_contributions
          }
          cancelSubscriptionCB={onCancelSubscriptionCB}
          {...props}
        />
      )}
      {/* </CustomModal> */}

      <CustomModal
        noClose
        visible={showAuthModal}
        closeCallback={() => {
          setIsLoading(false);
          setShowAuthModal(false);
        }}
      >
        <Login
          // authCallback={(authType) => handleAuthMethod(authType)}
          closeCallback={() => {
            setIsLoading(false);
            setShowAuthModal(false);
          }}
          isLoading={isLoading || loginLoader}
          onLogin={onLogin}
          setIsLoading={(loadingState) => {
            setIsLoading(loadingState);
          }}
          dispatch={props.dispatch}
        />
      </CustomModal>
    </>
  );
};
PublishedMission.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
  successToast: PropTypes.func,
  errorToast: PropTypes.func,
  Dash_data: PropTypes.object,
  dispatch: PropTypes.func,
};
export default PublishedMission;
const ImageWrapper = styled.View`
  /* background-color: ${colors.GREYS.C7}; */
`;
const Container = styled.View`
  background-color: ${colors.white};
`;
