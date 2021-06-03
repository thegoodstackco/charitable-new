import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import logo from '../../assets/images/splash-logo.png';
import { colors } from '../../styles/styleSheet';
import { getJWTToken } from '../../app/shared/utils/token';
import { useLogoutHook } from '../../app/shared/hooks';
// write the file

const checkAuth = async (cb) => {
  const userInfo = await getJWTToken();
  cb(userInfo);
};

const SplashScreen = (props) => {
  const { onLogout } = useLogoutHook(props);
  const [initialRoute, setInitialRoute] = useState('Landing');
  const {
    Dash_hoc: {
      actions: { GET_PROFILE_API_CALL, GET_USER_MISSIONS_API_CALL },
      axios,
    },
  } = props;

  useEffect(() => {
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage && remoteMessage.data && remoteMessage.data.type) {
          // eslint-disable-next-line no-console
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          setInitialRoute(remoteMessage.data.type);
        }
      });
  }, []);

  const getUserProfile = (userInfo) => {
    GET_PROFILE_API_CALL({
      request: {
        params: {
          userId: userInfo.userId,
        },
      },
      callback: {
        successCallback: ({ data = {} }) => {
          // setTimeout(() => {
          if (data.data && data.data.id)
            if (!data.data.profile_complete) {
              props.navigation.navigate('Profile', {
                password: '',
              });
            } else {
              props.navigation.navigate(initialRoute);
            }
          else {
            onLogout();
            props.navigation.navigate('Home');
          }
          // }, 100);
        },
        errorCallback: () => {
          // setTimeout(() => {
          onLogout();
          props.navigation.navigate('Home');
          // }, 100);
        },
      },
    });
  };

  useEffect(() => {
    checkAuth((userInfo) => {
      if (userInfo && Object.keys(userInfo).length) {
        axios.defaults.headers.common.Authorization = `JWT ${userInfo.token}`;
        GET_USER_MISSIONS_API_CALL({
          callback: {
            successCallback: () => {
              getUserProfile(userInfo);
            },
            errorCallback: () => {
              // setTimeout(() => {
              props.navigation.navigate('Home');
              onLogout();
              // }, 100);
            },
          },
        });
      } else {
        // setTimeout(() => {
        onLogout();
        props.navigation.navigate('Home');
        // }, 100);
      }
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      }}
    >
      <View style={{ height: 53, width: 150 }}>
        <Image
          source={logo}
          alt="splash-logo"
          style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
        />
      </View>
      {/* <Text
        style={[
          typography.bold.h1,
          {
            lineHeight: wp(7.2),
          },
        ]}
      >
        CHARITABLE
      </Text> */}
    </View>
  );
};

SplashScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  Dash_hoc: PropTypes.object,
  GET_PROFILE_API_CALL: PropTypes.func,
};

export default SplashScreen;
