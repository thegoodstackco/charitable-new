import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  ImageBackground,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  // Keyboard,
  Platform,
  Image,
  RefreshControl,
} from 'react-native';
import styled from 'styled-components';
import { useFocusEffect } from '@react-navigation/native';
import { request, PERMISSIONS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import EmptyState from '../common/EmptyState';
import Loader from '../common/Loader';
import { Custompadding, colors, typography } from '../../styles/styleSheet';
import Header from '../common/header';
import Input from '../common/CustomTextField';
import CustomModal from '../common/modal';
import MissionCard from '../sceneComponents/FindMission/MissionCard';
// import mission1 from '../../assets/images/mission1.png';
// import mission2 from '../../assets/images/mission2.png';
// import mission3 from '../../assets/images/mission3.png';
import mission from '../../assets/images/mission.png';
import startMission from '../../assets/images/start-mission.png';
import { wp } from '../../utils/Dimensions';
import LocationModal from '../sceneComponents/FindMission/LocationModal';
import Login from '../sceneComponents/HomePage/Login';
import {
  useMissionListHook,
  useCategoriesHook,
  useMissionControlHook,
  useLoginHook,
} from '../../app/shared/hooks';

const FindMission = (props) => {
  const categoryRef = useRef(null);

  const [locationModal, setLocationModal] = useState(false);
  const [locationLoader, setLocationLoader] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const { onLogin, loginLoader } = useLoginHook(props, {
    onLoginSuccess,
    onLoginError,
  });

  function onLoginSuccess() {
    setShowAuthModal(false);
    // props.navigation.navigate('Landing');
  }
  function onLoginError(error) {
    // eslint-disable-next-line no-console
    console.log(error); // TODO handle error
  }
  const {
    Dash_data: { isLoggedIn },
    route: { params: { query } = {} },
    navigation,
  } = props;

  const {
    missionList: {
      data: missions,
      loader: listLoader,
      // lastUpdated
    },
    category,
    location,
    filterMethod,
    onClear,
    search,
  } = useMissionListHook(props, {
    query,
    onClearFilter,
    isRefresh: refreshing,
  });

  const {
    activeMissions,
    // userMissionList: { loader: userMissionLoader },
  } = useMissionControlHook(props);

  const {
    categories: { data: categories, loader },
  } = useCategoriesHook(props);

  // useEffect(() => {
  //   requestLocationPermission();
  // }, []);

  const wait = (timeout) =>
    new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(1000).then(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (categoryRef.current && categoryRef.current.isFocused()) {
        categoryRef.current.blur();
      }
    }, []),
  );

  function onClearFilter() {
    if (categoryRef.current && categoryRef.current.isFocused()) {
      categoryRef.current.blur();
    }
  }

  const onPermissionGranted = () => {
    setLocationLoader(true);
    Geolocation.getCurrentPosition(
      (position) => {
        setLocationLoader(false);
        if (position && position.coords) {
          location.onNearBy(position.coords, category.value, search.value);
        }
      },
      (error) => {
        setLocationLoader(false);

        requestLocationPermission();
        // eslint-disable-next-line no-console
        console.log(error.code, error.message, 'error');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (response === 'granted') {
        onPermissionGranted();
      } else if (response === 'blocked') {
        props.errorToast(
          'Please enable location permission, inorder to access Nearby feature',
        );
      }
    } else {
      const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (response === 'granted') {
        onPermissionGranted();
      } else if (response === 'blocked') {
        props.errorToast(
          'Please enable location permission, inorder to access Nearby feature',
        );
      }
    }
  };

  // const handleSearchMission = () => {
  //   if (Keyboard) Keyboard.dismiss();
  //   navigation.navigate('SearchMission', {
  //     redirectTo: 'FindMission',
  //     showSearch: false,
  //   });
  // };
  const handleFocusSearch = () => {
    search.onFocus();
  };
  const handleCardClick = (missionId) => {
    navigation.navigate('Mission', {
      missionId,
    });
  };

  const handleSelectLocation = (locationInfo) => {
    navigation.setParams({ selectedCategory: {} });
    setLocationModal(false);
    location.onSelect(locationInfo);
  };

  const handleStartMission = () => {
    if (isLoggedIn) {
      navigation.navigate('MissionControl');
    } else {
      props.dispatch({
        type: 'SET_AFTER_LOGIN_ROUTE',
        payload: {
          afterLoginRoute: 'MissionControl',
          afterLoginParam: {},
        },
      });
      setShowAuthModal(true);
    }
  };
  const handleNearByMission = () => {
    navigation.setParams({ selectedCategory: {} });
    requestLocationPermission();
  };
  const handleClearFilters = () => {
    navigation.setParams({ selectedCategory: {} });
    onClear();
  };

  const handleSelectCategory = (selected) => {
    // props.navigation.navigate('FindMission', { selectedCategory: selected });
    category.onSelect(selected);
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Container style={[Custompadding.paddingLarge]}>
            <Header
              heading="find a mission"
              backCallback={(e) => {
                if (
                  categoryRef &&
                  categoryRef.current &&
                  categoryRef.current.isFocused()
                ) {
                  categoryRef.current.blur();
                }
                if (search.showCategory) {
                  search.onBlur(e);
                } else if (isLoggedIn && !search.showCategory) {
                  navigation.navigate('Landing');
                } else {
                  navigation.goBack();
                }
              }}
              rightHeading={filterMethod !== 'Global' ? 'Clear Filters' : null}
              textCallback={handleClearFilters}
            />
            <View style={{ marginVertical: wp(4) }}>
              <Input
                isSearchInput
                text="Search"
                onFocus={handleFocusSearch}
                onChangeText={search.onChange}
                // onBlur={search.onBlur}
                // onPressSearch={handleSearchMission}
                value={search.value || category.value.name}
                errorText={category.error}
                ref={categoryRef}
              />
            </View>
            {
              // !lastUpdated &&
              loader || listLoader || locationLoader ? (
                <Loader />
              ) : (
                <>
                  {search.showCategory ? (
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <>
                        {categories && categories.length ? (
                          categories
                            .filter((cat) => cat.find_mission)
                            .map((categoryInfo) => (
                              <TouchableOpacity
                                onPress={() =>
                                  handleSelectCategory(categoryInfo)
                                }
                                key={categoryInfo.id}
                              >
                                <View
                                  style={[
                                    Custompadding.paddingLeftRightXLarge,
                                    Custompadding.paddingTopBottomRegular,
                                    {
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      backgroundColor: colors.GREYS.C7,
                                      borderRadius: 18,
                                      marginBottom: wp(2),
                                    },
                                  ]}
                                >
                                  <View
                                    style={{ height: wp(10.66), width: wp(10) }}
                                  >
                                    <Image
                                      source={{
                                        uri: categoryInfo.icon,
                                      }}
                                      alt="google"
                                      style={{
                                        height: '100%',
                                        width: '100%',
                                        resizeMode: 'contain',
                                      }}
                                    />
                                  </View>
                                  <Text
                                    style={[
                                      typography.bold.h6,
                                      Custompadding.paddingLeftXLarge,
                                      { textTransform: 'capitalize' },
                                    ]}
                                  >
                                    {categoryInfo.name}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            ))
                        ) : (
                          <EmptyState message="No categories" />
                        )}
                      </>
                    </ScrollView>
                  ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <View
                        style={[
                          Custompadding.paddingBottomRegular,
                          {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            typography.bold.h1,
                            { textTransform: 'capitalize' },
                          ]}
                        >
                          {filterMethod}
                        </Text>
                        <TouchableOpacity
                          onPress={() => setLocationModal(true)}
                        >
                          <Text
                            style={[
                              typography.regular.h7,
                              {
                                color: colors.GREEN.C3,
                                textTransform: 'capitalize',
                              },
                            ]}
                          >
                            change location
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {missions && missions.length ? (
                        <>
                          <MissionCard
                            missions={missions.slice(0, 4)}
                            onCardClick={handleCardClick}
                          />
                          {filterMethod !== 'Near By' && (
                            <LocationCard
                              style={{
                                marginBottom: wp(4),
                                height: wp(38.93),
                                width: wp(88),
                                // backgroundColor: colors.error,
                              }}
                              onPress={handleNearByMission}
                            >
                              <Image
                                source={mission}
                                alt="location"
                                style={{
                                  height: '100%',
                                  width: '100%',
                                  resizeMode: 'contain',
                                }}
                              />
                              {/* <ImageBackground
                        source={bg}
                        alt="location"
                        style={{
                          height: wp(38.93),
                          width: wp(88),
                          borderRadius: 20,
                          position: 'relative',
                        }}
                      />
                      <View
                        style={[
                          Custompadding.paddingTopBottomXLarge,
                          {
                            position: 'absolute',
                            justifyContent: 'center',
                            //   alignItems: 'center',
                            flex: 1,
                            marginHorizontal: wp(8),
                          },
                        ]}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            marginBottom: wp(2.64),
                          }}
                        >
                          <Text>
                            {GetIcon(
                              'location-arrow|FontAwesome5',
                              colors.GREEN.C1,
                              wp(6),
                            )}
                          </Text>
                          <Text
                            style={[
                              typography.regular.h4,
                              {
                                textTransform: 'capitalize',
                                marginLeft: wp(3.4),
                              },
                            ]}
                          >
                            nearby
                          </Text>
                        </View>
                        <Text
                          style={[typography.bold.h6, { marginLeft: wp(8.2) }]}
                        >
                          Show missions nearby to your neighborhood using
                          location services
                        </Text>
                      </View> */}
                            </LocationCard>
                          )}
                        </>
                      ) : (
                        <EmptyState message="no missions available" />
                      )}

                      {missions && missions.length > 4 ? (
                        <MissionCard
                          missions={missions.slice(4, 8)}
                          onCardClick={handleCardClick}
                        />
                      ) : null}
                      {!(activeMissions && activeMissions.length) ? (
                        <LocationCard
                          style={{
                            marginTop: wp(6.66),
                            marginBottom: wp(4),
                            height: wp(38.93),
                            width: wp(88),
                            // backgroundColor: colors.error,
                          }}
                          onPress={handleStartMission}
                        >
                          <ImageBackground
                            source={startMission}
                            alt="location"
                            style={{
                              height: wp(38.93),
                              width: wp(88),
                              borderRadius: 20,
                              position: 'relative',
                            }}
                          />
                          {/* <View
                                style={[
                                  Custompadding.paddingTopBottomXLarge,
                                  {
                                    position: 'absolute',
                                    justifyContent: 'center',
                                    //   alignItems: 'center',
                                    flex: 1,
                                    marginHorizontal: wp(8),
                                  },
                                ]}
                              >
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    marginBottom: wp(2.64),
                                  }}
                                >
                                  <Text>
                                    {GetIcon(
                                      'location-arrow|FontAwesome5',
                                      colors.GREEN.C1,
                                      wp(6),
                                    )}
                                  </Text>
                                  <Text
                                    style={[
                                      typography.regular.h4,
                                      {
                                        textTransform: 'capitalize',
                                        marginLeft: wp(3.4),
                                      },
                                    ]}
                                  >
                                    start a mission
                              </Text>
                                </View>
                                <Text style={[typography.bold.h6]}>
                                  Setup automatic donations for a cause that you are
                                  passionate about
                            </Text>
                              </View> */}
                        </LocationCard>
                      ) : null}
                      {missions && missions.length > 8 ? (
                        <MissionCard
                          missions={missions.slice(8)}
                          onCardClick={handleCardClick}
                        />
                      ) : null}
                    </ScrollView>
                  )}
                </>
              )
            }
          </Container>
        </ScrollView>
      </SafeAreaView>
      <CustomModal
        noClose
        visible={locationModal}
        closeCallback={() => setLocationModal(false)}
      >
        <LocationModal
          navigation={navigation}
          closeCallback={() => setLocationModal(false)}
          onSelectCB={handleSelectLocation}
        />
      </CustomModal>

      <CustomModal
        noClose
        visible={showAuthModal}
        closeCallback={() => {
          setIsLoading(false);
          setShowAuthModal(false);
        }}
      >
        <Login
          // authCallback={(authType) => handleAuthMethod(authType)}
          closeCallback={() => {
            setIsLoading(false);
            setShowAuthModal(false);
          }}
          isLoading={isLoading || loginLoader}
          onLogin={onLogin}
          setIsLoading={(loadingState) => {
            setIsLoading(loadingState);
          }}
          dispatch={props.dispatch}
        />
      </CustomModal>
    </>
  );
};
FindMission.propTypes = {
  navigation: PropTypes.object,
  Dash_data: PropTypes.object,
  route: PropTypes.object,
  errorToast: PropTypes.func,
  dispatch: PropTypes.func,
};
export default FindMission;
const Container = styled.View`
  background-color: ${colors.white};
  flex: 1;
`;
const LocationCard = styled.TouchableOpacity`
  border-radius: 20px;
`;
