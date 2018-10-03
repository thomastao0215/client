import React from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { CheckBox, Button } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import Toast from '../../components/Toast';
import { searchNeighbor, getNeighborCounty, searchChart } from '../../api/search'

import SelfCheck from '../../components/SelfCheck';
import Spinner from 'react-native-loading-spinner-overlay';

import { searchType } from '../../config';

import styles from './style';

var dateFormat = require('dateformat');

const DEVICE_WIDTH = Dimensions.get('window').width;

export default class Neighborhood extends React.PureComponent {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      neighbor: '',
      isLoaderlVisible: false,
      countyArray: [],
      LocArray: [],
      NeighborArray: [],
      state: '',
      disable: false,
      disablePrice: false,
      county: '',
      locality: '',
      neigbor: '',
      timechkval: true,
      pricechkval: true,
      multiSliderValue: [10000, 10000000],
      multiSliderValueDate: [1, 10],
      timeRadVal: 0,
      timeSort: 1,
      priceSort: 1,
      togglePrice: false,
      toggleTime: true,
    }
    this._summaryPage = this._summaryPage.bind(this);
    this.onChangeTextState = this.onChangeTextState.bind(this);
    this.onChangeTextCounty = this.onChangeTextCounty.bind(this);
    this.onChangeTextLocality = this.onChangeTextLocality.bind(this);
    this.onChangeTextNeighbor = this.onChangeTextNeighbor.bind(this);
  }

  async _summaryPage(type = 1) {
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
    let { state, county, locality, neigbor } = this.state;
    if (state == '') {
      Toast.show('Please Select State');
    }
    else if (county == '') {
      Toast.show('Please Select County');
    }
    // else if (locality == '') {
    //   Toast.show('Please Select Locality');
    // }
    // else if (neigbor == '') {
    //   Toast.show('Please Select Neighborhood');
    // }
    else {
      this.setState({ isLoaderlVisible: true });
      if (type === 1) {
        const searchOption = {
          timeStart: StYear,
          timeSortOrder: stTie,
          priceSortOrder: stPrice,
          timeEnd: EnYear,
          AmtStart: price_range_start,
          AmtEnd: price_range_end,
          stateType: state,
          county: county,
          locality: locality,
          neighbor: neigbor,
        }
        let data = await searchNeighbor({
          ...searchOption,
          page: 1
        });
        if (data.data == '' || data.data == []) {
          Toast.show('No Result Found');
          this.setState({ isLoaderlVisible: false });
        } else {
          this.setState({ isLoaderlVisible: false });
          this.props.route.navig.navigation.navigate('Summary', { data: data.data, type: searchType.neighbor, searchOption });
        }
      } else if (type === 2) {
        console.log(this.state)
        let data = await searchChart({
          timeStart: StYear,
          timeEnd: EnYear,
          timeSortOrder: stTie,
          priceSortOrder: stPrice,
          AmtStart: price_range_start,
          AmtEnd: price_range_end,
          neigbor:neigbor
        });

        if (data.data == 'neighbor not supported') {
          Toast.show('neighbor not supported')
          this.setState({ isLoaderlVisible: false });
        }
        else if (data.data.length == 0) {
          Toast.show('No result found')
          this.setState({ isLoaderlVisible: false });
        }
        else {
          this.setState({ isLoaderlVisible: false });
          this.props.route.navig.navigation.navigate('Chart', { data: data.data, state, county, locality, neigbor });
        }
      }
    }
  }

  onChangeTextState(text) {
    let countyState = text === 'NY' ?
      [{ value: 'New York County' }, { value: 'Ontario County' }, { value: 'Kings County' }, { value: 'Genesee County' }]
      : [{ value: 'Hudson County' }, { value: 'Essex County' }, { value: 'Bergen County' }];
    this.setState({
      countyArray: countyState,
      county: '',
      neigbor: '',
      locality: '',
      state: text
    });
  }

  async onChangeTextCounty(text) {
    let LocalityArr = [], NeighborArr = [];
    this.setState({
      neigbor: '',
      locality: '',
      county: text,
      isLoaderlVisible: true
    });
    let data = await getNeighborCounty({ county: text, state: this.state.state });
    data.data.map((item, i) => {
      item.Locality !== '' && LocalityArr.push({ 'value': item.Locality });
      item.Neigborhood !== '' && NeighborArr.push({ 'value': item.Neigborhood });
    });
    this.setState({
      LocArray: this.removeDuplicates(LocalityArr),
      NeighborArray: this.removeDuplicates(NeighborArr),
      isLoaderlVisible: false
    });
  }

  removeDuplicates(arr) {
    let flags = [], output = [];
    for (let i = 0, l = arr.length; i < l; i++) {
      if (flags[arr[i].value]) continue;
      flags[arr[i].value] = true;
      output.push({ 'value': arr[i].value });
    }
    return output;
  }

  onChangeTextLocality(text) {
    this.setState({ neigbor: '', locality: text });
  }

  onChangeTextNeighbor(text) {
    this.setState({ neigbor: text });
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
        timechkval: flag
      });
    }
    else {
      this.setState({
        disable: true,
        timechkval: flag
      });
    }
  }

  PriceChkValuesChangeDate = (values) => {
    let flag = !this.state.pricechkval;
    if (flag) {
      this.setState({
        multiSliderValue: [10000, 10000000],
        disablePrice: false,
        pricechkval: flag
      });
    } else {
      this.setState({
        disablePrice: true,
        pricechkval: flag
      });
    }
  }

  render() {
    let state = [{ value: 'NY' }, { value: 'NJ' }];
    let county = this.state.countyArray;
    let locality = this.state.LocArray;
    let Neigbor = this.state.NeighborArray;

    return (
      <ScrollView style={styles.container}>
        <Dropdown
          label='Select State'
          onChangeText={this.onChangeTextState}
          fontSize={18}
          labelFontSize={16}
          data={state}
          value={this.state.state} />
        <Dropdown
          label='Select County'
          onChangeText={this.onChangeTextCounty}
          fontSize={18}
          labelFontSize={16}
          data={county}
          value={this.state.county} />
        <Dropdown
          label='Select Locality'
          onChangeText={this.onChangeTextLocality}
          fontSize={18}
          labelFontSize={16}
          data={locality}
          value={this.state.locality} />
        <Dropdown
          label='Select Neighborhood'
          onChangeText={this.onChangeTextNeighbor}
          fontSize={18}
          labelFontSize={16}
          data={Neigbor}
          value={this.state.neigbor} />
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
          selectedStyle={{ backgroundColor: 'silver', }}
          unselectedStyle={{ backgroundColor: 'silver', }}
          values={[this.state.multiSliderValueDate[0], this.state.multiSliderValueDate[1]]}
          sliderLength={DEVICE_WIDTH - 54}
          containerStyle={{ height: 30 }}
          onValuesChange={this.multiSliderValuesChangeDate}
          min={1}
          max={10}
          enabledOne={this.state.disable}
          enabledTwo={this.state.disable}
          step={1}
          allowOverlap
          snapped />
        <View style={styles.sliderRange}>
          <Text style={styles.Rangetext}>Price Range:</Text>
          <CheckBox
            title='All'
            containerStyle={{ backgroundColor: '#fff', borderColor: '#fff', padding: 0, margin: 0 }}
            checked={this.state.pricechkval}
            onPress={() => this.PriceChkValuesChangeDate()} />
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
        <Spinner visible={this.state.isLoaderlVisible} />
        <Button
          title='Next'
          textStyle={styles.nextText}
          buttonStyle={styles.nextButton}
          disabled={this.state.isLoaderlVisible}
          onPress={() => this._summaryPage(1)} />
        <Button
          title='Chart'
          textStyle={styles.nextText}
          buttonStyle={[styles.nextButton, { marginTop: 6 }]}
          disabled={this.state.isLoaderlVisible}
          onPress={() => this._summaryPage(2)} />
      </ScrollView>
    )
  }
}
