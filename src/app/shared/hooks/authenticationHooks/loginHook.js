/* eslint-disable no-console */
import { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';

export const useLoginHook = (
  {
    Dash_hoc: {
      actions: { LOGIN_API_CALL, LOGIN_EMAIL_API_CALL, GET_PROFILE_API_CALL },
      axios,
    },
    Dash_data: { LOGIN_API, LOGIN_EMAIL_API, afterLoginRoute, afterLoginParam },
    getData,
    dispatch,
  },
  { onLoginSuccess, onLoginError } = {},
) => {
  const navigation = useNavigation();
  const handleLogin = (payload, isEmail) => {
    let endPoint = LOGIN_API_CALL;
    if (isEmail) {
      endPoint = LOGIN_EMAIL_API_CALL;
    }
    endPoint({
      request: {
        payload,
      },
      callback: {
        successCallback: ({ res, data, message, status }) => {
          // eslint-disable-next-line no-param-reassign
          axios.defaults.headers.common.Authorization = `JWT ${data.data.token}`;
          GET_PROFILE_API_CALL({
            request: {
              params: {
                userId: data.data.user_id,
              },
            },
            callback: {
              successCallback: (profileData) => {
                if (!profileData.data.data.profile_complete) {
                  navigation.navigate('Profile', {
                    emailInfo: '',
                    password: '',
                    showEmail: true,
                    showPhone: true,
                  });
                } else if (
                  profileData.data.data.profile_complete &&
                  afterLoginRoute
                ) {
                  navigation.navigate(afterLoginRoute, afterLoginParam);
                  dispatch({
                    type: 'SET_AFTER_LOGIN_ROUTE',
                    payload: {
                      afterLoginRoute: '',
                      afterLoginParam: {},
                    },
                  });
                } else {
                  navigation.navigate('Landing');
                  dispatch({
                    type: 'SET_AFTER_LOGIN_ROUTE',
                    payload: {
                      afterLoginRoute: '',
                      afterLoginParam: {},
                    },
                  });
                }
              },
            },
          });
          onLoginSuccess({ res, data, message, status });
        },
        errorCallback: ({
          error,
          errorData: responseErrorParser,
          message,
          status,
          errors,
        }) => {
          // console.error(message);
          onLoginError({ error, responseErrorParser, message, status, errors });
        },
      },
    });
  };

  const logInInfo = useMemo(() => getData(LOGIN_API, [], false), [LOGIN_API]);
  const logInEmailInfo = useMemo(() => getData(LOGIN_EMAIL_API, [], false), [
    LOGIN_EMAIL_API,
  ]);

  return {
    onLogin: handleLogin,
    loginLoader: logInInfo.loader,
    loginEmailLoader: logInEmailInfo.loader,
  };
};
