import { DEVICE_HEIGHT, DEVICE_WIDTH } from '../../util';

export default {
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white'
  },
  buttonContainer: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    height: DEVICE_HEIGHT * 0.4,
  },
  loginButton: {
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 25,
    height: 50,
    backgroundColor: '#23BCBA',
    justifyContent: 'center',
    alignItems: 'center'
  },
  forgotButton: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  signButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  leftContainer: {
    flex: 1,
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rightContainer: {
    flex: 1,
    marginRight: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  textButton: {
    color: '#23BCBA'
  },
  socialContainer: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: DEVICE_HEIGHT * 0.3
  },
  splitter: {
    width: DEVICE_WIDTH - 50,
    height: 0.5,
    backgroundColor: '#9d9d9d'
  },
  socialButtonContainer: {
    flex: 1,
    height: DEVICE_HEIGHT * 0.3,
    flexDirection: 'row',
    marginTop: 20,
  },
  socialButton: {
    flex: 1,
    width: DEVICE_WIDTH / 2,
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    height: 40,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
    borderColor: '#9d9d9d',
    borderWidth: 0.5,
    color: '#0E0E0E',
  },
  eye: {
    width: 30,
    height: 20,
    position: 'absolute',
    right: 20,
    top: 15
  }
}