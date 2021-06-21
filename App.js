/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import 'react-native-gesture-handler';
 import React, { useEffect } from 'react';
 import PropTypes from 'prop-types';
 import { NavigationContainer } from '@react-navigation/native';
 import { createStackNavigator } from '@react-navigation/stack';
 import auth from '@react-native-firebase/auth';
 import Toast from 'react-native-root-toast';
 import messaging from '@react-native-firebase/messaging';
 import Icon from 'react-native-vector-icons/MaterialIcons';
 // import CustomStatusbar from './src/components/common/customStatusbar';
 import HomePage from './src/components/scenes/HomePage';
 import AuthLogin from './src/components/scenes/AuthLogin';
 import OtpVerification from './src/components/scenes/OtpVerification';
 import ForgotPassword from './src/components/scenes/ForgotPassword';
 import Profile from './src/components/scenes/Profile';
 import CreateMission from './src/components/scenes/CreateMission';
 import About from './src/components/scenes/AboutSetup';
 import Social from './src/components/scenes/SocialSetup';
 import Content from './src/components/scenes/ContentSetup';
 import Milestone from './src/components/scenes/Milestone';
 import MissionPreview from './src/components/scenes/MissionPreview';
 import PublishedMission from './src/components/scenes/PublishedMission';
 import Landing from './src/components/scenes/Landing';
 import MissionControl from './src/components/scenes/MissionControl';
 import AccountBalance from './src/components/scenes/AccountBalance';
 import Settings from './src/components/scenes/Settings';
 import Notifications from './src/components/scenes/Notifications';
 import FindMission from './src/components/scenes/FindMission';
 import SearchMission from './src/components/scenes/SearchMission';
 import ContributionHistory from './src/components/scenes/ContributionHistory';
 import RoundUps from './src/components/scenes/RoundUps';
 import LinkedAccount from './src/components/scenes/LinkedAccount';
 import AccountDetail from './src/components/scenes/AccountDetail';
 import CardList from './src/components/scenes/CardList';
 import LinkedCards from './src/components/scenes/LinkedCards';
 import PlaidAccounts from './src/components/scenes/PlaidAccounts';
 import Dashboard from './src/components/scenes/Dashboard';
 import SplashScreen from './src/components/scenes/SplashScreen';
 import Location from './src/components/scenes/Location';
 import CustomCardScreen from './src/components/sceneComponents/Payments/CustomCardScreen';
 import RecurringPayment from './src/components/sceneComponents/Payments/RecurringPayment';
 import SaveCard from './src/components/sceneComponents/Payments/SaveCard';
 import RoundOffPayment from './src/components/sceneComponents/Payments/RoundOffPayment';
 import PaymentAuth from './src/components/sceneComponents/Payments/PaymentAuth';
 import ViewPDF from './src/components/scenes/ViewPDF';
 import TransferBalance from './src/components/scenes/TransferBalance';
 import { DashboardHoc } from './src/app/shared/Hoc';
 // import ToastContainer from './src/components/common/Toast';
 // import Loader from './src/components/common/Loader';
 import { colors } from './src/styles/styleSheet';
 import { useDeviceTokenHook } from './src/app/shared/hooks';
 import { setDeviceToken } from './src/app/shared/utils/token';
 
 const Stack = createStackNavigator();
 
 // eslint-disable-next-line no-console
 console.disableYellowBox = true;
 GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
 // GLOBAL.FormData = GLOBAL.originalFormData
 //   ? GLOBAL.originalFormData
 //   : GLOBAL.FormData;
 
 const App = (props) => {
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
     Icon.loadFont();
   }, []);
 
   useEffect(() => {
     console.log(userProfile && userProfile.id, 'userProfile && userProfile.id');
     if (isLoggedIn && userProfile && userProfile.id) {
       onRegisterToken();
     }
   }, [isLoggedIn && Object.keys(userProfile).length]);
 
   useEffect(() => {
     requestUserPermission();
     const unsubscribe = messaging().onMessage(async (remoteMessage) => {
       alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
     });
 
     return unsubscribe;
   }, []);
 
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
 
   useEffect(() => {
     // Assume a message-notification contains a "type" property in the data payload of the screen to open
 
     messaging().onNotificationOpenedApp((remoteMessage) => {
       console.log(
         'Notification caused app to open from background state:',
         remoteMessage.notification,
       );
       // navigation.navigate(remoteMessage.data.type);
     });
 
     // Check whether an initial notification is available
     messaging()
       .getInitialNotification()
       .then((remoteMessage) => {
         if (remoteMessage) {
           console.log(
             'Notification caused app to open from quit state:',
             remoteMessage.notification,
           );
           // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
         }
       });
   }, []);
 
   const onAuthStateChanged = (user) => {
     // eslint-disable-next-line no-console
     // console.log(user, 'firebase user');
     props.dispatch({
       type: 'UPDATE_FIREBASE_PROFILE',
       payload: {
         // isLoggedIn: !!user,
         isInitialize: false,
         profile: user,
       },
     });
   };
 
   useEffect(() => {
     if (authListener) {
       const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
       return subscriber;
     }
     return null;
   }, []);
 
   const showToast = (message, backgroundColor) => {
     Toast.show(message, {
       backgroundColor,
       duration: Toast.durations.LONG,
       position: Toast.positions.BOTTOM,
       shadow: true,
       animation: true,
       hideOnPress: true,
       delay: 0,
       onShow: () => {
         // calls on toast\`s appear animation start
       },
       onShown: () => {
         // calls on toast\`s appear animation end.
       },
       onHide: () => {
         // calls on toast\`s hide animation start.
       },
       onHidden: () => {
         // calls on toast\`s hide animation end.
       },
     });
   };
 
   function successToast(message) {
     showToast(message, colors.GREEN.C1);
   }
   function errorToast(message) {
     showToast(message, 'red');
   }
 
   const customProps = {
     ...props,
     successToast,
     errorToast,
   };
 
   const deepLinking = {
     prefixes: ['charitableApp://'],
     config: {
       screens: {
         Home: 'Home',
         Landing: 'Landing',
         Mission: {
           path: 'MissionDetail/:missionId',
           params: {
             missionId: null,
           },
         },
       },
     },
   };
 
   return (
     <>
       <NavigationContainer linking={deepLinking}>
         <Stack.Navigator initialRouteName="SplashScreen" headerMode="none">
           {isLoggedIn ? (
             <>
               <Stack.Screen name="Landing">
                 {(navigationProps) => (
                   <Landing {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="StartMission">
                 {(navigationProps) => (
                   <CreateMission {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="About">
                 {(navigationProps) => (
                   <About {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="Social">
                 {(navigationProps) => (
                   <Social {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="Content">
                 {(navigationProps) => (
                   <Content {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="Milestone">
                 {(navigationProps) => (
                   <Milestone {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="Preview">
                 {(navigationProps) => (
                   <MissionPreview {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="MissionControl">
                 {(navigationProps) => (
                   <MissionControl {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="AccountBalance">
                 {(navigationProps) => (
                   <AccountBalance {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="Settings">
                 {(navigationProps) => (
                   <Settings {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="Notifications">
                 {(navigationProps) => (
                   <Notifications {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="History">
                 {(navigationProps) => (
                   <ContributionHistory {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="SearchMission">
                 {(navigationProps) => (
                   <SearchMission {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="Dashboard">
                 {(navigationProps) => (
                   <Dashboard {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="Location">
                 {(navigationProps) => (
                   <Location {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="RoundUps">
                 {(navigationProps) => (
                   <RoundUps {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="LinkedAccount">
                 {(navigationProps) => (
                   <LinkedAccount {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="AccountDetail">
                 {(navigationProps) => (
                   <AccountDetail {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="CardList">
                 {(navigationProps) => (
                   <CardList {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="LinkedCards">
                 {(navigationProps) => (
                   <LinkedCards {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="PlaidAccounts">
                 {(navigationProps) => (
                   <PlaidAccounts {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="SaveCard">
                 {(navigationProps) => (
                   <SaveCard {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="CustomCardScreen">
                 {(navigationProps) => (
                   <CustomCardScreen {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="RecurringPayment">
                 {(navigationProps) => (
                   <RecurringPayment {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="RoundOffPayment">
                 {(navigationProps) => (
                   <RoundOffPayment {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="PaymentAuth">
                 {(navigationProps) => (
                   <PaymentAuth {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="ViewPDF">
                 {(navigationProps) => (
                   <ViewPDF {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="TransferBalance">
                 {(navigationProps) => (
                   <TransferBalance {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
             </>
           ) : (
             <>
               <Stack.Screen name="SplashScreen">
                 {(navigationProps) => (
                   <SplashScreen {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="Home">
                 {(navigationProps) => (
                   <HomePage {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="AuthLogin">
                 {(navigationProps) => (
                   <AuthLogin {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="Otp">
                 {(navigationProps) => (
                   <OtpVerification {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
               <Stack.Screen name="ForgotPassword">
                 {(navigationProps) => (
                   <ForgotPassword {...customProps} {...navigationProps} />
                 )}
               </Stack.Screen>
             </>
           )}
           <Stack.Screen name="Profile">
             {(navigationProps) => (
               <Profile {...customProps} {...navigationProps} />
             )}
           </Stack.Screen>
           <Stack.Screen name="Mission">
             {(navigationProps) => (
               <PublishedMission {...customProps} {...navigationProps} />
             )}
           </Stack.Screen>
           <Stack.Screen name="FindMission">
             {(navigationProps) => (
               <FindMission {...customProps} {...navigationProps} />
             )}
           </Stack.Screen>
         </Stack.Navigator>
       </NavigationContainer>
     </>
   );
 };
 
 App.propTypes = {
   Dash_data: PropTypes.object,
   // Dash_hoc: PropTypes.object,
   dispatch: PropTypes.func,
 };
 
 export default DashboardHoc(App);
 