import React from 'react';
import { shallow, mount } from 'enzyme';
import firebase from 'firebase';

import Auth from './Auth';
import AuthContextProvider from './AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { config } from '../../firebase';

it('Auth component matches a snapshot', () => {
  const wrapper = shallow(<Auth />);
  expect(wrapper).toMatchSnapshot();
});

it('AuthContext component matches a snapshot', () => {
  const wrapper = shallow(<AuthContextProvider />);
  expect(wrapper).toMatchSnapshot();
});

it('Submit event has impact on the state', async () => {
  let match = { params: { mode: 'signin' } };
  let wrapper = mount(
    <BrowserRouter>
      <Auth.WrappedComponent match={match} />
    </BrowserRouter>
  );
  let instance = wrapper.find('Auth').instance();
  instance.setState({
    formData: {
      email: 'bob_awesome@mail.com',
      password: 'bob_awesome'
    }
  });
  expect(instance.state.mode).toEqual('signin');
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
  wrapper.find('form').simulate('submit');
  expect(instance.state.formData.email).toEqual('');
  expect(instance.state.formData.password).toEqual('');

  match = { params: { mode: 'signup' } };
  wrapper = mount(
    <BrowserRouter>
      <Auth.WrappedComponent match={match} />
    </BrowserRouter>
  );
  instance = wrapper.find('Auth').instance();
  instance.setState({
    formData: {
      email: 'test@mail.com',
      password: 'test_mail'
    }
  });
  wrapper.find('form').simulate('submit');
  expect(instance.state.formData.email).toEqual('');
  expect(instance.state.formData.password).toEqual('');
});

it('Authorization with Google works', () => {
  const match = { params: { mode: 'signin' } };
  const wrapper = mount(
    <BrowserRouter>
      <Auth.WrappedComponent match={match} />
    </BrowserRouter>
  );
  const instance = wrapper.find('Auth').instance();
  instance.setState({
    formData: {
      email: '',
      password: ''
    }
  });
  wrapper
    .find('.email-input')
    .simulate('change', { target: { value: 'Test email' } });
  wrapper
    .find('.password-input')
    .simulate('change', { target: { value: 'Test password' } });

  expect(instance.state.formData.email).toEqual('Test email');
  expect(instance.state.formData.password).toEqual('Test password');
});

it('Setting user credentails and logout change Auth context state', () => {
  const wrapper = mount(
    <BrowserRouter>
      <AuthContextProvider.WrappedComponent />
    </BrowserRouter>
  );
  const instance = wrapper.find('AuthContextProvider').instance();
  instance.setState({
    userLogin: '',
    userId: '',
    userToken: '',
    userAuthenticated: false
  });
  instance.setUserCredentialsHandler('testLogin', 'testId', 'testToken');
  expect(instance.state).toEqual({
    userLogin: 'testLogin',
    userId: 'testId',
    userToken: 'testToken',
    userAuthenticated: true
  });
  instance.logoutHandler();
  expect(instance.state).toEqual({
    userLogin: '',
    userId: '',
    userToken: '',
    userAuthenticated: false
  });
});

it('Changes state if local storage auth credentials are not empty', () => {
  localStorage.floristAuthToken = 'asfasfasf';
  const wrapper = mount(
    <BrowserRouter>
      <AuthContextProvider.WrappedComponent />
    </BrowserRouter>
  );
  const instance = wrapper.find('AuthContextProvider').instance();
  expect(instance.state.userAuthenticated).toBeTruthy();
});

it('Google and Facebook authorization clicking envokes a handlers', async () => {
  const match = { params: { mode: 'signin' } };
  const wrapper = mount(
    <BrowserRouter>
      <AuthContextProvider.WrappedComponent>
        <Auth.WrappedComponent match={match} />
      </AuthContextProvider.WrappedComponent>
    </BrowserRouter>
  );
  const contextInstance = wrapper.find('AuthContextProvider').instance();
  const authInstance = wrapper.find('Auth').instance();
  const spyGoogle = jest.spyOn(authInstance, 'authWithGoogleHandler');
  const spyFacebook = jest.spyOn(authInstance, 'authWithFacebookHandler');
  authInstance.forceUpdate();
  contextInstance.setState({
    userLogin: '',
    userId: '',
    userToken: '',
    userAuthenticated: false
  });
  authInstance.setState({
    formData: {
      email: 'bob_awesome@mail.com',
      password: 'bob_awesome'
    },
    mode: 'signin'
  });
  wrapper.find('.google-auth').simulate('click');
  expect(spyGoogle).toHaveBeenCalled();
  wrapper.find('.facebook-auth').simulate('click');
  expect(spyFacebook).toHaveBeenCalled();
});