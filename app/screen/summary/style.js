import { DEVICE_HEIGHT } from '../../util'

export default {
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headtext: {
    color: 'white',
    marginLeft: 5,
    textAlign: 'center'
  },
  summaryTableView: {
    flex: 1,
    marginTop: 4,
    marginLeft: 5,
    marginRight: 5,
  },
  summaryTableHeader: {
    flexDirection: 'row',
    flex: 6,
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#808080',
    paddingTop: 5,
    paddingBottom: 5,
  },
  summaryTableBlock: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
  },
  Headtext: {
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row', justifyContent: 'space-between' 
  },
  itemText: {
    fontSize: 12, color: '#656565'
  },
  EmptyBodytext: {
    marginTop: 25,
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold'
  },
}