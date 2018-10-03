import React, { Component } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';

import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { CheckBox, Button, SearchBar } from 'react-native-elements';

import SelfCheck from '../../components/SelfCheck';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from '../../components/Toast';

import { searchZipCode, searchChart } from '../../api/search';

import { searchType } from '../../config';

import styles from './style';

var dateFormat = require('dateformat');

const DEVICE_WIDTH = Dimensions.get('window').width;

export default class ZipCode extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      zCode: '',
      isLoaderlVisible: false,
      disable: false,
      disablePrice: false,
      timechkval: true,
      pricechkval: true,
      multiSliderValue: [10000, 10000000],
      multiSliderValueDate: [1, 10],
      togglePrice: false,
      toggleTime: true,
    }
  }

  multiSliderValuesChange = (values) => {
    this.setState({
      multiSliderValue: values,
    });
  }

  multiSliderValuesChangeDate = (values) => {
    this.setState({
      multiSliderValueDate: values,
    });
  }

  TimeChkValuesChangeDate = () => {
    let flag = !this.state.timechkval;
    if (flag) {
      this.setState({
        multiSliderValueDate: [1, 10],
        disable: false,
        timechkval: flag,
      });
    }
    else {
      this.setState({
        disable: true,
        timechkval: flag,
      });
    }
  }

  PriceChkValuesChangeDate = () => {
    let flag = !this.state.pricechkval;
    if (flag) {
      this.setState({
        multiSliderValue: [10000, 10000000],
        disablePrice: false,
        pricechkval: flag,
      });
    }
    else {
      this.setState({
        disablePrice: true,
        pricechkval: flag,
      });
    }
  }

  // For Searching user entered zipcode
  searchCode = async (data, type) => {
    if (data == '') {
      alert('Please Enter Zip Code');
      return false;
    }
    let [StrtYear, EndYear] = this.state.multiSliderValueDate;
    let d = new Date();
    let e = new Date();
    let StYearTimestmp = d.setFullYear(e.getFullYear() - StrtYear);
    let EnYearTimestmp = d.setFullYear(e.getFullYear() - EndYear);
    let EnYear = dateFormat(StYearTimestmp, "yyyy,mm,dd");
    let StYear = dateFormat(EnYearTimestmp, "yyyy,mm,dd");
    //For Price
    let [price_range_start, price_range_end] = this.state.multiSliderValue;
    let stTie = this.state.toggleTime ? 1 : -1;
    let stPrice = this.state.togglePrice ? 1 : -1;

    this.setState({ isLoaderlVisible: true });
    if (type === 1) {
      const searchOption = {
        timeStart: StYear,
        timeEnd: EnYear,
        timeSortOrder: stTie,
        priceSortOrder: stPrice,
        AmtStart: price_range_start,
        AmtEnd: price_range_end,
        zipcode: data,
      }
      let result = await searchZipCode({
        ...searchOption,
        page: 1
      });
      if (result.data == 'zipcode not supported') {
        Toast.show('zipcode not supported');
        this.setState({ isLoaderlVisible: false });
      }
      else if (result.data.length == 0) {
        Toast.show('No result found');
        this.setState({ isLoaderlVisible: false });
      }
      else {
        this.setState({ isLoaderlVisible: false });
        this.props.route.navig.navigation.navigate('Summary', { data: result.data, searchOption, type: searchType.zipCode });
      }
    } else if (type === 2) {

      const searchOption = {
        timeStart: StYear,
        timeEnd: EnYear,
        timeSortOrder: stTie,
        priceSortOrder: stPrice,
        AmtStart: price_range_start,
        AmtEnd: price_range_end,
        zipcode: data,
      }
      console.log(searchOption)

      let result = await searchChart(searchOption);


      console.log(result.data);
      if (result.data == 'zipcode not supported') {
        Toast.show('zipcode not supported');
        this.setState({ isLoaderlVisible: false });
      }
      else if (result.data.length == 0) {
        Toast.show('No result found');
        this.setState({ isLoaderlVisible: false });
      }
      else {
        this.setState({ isLoaderlVisible: false });
        this.props.route.navig.navigation.navigate('Chart', { data: result.data,zipcode:data });
      }
    }

  }

  //Render Method For Zipcode Search
  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.isLoaderlVisible} />
        <SearchBar
          lightTheme
          onChangeText={(zCode) => this.setState({ zCode })}
          containerStyle={{ backgroundColor: '#fff', borderBottomColor: '#fff' }}
          inputStyle={{ backgroundColor: '#ddd' }}
          returnKeyType='done'
          keyboardType='numeric'
          placeholder='enter zip code ...' />
        <ScrollView style={styles.sortContainer}>
          <View style={styles.sliderRange}>
            <Text style={styles.Rangetext}>Time Range:</Text>
            <CheckBox
              title='All'
              containerStyle={{ backgroundColor: '#fff', borderColor: '#fff', padding: 0, margin: 0 }}
              checked={this.state.timechkval}
              onPress={() => this.TimeChkValuesChangeDate()} />
            <Text style={styles.text}>past {this.state.multiSliderValueDate[0]} to {this.state.multiSliderValueDate[1]} years</Text>
          </View>

          <MultiSlider
            selectedStyle={{
              backgroundColor: 'silver',
            }}
            unselectedStyle={{
              backgroundColor: 'silver',
            }}
            values={[this.state.multiSliderValueDate[0], this.state.multiSliderValueDate[1]]}
            sliderLength={DEVICE_WIDTH - 54}
            onValuesChange={this.multiSliderValuesChangeDate}
            min={1}
            max={10}
            enabledOne={this.state.disable}
            enabledTwo={this.state.disable}
            step={1}
            allowOverlap
            snapped />
          <View style={styles.sliderBar}>
            <View style={styles.sliderRange}>
              <Text style={styles.Rangetext}>Price Range:</Text>
              <CheckBox
                title='All'
                containerStyle={{ backgroundColor: '#fff', borderColor: '#fff', padding: 0, margin: 0 }}
                checked={this.state.pricechkval}
                onPress={() => this.PriceChkValuesChangeDate()} />
            </View>
            <Text style={styles.text}>{this.state.multiSliderValue[0]} to {this.state.multiSliderValue[1]}</Text>
          </View>
          <MultiSlider
            selectedStyle={{
              backgroundColor: 'silver',
            }}
            unselectedStyle={{
              backgroundColor: 'silver',
            }}
            values={[this.state.multiSliderValue[0], this.state.multiSliderValue[1]]}
            sliderLength={DEVICE_WIDTH - 54}
            onValuesChange={this.multiSliderValuesChange}
            min={10000}
            max={10000000}
            enabledOne={this.state.disablePrice}
            enabledTwo={this.state.disablePrice}
            step={10000}
            allowOverlap
            snapped />
          <View style={{ marginBottom: 6, }}>
            <Text>Sorting</Text>
          </View>
          <View style={styles.toggleContainerButtons}>
            <View style={styles.toggleItem}>
              <SelfCheck
                label='Time'
                Checked={this.state.toggleTime}
                onCheck={(flag) => this.setState({ toggleTime: flag })} />
            </View>
            <View style={styles.toggleItem}>
              <SelfCheck
                label='Price'
                Checked={this.state.togglePrice}
                onCheck={(flag) => this.setState({ togglePrice: flag })} />
            </View>
          </View>
          <Button
            title='Detail data'
            textStyle={styles.nextText}
            buttonStyle={styles.nextButton}
            disabled={this.state.isLoaderlVisible}
            onPress={() => this.searchCode(this.state.zCode, 1)} />
          <Button
            title='Chart'
            textStyle={styles.nextText}
            buttonStyle={[styles.nextButton, { marginTop: 6 }]}
            disabled={this.state.isLoaderlVisible}
            onPress={() => this.searchCode(this.state.zCode, 2)} />
        </ScrollView>
      </View >

    )
  }
}
