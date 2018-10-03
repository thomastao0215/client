import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import { Icon } from 'react-native-elements';

import Address from '../ExactAddress';
import Neighborhood from '../Neighborhood';
import ZipCode from '../ZipCode';
import styles from './style';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default class Search extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: 'Property Information Lookup',
    tabBarLabel: 'Main',
    tabBarIcon: ({ tintColor, focused }) => (
      <View>
        <Icon
          name='ios-home' // ios-settings
          type='ionicon'  // ionicon
          color={tintColor} />
      </View>
    ),
    headerStyle: { backgroundColor: '#fff' },
    headerTitleStyle: { color: '#898989', alignSelf: 'center' }
  });

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: 'Address', navig: props },
        { key: 'second', title: 'Neighborhood', navig: props },
        { key: 'third', title: 'Zip Code', navig: props },
      ],
    }
  }

  _handleIndexChange = index => {
    this.setState({ index });
  }

  _renderHeader = props => <TabBar {...props}
    style={{ backgroundColor: '#39BCBA' }}
    labelStyle={{ fontSize: 15, paddingLeft: 0, paddingRight: 0, paddingTop: 7, paddingBottom: 7, margin: 0, textAlign: 'center' }}
    getLabelText={({ route }) => route.title}
  />;

  _renderScene = SceneMap({
    first: Address,
    second: Neighborhood,
    third: ZipCode
  });

  render() {
    return (
      <View style={[styles.container]}>
        <TabViewAnimated
          swipeEnabled={false}
          style={styles.containerSearch}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={this._renderHeader}
          onIndexChange={this._handleIndexChange}
          initialLayout={initialLayout}
        />
      </View>
    )
  }
}
