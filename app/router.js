import React, { Component } from 'react';
import {
  TabNavigator,
  StackNavigator,
  addNavigationHelpers,
 } from 'react-navigation';
import {
  initializeListeners,
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

import { connect } from 'react-redux'

import HomeScreen from './screen/home';
import LoginScreen from './screen/login';
import SignScreen from './screen/sign';
import VerificationScreen from './screen/verification';
import ForgotScreen from './screen/forgot';
import HighChartScreen from './screen/Chart';
import SearchScreen from './screen/Search';
import SummaryScreen from './screen/summary';
import DetSumScreen from './screen/detailsummary';
import MulSumScreen from './screen/multisummary';

import SettingScreen from './screen/Setting';
import ConfigScreen from './screen/Conf';

const paramsToProps = (SomeComponent) => {
  return class extends Component {
    static navigationOptions = SomeComponent.navigationOptions;
    render() {
      const { navigation } = this.props;
      const { state: { params } } = navigation;
      return <SomeComponent {...this.props} {...params} />
    }
  }
}

const MainNavigator = TabNavigator({
  Search: {
    screen: SearchScreen,
  },
  Config: {
    screen: SettingScreen
  }
}, {
    animationEnabled: false, // 切换页面时不显示动画
    tabBarPosition: 'bottom', // 显示在底端,android 默认是显示在页面顶端的
    swipeEnabled: false, // 禁止左右滑动
    backBehavior: 'none', // 按 back 键是否跳转到第一个 Tab, none 为不跳转
    tabBarOptions: {//配置标签栏的一些属性
      activeTintColor: '#23BCBA',// 文字和图片选中颜色
      inactiveTintColor: '#bdbdbd', // 文字和图片默认颜色
      showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
      indicatorStyle: { height: 0 }, // android 中TabBar下面会显示一条线,高度设为 0 后就不显示线了 暂时解决这个问题
      style: {
        backgroundColor: '#f7f7f7', // TabBar 背景色
        paddingBottom: 0,
      },
      labelStyle: {
        fontSize: 12, // 文字大小
      },
    },
  })

const AuthNavigator = StackNavigator({
  Login: {
    screen: paramsToProps(LoginScreen)
  },
  Conf: {
    screen: paramsToProps(ConfigScreen)
  },
  Sign: {
    screen: paramsToProps(SignScreen)
  },
  Verification: {
    screen: paramsToProps(VerificationScreen)
  },
  Home: {
    screen: paramsToProps(HomeScreen)
  },
  Forgot: {
    screen: paramsToProps(ForgotScreen)
  },
  Main: {
    screen: MainNavigator
  },
  Chart: {
    screen: paramsToProps(HighChartScreen)
  },
  Summary: {
    screen: paramsToProps(SummaryScreen)
  },
  MultiSummary: {
    screen: paramsToProps(MulSumScreen)
  },
  DetailSummary: {
    screen: paramsToProps(DetSumScreen)
  },
});

export const routerMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.router
);
const addListener = createReduxBoundAddListener('root');

class Router extends React.PureComponent {
  componentDidMount() {
    initializeListeners('root', this.props.router)
  }
  render() {
    const { dispatch, router, isInit } = this.props;
    const navigation = addNavigationHelpers({
      dispatch,
      state: router,
      addListener,
    });
    if(isInit) return null;
    return <AuthNavigator navigation={navigation} />;
  }
}

export function routerReducer(state, action = {}) {
  return AuthNavigator.router.getStateForAction(action, state)
}

function select(state) {
  return {
    router: state.router,
    isInit: state.app.isInit
  }
}

export default connect(select)(Router);
