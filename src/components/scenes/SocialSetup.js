/* eslint-disable no-console */
/* eslint-disable react/no-unescaped-entities */

import React, { useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {
  View,
  Text,
  Image,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,Alert
} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import InstagramLogin from 'react-native-instagram-login';
import Header from '../common/header';
import Loader from '../common/Loader';
import { colors, Custompadding, typography } from '../../styles/styleSheet';
import { wp, hp } from '../../utils/Dimensions';
import puppy from '../../assets/images/dog-bg.png';
import instaCheck from '../../assets/images/instagram-linked.png';
import instaCircle from '../../assets/images/insta-circle.png';
import facebookCircle from '../../assets/images/facebook-circle.png';
import fbCheck from '../../assets/images/facebook-linked.png';
import close from '../../assets/images/close_social.png';

import {
  useUpdateMissionSocialHook,
  useMissionDetailHook,
} from '../../app/shared/hooks';

const Social = (props) => {
  const instagramRef = useRef(null);
  const {
    route: { params: { missionId = null } = {} },
  } = props;

  const {
    instagram,
    facebook,
    unlink,
    updateSocial: { onSubmit, loader: updateLoader },
    socialLoader,
  } = useUpdateMissionSocialHook(props, {
    onSocialSuccess,
    onSocialError,
    missionId,
  });
  const {
    missionDetail: { loader: detailLoader },
  } = useMissionDetailHook(props, {
    missionId,
  });

  function onSocialSuccess({ data = {} }) {
    if (!missionId) {
      let mission = '';
      if (data && data.data && data.data.id) {
        mission = data.data.id;
      }
      props.navigation.navigate('Content', {
        missionId: mission,
      });
    } else {
      props.successToast('Mission Updated Successfully');
      props.navigation.navigate('MissionControl');
    }
  }
  function onSocialError() {}

  const setIgToken = (results,code) => {
    handleInstagramCode(results,code);
  };

  const handleInstagramCode = async (results, code) => {
    if (results && results.user_id) {
      instagram.onLink(code, results);
    } else {
      console.log(results);
    }
  };

  let textLabel = 'Next';
  if (!missionId) {
    textLabel = 'Next';
  } else if (socialLoader) {
    textLabel = 'Linking';
  } else if (missionId && !updateLoader) {
    textLabel = 'Save';
  } else if (missionId && updateLoader) {
    textLabel = 'Saving';
  }

  const handleUnlinkSocial = (type) => {
    Alert.alert(
      "Alert",
      `Are you sure want to unlink from ${type}`,
      [
        {
          text: "NO",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "YES", onPress: () => unlink.onSubmitUnlink({type: type})}
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View
        style={[
          Custompadding.paddingLeftRightLarge,
          Custompadding.paddingTopLarge,
        ]}
      >
        <Header
          heading="social"
          rightHeading={textLabel}
          backCallback={() => {
            props.navigation.goBack();
          }}
          textCallback={
            !detailLoader || !socialLoader || !updateLoader ? onSubmit: null
          }
        />
        {!missionId && (
          <View
            style={[
              Custompadding.paddingTopBottomRegular,
              // Custompadding.paddingBottomLarge,
              { justifyContent: 'center', alignItems: 'center' },
            ]}
          >
            <Progress.Bar
              progress={0.4}
              width={wp(55.73)}
              height={wp(2.4)}
              color={colors.GREEN.C1}
              unfilledColor={colors.GREYS.C7}
              borderWidth={1}
              borderColor={colors.GREYS.C7}
              borderRadius={7}
            />
          </View>
        )}
      </View>
      {socialLoader || detailLoader || updateLoader ? (
        <Loader />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Container
            style={[
              Custompadding.paddingBottomLarge,
              Custompadding.paddingTopRegular,
            ]}
          >
            <ImageBackground
              source={puppy}
              alt="location"
              style={{
                height: hp(80),
                width: wp(100),
                position: 'relative',
              }}
            />

            <LinearGradient
              useAngle
              angle={180}
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)']}
              style={{
                height: hp(60),
                width: '100%',
                position: 'absolute',
                bottom: 0,
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  // flexDirection: 'row',
                  // justifyContent: 'space-evenly',
                  // width: '100%',
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    instagramRef.current.show();
                  }}
                  style={{
                    flexDirection: 'row',
                    // alignSelf: 'flex-end',
                    // justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: wp(5.33),
                    marginLeft: wp(3.2),
                  }}
                >
                  {/* {instagram.link ? ( */}
                  {instagram.link ? (
                    <View>
                      <View style={{ height: 84, width: 64 }}>
                        <Image
                          source={instaCheck}
                          alt="instagram"
                          style={{
                            height: '100%',
                            width: '100%',
                            resizeMode: 'contain',
                          }}
                        />
                      </View>
                      <Text
                        style={[
                          typography.regular.h6,
                          { color: colors.secondaryBorderColor },
                        ]}
                      >
                        Instagram
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <View style={{ height: 84, width: 64 }}>
                        <Image
                          source={instaCircle}
                          alt="instagram"
                          style={{
                            height: '100%',
                            width: '100%',
                            resizeMode: 'contain',
                          }}
                        />
                      </View>
                      <Text
                        style={[
                          typography.regular.h6,
                          { color: colors.secondaryBorderColor },
                        ]}
                      >
                        Instagram
                      </Text>
                    </View>
                  )}
                  {instagram.link ? (
                    <Text
                      style={[
                        typography.bold.h6,
                        { color: colors.secondaryBorderColor },
                      ]}
                    >
                      {`@${instagram.id}`}
                    </Text>
                  ) : null}
                  {instagram.link ? (
                    <TouchableOpacity 
                    onPress={()=> handleUnlinkSocial('Instagram')}>
                    <View
                      style={{
                        height: 28,
                        width: 28,
                        backgroundColor: colors.white,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 100,
                        marginLeft: wp(2.67),
                      }}
                    >
                      <Image
                        source={close}
                        alt="close"
                        style={{
                          height: wp(2.67),
                          width: wp(2.67),
                          resizeMode: 'contain',
                        }}
                      ></Image>
                    </View>
                    </TouchableOpacity>
                  ) : null}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={facebook.onLink}
                  style={{
                    flexDirection: 'row',
                    // alignSelf: 'flex-end',
                    // justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: wp(5.33),
                    marginLeft: wp(3.2),
                  }}
                >
                  {/* {facebook.link ? ( */}
                  {facebook.link ? (
                    <View>
                      <View style={{ height: 84, width: 64 }}>
                        <Image
                          source={fbCheck}
                          alt="facebook"
                          style={{
                            height: '100%',
                            width: '100%',
                            resizeMode: 'contain',
                          }}
                        />
                      </View>
                      <Text
                        style={[
                          typography.regular.h6,
                          { color: colors.secondaryBorderColor },
                        ]}
                      >
                        facebook
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <View style={{ height: 84, width: 64 }}>
                        <Image
                          source={facebookCircle}
                          alt="facebook"
                          style={{
                            height: '100%',
                            width: '100%',
                            resizeMode: 'contain',
                          }}
                        />
                      </View>
                      <Text
                        style={[
                          typography.regular.h6,
                          { color: colors.secondaryBorderColor },
                        ]}
                      >
                        facebook
                      </Text>
                    </View>
                  )}
                  {facebook.link ? (
                    <Text
                      style={[
                        typography.bold.h6,
                        { color: colors.secondaryBorderColor },
                      ]}
                    >
                      {`${facebook.id}`}
                    </Text>
                  ) : null}
                  {facebook.link ? (
                    <TouchableOpacity 
                      onPress={()=> handleUnlinkSocial('Facebook')}>
                      <View
                        style={{
                          height: 28,
                          width: 28,
                          backgroundColor: colors.white,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 100,
                          marginLeft: wp(2.67),
                        }}
                      >
                        <Image
                          source={close}
                          alt="close"
                          style={{
                            height: wp(2.67),
                            width: wp(2.67),
                            resizeMode: 'contain',
                          }}
                        ></Image>
                      </View>
                    </TouchableOpacity>
                  ) : null}
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Container>
          <InstagramLogin
            ref={instagramRef}
            appId="300866088239686"
            appSecret="3863f8ef427477c6518de29d1a256225"
            redirectUrl="https://doosit-c41fe.firebaseapp.com/__/auth/handler"
            scopes={['user_profile', 'user_media']}
            onLoginSuccess={setIgToken}
            onLoginFailure={(data) => instagram.onLinkError(data)}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
Social.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
  successToast: PropTypes.func,
};
export default Social;
const Container = styled.View`
  background-color: ${colors.white};
  flex: 0.9;
`;
