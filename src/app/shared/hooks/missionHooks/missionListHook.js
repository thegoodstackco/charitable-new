import { useMemo, useEffect, useState, useCallback } from 'react';

export const useMissionListHook = (
  {
    Dash_hoc: {
      actions: {
        GET_ALL_MISSIONS_API_CALL,
        GET_NEAREST_MISSION_API_CALL,
        GET_ALL_MISSIONS_API_CANCEL,
        GET_NEAREST_MISSION_API_CANCEL,
      },
    },
    Dash_data: { GET_ALL_MISSIONS_API, GET_NEAREST_MISSION_API },
    getData,
  },
  { onClearFilter, isRefresh } = {},
) => {
  const [category, setCategory] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [location, setLocation] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [showCategory, setShowCategory] = useState(false);
  const [nearestLocation, setNearestLocation] = useState(null);
  const [filterMethod, setFilterMethod] = useState('Global');

  useEffect(() => {
    GET_ALL_MISSIONS_API_CALL();
  }, []);

  useEffect(() => {
    if (isRefresh){
        setNearestLocation(null);
        // setCategory('');
        const query = {
          zip_code: pinCode,
        };
        if (category && category.id) {
          query.categories__id = category.id;
        }
        if (searchKey && searchKey.length) {
          query.search = searchKey;
        }
        GET_ALL_MISSIONS_API_CALL({
          request: {
            query,
          },
        });
    }
  }, [isRefresh]);

  useEffect(
    () => () => {
      GET_ALL_MISSIONS_API_CANCEL();
      GET_NEAREST_MISSION_API_CANCEL();
    },
    [],
  );

  // console.log(selectedCategory, 'selectedCategory');

  const onSelectLocation = (locationInfo) => {
    if (locationInfo && Object.keys(locationInfo).length) {
      if (locationInfo.postCode !== pinCode) {
        setPinCode(locationInfo.postCode);
        // setLocation(locationInfo.searchText);
        setLocation(locationInfo.city);
        setFilterMethod(locationInfo.city);
        setNearestLocation(null);
        // setCategory('');
        const query = {
          zip_code: locationInfo.postCode,
        };
        if (category && category.id) {
          query.categories__id = category.id;
        }
        if (searchKey && searchKey.length) {
          query.search = searchKey;
        }
        GET_ALL_MISSIONS_API_CALL({
          request: {
            query,
          },
        });
      }
    }
  };

  const handleNearByMission = (coords, selectedCat, searchValue) => {
    const { latitude, longitude } = coords;
    setFilterMethod('Near By');
    setLocation('');
    setPinCode('');
    setNearestLocation(coords);
    // setCategory('');
    const query = {
      lat: `${latitude}`,
      lng: `${longitude}`,
    };
    if (selectedCat && selectedCat.id) {
      query.category_id = selectedCat.id;
    } else {
      delete query.category_id;
    }
    if (searchValue && searchValue.length) {
      query.search = searchValue;
    } else {
      delete query.search;
    }
    GET_NEAREST_MISSION_API_CALL({
      request: {
        query,
      },
    });
  };

  const handleClearFilters = () => {
    setFilterMethod('Global');
    setLocation('');
    setPinCode('');
    setCategory('');
    setNearestLocation(null);
    GET_ALL_MISSIONS_API_CALL();
    setSearchKey('');
    onClearFilter();
  };

  const onChangeSearch = (e) => {
    const value = getPlatformBasedFieldValue(e);
    setSearchKey(value);
    const query = {
      search: value,
    };
    if (!value.length) {
      setShowCategory(true);
      delete query.search;
    } else {
      setShowCategory(false);
    }
    setCategory('');
    if (!location.length) setFilterMethod('');
    // setLocation('');
    // setPinCode('');
    if (pinCode) {
      if (location) setFilterMethod(location);
      query.zip_code = pinCode;
    }
    if (nearestLocation) {
      setFilterMethod('Near by');
      handleNearByMission(nearestLocation, '', value);
    } else {
      GET_ALL_MISSIONS_API_CALL({
        request: {
          query,
        },
      });
    }
  };

  const onSearchFocus = () => {
    if (searchKey && searchKey.length) {
      setShowCategory(false);
    } else {
      setShowCategory(true);
    }
  };

  const onSelectCategory = (selected) => {
    setShowCategory(false);
    if (selected && Object.keys(selected).length) {
      if (selected.id) {
        setCategory(selected);
        // setFilterMethod(selected.name);
        setFilterMethod('');
        setLocation('');
        setPinCode('');
        setSearchKey('');
        const query = {
          categories__id: selected.id,
        };
        if (pinCode) {
          if (location) setFilterMethod(location);
          query.zip_code = pinCode;
        }
        if (nearestLocation) {
          setFilterMethod('Near by');
          handleNearByMission(nearestLocation, selected);
        } else {
          GET_ALL_MISSIONS_API_CALL({
            request: {
              query,
            },
          });
        }
        // setSelectedCategory(selectedCategory.id);
      }
    }
  };

  const onBlurSearch = useCallback(
    (e) => {
      e.preventDefault();
      setShowCategory(false);
    },
    [searchKey],
  );

  // useEffect(() => {
  //   if (selectedCategory && Object.keys(selectedCategory).length) {
  //     if (selectedCategory.id) {
  //       setCategory(selectedCategory);
  //       setFilterMethod(selectedCategory.name);
  //       setLocation('');
  //       setPinCode('');
  //       const query = {
  //         categories__id: selectedCategory.id,
  //       };
  //       if (pinCode) {
  //         if (location) setFilterMethod(location);
  //         query.zip_code = pinCode;
  //       }
  //       if (nearestLocation) {
  //         setFilterMethod('Near by');
  //         handleNearByMission(nearestLocation, selectedCategory);
  //       } else {
  //         GET_ALL_MISSIONS_API_CALL({
  //           request: {
  //             query,
  //           },
  //         });
  //       }
  //       // setSelectedCategory(selectedCategory.id);
  //     }
  //   }
  // }, [selectedCategory]);

  const missionList = useMemo(() => getData(GET_ALL_MISSIONS_API, [], false), [
    GET_ALL_MISSIONS_API,
  ]);

  const nearestMissionList = useMemo(
    () => getData(GET_NEAREST_MISSION_API, [], false),
    [GET_NEAREST_MISSION_API],
  );

  return {
    missionList: {
      data:
        filterMethod === 'Near By' ? nearestMissionList.data : missionList.data,
      loader:
        filterMethod === 'Near By'
          ? nearestMissionList.loader
          : missionList.loader,
      lastUpdated:
        filterMethod === 'Near By'
          ? nearestMissionList.lastUpdated
          : missionList.lastUpdated,
    },
    category: {
      value: category,
      onSelect: onSelectCategory,
    },
    location: {
      value: location,
      onSelect: onSelectLocation,
      onNearBy: handleNearByMission,
    },
    filterMethod,
    onClear: handleClearFilters,
    search: {
      onChange: onChangeSearch,
      onBlur: onBlurSearch,
      onFocus: onSearchFocus,
      value: searchKey,
      showCategory,
    },
  };
};

function getPlatformBasedFieldValue(e) {
  return typeof e === 'object' ? e.target.value : e;
}
