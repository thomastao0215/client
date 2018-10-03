import { DEVICE_WIDTH } from '../../util';

export default {
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 12,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 40,
    borderRadius: 25,
    height: 50,
    backgroundColor: '#23BCBA'
  },
  sendText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    height: 40,
    marginTop:6,
    paddingLeft:6,
    color: '#0E0E0E',
  },
  errorText: {
    position: 'absolute',
    paddingLeft:10,
    top: 92,
  },
}