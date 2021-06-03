/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import ReactImage from 'react-native-image-progress';
import Header from '../common/header';
import { colors, Custompadding, typography } from '../../styles/styleSheet';
import { wp, hp } from '../../utils/Dimensions';
import { GetIcon } from '../../utils/Icons';
import CustomModal from '../common/modal';
import EditModal from '../sceneComponents/MissionControl/EditModal';
import Loader from '../common/Loader';
import { useMissionControlHook } from '../../app/shared/hooks';
import banner1 from '../../assets/images/mission_image.png';

const nf = new Intl.NumberFormat();

const MissionControl = (props) => {
  const [editModal, setEditModal] = useState(false);
  const {
    activeMissions,
    userMissionList: { loader: userMissionLoader, lastUpdated },
  } = useMissionControlHook(props);

  const menu = [
    {
      menuItem: 'Total Donation',
      amount:
        activeMissions &&
        activeMissions.length &&
        activeMissions[0].total_donation &&
        `$ ${nf.format((+activeMissions[0].total_donation).toFixed(2))}`,
      onPress: () =>
        props.navigation.navigate('AccountBalance', {
          mission: activeMissions[0],
        }),
    },
    // {
    //   menuItem: 'Transfer to Bank',
    //   onPress: null,
    // },
    { menuItem: 'Edit Mission', onPress: () => setEditModal(true) },
    // {
    //   menuItem: 'Mission Settings',
    //   onPress: null,
    // },
  ];

  const handleEditMission = (editType) => {
    setEditModal(false);
    if (editType !== 'endMission') {
      props.navigation.navigate(editType, { missionId: activeMissions[0].id });
    }
  };
  const handleStartMission = () => {
    props.dispatch({
      type: 'CLEAR_MISSION_PAYLOAD',
    });
    props.navigation.navigate('About');
  };
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <Container style={[Custompadding.paddingLarge]}>
          <Header
            heading="mission control"
            backCallback={() => {
              props.navigation.navigate('Landing');
            }}
          />
          {!lastUpdated && userMissionLoader ? (
            <Loader />
          ) : (
            <>
              {activeMissions && activeMissions.length ? (
                <ScrollView>
                  <View
                    style={[
                      Custompadding.paddingLeftRightXLarge,
                      Custompadding.paddingTopXLarge,
                      {
                        marginTop: wp(12),
                        borderWidth: 3,
                        borderColor: colors.secondaryBorderColor,
                        borderRadius: 15,
                      },
                    ]}
                  >
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <View style={{ height: wp(40), width: wp(40) }}>
                        {activeMissions[0].image && (
                          <ReactImage
                            source={{ uri: activeMissions[0].image }}
                            alt="mission"
                            style={{
                              height: '100%',
                              width: '100%',
                              resizeMode: 'cover',
                            }}
                          />
                        )}
                      </View>
                      <Text
                        style={[
                          Custompadding.paddingTopBottomLarge,
                          typography.bold.h1,
                          // { textTransform: 'capitalize' },
                        ]}
                      >
                        {activeMissions[0].title}
                      </Text>
                    </View>
                    {menu.map((item) => (
                      <TouchableOpacity
                        style={[
                          Custompadding.paddingTopBottomXLarge,
                          {
                            borderTopColor: colors.GREYS.C3,
                            borderTopWidth: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          },
                        ]}
                        onPress={item.onPress}
                      >
                        <Text style={[typography.regular.h4]}>
                          {item.menuItem}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          {item.amount && (
                            <Text
                              style={[
                                typography.bold.h4,
                                { marginRight: wp(2.63) },
                              ]}
                            >
                              {item.amount}
                            </Text>
                          )}
                          <Text>
                            {GetIcon(
                              'chevron-right|FontAwesome5',
                              colors.black,
                              wp(2.64),
                            )}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {/* <View
                    style={[
                      Custompadding.paddingTopBottomRegular,
                      Custompadding.paddingLeftLarge,

                      { flexDirection: 'row', flexWrap: 'wrap' },
                    ]}
                  >
                    <Text
                      style={[
                        typography.regular.h7,
                        { lineHeight: wp(5.33), marginRight: wp(1) },
                      ]}
                    >
                      If you qualify as a 501 3c email us at
                    </Text>
                    <Text
                      style={[
                        typography.bold.h7,
                        { lineHeight: wp(5.33), marginRight: wp(1) },
                      ]}
                    >
                      admin@charitable.com
                    </Text>
                    <Text
                      style={[typography.regular.h7, { lineHeight: wp(5.33) }]}
                    >
                      for verification.
                    </Text>
                  </View> */}
                </ScrollView>
              ) : (
                <View
                  style={[
                    Custompadding.paddingLeftRightLarge,
                    {
                      height: hp(80),
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    },
                  ]}
                >
                  <View style={{ height: hp(20), width: wp(100) }}>
                    <Image
                      source={banner1}
                      alt="banner1"
                      style={{
                        height: '100%',
                        width: '100%',
                        resizeMode: 'contain',
                      }}
                    ></Image>
                  </View>
                  <View>
                    <Text
                      style={[
                        typography.bold.h2,
                        Custompadding.paddingBottomRegular,
                        { textAlign: 'center' },
                      ]}
                    >
                      Create your mission today
                    </Text>
                    <Text
                      style={[
                        typography.regular.h2,
                        Custompadding.paddingBottomRegular,
                        // Custompadding.paddingLeftRightLarge,
                        { textAlign: 'center' },
                      ]}
                    >
                      A lot of little change can make a big change.
                    </Text>
                    <TouchableOpacity
                      onPress={handleStartMission}
                      style={{
                        backgroundColor: colors.GREYS.C7,
                        paddingVertical: wp(6.4),
                        // marginBottom: wp(2.64),
                        borderRadius: 14,
                      }}
                    >
                      <Text
                        style={[typography.bold.h4, { textAlign: 'center' }]}
                      >
                        Start a Mission
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={[
                        typography.regular.h6,
                        { lineHeight: wp(5.86), color: colors.GREYS.C8 },
                      ]}
                    >
                      {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. */}
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
        </Container>
      </SafeAreaView>

      <CustomModal
        visible={editModal}
        closeCallback={() => setEditModal(false)}
      >
        <EditModal onEditMission={handleEditMission} />
      </CustomModal>
    </>
  );
};
MissionControl.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
};
export default MissionControl;
const Container = styled.View`
  background-color: ${colors.white};
  flex: 1;
`;
