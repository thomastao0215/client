import React from 'react';
import { View, Text, TouchableHighlight, NativeModules } from 'react-native';
import { Icon } from 'react-native-elements';
import { createAct } from '../../util/index';
import { connect } from 'react-redux';

const { InAppUtils } = NativeModules;

class ClickItem extends React.PureComponent {
  render() {
    return (
      <View>
        <TouchableHighlight
          style={{
            height: 50,
            backgroundColor: '#fff',
            paddingVertical: 12,
            paddingHorizontal: 18
          }}
          underlayColor='#fff'
          activeOpacity={0.7}
          onPress={this.props.onPress}>
          <Text style={{ lineHeight: 26 }}>{this.props.title}</Text>
        </TouchableHighlight>
        <View style={{ height: 1, backgroundColor: '#dcdcdc', marginHorizontal: 16 }} />
      </View>
    )
  }
}

class SettingScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: 'Setting',
    tabBarLabel: 'Setting',
    tabBarIcon: ({ tintColor, focused }) => (
      <View>
        <Icon
          name='ios-settings' // 
          type='ionicon'  // ionicon
          color={tintColor} />
      </View>
    ),
    headerStyle: { backgroundColor: '#fff' },
    headerTitleStyle: { color: '#898989', alignSelf: 'center' }
  });
  state = {
    hasProducts: false,
    canPurchaseProducts: false,
  }

  UNSAFE_componentWillMount() {
    // var products = [
    //   'RealtyAnalytic_AutoRenew_Subscription'
    // ];
    // InAppUtils.loadProducts(products, (error, products) => {
    //   if (products.length !== 0) {
    //     alert(products);
    //     this.setState({ hasProducts: true })
    //     InAppUtils.canMakePayments((canMakePayments) => {
    //       if (!canMakePayments) {
    //         Alert.alert('Not Allowed', 'This device is not allowed to make purchases. Please check restrictions on device');
    //       } else {
    //         this.setState({ canPurchaseProducts: true });
    //       }
    //     })
    //   } else {
    //     alert(`no products found`);
    //   }
    // });
  }

  buyProduct() {
    if (this.state.canPurchaseProducts && this.state.hasProducts) {
      let productIdentifier = 'RealtyAnalytic_AutoRenew_Subscription';
      InAppUtils.purchaseProduct(productIdentifier, (error, response) => {
        // NOTE for v3.0: User can cancel the payment which will be available as error object here.
        if (response && response.productIdentifier) {
          Alert.alert('Purchase Successful', 'Your Transaction ID is ' + response.transactionIdentifier);
          //unlock store here.
        }
      });
    } else {
      alert(`can't buy, no products.`);
    }
  }

  restoreProduct() {
    if (this.state.hasProducts && this.state.canPurchaseProducts) {
      InAppUtils.restorePurchases((error, response) => {
        if (error) {
          Alert.alert('itunes Error', 'Could not connect to itunes store.');
        } else {
          Alert.alert('Restore Successful', 'Successfully restores all your purchases.');
          if (response.length === 0) {
            Alert.alert('No Purchases', "We didn't find any purchases to restore.");
            return;
          }
          response.forEach((purchase) => {
            if (purchase.productIdentifier === 'RealtyAnalytic_AutoRenew_Subscription') {
              // Handle purchased product.
            }
          });
        }
      });
    } else {
      alert(`can't restore, no products.`);
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ClickItem
          title='Buy Product'
          onPress={() => {
            // this.buyProduct();
          }} />
        <ClickItem
          title='Restore Product'
          onPress={() => {
            // this.restoreProduct();
          }} />
        <ClickItem
          title='Search config'
          onPress={() => {
            this.props.navigation.navigate('Conf');
          }} />
        <View style={{ width: '100%', alignItems: 'center', marginTop: 40 }}>
          <TouchableHighlight
            style={{
              height: 42,
              width: 240,
              backgroundColor: '#ff0000',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 4,
            }}
            underlayColor='#ff0101'
            activeOpacity={0.7}
            onPress={() => { this.props.dispatch(createAct('app/logout')()); }}>
            <Text style={{ lineHeight: 26, color: '#fff' }}>{'Logout'}</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

function select(state) {
  return {
    //null
  }
}

export default connect(select)(SettingScreen);