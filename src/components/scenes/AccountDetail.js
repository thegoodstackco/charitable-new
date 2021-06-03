import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import SwitchToggle from '@dooboo-ui/native-switch-toggle';
import { wp } from '../../utils/Dimensions';
import { typography, colors, Custompadding } from '../../styles/styleSheet';
import Header from '../common/header';
import Button from '../common/button';

const categories = [
  { name: 'round-ups', itemSelected: true },
  { name: 'round-ups' },
];

const AccountDetail = (props) => {
  const [switchOn, setSwitchOn] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <Container style={[Custompadding.paddingLarge]}>
        <Header
          heading="wells fargo"
          backCallback={() => props.navigation.goBack()}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: wp(2.63) }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              style={[
                Custompadding.paddingTopBottomSmall,
                Custompadding.paddingLeftRightXLarge,
                {
                  borderColor: category.itemSelected
                    ? colors.GREEN.C2
                    : colors.GREYS.C11,
                  borderWidth: category.itemSelected ? 2 : 1,
                  borderRadius: 22,
                  marginBottom: wp(5.33),
                  // backgroundColor: category.itemSelected
                  //   ? colors.background
                  //   : colors.white,
                },
              ]}
            >
              <View>
                <Text style={[typography.bold.h3, { marginBottom: wp(3.46) }]}>
                  Visa College Card Rewards Plus
                </Text>
                <Text style={[typography.bold.h3, { marginBottom: wp(6.66) }]}>
                  …X 4553
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: wp(2.64),
                }}
              >
                <Text
                  style={[
                    typography.regular.h4,
                    { textTransform: 'capitalize' },
                  ]}
                >
                  {category.name}
                </Text>
                <SwitchToggle
                  containerStyle={{
                    width: wp(12.26),
                    height: wp(7.2),
                    borderRadius: 19,
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
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={{ marginTop: wp(4) }}>
          <Text
            style={[
              typography.regular.h6,
              { color: colors.error, textAlign: 'center' },
            ]}
          >
            Select atleast one card
          </Text>
        </View>
        <View style={{ marginTop: wp(2.64) }}>
          <Button type="link" title="add new card" />
        </View>
        <View style={{ marginTop: wp(2.64) }}>
          <Button title="done" width={wp(88)} />
        </View>
      </Container>
    </SafeAreaView>
  );
};

AccountDetail.propTypes = {
  navigation: PropTypes.object,
};
export default AccountDetail;
const Container = styled.View`
  background-color: ${colors.white};
  flex: 1;
`;
