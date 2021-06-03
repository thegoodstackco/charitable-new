/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/**
 * @format
 */
 import React from 'react';
 import { AppRegistry } from 'react-native';
 import { Provider } from 'react-redux';
 import { store as configureStore } from 'react-boilerplate-redux-saga-hoc';
 import { SafeAreaProvider } from 'react-native-safe-area-context';
 import { RootSiblingParent } from 'react-native-root-siblings';
 import messaging from '@react-native-firebase/messaging';
 import App from './App';
 import { name as appName } from './app.json';
 
 const initialState = {};
 
 const store = configureStore(initialState);
 
 // Register background handler
 messaging().setBackgroundMessageHandler(async (remoteMessage) => {
   // eslint-disable-next-line no-console
   console.log('Message handled in the background!', remoteMessage);
 });
 
 function HeadlessCheck(props) {
   const { isHeadless } = props;
   if (isHeadless) {
     // App has been launched in the background by iOS, ignore
     return null;
   }
 
   return (
     <SafeAreaProvider>
       <Provider store={store}>
         <RootSiblingParent>
           <App {...props} />
         </RootSiblingParent>
       </Provider>
     </SafeAreaProvider>
   );
 }
 
 AppRegistry.registerComponent(appName, () => HeadlessCheck);
 