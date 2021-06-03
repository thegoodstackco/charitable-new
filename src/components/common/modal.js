import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

import Modal from 'react-native-modal';
import { wp } from '../../utils/Dimensions';
import { colors, Custompadding, typography } from '../../styles/styleSheet';
import { GetIcon } from '../../utils/Icons';

const CustomModal = ({
  visible,
  closeCallback,
  children,
  height,
  noClose,
  overlay,
}) => (
  <Modal
    isVisible={visible}
    onBackdropPress={closeCallback}
    onBackButtonPress={closeCallback}
    overlay={overlay}
    style={{
      flex: 1,
      margin: 0,
      justifyContent: overlay ? 'flex-start' : 'flex-end',
      marginTop: overlay ? wp(10) : 0,
    }}
  >
    <KeyboardAwareScrollView
      scrollToInputIfNotHidden
      enableOnAndroid
      enableAutomaticScroll
      // extraScrollHeight={30}
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'flex-end',
      }}
    >
      <View
        style={[
          Custompadding.paddingTopBottomLarge,
          Custompadding.paddingLeftRightLarge,
          {
            height: height || 'auto',
            backgroundColor: overlay ? 'transparent' : colors.white,
            borderTopLeftRadius: wp(5),
            borderTopRightRadius: wp(5),
          },
        ]}
      >
        {!noClose ? (
          <TouchableOpacity
            onPress={closeCallback}
            style={[
              Custompadding.paddingBottomSmall,
              {
                alignItems: 'flex-end',
              },
            ]}
          >
            {/* {overlay ? (
              <Text>{GetIcon('times|FontAwesome5', colors.white, wp(8))}</Text>
            ) : ( */}
            <Text
              style={[
                typography.regular.h6,
                { color: colors.black, textTransform: 'capitalize' },
              ]}
            >
              Cancel
            </Text>
            {/* )} */}
          </TouchableOpacity>
        ) : null}
        {overlay && (
          <TouchableOpacity
            onPress={closeCallback}
            style={[
              Custompadding.paddingBottomSmall,
              {
                alignItems: 'flex-end',
              },
            ]}
          >
            <Text>{GetIcon('times|FontAwesome5', colors.white, wp(8))}</Text>
          </TouchableOpacity>
        )}
        {children}
      </View>
    </KeyboardAwareScrollView>
  </Modal>
);
CustomModal.propTypes = {
  visible: PropTypes.bool,
  closeCallback: PropTypes.func,
  children: PropTypes.node,
  height: PropTypes.string,
  noClose: PropTypes.bool,
  overlay: PropTypes.string,
};
export default CustomModal;
