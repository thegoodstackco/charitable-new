/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-throw-literal */
/* eslint-disable no-console */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  NativeModules,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import auth, { firebase } from '@react-native-firebase/auth';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';
import appleAuth, {
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import { useNavigation } from '@react-navigation/native';
import facebook from '../../../assets/images/facebook.png';
import google from '../../../assets/images/google.png';
import apple from '../../../assets/images/apple.png';
import loader from '../../../assets/images/loader.gif';
import { wp } from '../../../utils/Dimensions';
import { GetIcon } from '../../../utils/Icons';
import { typography, Custompadding, colors } from '../../../styles/styleSheet';
const FBLoginManager = NativeModules.MFBLoginManager;

const option = [
  {
    icon: facebook,
    value: 'Continue with Facebook',
    type: 'facebook',
    bgColor: colors.BLUES.C3,
    showButton: true,
  },
  // {
  //   bgColor: colors.BLUES.C2,
  //   showButton: true,
  // },
  {
    icon: google,
    value: 'Continue with Google',
    type: 'google',
    bgColor: colors.white,
    showButton: true,
  },
  {
    icon: apple,
    value: 'Continue with Apple',
    type: 'apple',
    bgColor: colors.GREYS.C6,
    showButton: Platform.OS === 'ios',
  },
  {
    // value: 'phone or email',
    value: 'Phone or Email',
    type: 'phone_email',
    bgColor: colors.GREYS.C7,
    showButton: true,
  },
];
const Login = (props) => {
  const { onLogin, setIsLoading, closeCallback, isLoading, dispatch } = props;
  const navigation = useNavigation();
  
  useEffect(async()=>{
    const fbView = Platform.OS === 'ios'
    ? FBLoginManager.LoginBehaviors.Web
    : FBLoginManager.LoginBehaviors.WebView;
    await FBLoginManager.setLoginBehavior(fbView);
  },[])
  async function signInWithCredential(credential, email) {
    setIsLoading(true);
    // login with credential
    // props.dispatch({
    //   type: 'UPDATE_AUTH_LISTENER',
    //   payload: {
    //     authListener: false,
    //   },
    // });
    firebase
      .auth()
      .signInWithCredential(credential)
      .then((firebaseUserCredential) => {
        // firebaseUserCredential.user.linkWithCredential(credential);
        const fireBaseInfo = firebaseUserCredential.user._user;
        const {
          isNewUser,
          providerId,
        } = firebaseUserCredential.additionalUserInfo;
        if (isNewUser) {
          closeCallback();
          navigation.navigate('Profile', {
            emailInfo: '',
            password: '',
            showEmail: true,
            showPhone: true,
          });
        } else {
          const provider = providerId.replace('.com', '');
          let profileID = '';
          if (fireBaseInfo.providerData && fireBaseInfo.providerData.length) {
            profileID = fireBaseInfo.providerData[0].uid;
          }
          const payload = {
            login_strategy: provider,
            [`${provider}_id`]: profileID,
            firebase_id: fireBaseInfo.uid,
          };
          onLogin(payload);
        }
        // props.dispatch({
        //   type: 'UPDATE_AUTH_LISTENER',
        //   payload: {
        //     authListener: true,
        //   },
        // });
        // if (displayName) {
        //   firebaseUserCredential.user.updateProfile({ displayName });
        // }
        setIsLoading(false);
      })
      .catch(async (error) => {
        if (error.code === 'auth/account-exists-with-different-credential') {
          if (email) {
            firebase
              .auth()
              .fetchSignInMethodsForEmail(email)
              .then((providers) => {
                if (providers.includes('apple.com') && appleAuth.isSupported) {
                  Alert.alert(
                    'Sign-in via Apple',
                    "Looks like you previously signed in via Apple. You'll need to sign-in there to continue",
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Continue', onPress: () => onAppleLogin() },
                    ],
                  );
                } else if (providers.includes('google.com')) {
                  Alert.alert(
                    'Sign-in via Google',
                    "Looks like you previously signed in via Google. You'll need to sign-in there to continue",
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Continue',
                        onPress: () => onGoogleLogin(),
                      },
                    ],
                  );
                } else if (providers.includes('facebook.com')) {
                  Alert.alert(
                    'Sign-in via Facebook',
                    "Looks like you previously signed in via Facebook. You'll need to sign-in there to continue",
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Continue',
                        onPress: () => onFacebookLogin(),
                      },
                    ],
                  );
                } else {
                  Alert.alert(
                    'Login Error',
                    'Sign in using a different provider',
                  );
                }
              });
          } else {
            Alert.alert(
              'Login Error',
              'Unable to sign in using account, could not determine email',
            );
          }
        } else {
          Alert.alert('Login Error', error.toString());
        }
        setIsLoading(false);
      });
  }

  async function onAppleLogin() {
    setIsLoading(true);
    try {

      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      console.log('214214appleAuthRequestResponse', appleAuthRequestResponse);
  
      const {
        identityToken,
        fullName,
        email,
        nonce,
      } = appleAuthRequestResponse;
      const displayName = `${fullName.givenName} ${fullName.familyName}`;

      if (identityToken) {
        const appleCredential = firebase.auth.AppleAuthProvider.credential(
          identityToken,
          nonce,
        );
        setIsLoading(false);
        signInWithCredential(appleCredential, email, displayName);
      } else {
        setIsLoading(false);
        Alert.alert('Apple Sign-In Error', 'Unable to sign-in');
      }
    } catch (error) {
      console.log(error, 'appleError');
      setIsLoading(false);
    }
  }

  async function getFacebookProfile() {
    return new Promise((resolve) => {
      const infoRequest = new GraphRequest(
        '/me?fields=email,name',
        null,
        (error, result) => {
          if (error) {
            console.log(`Error fetching data: ${error.toString()}`);
            resolve(null);
            return;
          }

          resolve(result);
        },
      );
      new GraphRequestManager().addRequest(infoRequest).start();
    });
  }

  async function onFacebookLogin() {
    setIsLoading(true);
    // Attempt login with permissions
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        setIsLoading(false);
        throw 'User cancelled the login process';
      }
  
      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        setIsLoading(false);
        throw 'Something went wrong obtaining access token';
      }
      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );
  
      const profile = await getFacebookProfile();
  
      const { email, name } = profile;
  
      // Sign-in the user with the credential
      return signInWithCredential(facebookCredential, email, name);
    } catch (e) {
      console.log(252252252,e)
    }
    
  }

  
  async function onGoogleLogin() {
    setIsLoading(true);
    try {
      await GoogleSignin.configure({
        offlineAccess: false,
        webClientId:
          Platform.OS === 'ios'
            ? '460954975544-i2epg7f0ic07se90uh0k4a0t1cq7iofl.apps.googleusercontent.com' // client id
            : '460954975544-i2epg7f0ic07se90uh0k4a0t1cq7iofl.apps.googleusercontent.com',
      });
      await GoogleSignin.hasPlayServices();

      await GoogleSignin.signIn().then((data) => {
        // create a new firebase credential with the token
        const credential = firebase.auth.GoogleAuthProvider.credential(
          data.idToken,
          // data.accessToken,
        );

        // login with credential
        signInWithCredential(credential, data.user.email, data.user.name);
      });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        console.log(error, 'googleError');
      }
      setIsLoading(false);
    }
  }
  const handleAuthMethod = (authType) => {
    switch (authType) {
      case 'facebook':
        onFacebookLogin();
        break;
      case 'google':
        onGoogleLogin();
        break;
      case 'apple':
        onAppleLogin();
        break;
      case 'phone_email':
        closeCallback();
        navigation.navigate('AuthLogin');
        break;
      default:
    }
    return null;
  };

  const handleCloseLogin = () => {
    closeCallback();
    dispatch({
      type: 'SET_AFTER_LOGIN_ROUTE',
      payload: {
        afterLoginRoute: '',
        afterLoginParam: {},
      },
    });
  };
  return (
    <Container>
      <Text
        style={[
          typography.bold.h1,
          Custompadding.paddingBottomXLarge,
          {
            textTransform: 'capitalize',
          },
        ]}
      >
        access your account
      </Text>
      {!isLoading ? (
        <>
          {option.map(
            (item) =>
              item.showButton && (
                <ButtonWrapper
                  key={item.type}
                  onPress={() => {
                    handleAuthMethod(item.type);
                    // props.authCallback(item.type);
                  }}
                  style={[
                    Custompadding.paddingTopBottomRegular,
                    {
                      marginBottom: wp(4),
                      backgroundColor: item.bgColor,
                      borderWidth: 2,
                      borderColor: colors.GREYS.C7,
                    },
                  ]}
                >
                  {item.icon && (
                    <View style={{ height: wp(8.55), width: wp(8.55) }}>
                      <Image
                        source={item.icon}
                        alt="facebook"
                        style={{
                          height: '100%',
                          width: '100%',
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  )}
                  <Text
                    style={[
                      typography.bold.h4,
                      {
                        color:
                          item.type === 'facebook'
                            ? colors.white
                            : colors.black,
                        lineHeight: 28,
                        textAlign: 'center',
                      },
                    ]}
                  >
                    {item.value}
                  </Text>
                </ButtonWrapper>
              ),
          )}
          <TouchableOpacity
            onPress={handleCloseLogin}
            style={[Custompadding.paddingTopBottomXLarge]}
          >
            {GetIcon('chevron-down|FontAwesome5', colors.black, wp(4))}
          </TouchableOpacity>
        </>
      ) : (
        <View style={{ height: wp(100), width: wp(100) }}>
          <Image
            source={loader}
            alt="loader"
            style={{
              height: '100%',
              width: '100%',
              // resizeMode: 'contain',
            }}
          />
        </View>
      )}
    </Container>
  );
};
Login.propTypes = {
  // authCallback: PropTypes.func,
  setIsLoading: PropTypes.func,
  onLogin: PropTypes.func,
  closeCallback: PropTypes.func,
  dispatch: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default Login;

const Container = styled.View`
  justify-content: center;
  align-items: center;
`;
const ButtonWrapper = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  /* background-color: ${colors.BLUES.C3}; */
  border-radius: 14px;
  width: 100%;
`;
