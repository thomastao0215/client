import React, { Component } from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  FlatList,
  Alert,
} from 'react-native';
import styles from './style';
import { HeaderBackButton } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import { SearchBar } from 'react-native-elements';
import Toast from '../../components/Toast';

import { searchDetail, searchNearby, searchNeighbor, searchZipCode, searchGoogle } from '../../api/search';
import { addCommas, dateFormat } from '../../util';

import { searchType } from '../../config';

export default class Summary extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Property Summary`,
    headerLeft: (
      <HeaderBackButton
        title='Back'
        tintColor={'#898989'}
        onPress={() => navigation.goBack()} />
    ),
    // TODO: need be consummated
    headerRight: navigation.state.params && navigation.state.params.data && navigation.state.params.data.length === 1 && (
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor='#fff'
        onPress={() => {
          Alert.alert('Tip', 'Now the radius is 0.4, whether need change?', [
            {
              text: 'Change', onPress: () => {
                navigation.navigate('Conf');
              }
            }, {
              text: 'Cancel', onPress: async () => {
                let data = await searchNearby({
                  address: '311 TENTH STREET',
                  zipcode: '07302',
                  state: 'New Jersey'
                });
                if (data.data === 'neighbor not supported') {
                  Toast.show('neighbor not supported');
                }
                else if (data.data.length === 0) {
                  Toast.show('No result found');
                }
                else {
                  navigation.navigate('Summary', { data: data.data });
                }
              }
            }
          ])
        }}>
        <Text style={{ color: '#898989', paddingHorizontal: 12, paddingVertical: 6, fontSize: 16, fontWeight: '500' }}>Nearby</Text>
      </TouchableHighlight>
    ),
    headerStyle: { backgroundColor: '#fff' },
    headerTitleStyle: { color: '#898989', alignSelf: 'center' }
  });

  constructor(props) {
    super(props);
    this.state = {
      addr: '',
      isLoading: false,
      list: props.data,
      complete: props.data.length < 18
    }
    this.detailPage = this.detailPage.bind(this);
  }

  componentWillMount() {
    this.page = 1;
    this.keyword = '';
    this.searchOption = this.props.searchOption;
    this.type = this.props.type;
  }

  async detailPage(val) {
    this.setState({
      isLoading: true,
    });
    let data = await searchDetail({
      // address: val.Address,
      // zipcode: val.Zipcode,
      // state: val.State,
      id:val.id
    })

    // console.log(dataId)
    if (data == '' || data == []) {
      Toast.show('No Result Found');
      this.setState({
        isLoading: false,
      });
    }
    else {
      this.setState({
        isLoading: false,
      });
      let length = data.data.length;
      if (length == 1) {
        if (data.data.UNIT == '') {
          this.props.navigation.navigate('DetailSummary', { data: data.data });
        }
        else {
          this.props.navigation.navigate('MultiSummary', { data: data.data, info: val });
        }
      }
      else {
        this.props.navigation.navigate('MultiSummary', { data: data.data });
      }
    }
  }

  filterAddr = async (text) => {
    let data = '';
    this.page = 1;
    this.keyword = text;
    this.setState({
      isLoading: true
    });
    if (this.type === searchType.neighbor) {
      data = await searchNeighbor({
        ...this.searchOption,
        keyword: this.keyword,
        page: 1,
      });
    } else if (this.type === searchType.zipCode) {
      data = await searchZipCode({
        ...this.searchOption,
        keyword: this.keyword,
        page: 1,
      });
    } else if (this.type === searchType.google) {
      data = await searchGoogle({
        ...this.searchOption,
        keyword: this.keyword,
        page: 1,
      });
    }
    console.log(data)

    let complete = false;

    if (data.data == '' || data.data == [] || typeof data.data === 'string') {
      complete = true;
      this.setState({
        complete,
        isLoading: false,
      });
    } else {
      if (data.data.length < 10) {
        complete = true;
      }
      this.setState({
        list: [...data.data],
        complete,
        isLoading: false,
      });
    }
  }

  onEndReached = async () => {
    let data = '';
    if (this.state.complete) return;
    if (this.type === searchType.neighbor) {
      data = await searchNeighbor({
        ...this.searchOption,
        keyword: this.keyword,
        page: ++this.page,
      });
    } else if (this.type === searchType.zipCode) {
      data = await searchZipCode({
        ...this.searchOption,
        keyword: this.keyword,
        page: ++this.page,
      });
    } else if (this.type === searchType.google) {
      data = await searchGoogle({
        ...this.searchOption,
        keyword: this.keyword,
        page: ++this.page,
      });
    }
    console.log(data);
    let complete = false;

    if (data.data == '' || data.data == [] || typeof data.data === 'string') {
      complete = true;
      this.setState({
        complete
      });
    } else {
      if (data.data.length < 10) {
        complete = true;
      }
      this.setState({
        list: [...this.state.list, ...data.data],
        complete
      });
    }


  }

  itemRender = (item) => {
    const data = item.item;
    const dataId = data._id;
    let FullDate = dateFormat(data.lastSalesDate, "yyyy-mm-dd");
    let lastAmount = addCommas(data.lastSalesAmount);
    let maxAmount = addCommas(data.maxSalesAmount);
    let DetailInfo = { Address: dataId.ADDRESS, Zipcode: dataId.ZIPCODE, State: dataId.STATE ,id:dataId.id}
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
          onPress={() => this.detailPage(DetailInfo)}>
          <View>
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>Last:<Text style={{ color: '#25b5ef' }}>{`$${lastAmount}`}</Text></Text>
              <Text style={styles.itemText}>{FullDate}</Text>
              <Text style={styles.itemText}>Record High:<Text style={{ color: '#25b5ef' }}>{`$${maxAmount}`}</Text></Text>
            </View>
            <View style={[styles.itemContainer, { marginTop: 6 }]}>
              <Text style={{ fontSize: 13, }} >{`${dataId.ADDRESS} - ${dataId.PROPERTY_TYPE}`}</Text>
              <Text style={{ fontSize: 13, color: '#656565' }}>{`No. Records: ${data.TotalRecords}`}</Text>
            </View>
          </View>
        </TouchableHighlight>
        <View style={{ height: 1, backgroundColor: '#dcdcdc', marginHorizontal: 16 }} />
      </View>
    );
  }

  _footer = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 40 }}>
        <Text style={{ textAlign: 'center' }}>{
          this.state.complete ? `that's all` : 'Loading ...'
        }</Text>
      </View>
    )
  }

  render() {
    if (this.state.list.length === 0) {
      return <Text style={styles.EmptyBodytext}>No Result</Text>;
    }
    return (
      <View style={styles.container}>
        <SearchBar
          lightTheme
          onChangeText={(addr) => this.setState({ addr })}
          containerStyle={{ backgroundColor: '#fff', borderBottomColor: '#fff' }}
          inputStyle={{ backgroundColor: '#ddd' }}
          returnKeyType={'search'}
          onSubmitEditing={() => {
            this.filterAddr(this.state.addr);
          }}
          placeholder='Filter Address' />
        <Spinner visible={this.state.isLoading} />
        <View style={styles.summaryTableView}>
          <FlatList
            style={{ flex: 1 }}
            data={this.state.list}
            renderItem={this.itemRender}
            getItemLayout={(data, index) => ({ length: 60, offset: 60 * index, index })}//行高70，分割线1，所以offset=71
            keyExtractor={(item, index) => `${item.name}${index}`}
            onEndReached={() => this.onEndReached()}
            ListFooterComponent={this._footer}
            onEndReachedThreshold={0.01} />
        </View>
      </View>
    )
  }
}
