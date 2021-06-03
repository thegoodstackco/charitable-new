import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '../../common/button';
import { Custompadding, colors } from '../../../styles/styleSheet';
import { wp } from '../../../utils/Dimensions';

const ButtonSection = ({ onShareMission, onContribute }) => (
  <>
    <ButtonWrapper
      style={[
        Custompadding.paddingRegular,
        {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 10,
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
        },
      ]}
    >
      <Button
        type="primary"
        title="share"
        width={wp(30)}
        callback={onShareMission}
      />
      <Button
        title="contribute"
        width={wp(60)}
        // callback={() => setContributeModal(true)}
        callback={onContribute}
      />
    </ButtonWrapper>
  </>
);
ButtonSection.propTypes = {
  onShareMission: PropTypes.func,
  onContribute: PropTypes.func,
};
export default ButtonSection;
const ButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  background-color: ${colors.white};
`;
