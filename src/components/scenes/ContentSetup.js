/* eslint-disable no-console */
/* eslint-disable indent */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import * as Progress from 'react-native-progress';
import ImagePicker from 'react-native-image-crop-picker';
import Image from 'react-native-image-progress';
import Header from '../common/header';
import EmptyState from '../common/EmptyState';
import Loader from '../common/Loader';
import {
  colors,
  Custompadding,
  typography,
  // width,
} from '../../styles/styleSheet';
import { wp } from '../../utils/Dimensions';
import CustomModal from '../common/modal';
import ConfirmationModal from '../common/ConfirmationModal';
import {
  useContentSetupHook,
  useMissionDetailHook,
} from '../../app/shared/hooks';

const MAX_COUNT = 5;

const Content = (props) => {
  const {
    route: { params: { missionId = null } = {} },
  } = props;

  // const cleanTempImages = () => {
  //   ImagePicker.clean()
  //     .then(() => {
  //       console.log('removed all tmp images from tmp directory');
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
  // };

  useEffect(() => {
    // cleanTempImages();
  }, []);

  const {
    cameraRollImages,
    onSelectImages,
    showModal,
    onRemoveConfirm,
    onModalShowClose,
    updateContent: { onSubmit, loader: updateLoader },
    deleteContent: { loader: deleteLoader },
  } = useContentSetupHook(props, {
    onAddRemoveSuccess,
    onAddRemoveError,
    onContentSuccess,
    onContentError,
    missionId,
    maxCount: MAX_COUNT,
  });

  const {
    missionDetail: { loader: detailLoader },
    getMissionDetail,
  } = useMissionDetailHook(props, {
    missionId,
  });

  function onAddRemoveSuccess() {
    props.successToast('Content Removed Successfully');
    getMissionDetail();
  }
  function onAddRemoveError(error) {
    props.errorToast(error);
  }

  function onContentSuccess({ data = {} }) {
    if (!missionId) {
      let mission = '';
      if (data && data.data && data.data.id) {
        mission = data.data.id;
      }
      // cleanTempImages();
      props.navigation.navigate('Milestone', {
        missionId: mission,
      });
    } else {
      props.successToast('Mission Updated Successfully');
      props.navigation.navigate('MissionControl');
    }
  }

  function onContentError({ errors }) {
    props.errorToast(JSON.stringify(errors));
  }
  const handleCameraRoll = () => {
    if (cameraRollImages.length < MAX_COUNT) {
      const options = {
        title: 'Upload Image',
        maxWidth: 600,
        maxHeight: 600,
        multiple: true,
        mediaType: 'photo',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      ImagePicker.openPicker(options)
        .then((imageData) => {
          onSelectImages(imageData);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log(e);
        });
    } else {
      props.errorToast(
        `Maximum of no of images allowed only ${MAX_COUNT}, Remove any unwanted image to add image from camera roll`,
      );
    }
  };

  let textLabel = 'Next';
  if (missionId) {
    textLabel = 'Save';
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <View
          style={[
            Custompadding.paddingLeftRightLarge,
            Custompadding.paddingTopLarge,
          ]}
        >
          <Header
            heading="content"
            rightHeading={updateLoader || deleteLoader ? 'Updating' : textLabel}
            backCallback={() => {
              props.navigation.goBack();
            }}
            textCallback={
              updateLoader || deleteLoader || detailLoader ? null : onSubmit
            }
          />
          {!missionId && (
            <View
              style={[
                Custompadding.paddingTopRegular,
                Custompadding.paddingBottomLarge,
                { justifyContent: 'center', alignItems: 'center' },
              ]}
            >
              <Progress.Bar
                progress={0.6}
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
        {detailLoader || updateLoader || deleteLoader ? (
          <Loader />
        ) : (
          <>
            <ScrollView showsVerticalScrollIndicator={false}>
              {cameraRollImages && cameraRollImages.length ? (
                cameraRollImages.map((image, index) => (
                  <TouchableOpacity
                    onPress={() => onModalShowClose(index, image)}
                    style={{
                      // height: width * 1,
                      // width: wp(100),
                      marginBottom: wp(2.64),
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      source={{ uri: image.file || image.uri }}
                      alt="location"
                      style={{
                        height: wp(100),
                        width: wp(100),
                        // resizeMode: 'cover',
                        // aspectRatio: 1,
                      }}
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <EmptyState message="Content is empty" />
              )}
            </ScrollView>
            <TouchableOpacity onPress={handleCameraRoll}>
              <Text
                style={[
                  typography.regular.h5,
                  {
                    lineHeight: 20,
                    textTransform: 'capitalize',
                    textAlign: 'center',
                    marginVertical: wp(2.64),
                  },
                ]}
              >
                Add from camera roll
              </Text>
            </TouchableOpacity>
          </>
        )}
      </SafeAreaView>
      <CustomModal
        noClose
        visible={showModal}
        closeCallback={() => onModalShowClose('')}
      >
        <ConfirmationModal
          customText="Are you sure you want to delete this image? "
          confirmText={deleteLoader ? 'deleting' : 'delete'}
          onConfirm={!deleteLoader ? onRemoveConfirm : null}
          onClose={() => onModalShowClose('')}
        />
      </CustomModal>
    </>
  );
};
Content.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
  errorToast: PropTypes.bool,
  successToast: PropTypes.bool,
};
export default Content;
