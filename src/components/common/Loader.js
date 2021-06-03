import React from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import loader from '../../assets/images/loader.gif';
import { wp } from '../../utils/Dimensions';

const Loader = ({ height, width }) => (
  <View
    style={{
      height: height || wp(100),
      width: width || '100%',
      alignSelf: 'center',
    }}
  >
    <Image
      source={loader}
      alt="loader"
      style={{
        height: '100%',
        width: '100%',
        resizeMode: 'center',
      }}
    />
  </View>
);

Loader.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

export default Loader;
