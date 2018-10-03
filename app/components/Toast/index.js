import React from 'react';
import RootView from './RootView'
import ToastView from './ToastView'

class Toast {
  static LONG = 2000;
  static SHORT = 1000;

  static show(msg) {
    RootView.setView(<ToastView
      message={msg}
      onDismiss={() => {
        RootView.setView()
      }} />)
  }

  static showLong(msg) {
    RootView.setView(<ToastView
      message={msg}
      time={this.LONG}
      onDismiss={() => {
        RootView.setView()
      }} />)
  }
}

export default Toast
