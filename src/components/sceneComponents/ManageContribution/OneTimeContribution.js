import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SwitchToggle from '@dooboo-ui/native-switch-toggle';
import Button from '../../common/button';
import Input from '../../common/CustomTextField';
import { wp } from '../../../utils/Dimensions';
import { colors, typography, Custompadding } from '../../../styles/styleSheet';
import { GetIcon } from '../../../utils/Icons';

const OneTimeContribution = ({
  amount,
  backCallback,
  closeContributionModal,
  oneTimeContribution,
  cards,
  cardLoader,
  missionId,
}) => {
  const navigation = useNavigation();
  const {
    onOneTimeSubmit,
    loader: oneTimeLoader,
    validatePayment,
  } = oneTimeContribution;
  const amountRef = useRef(null);
  const handleMakePayment = () => {
    const isError = validatePayment();
    if (!isError) {
      if (cards && cards.data && cards.data.length) {
        closeContributionModal();
        navigation.navigate('CardList', { amount: amount.value, missionId });
      } else {
        onOneTimeSubmit({ isNew: true });
      }
    }
  };
  const [switchOn, setSwitchOn] = useState(false);
  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <TouchableOpacity onPress={backCallback}>
          {GetIcon('chevron-left|FontAwesome5', colors.black, wp(6))}
        </TouchableOpacity>
        <Title
          style={[
            typography.bold.h4,
            {
              marginBottom: wp(2),
              textTransform: 'capitalize',
              textAlign: 'center',
              marginLeft: wp(12),
            },
          ]}
        >
          one time contribution
        </Title>
      </View>
      <View
        style={{
          marginVertical: wp(4),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              position: 'absolute',
              left: 0,
              bottom: wp(4.23),
              paddingHorizontal: wp(2),
            }}
          >
            <Text style={{ fontSize: 17, color: 'rgba(0,0,0,0.4)' }}>$</Text>
          </View>
          <View style={{ width: wp(70), marginLeft: wp(6) }}>
            <Input
              placeholder="enter your contribution amount"
              onChangeText={amount.onChange}
              onBlur={amount.onBlur}
              value={amount.value || ''}
              errorText={amount.error}
              keyboardType="numeric"
              ref={amountRef}
              returnKeyType="done"
              // onSubmitEditing={() => {
              //   if (Keyboard) Keyboard.dismiss();
              //   if (!cardLoader || !oneTimeLoader) handleMakePayment();
              // }}
            />
          </View>
        </View>
        <TouchableOpacity
          style={[
            Custompadding.paddingBottomSmall,
            {
              alignItems: 'flex-end',
            },
          ]}
          onPress={() => {
            if (amountRef.current) amountRef.current.clear();
            amount.onClear();
          }}
        >
          <Text>{GetIcon('x-circle|Feather', colors.GREYS.C6, wp(6))}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: wp(4) }}>
        <Button
          title={oneTimeLoader || cardLoader ? 'Submitting ' : 'make donation'}
          disable={oneTimeLoader || cardLoader}
          width={wp(88)}
          callback={handleMakePayment}
        />
      </View>
      <TouchableOpacity
        style={[
          Custompadding.paddingTopLarge,
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
          },
        ]}
      >
        <Text style={[typography.bold.h5, { textTransform: 'capitalize' }]}>
          anonymously
        </Text>
        <SwitchToggle
          containerStyle={{
            width: wp(12.26),
            height: wp(7.2),
            borderRadius: 25,
            backgroundColor: '#ccc',
            padding: 1,
          }}
          circleStyle={{
            width: wp(6.66),
            height: wp(6.66),
            borderRadius: 19,
            backgroundColor: 'white',
          }}
          switchOn={switchOn}
          onPress={() => setSwitchOn(!switchOn)}
          backgroundColorOn="#00C470"
          circleColorOff="white"
          circleColorOn="white"
          duration={500}
        />
      </TouchableOpacity>
      {/* <Text
        numberOfLines={3}
        style={[typography.regular.h8, Custompadding.paddingTopBottomSmall]}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </Text> */}
      {/* <CustomModal
        noClose
        visible={openModal}
        closeCallback={() => setOpenModal(false)}
      >
        <SaveModal />
      </CustomModal> */}
    </>
  );
};

OneTimeContribution.propTypes = {
  amount: PropTypes.object,
  oneTimeContribution: PropTypes.object,
  // closeCallback: PropTypes.func,
  backCallback: PropTypes.func,
  closeContributionModal: PropTypes.func,
  cards: PropTypes.array,
  cardLoader: PropTypes.bool,
  missionId: PropTypes.string,
};

export default OneTimeContribution;

const Title = styled.Text``;
