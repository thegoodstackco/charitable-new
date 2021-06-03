import { useMemo } from 'react';
import { getDeviceToken } from '../../utils/token';

const checkDeviceToken = async (cb) => {
  const deviceInfo = await getDeviceToken();
  cb(deviceInfo);
};

export const useDeviceTokenHook = ({
  Dash_hoc: {
    actions: { REGISTER_DEVICE_TOKEN_API_CALL },
  },
  Dash_data: { REGISTER_DEVICE_TOKEN_API, userProfile = {} },
  getData,
}) => {
  const handleRegisterDeviceToken = () => {
    checkDeviceToken((tokenInfo) => {
      if (tokenInfo) {
        const payload = {
          user: userProfile && userProfile.id,
          device_token: tokenInfo,
        };
        REGISTER_DEVICE_TOKEN_API_CALL({
          request: {
            payload,
          },
          callback: {
            successCallback: () => {},
            errorCallback: () => {},
          },
        });
      }
    });
  };

  const registerToken = useMemo(() => {
    const token = getData(REGISTER_DEVICE_TOKEN_API, {}, false);
    return token;
  }, [REGISTER_DEVICE_TOKEN_API]);

  return {
    registerToken: {
      loader: registerToken.loader,
      onRegisterToken: handleRegisterDeviceToken,
    },
  };
};
