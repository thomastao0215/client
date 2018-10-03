import React, { Component } from 'react';
import { View, Text, } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { LargeList } from "react-native-largelist";
import { searchDetail } from '../../api/search';
import { addCommas, dateFormat } from '../../util';


import styles from './styles';

export default class DetailSummary extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Detail Summary`,
    headerLeft: (
      <HeaderBackButton
        title='Back'
        tintColor={'#898989'}
        onPress={() => navigation.goBack()} />
    ),
    headerStyle: { backgroundColor: '#fff' },
    headerTitleStyle: { color: '#898989', alignSelf: 'center' }
  });

  constructor(props) {
    super(props);
    this.state = {
      data: null,
    }
    this.detailPage = this.detailPage.bind(this);
  }

  componentWillMount() {
    this.showHeader = this.props.data;
  }
  async detailPage(val) {
    let data = await searchDetail({
      id:val.id
      // address: val.Address,
      // zipcode: val.Zipcode,
      // state: val.State,
    });
    console.log(data);
    if (data.data[0].UNIT == '') {
      console.log('No Unit');
    }
    else {
      console.log('Unit Exist');
    }
  }

  renderHeader = () => {
    let arrData = this.showHeader;
    let arrUnit = arrData.UNIT == '' ? 'NA' : arrData.UNIT;
    let arrSqft = arrData.SQFT == null ? 'NA' : addCommas(arrData.SQFT);
    return (
      <View>
        <View style={[styles.itemContainer, { paddingVertical: 12, paddingHorizontal: 16 }]}>
          <Text style={styles.itemText}>{arrData.ADDRESS}</Text>
          <Text style={styles.itemText}>{`Unit: ${arrUnit}`}</Text>
          <Text style={styles.itemText}>{`${arrSqft} Sq.Ft.`}</Text>
        </View>
        <View style={{ height: 1, backgroundColor: '#dcdcdc', marginHorizontal: 16 }} />
      </View>
    )
  }

  itemRender = (section, index) => {
    let data = this.showHeader.TRANSACTIONS[index];
    let FullDate = dateFormat(data.DOC_DATE, "yyyy-mm-dd");
    let amount = addCommas(data.AMOUNT);
    return (
      <View>
        <View style={styles.itemContainer}>
          <Text style={[styles.itemText, { color: '#25b5ef' }]}>{`$${amount}`}</Text>
          <Text style={styles.itemText}>{FullDate}</Text>
        </View>
        <View style={{ height: 1, backgroundColor: '#dcdcdc', marginHorizontal: 16 }} />
      </View>
    )
  }

  render() {
    if (this.showHeader === null) {
      return <Text style={styles.EmptyBodytext}> No Result</Text>;
    }
    return (
      <View style={[styles.container]}>
        <LargeList
          style={{ flex: 1 }}
          numberOfRowsInSection={() => this.showHeader.TRANSACTIONS.length}
          heightForCell={() => 40}
          renderItemSeparator={() => { }}
          renderCell={this.itemRender}
          renderHeader={this.renderHeader}
          getItemLayout={(data, index) => ({ length: 40, offset: 40 * index, index })} />
      </View>
    )
  }
}
