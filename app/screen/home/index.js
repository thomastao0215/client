import React from 'react';

import { View, TouchableOpacity, Text, NativeModules, Alert } from 'react-native';
import { createAct } from '../../util/index';
import { connect } from 'react-redux';
const { InAppUtils } = NativeModules;

class HomeScreen extends React.PureComponent {

  static navigationOptions = ({ navigation }) => ({
    title: 'In-App Purchase Test Page',
    headerStyle: { backgroundColor: '#fff' },
    headerTitleStyle: { color: '#898989', alignSelf: 'center' }
  });

  constructor(props) {
    super(props);

    this.state = {
      hasProducts: false,
      canPurchaseProducts: false,
    }
  }

  componentDidMount() {
    var products = [
      'RealtyAnalytic_AutoRenew_Subscription'
    ];
    InAppUtils.loadProducts(products, (error, products) => {
      if (products.length !== 0) {
        alert(products);
        this.setState({ hasProducts: true })
        InAppUtils.canMakePayments((canMakePayments) => {
          if (!canMakePayments) {
            Alert.alert('Not Allowed', 'This device is not allowed to make purchases. Please check restrictions on device');
          } else {
            this.setState({ canPurchaseProducts: true });
          }
        })
      }
    });
  }

  buyProduct() {
    if (this.state.canPurchaseProducts && this.state.hasProducts) {
      var productIdentifier = 'RealtyAnalytic_AutoRenew_Subscription';
      InAppUtils.purchaseProduct(productIdentifier, (error, response) => {
        // NOTE for v3.0: User can cancel the payment which will be available as error object here.
        if (response && response.productIdentifier) {
          Alert.alert('Purchase Successful', 'Your Transaction ID is ' + response.transactionIdentifier);
          //unlock store here.
        }
      });
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
    }
  }
  logout = () => {
    this.props.dispatch(createAct('app/logout')());
  }

  render() {
    return (
      <View>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginTop: 100 }} onPress={() => this.buyProduct()}>
          <Text>Buy Product</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginTop: 100 }} onPress={() => this.restoreProduct()}>
          <Text>Restore Product</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginTop: 100 }} onPress={() => this.logout()}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

function select(state) {
  return {
    //null
  }
}

export default connect(select)(HomeScreen);