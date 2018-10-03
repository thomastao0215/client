import React from 'react';
import { View, Dimensions, Text } from 'react-native';
import ChartView from 'react-native-highcharts';
import { HeaderBackButton } from 'react-navigation';
import { LargeList } from 'react-native-largelist';

import { searchChartList } from '../../api/search';
import Spinner from 'react-native-loading-spinner-overlay';

import { addCommas, dateFormat } from '../../util'

import styles from './style';




class HighChartScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.chartData = [];
    for (let i = 0, j = 12 * 4, tempValue = {}; i < j; i++) {
      if (this.props.data[i] !== undefined){
        tempValue = this.props.data[i];
        // console.log(tempValue)
        this.chartData.push({
          x: Date.UTC(tempValue.Year, tempValue.Month - 1, i % 27),
          low: tempValue.min,
          q1: tempValue['25pct'],
          median: tempValue.median,
          q3: tempValue['75pct'],
          high: tempValue.max,
          total: tempValue.total,
          date: `${tempValue.Year}.${tempValue.Month}`
        })
      }


    }
    // avoid chart show half data.
    let tmpMonth = new Date(this.chartData[0].x);
    this.chartData.unshift({
      x: new Date(this.chartData[0].x).setMonth(tmpMonth - 1),
      low: 0,
      q1: 0,
      median: 0,
      q3: 0,
      high: 0,
      total: 0,
      date: `no click`
    })
    this.state = {
      isRefresh: false
    }
  }
  static navigationOptions = ({ navigation }) => ({
    title: `Plot Chart`,
    headerLeft: (
      <HeaderBackButton
        title='Back'
        tintColor={'#898989'}
        onPress={() => navigation.goBack()} />
    ),
    headerStyle: { backgroundColor: '#fff' },
    headerTitleStyle: { color: '#898989', alignSelf: 'center' }
  });

  listData = [];

  onMessage = async (event) => {
    let data = event.nativeEvent.data;
    data = JSON.parse(data);
    let [y, m] = data.date.split('.');
    this.setState({
      isRefresh: true
    }, async () => {
      // const { zipcode, state = '' } = this.props;
      const zipcode = this.props.zipcode
      var options
      let { state, county, locality, neigbor } = this.props;
      if (zipcode !== undefined){
        options = {
          zipcode:zipcode,
          year: Number(y),
          month: Number(m)
        }
      }else {
        options = {
          state:state,
          county:county,
          locality:locality,
          neighbor:neigbor,
          year: Number(y),
          month: Number(m)
        }
      }
      console.log(options)


      console.log(options)
      let data = await searchChartList(options);
      console.log(data);
      this.listData = data.data;
      this.list.reloadData();
    })
  }

  itemRender = (section, index) => {
    let data = this.listData[index];
    let lastAmount = addCommas(data.TRANSACTIONS[0].AMOUNT);
    let FullDate = dateFormat(data.TRANSACTIONS[0].DOC_DATE);
    console.log(FullDate)
    return (
      <View style={{
        backgroundColor: '#fff',
        paddingVertical: 4,
        height: 40,
        paddingHorizontal: 16,
        borderBottomColor: '#f4f4f4',
        borderBottomWidth: 1,
      }}>
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>Amount:<Text style={{ color: '#25b5ef' }}>{`$${lastAmount}`}</Text></Text>
          <Text style={styles.itemText}>{FullDate}</Text>
        </View>
        <View style={[styles.itemContainer, { marginTop: 2 }]}>
          <Text style={{ fontSize: 13, }} >{`${data.ADDRESS} - ${data.PROPERTY_TYPE}`}</Text>
          <Text style={styles.itemText}>{`Unit: ${data.UNIT || 'NULL'}`}</Text>
        </View>
      </View>
    );
  }
  render() {
    let conf = {
      chart: {
        type: 'boxplot',
      },
      title: {
        text: ''
      },
      scrollbar: {
        enabled: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: function (o) {
                let clickObj = {
                  total: this.total,
                  max: this.high,
                  q3: this.q3,
                  median: this.median,
                  q1: this.q1,
                  low: this.low,
                  date: this.date,
                }
                window.postMessage(JSON.stringify(clickObj));
              }
            }
          }
        }
      },
      xAxis: {
        title: {
          text: 'month'
        },
        type: 'datetime',
        minRange: 30 * 24 * 3600 * 1000
      },
      yAxis: {
        title: {
          text: 'money'
        },
        // plotLines: [{
        //   value: 932,
        //   color: 'red',
        //   width: 1,
        //   label: {
        //     text: '理论模型: 932',
        //     align: 'center',
        //     style: {
        //       color: 'gray'
        //     }
        //   }
        // }]
      },
      tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.date}</b><br/>' + // eslint-disable-line no-dupe-keys
          'largest: {point.high}<br/>' +
          '75pct\t: {point.q3}<br/>' +
          'median: {point.median}<br/>' +
          '25pct\t: {point.q1}<br/>' +
          'smallest: {point.low}<br/>' +
          'total\t: {point.total}<br/>',
        split: false,
      },
      rangeSelector: {
        buttons: [{
          type: 'month',
          count: 3,
          text: '3m'
        }, {
          type: 'all',
          text: 'all'
        }],
        selected: 1
      },
      series: [{
        name: '观测值',
        type: 'boxplot',
        data: this.chartData,
        tooltip: {
          headerFormat: '<em>{point.date}</em><br/>'
        }
      }],
      exporting: {
        enabled: false     //not show export
      },
      credits: {
        enabled: false     //not show url
      },
    };

    const options = {
      global: {
        useUTC: false
      },
      lang: {
        decimalPoint: '.',
        thousandsSep: ','
      }
    };

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Spinner visible={this.state.isRefresh} />
        <ChartView
          style={{ flex: 2 }}
          config={conf}
          stock={true}
          more={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          options={options}
          onMessage={this.onMessage} />
        <LargeList
          style={{ flex: 1 }}
          ref={r => this.list = r}
          renderEmpty={() => <Text>Click to show more infomation</Text>}
          numberOfRowsInSection={() => this.listData.length}
          renderItemSeparator={() => { }}
          onLargeListDidUpdate={() => { this.setState({ isRefresh: false }); }}
          heightForCell={() => 40}
          renderCell={this.itemRender}
          getItemLayout={(data, index) => ({ length: 40, offset: 40 * index, index })} />
      </View>
    );
  }


}

export default HighChartScreen;
