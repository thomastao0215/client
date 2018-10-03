import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import styles from './style';
import { searchGoogle } from '../../api/search';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Spinner from 'react-native-loading-spinner-overlay';

import Toast from '../../components/Toast';

import { searchType } from '../../config';

export default class Address extends Component {
  static navigationOptions = {
    header: null,
  }
  state = {
    propertyObject: {},
    isLoaderlVisible: false,
  }
  render() {
    return (
      <View style={[styles.SearchCnt]}>
        <View style={[styles.FormCnt]}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed="auto" // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={async (data, details = null) => {
              var postal_zip = details.address_components[details.address_components.length - 1].long_name;
              if (postal_zip !== undefined) {
                this.setState({ isLoaderlVisible: true });
                const searchOption = {
                  zipcode: postal_zip,
                  autoCompleteObj: details,
                };
                let data = await searchGoogle({
                  ...searchOption,
                  page: 1
                })
                console.log(data);
                let alertMsg = '';
                if (data.mode !== undefined && data.mode == 'GeoNear') {
                  alertMsg = 'Address is not found, showing nearby properties.';
                }
                if (data.data == '' || data.result == false || data.data == 'zipcode not supported') {
                  alertMsg = 'Zipcode is not supported in the dataset.';
                } else {
                  if (alertMsg !== '') {
                    Toast.show(alertMsg)
                    this.setState({ propertyObject: data.data, isLoaderlVisible: false });
                    this.props.route.navig.navigation.navigate('Summary', { data: data.data });
                  } else {
                    this.setState({ propertyObject: data.data, isLoaderlVisible: false });
                    this.props.route.navig.navigation.navigate('Summary', { data: data.data, type: searchType.google, searchOption });
                  }
                }
              } else {
                alert('Zipcode not exist for Searched Address.');
              }
            }}
            getDefaultValue={() => {
              return ''; // text input default value
            }}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: 'AIzaSyApPrtfGqZpdf40SV5kT6cB5vom09iPX7E',
              language: 'en', // language of the results
              types: 'geocode', // default: 'geocode'
            }}
            styles={searchInputStyle}
            currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current location"
            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}
            debounce={200} />
        </View>
        <Spinner visible={this.state.isLoaderlVisible} />
      </View>
    )
  }
}

const searchInputStyle = {
  container: {
    backgroundColor: '#fff',
    marginLeft: 0,
    marginRight: 0,
    marginTop: 20,
    marginBottom: 0,
    opacity: 0.9,
    borderRadius: 8
  },
  description: {
    fontWeight: 'bold',
    color: "#007",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    opacity: 0.9,
  },
  predefinedPlacesDescription: {
    color: '#355',
  },
  textInputContainer: {
    width: '100%',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    paddingLeft: 0,
    borderRadius: 5,
    paddingRight: 15,
    paddingTop: 0,
    paddingBottom: 0,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  textInput: {
    height: 33,
    fontSize: 16,
    color: '#424242',
  }
}
