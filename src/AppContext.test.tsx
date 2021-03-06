import React from 'react';
import { shallow, mount } from 'enzyme';

import AppContextProvider from './AppContext';
import { BrowserRouter } from 'react-router-dom';
import labels from './config/labels';

describe('AppContext works as expected', () => {
  it('AppContext matches a snapshot', () => {
    const wrapper = shallow(<AppContextProvider />);
    expect(wrapper).toMatchSnapshot();
  });

  it('setLangHandler changes the lang', () => {
    const wrapper = mount(
      <BrowserRouter>
        <AppContextProvider />
      </BrowserRouter>
    );
    const instance = wrapper.find('AppContextProvider').instance();
    instance.setState({
      lang: 'en'
    });
    instance.setLangHandler('uk');
    expect(instance.state.lang).toEqual('uk');
  });

  it('Setting user credentails and logout change Auth context state', () => {
    const wrapper = mount(
      <BrowserRouter>
        <AppContextProvider.WrappedComponent />
      </BrowserRouter>
    );
    const instance = wrapper.find('AppContextProvider').instance();
    instance.setState({
      userLogin: '',
      userId: '',
      userToken: '',
      userAuthenticated: false,
      authenticationMethod: undefined,
      userRole: '',
      lang: 'en',
      labels: {},
      fetchInProgress: false,
      mobileMode: true,
      showNavigation: false,
      togglePosition: 'absolute'
    });
    wrapper.update();
    instance.setUserCredentialsHandler(
      'testLogin',
      'testId',
      'testToken',
      '',
      ''
    );
    expect(instance.state).toEqual({
      userLogin: 'testLogin',
      userId: 'testId',
      userToken: 'testToken',
      userAuthenticated: true,
      authenticationMethod: '',
      userRole: '',
      lang: 'en',
      labels: {},
      fetchInProgress: false,
      mobileMode: true,
      showNavigation: false,
      togglePosition: 'absolute'
    });
    instance.logoutHandler();
    expect(instance.state).toEqual({
      userLogin: '',
      userId: '',
      userToken: '',
      userAuthenticated: false,
      authenticationMethod: undefined,
      userRole: '',
      lang: 'en',
      labels: {},
      fetchInProgress: false,
      mobileMode: true,
      showNavigation: false,
      togglePosition: 'absolute'
    });
  });

  it('Changes state if local storage auth credentials are not empty', () => {
    localStorage.floristAuthToken = 'asfasfasf';
    const wrapper = mount(
      <BrowserRouter>
        <AppContextProvider.WrappedComponent />
      </BrowserRouter>
    );
    const instance = wrapper.find('AppContextProvider').instance();
    expect(instance.state.userAuthenticated).toBeTruthy();
  });
  it('showNavigationHandler and hideNavigationHandler change the state', () => {
    const wrapper = mount(
      <BrowserRouter>
        <AppContextProvider.WrappedComponent />
      </BrowserRouter>
    );
    const context = wrapper.find('AppContextProvider').instance();
    context.setState({
      userLogin: 'testLogin',
      userId: 'testId',
      userToken: 'testToken',
      userAuthenticated: false,
      authenticationMethod: undefined,
      userRole: 'user',
      lang: 'en',
      labels: {},
      fetchInProgress: false,
      mobileMode: true,
      showNavigation: false,
      togglePosition: 'absolute'
    });
    wrapper.update();
    context.showNavigationHandler();
    expect(context.state.showNavigation).toBeTruthy();
    expect(context.state.togglePosition).toEqual('fixed');
    context.hideNavigationHandler();
    expect(context.state.showNavigation).toBeFalsy();
    expect(context.state.togglePosition).toEqual('absolute');
  });
  it('enableMobileModeHandler and disableMobileModeHandler change the state', () => {
    const wrapper = mount(
      <BrowserRouter>
        <AppContextProvider.WrappedComponent />
      </BrowserRouter>
    );
    const context = wrapper.find('AppContextProvider').instance();
    context.setState({
      userLogin: 'testLogin',
      userId: 'testId',
      userToken: 'testToken',
      userAuthenticated: false,
      authenticationMethod: undefined,
      userRole: 'user',
      lang: 'en',
      labels: {},
      fetchInProgress: false,
      mobileMode: false,
      showNavigation: false,
      togglePosition: 'absolute'
    });
    wrapper.update();
    context.enableMobileModeHandler();
    expect(context.state.mobileMode).toBeTruthy();
    context.disableMobileModeHandler();
    expect(context.state.mobileMode).toBeFalsy();
  });
});
