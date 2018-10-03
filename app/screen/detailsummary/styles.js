const React = require('react-native');
const { StyleSheet, Dimensions, Platform } = React;

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default ({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  EmptyBodytext: {
    marginTop: 25,
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold'
  },
  itemContainer: {
    flexDirection: 'row', justifyContent: 'space-between',
    height: 40,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  itemText: {
    fontSize: 12, color: '#656565'
  },

});
