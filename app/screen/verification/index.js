import React, { Component } from 'react';

import { View, Text, TextInput } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import CodeInput from 'react-native-confirmation-code-input';
import { Button } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Toast from '../../components/Toast';

import { register } from '../../api/auth';

import styles from './style';
import { createAct } from '../../util';


class VerificationScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Verification',
      headerLeft: (
        <HeaderBackButton
          title='Back'
          tintColor={'#898989'}
          onPress={() => navigation.goBack()} />
      ),
      headerStyle: { backgroundColor: '#fff' },
      headerTitleStyle: { color: '#898989', alignSelf: 'center' }
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      code: '',
      password: '',
      confirm: '',
      isLoading: false,
    }
  }

  async signupWithPassword() {
    if (this.state.password === this.state.confirm) {
      try {
        this.setState({ isLoading: true })
        const data = await register({
          email: this.props.email,
          code: this.state.code,
          password: this.state.password,
          password2: this.state.confirm,
        });
        this.setState({ isLoading: false })
        if (!data.error) {
          this.props.dispatch(createAct('app/signSet')({ token: data.token }));
        } else {
          Toast.show(data.msg)
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      Toast.show('Password does not match');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.verifyLabel} numberOfLines={2}>Please enter verify code we sent to your email</Text>
        <View style={styles.formContainer}>
          <CodeInput
            ref="codeInputRef1"
            activeColor='rgba(255, 0, 0, 1)'
            inactiveColor='rgba(20, 20, 20, 1)'
            className={'border-b'}
            space={10}
            codeLength={4}
            size={50}
            keyboardType='numeric'
            inputPosition='center'
            onFulfill={(code) => this.setState({ code })} />
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#9d9d9d"
            secureTextEntry={true}
            style={styles.passwordItem}
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })} />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#9d9d9d"
            secureTextEntry={true}
            style={styles.passwordItem}
            value={this.state.confirm}
            onChangeText={(confirm) => this.setState({ confirm })} />
        </View>
        <Button
          title='Send'
          textStyle={styles.sendText}
          loading={this.props.isLoading}
          buttonStyle={styles.sendButton}
          onPress={() => this.signupWithPassword()} />
      </View>
    )
  }
}

function select(state) {
  return {}
}

export default connect(select)(VerificationScreen);