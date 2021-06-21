/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import { Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import { setJWTToken } from '../../utils/token';

export const useLogoutHook = ({
  Dash_data: { firebaseProfile = {} },
  Dash_hoc: { axios },
  dispatch,
}) => {
  const navigation = useNavigation();

  const customFacebookLogout = () => {
    let current_access_token = '';
    AccessToken.getCurrentAccessToken()
      .then((data) => {
        if (data && data.accessToken)
          current_access_token = data.accessToken.toString();
      })
      .then(() => {
        const logout = new GraphRequest(
          'me/permissions/',
          {
            accessToken: current_access_token,
            httpMethod: 'DELETE',
          },
          (error, result) => {
            if (error) {
              console.log(`Error fetching data:  ${error.toString()}`);
            } else {
              console.log(result, 'result');
              LoginManager.logOut();
            }
          },
        );
        new GraphRequestManager().addRequest(logout).start();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogout = async () => {
    try {
      if (
        firebaseProfile &&
        firebaseProfile._user &&
        firebaseProfile._user.providerData &&
        firebaseProfile._user.providerData.length &&
        firebaseProfile._user.providerData[0].providerId === 'google.com'
      ) {
        await GoogleSignin.configure({
          offlineAccess: false,
          webClientId:
            Platform.OS === 'ios'
              ? '460954975544-i2epg7f0ic07se90uh0k4a0t1cq7iofl.apps.googleusercontent.com' // client id
              : '460954975544-i2epg7f0ic07se90uh0k4a0t1cq7iofl.apps.googleusercontent.com',
        });
        // await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      if (
        firebaseProfile &&
        firebaseProfile._user &&
        firebaseProfile._user.providerData &&
        firebaseProfile._user.providerData.length &&
        firebaseProfile._user.providerData[0].providerId === 'facebook.com'
      ) {
        customFacebookLogout();
      }

      auth()
        .signOut()
        .then(() => {
          // eslint-disable-next-line no-param-reassign
          delete axios.defaults.headers.common.Authorization;
          setJWTToken('');
          AsyncStorage.clear();
          dispatch({
            type: 'LOGOUT',
          });
          navigation.navigate('Home');
          // eslint-disable-next-line no-console
          console.log('User signed out!');
        });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return {
    onLogout: handleLogout,
  };
};
