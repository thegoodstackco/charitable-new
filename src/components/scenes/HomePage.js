/* eslint-disable no-underscore-dangle */
/* eslint-disable no-throw-literal */
/* eslint-disable no-console */
import React, { useState,useEffect } from 'react';
import { View, ScrollView } from 'react-native';
// import styled from 'styled-components';
import PropTypes from 'prop-types';

import { colors } from '../../styles/styleSheet';
import ButtonSection from '../sceneComponents/HomePage/ButtonSection';
import CustomModal from '../common/modal';
import Login from '../sceneComponents/HomePage/Login';
import { BannerCarousel } from '../sceneComponents/HomePage/BannerCarousel';
import { wp } from '../../utils/Dimensions';
import { useLoginHook } from '../../app/shared/hooks';
import { useDeviceTokenHook } from '../../app/shared/hooks';
import { setDeviceToken } from '../../app/shared/utils/token';

import messaging from '@react-native-firebase/messaging';

const HomePage = (props) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    Dash_data: { isLoggedIn, authListener, userProfile },
    // Dash_hoc: { axios },
  } = props;

  const {
    registerToken: { onRegisterToken },
  } = useDeviceTokenHook(props);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    // const enabled =
    //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (authStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
      requestUserPermission();
    } else if (authStatus === messaging.AuthorizationStatus.DENIED) {
      errorToast(
        'Please enable notification permission in order to receive notifications',
      );
    }
  };

  const saveTokenToDatabase = (token) => {
    if (token) {
      setDeviceToken(token);
    }
  };

  useEffect(() => {
    // Get the device token
    messaging().getToken().then((token) => {
     if (token) {
       saveTokenToDatabase(token);
     }
    });

    // Listen to whether the token changes
    messaging().onTokenRefresh((token) => {
     if (token) {
       saveTokenToDatabase(token);
     }
    });
  }, []);


  const { onLogin, loginLoader } = useLoginHook(props, {
    onLoginSuccess,
    onLoginError,
  });

  function onLoginSuccess() {
    setShowAuthModal(false);
    // props.navigation.navigate('Landing');
  }
  function onLoginError(error) {
    console.log(error); // TODO handle error
  }

  const handleButtonClick = (clickType) => {
    props.dispatch({
      type: 'SET_AFTER_LOGIN_ROUTE',
      payload: {
        afterLoginRoute: clickType,
        afterLoginParam: {},
      },
    });
    // setShowAuthModal(true);

    switch (clickType) {
      case 'MissionControl':
        setShowAuthModal(true);
        break;
      case 'FindMission':
        // setShowAuthModal(true);

        props.navigation.navigate('FindMission');
        break;
      case 'Landing':
        setShowAuthModal(true);
        break;
      default:
        setShowAuthModal(true);
    }
    return null;
  };

  return (
    <View style={{ backgroundColor: colors.white, flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: 'flex-start', flexGrow: 1 }}
        keyboardShouldPersistTaps="always"
      >
        <View style={{ backgroundColor: colors.white, height: wp(130) }}>
          <BannerCarousel />
        </View>
        <View>
          <ButtonSection
            onButtonClick={(clickType) => handleButtonClick(clickType)}
            showAuthModal={showAuthModal}
            // authCallback={(authType) => handleAuthMethod(authType)}
            closeCallback={() => {
              setIsLoading(false);
              setShowAuthModal(false);
            }}
            // isLoading={isLoading || loginLoader}
          />
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
        </View>
      </ScrollView>
    </View>
  );
};

HomePage.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
};

export default HomePage;
