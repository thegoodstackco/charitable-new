import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Keyboard,
  Image as ReactImage,
} from 'react-native';
import styled from 'styled-components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';
import Image from 'react-native-image-progress';
import Modal from '../common/modal';
import Header from '../common/header';
import CustomInput from '../common/CustomTextField';
import { colors, Custompadding, typography } from '../../styles/styleSheet';
import profile from '../../assets/images/dummy-profile.png';
import camera from '../../assets/images/camera-icon.png';
import gallery from '../../assets/images/gallery.png';
import { wp, hp } from '../../utils/Dimensions';
import { useProfileHook } from '../../app/shared/hooks';

const Profile = (props) => {
  const nameRef = useRef(null);
  const mobileRef = useRef(null);
  const emailRef = useRef(null);
  const pinCodeRef = useRef(null);

  const {
    Dash_data: { afterLoginRoute, afterLoginParam },
    route,
    successToast,
    errorToast,
    navigation,
    dispatch,
  } = props;
  const { password = '', isEdit } = route.params;
  const [uploadOptionsVisible, setUploadOptionsVisible] = useState(false);
  const {
    name,
    mobile,
    email,
    pinCode,
    image,
    onSubmit,
    createProfile,
    updateProfile,
    isEmailDisabled,
    profileInfo,
  } = useProfileHook(props, {
    onSuccess,
    onError,
    onFormError,
    password,
    isEdit,
  });

  function onSuccess() {
    successToast('Profile Updated Successfully');
    if (afterLoginRoute) {
      navigation.navigate(afterLoginRoute, afterLoginParam);
    } else {
      navigation.navigate('Landing');
    }
    dispatch({
      type: 'SET_AFTER_LOGIN_ROUTE',
      payload: {
        afterLoginRoute: '',
        afterLoginParam: {},
      },
    });
  }

  function onError({ message }) {
    if (message) {
      errorToast(message.toString(message));
    } else {
      errorToast('Something went wrong');
    }
  }

  function onFormError() {
    errorToast('Please fix errors in your form before update');
  }

  const uploadFile = (uploadType) => {
    const options = {
      multiple: false,
      mediaType: 'photo',
    };
    (uploadType === 'picker' ? ImagePicker.openPicker : ImagePicker.openCamera)(
      options,
    )
      .then((imageData) => {
        const imageInfo = {
          name: Platform.OS === 'ios' ? imageData.filename : 'Mission',
          type: imageData.mime,
          // ext: imageData.type ? imageData.type : imageData.path.split('.')[1],
          uri: imageData.path,
        };
        image.onChange(imageInfo, { uri: imageData.path });
        setUploadOptionsVisible(false);
      })
      .catch((e) => {
        setUploadOptionsVisible(false);
        // eslint-disable-next-line no-console
        console.log(e);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <View style={[Custompadding.paddingLarge, { flex: 1 }]}>
          <Header
            heading="setup your profile"
            rightHeading={
              createProfile || updateProfile ? 'Submitting' : 'done'
            }
            successText
            backCallback={() => {
              navigation.navigate('Landing');
              // props.navigation.goBack();
            }}
            noBack={
              !(
                profileInfo &&
                profileInfo.data &&
                profileInfo.data.profile_complete
              )
            }
            textCallback={createProfile || updateProfile ? null : onSubmit}
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: wp(8.5),
            }}
          >
            <ImageWrapper
              style={{ height: wp(28), width: wp(28), marginBottom: wp(5.8) }}
            >
              <Image
                source={image.value || profile}
                alt="placeholder"
                style={{
                  height: 120,
                  width: 120,
                  borderRadius: 600,
                }}
                imageStyle={{
                  height: 120,
                  width: 120,
                  resizeMode: 'cover',
                  borderRadius: 60,
                }}
              />
            </ImageWrapper>
            <TouchableOpacity
              style={{
                backgroundColor: colors.GREYS.C7,
                paddingHorizontal: wp(6.93),
                paddingVertical: wp(3.2),
                borderRadius: 22,
              }}
              // onPress={() => {
              //   uploadFile('cam');
              // }}
              onPress={() => setUploadOptionsVisible(true)}
            >
              <Text style={[typography.regular.h7]}>Change picture</Text>
            </TouchableOpacity>
            {image.error ? (
              <Text
                style={[
                  typography.regular.h7,
                  { color: colors.error, paddingTop: 10 },
                ]}
              >
                Please upload image
              </Text>
            ) : null}
          </View>
          <View style={[Custompadding.paddingBottomRegular]}>
            <CustomInput
              ref={nameRef}
              returnKeyType="next"
              placeholder="name"
              onChangeText={name.onChange}
              onBlur={name.onBlur}
              value={name.value}
              errorText={name.error}
              onSubmitEditing={() => {
                mobileRef.current.focus();
                if (isEmailDisabled) {
                  mobileRef.current.focus();
                } else {
                  emailRef.current.focus();
                }
              }}
            />
          </View>
          <View style={[Custompadding.paddingBottomRegular]}>
            <CustomInput
              ref={mobileRef}
              placeholder="phone"
              onChangeText={mobile.onChange}
              onBlur={mobile.onBlur}
              value={mobile.value}
              errorText={mobile.error}
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={() => pinCodeRef.current.focus()}
              // disabled={!isEmailDisabled}
            />
          </View>
          <View style={[Custompadding.paddingBottomRegular]}>
            <CustomInput
              ref={emailRef}
              returnKeyType="next"
              placeholder="email"
              onChangeText={email.onChange}
              onBlur={email.onBlur}
              value={email.value}
              errorText={email.error}
              disabled={isEmailDisabled}
              onSubmitEditing={() => pinCodeRef.current.focus()}
            />
          </View>
          <View style={[Custompadding.paddingBottomRegular]}>
            <CustomInput
              ref={pinCodeRef}
              returnKeyType="done"
              placeholder="zipcode"
              onChangeText={pinCode.onChange}
              onBlur={pinCode.onBlur}
              value={pinCode.value}
              errorText={pinCode.error}
              keyboardType="numeric"
              onSubmitEditing={() => {
                if (Keyboard) Keyboard.dismiss();
                onSubmit();
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>

      <Modal
        visible={uploadOptionsVisible}
        closeCallback={() => setUploadOptionsVisible(false)}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 30,
          }}
        >
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '50%',
            }}
            onPress={() => {
              uploadFile('picker');
            }}
          >
            <View style={{ width: wp(8), height: hp(8) }}>
              <ReactImage
                source={gallery}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                }}
              />
            </View>
            <Text
              style={[
                typography.bold.h4,
                {
                  lineHeight: wp(7.2),
                  textTransform: 'capitalize',
                },
              ]}
            >
              upload photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '50%',
            }}
            onPress={() => {
              uploadFile('cam');
            }}
          >
            <View style={{ width: wp(8), height: hp(8) }}>
              <ReactImage
                source={camera}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                }}
              />
            </View>
            <Text
              style={[
                typography.bold.h4,
                {
                  lineHeight: wp(7.2),
                  textTransform: 'capitalize',
                },
              ]}
            >
              Take photo
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
Profile.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
  Dash_data: PropTypes.object,
  successToast: PropTypes.func,
  errorToast: PropTypes.func,
  dispatch: PropTypes.func,
};

export default Profile;
// const Container = styled.View`
//   background-color: ${colors.white};
//   flex: 1;
// `;
const ImageWrapper = styled.View`
  background-color: ${colors.GREYS.C7};
  border-radius: 100px;
`;
