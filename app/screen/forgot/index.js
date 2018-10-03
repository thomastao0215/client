import React from 'react';
import { View, Alert } from 'react-native';
import { Button, FormInput, FormLabel, FormValidationMessage } from 'react-native-elements'
import { HeaderBackButton } from 'react-navigation';
import Toast from '../../components/Toast';
import styles from './style';

import { resetPassword } from '../../api/auth'

export default class ForgotScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Reset Password',
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
      email: "",
      emailValid: true,
      isLoading: false
    }
  }

  async sendPressed() {
    if (this.state.email.length == 0) {
      this.setState({ emailValid: false });
      return;
    }
    if (this.isEmailValidated(this.state.email)) {
      this.setState({ emailValid: true, isLoading: true });
      const data = await resetPassword(this.state.email);
      console.log(JSON.stringify(data));
      this.setState({ isLoading: false });
      if (data.Message === 'Success') {
        let user = { email: this.state.email };
        this.props.navigation.navigate('Verification', { user });
      } else {
        Toast.show(data.Error);
      }
    } else {
      this.setState({ emailValid: false });
    }
  }

  isEmailValidated = (text) => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      console.log('Email is not valid');
      return false;
    } else {
      console.log('Email is valid');
      return true;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <FormLabel>Email</FormLabel>
        <FormInput
          inputStyle={styles.input}
          placeholder="Email Address"
          autoCorrect={false}
          returnKeyType={'done'}
          autoCapitalize={'none'}
          placeholderTextColor='#9d9d9d'
          underlineColorAndroid='transparent'
          value={this.state.email}
          onChangeText={(text) => this.setState({ email: text })} />
        {!this.state.emailValid && <FormValidationMessage containerStyle={styles.errorText}>
          Email invalid
          </FormValidationMessage>}
        <Button
          title='Send'
          textStyle={styles.sendText}
          loading={this.state.isLoading}
          buttonStyle={styles.sendButton}
          onPress={() => this.sendPressed()} />
      </View>
    )
  }
}