import React from 'react';
import { Text, ScrollView, View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
// import Tabs from '../../common/tabs';
import { Custompadding, colors, typography } from '../../../styles/styleSheet';
import { wp, hp } from '../../../utils/Dimensions';
import { GetIcon } from '../../../utils/Icons';
import profile from '../../../assets/images/dummy-profile.png';

const getDate = (date) => {
  const day = new Date(date);
  let dd = day.getDate();

  let mm = day.getMonth() + 1;
  const yyyy = day.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }

  if (mm < 10) {
    mm = `0${mm}`;
  }
  return `${mm}/${dd}/${yyyy}`;
};

// const tabItems = [
//   // {
//   //   value: 'members',
//   //   key: 'members',
//   // },
//   {
//     value: 'contributions',
//     key: 'contributions',
//   },
// ];

const MemberModal = ({ contributions, closeCallback }) => (
  <View style={{ height: hp(80) }}>
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
      <TouchableOpacity onPress={closeCallback}>
        {GetIcon('chevron-down|Feather', colors.black, wp(6))}
      </TouchableOpacity>
      <Text
        style={[
          typography.bold.h4,
          {
            marginBottom: wp(2),
            textTransform: 'capitalize',
            textAlign: 'center',
            marginLeft: wp(25),
          },
        ]}
      >
        contributions
      </Text>
    </View>
    {/* <Tabs
          details={tabItems}
          activeTab={activeTab}
          onTabClick={handleTabClick}
        /> */}
    <ScrollView showsVerticalScrollIndicator={false}>
      {contributions.map((contribution) => (
        <View
          style={{
            marginTop: wp(4),
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              height: wp(16),
              width: wp(16),
              borderRadius: 100,
              marginRight: wp(4),
            }}
          >
            <Image
              source={
                !contribution.is_anonymous && contribution.user.profile_image
                  ? { uri: contribution.user.profile_image }
                  : profile
              }
              alt="profile"
              style={{
                height: '100%',
                width: '100%',
                resizeMode: 'cover',
                borderRadius: 100,
              }}
            ></Image>
          </View>
          <View
            style={[
              Custompadding.paddingBottomRegular,
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottomColor: colors.borderColor,
                borderBottomWidth: 1,
                flex: 1,
              },
            ]}
          >
            <View>
              <Text style={[typography.regular.h6]}>
                {!contribution.is_anonymous
                  ? contribution.user.name
                  : 'Anonymous'}
              </Text>
              <Text style={[typography.regular.h8]}>
                {contribution.type_of_method}
              </Text>
            </View>
            <View>
              <Text style={[typography.regular.h8]}>
                {getDate(contribution.created_at)}
              </Text>
              <Text style={[typography.regular.h8, { alignSelf: 'flex-end' }]}>
                {`$${contribution.amount}`}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  </View>
);
MemberModal.propTypes = {
  contributions: PropTypes.array,
  closeCallback: PropTypes.func,
};
export default MemberModal;
