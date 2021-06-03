import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pdf from 'react-native-pdf';
import { StyleSheet, Dimensions, View } from 'react-native';
import Header from '../common/header';
import { colors, Custompadding } from '../../styles/styleSheet';
import { wp } from '../../utils/Dimensions';
import { GetIcon } from '../../utils/Icons';
import { shareUrl } from '../../app/shared/utils/shareHelper';

const ViewPDF = (props) => {
  const {
    route: { params: { pdfUrl = '' } = {} },
  } = props;
  const source = {
    uri: pdfUrl,
    cache: true,
  };
  const handleSharePDF = () => {
    shareUrl({ url: pdfUrl });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <Container style={[Custompadding.paddingLarge]}>
        <Header
          heading="contribution history"
          backCallback={() => {
            props.navigation.goBack();
          }}
          rightHeading={GetIcon('upload|Feather', colors.black, wp(5))}
          textCallback={handleSharePDF}
        />
        <View style={styles.container}>
          <Pdf
            source={source}
            // onLoadComplete={(numberOfPages, filePath) => {
            //   console.log(`number of pages: ${numberOfPages}`);
            // }}
            // onPageChanged={(page, numberOfPages) => {
            //   console.log(`current page: ${page}`);
            // }}
            // onError={(error) => {
            //   console.log(error);
            // }}
            // onPressLink={(uri) => {
            //   console.log(`Link presse: ${uri}`);
            // }}
            style={styles.pdf}
          />
        </View>
      </Container>
    </SafeAreaView>
  );
};

ViewPDF.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
export default ViewPDF;

const Container = styled.View`
  background-color: ${colors.white};
  flex: 1;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
