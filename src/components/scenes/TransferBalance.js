/* eslint-disable indent */
import React, { useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { View, SafeAreaView, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Loader from '../common/Loader';
import Header from '../common/header';
import CustomInput from '../common/CustomTextField';
import Button from '../common/button';
import { colors, Custompadding } from '../../styles/styleSheet';
import { wp } from '../../utils/Dimensions';
import { useBankAccountHook, usePayoutsHook } from '../../app/shared/hooks';

const TransferBalance = (props) => {
  const {
    navigation,
    route: { params: { mission = null } = {} },
    successToast,
    errorToast,
  } = props;

  const nameRef = useRef(null);
  const accountRef = useRef(null);
  const bankNameRef = useRef(null);
  const commentsRef = useRef(null);
  const routingRef = useRef(null);
  const venmoRef = useRef(null);
  const cashappRef = useRef(null);
  const paypalRef = useRef(null);

  const {
    bankAccounts: { loader: bankAccountsLoader, lastUpdated },
    updateBankAccount: { loader: updateLoader, onUpdate },
    name,
    accountNo,
    // ifscCode,
    bankName,
    routing,
    venmo,
    paypal,
    cashapp,
    comments,
  } = useBankAccountHook(props, { onUpdateBankAccountSuccess,onUpdateBankAccountError,});
  
  const {
    payoutToBank: { loader: payoutToBankLoader, onPayout },
    accountBalance,
  } = usePayoutsHook(props, {
    mission,
    onPayoutToBankSuccess,
    onPayoutToBankError,
  });

  function onPayoutToBankSuccess() {
    navigation.navigate('MissionControl');
    successToast('Amount will be transferred to your bank account shortly');
  }

  function onPayoutToBankError({ message }) {
    if (message) {
      errorToast(message.toString(message));
    } else {
      errorToast('Something went wrong');
    }
  }

  function onUpdateBankAccountSuccess({ isTransfer }) {
    if (isTransfer) {
      onPayout();
    } else {
      successToast('Bank Account Updated Successfully');
    }
  }

  function onUpdateBankAccountError({ message }) {
      console.log(77177);
    if (message) {
      errorToast(message.toString(message));
    } else {
      errorToast('Something went wrong');
    }
  }

  const handleSubmit = ({ isTransfer }) => {
    onUpdate({ isTransfer });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      {!lastUpdated && bankAccountsLoader ? (
        <Loader />
      ) : (
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={20}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={[
              Custompadding.paddingLeftRightLarge,
              Custompadding.paddingTopLarge,
            ]}
          >
            <Header
              heading="bank details"
              backCallback={() => {
                navigation.goBack();
              }}
            />
          </View>
          <Container
            style={[
              Custompadding.paddingBottomLarge,
              Custompadding.paddingTopRegular,
              Custompadding.paddingLeftRightRegular,
              {
                justifyContent: 'space-between',
              },
            ]}
          >
            <View>
              <View style={[Custompadding.paddingBottomRegular]}>
                <CustomInput
                  placeholder="account Holder name"
                  ref={nameRef}
                  onChangeText={name.onChange}
                  onBlur={name.onBlur}
                  value={name.value}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    accountRef.current.focus();
                  }}
                />
              </View>
              <View style={[Custompadding.paddingBottomRegular]}>
                <CustomInput
                  placeholder="account number"
                  ref={accountRef}
                  onChangeText={accountNo.onChange}
                  onBlur={accountNo.onBlur}
                  value={accountNo.value}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    bankNameRef.current.focus();
                  }}
                />
              </View>
              {/* <View style={[Custompadding.paddingBottomRegular]}>
                <CustomInput
                  placeholder="IFSC Code"
                  ref={ifscRef}
                  onChangeText={ifscCode.onChange}
                  onBlur={ifscCode.onBlur}
                  value={ifscCode.value}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    bankNameRef.current.focus();
                  }}
                />
              </View> */}
              <View style={[Custompadding.paddingBottomRegular]}>
                <CustomInput
                  placeholder="bank name"
                  ref={bankNameRef}
                  onChangeText={bankName.onChange}
                  onBlur={bankName.onBlur}
                  value={bankName.value}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    routingRef.current.focus();
                  }}
                />
              </View>
              <View style={[Custompadding.paddingBottomRegular]}>
                <CustomInput
                  placeholder="routing"
                  ref={routingRef}
                  onChangeText={routing.onChange}
                  onBlur={routing.onBlur}
                  value={routing.value}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    venmoRef.current.focus();
                  }}
                />
              </View>
              <View style={[Custompadding.paddingBottomRegular]}>
                <CustomInput
                  placeholder="venmo"
                  ref={venmoRef}
                  onChangeText={venmo.onChange}
                  onBlur={venmo.onBlur}
                  value={venmo.value}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    cashappRef.current.focus();
                  }}
                />
              </View>
              <View style={[Custompadding.paddingBottomRegular]}>
                <CustomInput
                  placeholder="cashapp"
                  ref={cashappRef}
                  onChangeText={cashapp.onChange}
                  onBlur={cashapp.onBlur}
                  value={cashapp.value}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    paypalRef.current.focus();
                  }}
                />
              </View>
              <View style={[Custompadding.paddingBottomRegular]}>
                <CustomInput
                  placeholder="paypal"
                  ref={paypalRef}
                  onChangeText={paypal.onChange}
                  onBlur={paypal.onBlur}
                  value={paypal.value}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    commentsRef.current.focus();
                  }}
                />
              </View>
              <View style={[Custompadding.paddingBottomRegular]}>
                <CustomInput
                  placeholder="address"
                  ref={commentsRef}
                  onChangeText={comments.onChange}
                  value={comments.value}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    if (Keyboard) Keyboard.dismiss();
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: accountBalance ? 'space-between' : 'center',
              }}
            >
              <Button
                type="primary"
                title={updateLoader ? 'Updating' : 'Save'}
                width={wp(40)}
                callback={() => handleSubmit({ isTransfer: false })}
              />
              {accountBalance ? (
                <Button
                  width={wp(45)}
                  title={
                    updateLoader || payoutToBankLoader
                      ? 'Transferring '
                      : 'Save & Transfer'
                  }
                  disable={updateLoader || payoutToBankLoader}
                  callback={handleSubmit}
                />
              ) : null}
            </View>
          </Container>
        </KeyboardAwareScrollView>
      )}
    </SafeAreaView>
  );
};
TransferBalance.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
  successToast: PropTypes.func,
  errorToast: PropTypes.func,
};
export default TransferBalance;
const Container = styled.View`
  background-color: ${colors.white};
  flex: 1;
`;
