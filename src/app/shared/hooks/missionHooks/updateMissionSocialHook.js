/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { useState, useMemo, useEffect } from 'react';
import { NativeModules } from 'react-native';
import axios from 'axios';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

const instagramBaseUrl = 'https://www.instagram.com/';

export const useUpdateMissionSocialHook = (
  {
    Dash_hoc: {
      actions: { UPDATE_MISSION_API_CALL },
    },
    Dash_data: {
      UPDATE_MISSION_API,
      GET_MISSION_BY_ID_API,
      createMissionPayload: { social },
    },
    getData,
    dispatch,
  },
  { onSocialSuccess, onSocialError, missionId = null } = {},
) => {
  const [instagramId, setInstagramId] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [facebookId, setFacebookId] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [isLoading, setIsLoading] = useState('');

  useEffect(() => {
    if (!missionId && Object.keys(social).length) {
      setInstagramId(social.insta_token);
      setInstagramLink(social.insta_link);
      setFacebookId(social.facebook_token);
      setFacebookLink(social.facebook_link);
    }
  }, [missionId, social]);

  const getInstagramUserProfile = async (token) => {
    const igBaseUrl = 'https://graph.instagram.com/me';
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const httpRequest = axios.create({
      baseURL: `${igBaseUrl}`,
      headers,
      method: 'get',
    });
    setIsLoading(true);
    httpRequest({
      params: { fields: 'id,username', access_token: token },
    })
      .then(({ data }) => {
        setIsLoading(false);
        setInstagramId(data.username);
        setInstagramLink(`${instagramBaseUrl}${data.username}`);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err, 'instagram profile err');
      });
  };

  const handleLinkInstagram = (instagramData, results) => {
    setInstagramId(instagramData.data.username);
    setInstagramLink(`${instagramBaseUrl}${instagramData.data.username}`);
    //getInstagramUserProfile(instagramData.access_token);
  };

  const handleLinkInstagramError = (errorData) => {
    console.log(errorData, 'errorData');
  };

  const handleInstagramCode = async (code, results) => {
    if (results.access_token) {
      const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      const http = axios.create({
        baseURL: 'https://graph.instagram.com/',
        headers,
      });
      setIsLoading(true);
      const res = await http.get(`${results.user_id}?fields=id,username&access_token=${results.access_token}`).catch((error) => {
        setIsLoading(false);
        return false;
      });
      if (res) {
        setIsLoading(false);
        handleLinkInstagram(res, results);
      } else {
        setIsLoading(false);
        console.log(results);
      }
    } else {
      //handleLinkInstagram(code, results);
    }
  };

  

  async function getFacebookProfile() {
    return new Promise((resolve) => {
      const infoRequest = new GraphRequest(
        '/me',
        {
          parameters: {
            fields: {
              string: 'email,name,link',
            },
          },
        },
        (error, result) => {
          if (error) {
            console.log(`Error fetching data: ${error.toString()}`);
            resolve(null);
            setIsLoading(false);
            return;
          }

          resolve(result);
        },
      );
      new GraphRequestManager().addRequest(infoRequest).start();
    });
  }

  const getFacebookPage = async (userAccessToken) => {
    if (
      userAccessToken &&
      userAccessToken.permissions.includes('pages_show_list')
    ) {
      const fbBaseUrl = `https://graph.facebook.com/${userAccessToken.userID}/accounts/`;
      const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      const httpRequest = axios.create({
        baseURL: `${fbBaseUrl}`,
        headers,
        method: 'get',
      });
      setIsLoading(true);
      httpRequest({
        params: { access_token: userAccessToken.accessToken },
      })
        .then(({ data }) => {
          setIsLoading(false);
          // Linked Pages
          if (data.data && data.data.length) {
            setFacebookId(data.data[0].name);
            setFacebookLink(`https://www.facebook.com/${data.data[0].id}/`);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err, 'fb profile err');
        });
    }
  };

  const handleLinkFacebook = async () => {
    setIsLoading(true);
    try {
      await LoginManager.logInWithPermissions([
        'public_profile',
        // 'email',
        // 'user_link',
        'pages_show_list',
      ])
        .then(async (data) => {
          console.log(data, 'fb data');
          // TODO handle declinedPermissions permissions
          if (data.isCancelled) {
            setIsLoading(false);
          }
          const accessToken = await AccessToken.getCurrentAccessToken();
          // const profile = await getFacebookProfile();
          // console.log(profile, 'fb profile');
          const page = await getFacebookPage(accessToken);
          console.log(page, 'fb page');

          // setFacebookId(profile.email);
          // setFacebookLink(profile.link);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err, 'err');
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error, 'err');
      setIsLoading(false);
    }
  };

  const handelUpdateMissionSocialLinks = async(requestData) => {
    const formError = [];
    if (!formError.length) {
      var payload ;
      if(requestData && requestData.type === 'Instagram'){
        await setInstagramId('');
        await setInstagramLink('');
        payload = {
          insta_token: '',
          insta_link: '',
          facebook_token: facebookId,
          facebook_link: facebookLink,
        };
      }else if(requestData && requestData.type === 'Facebook'){
        await setFacebookId('');
        await setFacebookLink('');
        payload = {
          facebook_token: '',
          facebook_link: '',
          insta_token: instagramId,
          insta_link: instagramLink,
        };
      }else {
        payload = {
          insta_token: instagramId,
          insta_link: instagramLink,
          facebook_token: facebookId,
          facebook_link: facebookLink,
        };
      }
      if (!missionId) {
        dispatch({
          type: 'UPDATE_MISSION_PAYLOAD',
          payload: {
            key: 'social',
            data: payload,
          },
        });
        onSocialSuccess({ data: {} });
      } else {
        const params = { missionId };
        const formData = new FormData();
        Object.entries(payload).map(([key, value]) => {
          if (value) formData.append(key, value);
          return null;
        });
        UPDATE_MISSION_API_CALL({
          request: {
            payload: formData,
            params,
            axiosConfig: {
              headers: {
                'content-type': 'multipart/form-data',
                accept: 'application/json',
              },
            },
          },
          callback: {
            successCallback: ({ res, data, message, status }) => {
              // console.log(238,res)
              // console.log(239,data)
              // console.log(240,message)
              console.log(241,status)
              onSocialSuccess({ res, data, message, status });
            },
            errorCallback: ({ error, errorData, message, status, errors }) => {
              console.log(24122,error)
              console.log(24222,errorData)
              console.log(24322,message)
              console.log(24422,status)
              console.log(24522,errors)
              onSocialError({
                error,
                errorData,
                message,
                status,
                errors,
              });
            },
          },
        });
      }
    }
  };



  const updateSocial = useMemo(() => getData(UPDATE_MISSION_API, [], false), [
    UPDATE_MISSION_API,
  ]);

  const missionDetail = useMemo(() => {
    const missionInfo = getData(GET_MISSION_BY_ID_API, {}, false);
    if (missionInfo.data && Object.keys(missionInfo.data).length) {
      const missionData = missionInfo.data;
      setInstagramLink(missionData.insta_link);
      setFacebookLink(missionData.facebook_link);
      setInstagramId(missionData.insta_token);
      setFacebookId(missionData.facebook_token);
    }
    return missionInfo;
  }, [GET_MISSION_BY_ID_API]);

  return {
    instagram: {
      id: instagramId,
      link: instagramLink,
      onLink: handleInstagramCode,
      onLinkError: handleLinkInstagramError,
    },
    unlink:{
      onSubmitUnlink: handelUpdateMissionSocialLinks,
    },
    facebook: {
      id: facebookId,
      link: facebookLink,
      onLink: handleLinkFacebook,
    },
    updateSocial: {
      onSubmit: handelUpdateMissionSocialLinks,
      loader: updateSocial.loader,
      missionDetail,
    },
    socialLoader: isLoading,
  };
};
