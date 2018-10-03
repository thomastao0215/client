const React = require('react-native');
const { StyleSheet, Platform, Dimensions } = React;

export default {
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  verifyLabel: {
    marginTop: 70,
    marginBottom: 20,
    marginLeft: 80,
    marginRight: 80,
    alignSelf: 'center',
    textAlign: 'center',
    color: '#9d9d9d'
  },
  form: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  formContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  codeContainer: {
    flex: 1,
    height: '100%'
  },
  verifyItemContainer: {
    borderRadius: 10,
    borderColor: '#9d9d9d',
    borderWidth: 0.5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },

  passwordContainer: {
    marginTop: 30,
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    alignSelf: 'center'
  },
  passwordItem: {
    fontSize: 15,
    width: '100%',
    height: 40,
    marginBottom:12,
    borderRadius: 5,
    borderColor: '#9d9d9d',
    borderWidth: 0.5,
    paddingLeft: 10
  },
  sendButton: {
    justifyContent: 'center',
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    height: 50,
    backgroundColor: '#23BCBA'
  },
  sendText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  },
}