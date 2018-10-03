import React from 'react';
import { View, ScrollView, Text, } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { HeaderBackButton } from 'react-navigation';
import { CheckBox, Button } from 'react-native-elements'

import SelfCheck from '../../components/SelfCheck';

import styles from './style';

import { DEVICE_WIDTH } from '../../util';


class ConfigScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: `Config`,
    headerLeft: (
      <HeaderBackButton
        title='Back'
        tintColor={'#898989'}
        onPress={() => navigation.goBack()} />
    ),
    headerStyle: { backgroundColor: '#fff' },
    headerTitleStyle: { color: '#898989', alignSelf: 'center' }
  });

  state = {
    radius: [0],
    timeRange: [0, 10],
    priceRange: [10000, 10000000],
    isLoaderlVisible: false,
    timechkval: true,
    pricechkval: true,
    timeDisable: false,
    priceDisable: false,
    toggleTime: false,
    togglePrice: false,
  }

  onTimeAllSelect = () => {
    let flag = !this.state.timechkval;
    if (flag) {
      this.setState({
        timeRange: [1, 10],
        timeDisable: false,
        timechkval: flag,
      });
    }
    else {
      this.setState({
        timeDisable: true,
        timechkval: flag,
      });
    }
  }

  onPriceAllSelect = () => {
    let flag = !this.state.pricechkval;
    if (flag) {
      this.setState({
        priceRange: [10000, 10000000],
        priceDisable: false,
        pricechkval: flag,
      });
    }
    else {
      this.setState({
        priceDisable: true,
        pricechkval: flag,
      });
    }
  }

  render() {
    return (
      <ScrollView style={styles.sortContainer}>
        <View style={[styles.sliderRange, { paddingBottom: 24 }]}>
          <Text style={styles.Rangetext}>Radius:</Text>
          <Text style={styles.text}>{`Within ${this.state.radius[0]} Miles`}</Text>
        </View>
        <MultiSlider
          selectedStyle={{
            backgroundColor: 'silver',
          }}
          unselectedStyle={{
            backgroundColor: 'silver',
          }}
          values={this.state.radius}
          min={0}
          max={1}
          step={0.01}
          sliderLength={DEVICE_WIDTH - 54}
          onValuesChange={(radius) => {
            radius[0] = +radius[0].toFixed(2);
            this.setState({ radius })
          }} />
        <View style={styles.sliderRange}>
          <Text style={styles.Rangetext}>Time Range:</Text>
          <CheckBox
            title='All'
            containerStyle={{ backgroundColor: '#fff', borderColor: '#fff', padding: 0, margin: 0 }}
            checked={this.state.timechkval}
            onPress={() => this.onTimeAllSelect()} />
          <Text style={styles.text}>past {this.state.timeRange[0]} to {this.state.timeRange[1]} years</Text>
        </View>
        <MultiSlider
          selectedStyle={{
            backgroundColor: 'silver',
          }}
          unselectedStyle={{
            backgroundColor: 'silver',
          }}
          values={[this.state.timeRange[0], this.state.timeRange[1]]}
          sliderLength={DEVICE_WIDTH - 54}
          onValuesChange={(timeRange) => this.setState({ timeRange })}
          min={1}
          max={10}
          enabledOne={this.state.timeDisable}
          enabledTwo={this.state.timeDisable}
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
              onPress={() => this.onPriceAllSelect()} />
          </View>
          <Text style={styles.text}>{this.state.priceRange[0]} to {this.state.priceRange[1]}</Text>
        </View>
        <MultiSlider
          selectedStyle={{
            backgroundColor: 'silver',
          }}
          unselectedStyle={{
            backgroundColor: 'silver',
          }}
          values={[this.state.priceRange[0], this.state.priceRange[1]]}
          sliderLength={DEVICE_WIDTH - 54}
          onValuesChange={(priceRange) => this.setState({ priceRange })}
          min={10000}
          max={10000000}
          enabledOne={this.state.priceDisable}
          enabledTwo={this.state.priceDisable}
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
              onCheck={(toggleTime) => this.setState({ toggleTime })} />
          </View>
          <View style={styles.toggleItem}>
            <SelfCheck
              label='Price'
              Checked={this.state.togglePrice}
              onCheck={(togglePrice) => this.setState({ togglePrice })} />
          </View>
        </View>
        <Button
          title='OK'
          textStyle={styles.nextText}
          buttonStyle={styles.nextButton}
          disabled={this.state.isLoaderlVisible}
          loading={this.state.isLoaderlVisible}
          onPress={() => { this.props.navigation.goBack(); }} />
      </ScrollView>
    )
  }
}


export default ConfigScreen;