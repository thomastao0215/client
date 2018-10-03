import React from 'react';
import { View } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { Button, FormInput, FormLabel, FormValidationMessage } from 'react-native-elements'
import { connect } from 'react-redux';

import Spinner from 'react-native-loading-spinner-overlay';

import { createAct } from '../../util/index';

import styles from './style';

class SignScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Sign up',
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
      emailValid: true,
      email: ""
    }
  }

  async nextBtnPressed() {
    if (this.state.email.length == 0) {
      this.setState({ emailValid: false });
      return;
    }
    if (this.isEmailValidated(this.state.email)) {
      this.setState({ emailValid: true });
      this.props.dispatch(createAct('app/register')({ email: this.state.email }));
    } else {
      this.setState({ emailValid: false });
    }
  }

  isEmailValidated = (text) => {
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
          <Spinner visible={this.state.isLoading}/>
        <Button
          title='Send'
          textStyle={styles.sendText}
          buttonStyle={styles.sendButton}
          onPress={() => this.nextBtnPressed()} />
      </View>
    )
  }
}

function select(state) {
  return {

  }
}

export default connect(select)(SignScreen);