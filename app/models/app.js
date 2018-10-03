import { createAction, Storage, NavigationActions } from '../util'
import { guestSign, loginCheck, registerverified, googleCheck, fbCheck } from '../api/auth';
import Toast from '../components/Toast';
export default {
  namespace: 'app',
  state: {
    isLogin: false,
    isInit: true,
    isLoading: false,
    isVerifyLoading: false,
    token: ''
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    *appInit(action, { select, call, put }) {
      // const appState = yield call(Storage.get, 'appState');
      // if (appState) {
      //   yield put(createAction('updateState')({ ...appState }));
      //   yield put(
      //     NavigationActions.reset({
      //       index: 0,
      //       actions: [NavigationActions.navigate({ routeName: 'Config' })],
      //     })
      //   );
      // }
      yield put(createAction('updateState')({ isInit: false }))
    },

    *login({ email, password }, { call, put }) {
      yield put(createAction('updateState')({ isLoading: true }));
      const data = yield call(loginCheck, { email, password });
      if (!data.error) {
        yield put(NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Main' })],
        }));
        yield put(createAction('updateState')({
          isLogin: true,
          isLoading: false,
          token: data.token
        }));
      } else {
        Toast.show(data.msg);
        yield put(createAction('updateState')({ isLoading: false }));
      }
    },

    *guestSign({ deviceId }, { select, call, put }) {
      yield put(createAction('updateState')({ isLoading: true }));
      const data = yield call(guestSign, deviceId);
      if (!data.error) {
        yield put(NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Main' })],
        }));
        yield put(createAction('updateState')({
          isLogin: true,
          token: data.token,
          isLoading: false,
        }));
        const tmpState = yield select(state => state.app);
        yield call(Storage.set, 'appState', tmpState); // 存储
      } else {
        Toast.show(data.msg);
        yield put(createAction('updateState')({ isLoading: false }));
      }
    },
    *fbAuth({ res }, { call, put }) {
      const data = yield call(fbCheck, res.id);
      console.log(data); //get id, name, email(user no set, no get)
      yield put(NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Main' })],
      }));
    },
    *googleAuth({ user }, { call, put }) {
      console.log(user);
      const data = yield call(googleCheck, user.idToken)
      console.log(data)
      yield put(NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Main' })],
      }));
    },
    *signSet({ token }, { }) {
      yield put(createAction('updateState')({
        isLogin: true,
        token
      }));
      yield put(NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Main' })],
      }));
      Toast.show('Welcome back to RealtyAnalytics');
    },
    *logout(action, { call, put }) {
      yield put(createAction('updateState')({
        isLogin: false,
        token: ''
      }));
      yield call(Storage.remove, 'appState');
      yield put(NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })],
      }));
    },
    *register({ email }, { call, put }) {
      try {
        const data = yield call(registerverified, email);
        console.log(data)
        if (!data.error) {
          let params = { email };
          yield put(NavigationActions.navigate({ routeName: 'Verification', params }));//('Verification', )
        } else {
          Toast.show(data.msg)
        }
      } catch (error) {
        console.log(error);
      }
    },

  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'appInit' });
    },
  },
}
