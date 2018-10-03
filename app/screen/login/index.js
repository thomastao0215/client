import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { Button } from 'react-native-elements'
import DeviceInfo from 'react-native-device-info';
import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { connect } from 'react-redux';

import Spinner from 'react-native-loading-spinner-overlay';

import { createAct, NavigationActions } from '../../util';

import styles from './style';

class LoginScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Login',
      headerBackTitle: ' ',
      headerStyle: { backgroundColor: '#fff' },
      headerTitleStyle: { color: '#898989', alignSelf: 'center' }
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      emailValid: true,
      passwordValid: true,
      email: "",
      password: "",
      showPass: true,
    }
  }

  componentDidMount() {
    GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
      GoogleSignin.configure({
        iosClientId: '764197323339-m89u7lv9gmfio2j04fjogkon453bt045.apps.googleusercontent.com', // only for iOS
      })
        .then(() => {
          // you can now call currentUserAsync()
        });
    })
      .catch((err) => {
        console.log("Play services error", err.code, err.message);
      })
  }

  gotoSignup() {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Sign' }))
  }

  gotoForgot() {
    this.props.dispatch(NavigationActions.navigate({ routeName: 'Forgot' }))
  }

  signupAsGuest() {
    var deviceId = DeviceInfo.getUniqueID();
    this.props.dispatch(createAct('app/guestSign')({ deviceId }));
  }

  loginPressed() {
    if (this.state.email.length === 0) {
      this.setState({ emailValid: false });
      return;
    }
    if (this.state.password.length === 0) {
      this.setState({ passwordValid: false });
      return;
    }
    if (this.isEmailValidated(this.state.email)) {
      this.setState({ emailValid: true });
      this.props.dispatch(createAct('app/login')({
        email: this.state.email,
        password: this.state.password
      }));
    } else {
      this.setState({ emailValid: false });
      return;
    }
  }

  showPassword() {
    this.state.showPass ? this.setState({ showPass: false }) : this.setState({ showPass: true });
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
  // facebook login process

  fbAuth = () => {
    const { navigate } = this.props.navigation;
    LoginManager.logInWithReadPermissions(['public_profile']).then(async (result) => {
      if (!result.isCancelled) {
        // let dat = await AccessToken.getCurrentAccessToken();
        // console.log(dat.accessToken.toString()); // get facebook accessToken
        let req = new GraphRequest('/me', {
          httpMethod: 'GET',
          version: 'v2.5',
          parameters: {
            'fields': {
              'string': 'email,name,friends'
            }
          }
        }, (err, res) => {
          if (err) {
            console.log('user profile fetch error: ' + err.toString());
          } else {
            this.props.dispatch(createAct('app/fbAuth')({ res }));
          }
        });
        new GraphRequestManager().addRequest(req).start();
      }
    }, function (error) {
      console.log('some error occured!!');
    });
  }

  googleAuth() {
    GoogleSignin.signIn().then((user) => {
      console.log(user);
      this.props.dispatch(createAct('app/googleAuth')({ user }));
    }).catch((err) => {
      console.log('WRONG SIGNIN', err);
    }).done();
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput style={[styles.input, { marginTop: 50 }]}
          placeholder="Email Address"
          autoCorrect={false}
          returnKeyType={'done'}
          autoCapitalize={'none'}
          placeholderTextColor='#9d9d9d'
          underlineColorAndroid='transparent'
          value={this.state.email}
          onChangeText={(text) => this.setState({ email: text })} />
        <View>
          <TextInput style={styles.input}
            placeholder="Password"
            secureTextEntry={this.state.showPass}
            autoCorrect={false}
            autoCapitalize={'none'}
            returnKeyType={'done'}
            placeholderTextColor='#9d9d9d'
            underlineColorAndroid='transparent'
            maxLength={20}
            value={this.state.password}
            onChangeText={(text) => this.setState({ password: text })} />
          <TouchableOpacity style={styles.eye} onPress={() => this.showPassword()}>
            <Image source={require('../../resources/img/show_password.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
        <Spinner visible={this.props.isLoading}/>
          <Button
            title='Login'
            textStyle={styles.buttonText}
            buttonStyle={styles.loginButton}
            onPress={() => this.loginPressed()} />
          <View style={styles.forgotButton}>
            <TouchableOpacity
              onPress={() => this.gotoForgot()}>
              <Text style={{ color: '#9d9d9d' }}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.signButtonContainer}>
            <View style={styles.leftContainer}>
              <TouchableOpacity
                onPress={() => this.signupAsGuest()}>
                <Text style={styles.textButton}>Sign up as Guest</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rightContainer}>
              <TouchableOpacity
                onPress={() => this.gotoSignup()}>
                <Text style={styles.textButton}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.socialContainer}>
          <View style={styles.splitter} />
          <View style={styles.socialButtonContainer}>
            <View style={styles.socialButton}>
              <TouchableOpacity onPress={() => this.fbAuth()} >
                <Image source={require('../../resources/img/bt-blue-small.png')} />
              </TouchableOpacity>
            </View>
            <View style={styles.socialButton}>
              <TouchableOpacity onPress={() => this.googleAuth()} >
                <Image source={require('../../resources/img/bt-red-small.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View >
    )
  }
}

function select(state) {
  return {
    isLoading: state.app.isLoading
  }
}

export default connect(select)(LoginScreen);