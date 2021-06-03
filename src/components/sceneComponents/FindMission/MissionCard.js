import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { View, Text, TouchableOpacity } from 'react-native';
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { wp } from '../../../utils/Dimensions';
import {
  Custompadding,
  typography,
  colors,
  width,
} from '../../../styles/styleSheet';
import puppy from '../../../assets/images/puppy.png';
import { GetIcon } from '../../../utils/Icons';
import { useMilestoneProgressHook } from '../../../app/shared/hooks';
import { convertNumber } from '../../../app/shared/utils/convertNumber';

const MissionCard = ({ missions, onCardClick }) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    }}
  >
    {missions.map((mission) => {
      const {
        nextMilestone,
        pendingAmount,
        milestoneText,
        progressPercentage,
      } = useMilestoneProgressHook(mission.milestones, 'missionCard');
      return (
        <Wrapper style={{ width: wp(44), marginBottom: wp(5.33) }}>
          <TouchableOpacity onPress={() => onCardClick(mission.id)}>
            <View>
              <View
                style={{
                  // height: wp(28),
                  // width: wp(43),
                  position: 'relative',
                }}
              >
                <Image
                  source={mission.image ? { uri: mission.image } : puppy}
                  alt="group-image"
                  style={{
                    // height: '100%',
                    // width: '100%',
                    // resizeMode: 'cover',
                    height: wp(28),
                    width: width * 1,
                    aspectRatio: 1.5,
                  }}
                />
              </View>
              {mission.c5013 && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 6,
                    right: 6,
                    height: wp(6.66),
                    width: wp(6.66),
                    backgroundColor: colors.GREEN.C2,
                    borderRadius: 100,
                    borderColor: colors.white,
                    borderWidth: 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: wp(1.86),
                      color: colors.white,
                      textAlign: 'center',
                      paddingVertical: wp(1.67),
                    }}
                  >
                    501 3c
                  </Text>
                </View>
              )}
            </View>
            <View style={[Custompadding.paddingSmall]}>
              <Text
                numberOfLines={1}
                style={[typography.bold.h6, { textTransform: 'capitalize' }]}
              >
                {mission.title}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: wp(2.64),
                  marginBottom: wp(1),
                }}
              >
                <Text style={[typography.bold.h9, { color: colors.GREEN.C2 }]}>
                  {`$ ${pendingAmount}`}
                </Text>
                <Text
                  style={[typography.bold.h9, { paddingHorizontal: wp(1) }]}
                >
                  {milestoneText}
                </Text>
                {nextMilestone ? (
                  <Text
                    style={[typography.bold.h9, { color: colors.GREYS.C8 }]}
                  >
                    {nextMilestone}
                  </Text>
                ) : null}
              </View>
              <View style={{ marginBottom: wp(4) }}>
                <Progress.Bar
                  progress={progressPercentage}
                  width={wp(36)}
                  height={wp(1.87)}
                  color={colors.GREEN.C1}
                  unfilledColor={colors.GREYS.C7}
                  borderWidth={1}
                  borderColor={colors.GREYS.C7}
                  borderRadius={7}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={[typography.bold.h8, { color: colors.GREYS.C9 }]}>
                  {`$ ${convertNumber(
                    mission.total_donation ? +mission.total_donation : 0,
                  )}`}
                </Text>
                <View style={{ flexDirection: 'row', alignmissions: 'center' }}>
                  <Text style={[typography.bold.h7]}>
                    {(mission.contributions && mission.contributions.length) ||
                      0}
                  </Text>
                  <Text>{GetIcon('user|Feather', colors.black, wp(3.4))}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Wrapper>
      );
    })}
  </View>
);
MissionCard.propTypes = {
  missions: PropTypes.array,
  onCardClick: PropTypes.func,
};
export default MissionCard;
const Wrapper = styled.View`
  border: 3px solid ${colors.background};
  border-radius: 8px;
  background-color: ${colors.white};
`;
