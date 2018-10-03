import React, { Component } from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { LargeList } from "react-native-largelist";
import { dateFormat, addCommas } from '../../util';
import styles from './styles';

export default class MultiSummary extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Multi Units Summary`,
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
    this.detailPage = this.detailPage.bind(this);
  }

  componentWillMount() {
    this.arrData = this.props.data;
  }

  async detailPage(val) {
    this.props.navigation.navigate('DetailSummary', { data: val });
  }

  itemRender = (section, index) => {
    let data = this.arrData[index];
    let FullDate = data.TRANSACTIONS.length !== 0 ? dateFormat(data.TRANSACTIONS[0].DOC_DATE, "yyyy-mm-dd") : 'NA';
    let Amount = data.TRANSACTIONS.length !== 0 ? addCommas(data.TRANSACTIONS[0].AMOUNT) : 'NA';
    let unit = data.UNIT == '' ? 'NA' : data.UNIT;
    return (
      <View>
        <TouchableHighlight
          style={{
            height: 60,
            backgroundColor: '#fff',
            paddingVertical: 12,
            paddingHorizontal: 16
          }}
          underlayColor='#fff'
          activeOpacity={0.7}
          onPress={() => this.detailPage(data)}>
          <View>
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>Last:<Text style={{ color: '#25b5ef' }}>{`$${Amount}`}</Text></Text>
              <Text style={styles.itemText}>{FullDate}</Text>
            </View>
            <View style={[styles.itemContainer, { marginTop: 6, }]}>
              <Text style={{ fontSize: 14, }}>{data.ADDRESS}</Text>
              <Text style={{ fontSize: 14, color: '#656565' }}>{`Unit: ${unit}`}</Text>
            </View>
          </View>
        </TouchableHighlight>
        <View style={{ height: 1, backgroundColor: '#dcdcdc', marginHorizontal: 16 }} />
      </View>
    );
  }

  render() {
    if (this.arrData.length === 0) {
      return <Text style={styles.EmptyBodytext}> No Result</Text>;
    }
    return (
      <View style={styles.container}>
        <LargeList
          style={{ flex: 1 }}
          numberOfRowsInSection={() => this.arrData.length}
          heightForCell={() => 60}
          renderItemSeparator={() => { }}
          renderCell={this.itemRender}
          getItemLayout={(data, index) => ({ length: 60, offset: 60 * index, index })} />
      </View>
    )
  }
}
