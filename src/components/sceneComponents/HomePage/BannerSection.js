/* eslint-disable */
import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
// import banner from '../../../assets/images/banner1.png';
import banner1 from '../../../assets/images/carousel_1.jpg';

import { wp } from '../../../utils/Dimensions';
import { typography, colors } from '../../../styles/styleSheet';
const BannerSection = (props) => {
  return (
    <>
      <ImageBackground
        source={props.bannerImage}
        style={{ height: wp(120), width: wp(100) }}
      >
        <View
          style={{
            height: wp(120),
            width: wp(100),
            position: 'absolute',
            top: 0,
            opacity: 0.75,
          }}
        />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            marginHorizontal: 40,
          }}
        >
          <Text
            style={[
              typography.bold.h1,
              { color: colors.white, textAlign: 'center', lineHeight: 40 },
            ]}
          >
            {`${props.title}`}
          </Text>
        </View>
      </ImageBackground>
    </>
  );
};
export default BannerSection;
