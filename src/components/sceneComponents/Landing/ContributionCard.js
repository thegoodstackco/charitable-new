import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as Progress from 'react-native-progress';
import { View, Text, TouchableOpacity } from 'react-native';
import Image from 'react-native-image-progress';
import { colors, typography, Custompadding } from '../../../styles/styleSheet';
import { wp } from '../../../utils/Dimensions';
// import { GetIcon } from '../../../utils/Icons';
import { useMilestoneProgressHook } from '../../../app/shared/hooks';
import { convertNumber } from '../../../app/shared/utils/convertNumber';

const ContributionCard = ({
  contribution,
  contributionCallback,
  cardCallBack,
}) => {
  const {
    nextMilestone,
    pendingAmount,
    milestoneText,
    progressPercentage,
  } = useMilestoneProgressHook(contribution.milestones, 'contributionCard');

  return (
    <TouchableOpacity onPress={cardCallBack}>
      <View
        style={{
          borderColor: colors.GREYS.C4,
          borderWidth: 1,
          borderRadius: 25,
          // shadowColor: '#000',
          // shadowOffset: {
          //   width: 0,
          //   height: 2,
          // },
          // shadowOpacity: 0.25,
          // shadowRadius: 8,
          // elevation: 10,
          paddingVertical: wp(2),
          marginBottom: wp(4),
        }}
      >
        <ImageBanner
          style={{
            height: wp(61),
            width: wp(100),
            marginBottom: wp(5.33),
          }}
        >
          <Image
            source={{ uri: contribution.image }}
            alt="puppy"
            style={{
              height: '100%',
              width: '100%',
              resizeMode: 'contain',
            }}
          />
        </ImageBanner>
        <View style={[Custompadding.paddingLeftRightLarge]}>
          <Heading style={[Custompadding.paddingBottomRegular]}>
            <Text
              style={[
                typography.bold.h4,
                { color: colors.GREYS.C8, textTransform: 'uppercase' },
              ]}
            >
              {contribution.title}
            </Text>
            {/* {GetIcon('wrench|FontAwesome5', colors.GREYS.C8, wp(3.73))} */}
          </Heading>
          <View
            style={[Custompadding.paddingBottomLarge, { flexDirection: 'row' }]}
          >
            <View
              style={{
                flexDirection: 'row',
                marginRight: wp(9.6),
              }}
            >
              <Text
                style={[
                  typography.bold.h7,
                  { color: colors.GREYS.C8, marginRight: wp(1) },
                ]}
              >
                {`$${convertNumber(contribution.ytd ? +contribution.ytd : 0)}`}
              </Text>
              <Text
                style={[
                  typography.regular.h7,
                  { color: colors.GREYS.C8, textTransform: 'uppercase' },
                ]}
              >
                YTD
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginRight: wp(9.6),
              }}
            >
              <Text
                style={[
                  typography.bold.h7,
                  { color: colors.GREYS.C8, marginRight: wp(1) },
                ]}
              >
                {`$${convertNumber(contribution.mtd ? +contribution.mtd : 0)}`}
              </Text>
              <Text
                style={[
                  typography.regular.h7,
                  { color: colors.GREYS.C8, textTransform: 'uppercase' },
                ]}
              >
                month to date
              </Text>
            </View>
          </View>
          <Progress.Bar
            progress={progressPercentage}
            width={wp(88)}
            height={wp(1.86)}
            color={colors.GREEN.C1}
            unfilledColor={colors.GREYS.C7}
            borderWidth={1}
            borderColor={colors.GREYS.C7}
            borderRadius={12}
          />
          <View
            style={{
              flexDirection: 'row',
              marginTop: wp(1.4),
              alignItems: 'center',
            }}
          >
            {pendingAmount ? (
              <Text style={[typography.regular.h6]}>{`$${pendingAmount}`}</Text>
            ) : null}
            <Text style={[typography.regular.h8]}>{milestoneText}</Text>
            {nextMilestone ? (
              <Text style={[typography.bold.h8]}> {nextMilestone}</Text>
            ) : null}
          </View>
          <ContributionWrapper
            onPress={contributionCallback}
            style={[Custompadding.paddingLarge, { marginTop: wp(6.66) }]}
          >
            {contribution.payment_type && contribution.payment_type.length ? (
              <View
                style={[
                  Custompadding.paddingBottomXLarge,
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  },
                ]}
              >
                <Text
                  style={[typography.bold.h6, { textTransform: 'capitalize' }]}
                >
                  Your Contribution
                </Text>
                <Text
                  style={[
                    typography.regular.h6,
                    { color: colors.GREYS.C10, textTransform: 'capitalize' },
                  ]}
                >
                  {/* Round-Ups,{contribution.roundupAmount} */}
                  {contribution.payment_type.join(', ').replace('roundoff','Round Ups')}
                </Text>
              </View>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <View style={{ marginRight: wp(14.93) }}>
                <Text style={[typography.bold.h4, { color: colors.GREYS.C8 }]}>
                  {`$${convertNumber(
                    contribution.user_mtd_contribution
                      ? +contribution.user_mtd_contribution
                      : 0,
                  )}`}
                </Text>
                <Text
                  style={[typography.regular.h7, { color: colors.GREYS.C8 }]}
                >
                  Month to Date
                </Text>
              </View>
              <View>
                <Text style={[typography.bold.h4, { color: colors.GREYS.C8 }]}>
                  {`$${convertNumber(
                    contribution.user_ytd_contribution
                      ? +contribution.user_ytd_contribution
                      : 0,
                  )}`}
                </Text>
                <Text
                  style={[
                    typography.regular.h7,
                    { color: colors.GREYS.C8, textTransform: 'uppercase' },
                  ]}
                >
                  ytd
                </Text>
              </View>
            </View>
          </ContributionWrapper>
        </View>
      </View>
    </TouchableOpacity>
  );
};
ContributionCard.propTypes = {
  contribution: PropTypes.array,
  contributionCallback: PropTypes.func,
  cardCallBack: PropTypes.func,
};
export default ContributionCard;
const ImageBanner = styled.View`
  border-top-left-radius: 22px;
  border-top-right-radius: 22px;
`;
const Heading = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const ContributionWrapper = styled.TouchableOpacity`
  background-color: ${colors.GREYS.C5};
  border-radius: 15px;
`;
