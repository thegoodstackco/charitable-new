/* eslint-disable */
import React, { Component } from 'react';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { View, Text } from 'react-native';
import BannerSection from './BannerSection';
import { colors } from '../../../styles/styleSheet';
import { wp } from '../../../utils/Dimensions';

export class BannerCarousel extends Component {
  constructor(props) {
    super();
    this.props = props;
    this._carousel = {};
    this.init();
  }

  init() {
    this.state = {
      slides: [
        {
          title: 'Support individual and charity operated missions',
          thumbnail: require('../../../assets/images/carousel_1.jpg'),
        },
        {
          title: 'Add your charity or donate to a charity of your choice',
          thumbnail: require('../../../assets/images/carousel_2.jpg'),
        },
        {
          title: 'Round up spare change and change the world',
          thumbnail: require('../../../assets/images/carousel_3.jpg'),
        },
        {
          title: 'See the impact of your efforts all together',
          thumbnail: require('../../../assets/images/carousel_4.jpg'),
        },
      ],
      activeSlide: 0,
    };
  }

  _renderItem = ({ item, index }) => {
    return <BannerSection bannerImage={item.thumbnail} title={item.title}/>;
  };
  get pagination() {
    const { activeSlide, slides } = this.state;
    return (
      <Pagination
        dotsLength={slides.length}
        activeDotIndex={activeSlide}
        dotStyle={{
          bottom: 60,
          width: 20,
          height: 20,
          backgroundColor: colors.white,
          borderRadius: 100,
        }}
        dotColor={colors.white}
        inactiveDotColor={colors.white}
        inactiveDotStyle={{
          backgroundColor: colors.white,
          opacity: 0.3,
        }}
      />
    );
  }
  render() {
    return (
      <View>
        <Carousel
          ref={(c) => {
            this._carousel = c;
          }}
          lockScrollWhileSnapping
          autoplay
          autoplayDelay={2000}
          autoplayInterval={2000}
          data={this.state.slides}
          renderItem={this._renderItem}
          onSnapToItem={(index) => this.setState({ activeSlide: index })}
          sliderWidth={wp(100)}
          itemWidth={wp(100)}
          layout="default"
          firstItem={0}
          loop
        />
        {this.pagination}
      </View>
    );
  }
}
