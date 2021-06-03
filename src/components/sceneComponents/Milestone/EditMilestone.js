import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import { typography, colors, Custompadding } from '../../../styles/styleSheet';
import { wp } from '../../../utils/Dimensions';
import { GetIcon } from '../../../utils/Icons';
const EditMilestone = ({ onEditMilestone }) => (
  <>
    <View>
      <Title
        style={[
          typography.bold.h3,
          {
            marginBottom: wp(2),
            textTransform: 'capitalize',
            textAlign: 'center',
          },
        ]}
      >
        Milestone
      </Title>
    </View>
    <TouchableOpacity
      style={[
        Custompadding.paddingTopBottomRegular,
        { flexDirection: 'row', justifyContent: 'space-between' },
      ]}
      onPress={() => onEditMilestone('edit')}
    >
      <Text
        style={[
          typography.regular.h4,
          {
            textTransform: 'capitalize',
            // textAlign: 'center',
            color: colors.BLUES.C4,
          },
        ]}
      >
        edit
      </Text>
      <Text>
        {GetIcon('chevron-right|FontAwesome5', colors.black, wp(2.64))}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[
        Custompadding.paddingTopBottomRegular,
        { flexDirection: 'row', justifyContent: 'space-between' },
      ]}
      onPress={() => onEditMilestone('delete')}
    >
      <Text
        style={[
          typography.regular.h4,
          {
            textTransform: 'capitalize',
            // textAlign: 'center',
            color: colors.error,
          },
        ]}
      >
        delete
      </Text>
      <Text>
        {GetIcon('chevron-right|FontAwesome5', colors.black, wp(2.64))}
      </Text>
    </TouchableOpacity>
  </>
);
EditMilestone.propTypes = {
  onEditMilestone: PropTypes.func,
};
export default EditMilestone;
const Title = styled.Text``;
