import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import { typography, colors } from '../../../styles/styleSheet';
import { wp } from '../../../utils/Dimensions';
import { GetIcon } from '../../../utils/Icons';
// import Input from '../../common/CustomTextField';

const MAPS_API_KEY = 'AIzaSyDXJfXg8J9cjfe3ARLJ8NYS5X8XCGsBy58';

const LocationModal = ({ onSelectCB, closeCallback }) => {
  const reverseGeocoder = (lat, long, search) => {
    const searchText = search;
    const latitude = lat;
    const longitude = long;
    const googleBasedUrl = 'https://maps.google.com/maps/api/geocode/json';
    // const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const httpRequest = axios.create({
      baseURL: `${googleBasedUrl}`,
      method: 'get',
    });
    httpRequest({
      params: {
        key: `${MAPS_API_KEY}`,
        latlng: `${+lat},${+long}`,
        origin: null,
        referer: null,
      },
    })
      .then(({ data }) => {
        let postCode = '';
        let city = '';
        let state = '';

        if (data && data.results && data.results.length) {
          const { address_components } = data.results[0];
          if (address_components && address_components.length) {
            address_components.map((address) => {
              if (address.types && address.types.length) {
                if (address.types[0] === 'postal_code') {
                  postCode = address.long_name;
                }
                if (address.types[0] === 'locality') {
                  city = address.long_name;
                }
                if (address.types[0] === 'administrative_area_level_1') {
                  state = address.long_name;
                }
              }
              const locationInfo = {
                postCode,
                city,
                state,
                searchText,
                latitude,
                longitude,
              };
              onSelectCB(locationInfo);
              // props.navigation.navigate(redirectTo, { locationInfo });
              return null;
            });
          }
        }
      })
      .catch((err) => {
        alert(JSON.stringify(err), 'reverse Geocode Error err');
      });
  };

  const handleSearchResultPress = async (response, fetchDetails = null) => {
    const { description } = response;
    if (
      fetchDetails &&
      fetchDetails.geometry &&
      fetchDetails.geometry.location
    ) {
      const { lat, lng } = fetchDetails.geometry.location;
      if (lat && lng) reverseGeocoder(lat, lng, description);
    }
  };
  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <TouchableOpacity onPress={closeCallback}>
          {GetIcon('chevron-down|Feather', colors.black, wp(6))}
        </TouchableOpacity>
        <Title
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
          location
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
        <View style={{ width: wp(88) }}>
          {/* <Input isSearchInput text="Search by country, state, zipcode" /> */}
          {/* <View
            style={{
              marginRight: wp(3.46),
            }}
          >
            {GetIcon('search|Feather', colors.black, wp(4))}
          </View> */}
          <GooglePlacesAutocomplete
            placeholder="Search By City, Zipcode (US Only)"
            placeholderTextColor="rgba(0,0,0,0.4)"
            // suppressDefaultStyles
            fetchDetails
            onPress={handleSearchResultPress}
            // eslint-disable-next-line no-console
            onFail={(err) => console.log(err, 'err')}
            query={{
              key: MAPS_API_KEY,
              language: 'en',
              components: 'country:us',
              // types: '(regions)',
              // types: '(cities)',
            }}
            enablePoweredByContainer={false}
            // GooglePlacesDetailsQuery={{
            //   fields: ['formatted_address', 'geometry'],
            // }}
            listViewDisplayed={{
              borderBottomWidth: 1,
              borderBottomColor: colors.error,
              paddingTop: wp(1.6),
              paddingBottom: wp(1.6),
            }}
            styles={{
              textInputContainer: {
                backgroundColor: colors.white,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                borderRadius: 10,
                paddingHorizontal: wp(4),
              },
              textInput: {
                // marginLeft: 2,
                // marginRight: 2,
                height: 40,
                color: colors.black,
                fontSize: 16,
              },
              loader: {
                color: 'red',
              },
            }}
          />
        </View>
        {/* <TouchableOpacity
          onPress={closeCallback}
          style={{
            alignItems: 'flex-end',
            // marginTop: wp(4),
            position: 'absolute',
            right: 0,
            top: 10,
            // backgroundColor: 'red',
          }}
        >
          <Text
            style={[
              typography.regular.h6,
              { color: colors.black, textAlign: 'center' },
            ]}
          >
            Cancel
          </Text>
        </TouchableOpacity> */}
      </View>
    </>
  );
};
LocationModal.propTypes = {
  closeCallback: PropTypes.func,
  onSelectCB: PropTypes.func,
};
export default LocationModal;
const Title = styled.Text``;
