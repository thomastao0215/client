
import React from 'react';
import { Text, View } from 'react-native';
import { CheckBox } from 'react-native-elements';

export default class SelfCheck extends React.Component {
  onCheck = () => {
    let flag = !this.props.Checked;
    this.props.onCheck(flag);
  }
  render() {
    return (
      <View style={{ flexDirection: 'row',paddingHorizontal:15 }}>
        <Text style={{fontSize:17, color:'#43474d',marginTop:2}}>{this.props.label}</Text>
        <CheckBox
          title={this.props.Checked ? 'Asc' : 'Desc'}
          containerStyle={{ backgroundColor: '#fff', borderColor: '#fff', padding: 0, margin: 0 }}
          checked={this.props.Checked}
          onPress={() => this.onCheck()} />
      </View>
    )
  }

}