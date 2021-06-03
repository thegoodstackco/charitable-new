import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import * as Progress from 'react-native-progress';
import { wp } from '../../../utils/Dimensions';
import { typography, colors, Custompadding } from '../../../styles/styleSheet';
import { GetIcon } from '../../../utils/Icons';

const Milestones = ({
  icon,
  title,
  subTitle,
  desc,
  color,
  // lineColor,
  borderColor,
  textColor,
  percentage,
}) => (
  <View style={{ flex: 1 }}>
    <View
      style={{
        // height: wp(1),
        // width: '100%',
        // backgroundColor: lineColor,
        marginTop: wp(16),
        flexWrap: 'nowrap',
        alignItems: 'center',
        // position: 'relative',
      }}
    >
      <Progress.Bar
        progress={percentage}
        width={wp(100)}
        height={wp(1)}
        color={colors.GREEN.C1}
        unfilledColor={colors.GREYS.C3}
        borderWidth={0}
        // borderColor={colors.GREYS.C3}
        style={{ position: 'relative' }}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: wp(-2.64),
          height: wp(6.66),
          width: wp(6.66),
          backgroundColor: color,
          borderColor,
          borderWidth: 1,
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}
      >
        {GetIcon(icon, colors.white, wp(4))}
      </TouchableOpacity>
    </View>
    <Wrapper
      style={{
        // height: wp(72),
        width: wp(90),
        alignItems: 'center',
        paddingVertical: wp(32),
        // backgroundColor: 'orange',
      }}
    >
      <Text
        style={[
          typography.bold.h6,
          Custompadding.paddingBottomSmall,
          { textTransform: 'capitalize', textAlign: 'center' },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          typography.bold.h7,
          Custompadding.paddingBottomSmall,

          {
            color: textColor,
            textTransform: 'uppercase',
            textAlign: 'center',
          },
        ]}
      >
        {subTitle}
      </Text>
      <Text style={[typography.regular.h6, { textAlign: 'center' }]}>
        {desc}
      </Text>
    </Wrapper>
  </View>
);
Milestones.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  desc: PropTypes.string,
  color: PropTypes.string,
  // lineColor: PropTypes.string,
  borderColor: PropTypes.string,
  textColor: PropTypes.string,
  percentage: PropTypes.string,
};
export default Milestones;
const Wrapper = styled.View`
  border-radius: 2px;
  justify-content: center;
`;
