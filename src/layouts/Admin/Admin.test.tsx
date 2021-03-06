import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';

import Admin from './Admin';
import AppContextProvider from '../../AppContext';
import labels from '../../config/labels';
import { createMemoryHistory } from 'history';
import AddGalleryImage from './AddGalleryImage/AddGalleryImage';

describe('Admin works as expected', () => {
  it('Admin component matches a snapshot', () => {
    const wrapper = mount(
      <BrowserRouter>
        <AppContextProvider>
          <Admin />
        </AppContextProvider>
      </BrowserRouter>
    );
    const context = wrapper.find('AppContextProvider').instance();
    context.setState({
      userLogin: 'testLogin',
      userId: 'testId',
      userToken: 'testToken',
      userRole: 'admin',
      userAuthenticated: false,
      authenticationMethod: undefined,
      lang: 'en',
      labels: labels,
      fetchInProgress: false,
      mobileMode: true,
      showNavigation: false,
      togglePosition: 'absolute'
    });
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });
  it('add-product mode has impact on the displayed form', async () => {
    let match = { params: { mode: 'add-product' } };
    const historyMock = { replace: jest.fn() };
    const wrapper = mount(
      <BrowserRouter>
        <AppContextProvider>
          <Admin.WrappedComponent match={match} history={historyMock} />
        </AppContextProvider>
      </BrowserRouter>
    );
    const context = wrapper.find('AppContextProvider').instance();
    context.setState({
      userLogin: 'testLogin',
      userId: 'testId',
      userToken: 'testToken',
      userRole: 'admin',
      userAuthenticated: true,
      authenticationMethod: undefined,
      lang: 'en',
      labels,
      fetchInProgress: false,
      mobileMode: true,
      showNavigation: false,
      togglePosition: 'absolute'
    });
    wrapper.update();
    const instance = wrapper.find('Admin').instance();
    expect(wrapper.find('.AddProduct').exists()).toBeTruthy();
    expect(instance.state.mode).toEqual('add-product');
  });
  it('configurate-gallery mode has impact on the displayed form', () => {
    let match = { params: { mode: 'configurate-gallery' } };
    const historyMock = { replace: jest.fn() };
    const wrapper = mount(
      <BrowserRouter>
        <AppContextProvider>
          <Admin.WrappedComponent match={match} history={historyMock} />
        </AppContextProvider>
      </BrowserRouter>
    );
    const context = wrapper.find('AppContextProvider').instance();
    context.setState({
      userLogin: 'testLogin',
      userId: 'testId',
      userToken: 'testToken',
      userRole: 'admin',
      userAuthenticated: true,
      authenticationMethod: undefined,
      lang: 'en',
      labels,
      fetchInProgress: false,
      mobileMode: true,
      showNavigation: false,
      togglePosition: 'absolute'
    });
    wrapper.update();
    const instance = wrapper.find('Admin').instance();
    wrapper.find('.configurateGallery').simulate('click');
    expect(wrapper.find('.AddGalleryImage').exists()).toBeTruthy();
    expect(instance.state.mode).toEqual('configurate-gallery');
  });
  it('configurate-urls mode has impact on the displayed form', () => {
    let match = { params: { mode: 'configurate-urls' } };
    const historyMock = { replace: jest.fn() };
    const wrapper = mount(
      <BrowserRouter>
        <AppContextProvider>
          <Admin.WrappedComponent match={match} history={historyMock} />
        </AppContextProvider>
      </BrowserRouter>
    );
    const context = wrapper.find('AppContextProvider').instance();
    context.setState({
      userLogin: 'testLogin',
      userId: 'testId',
      userToken: 'testToken',
      userRole: 'admin',
      userAuthenticated: true,
      authenticationMethod: undefined,
      lang: 'en',
      labels,
      fetchInProgress: false,
      mobileMode: true,
      showNavigation: false,
      togglePosition: 'absolute'
    });
    wrapper.update();
    const instance = wrapper.find('Admin').instance();
    wrapper.find('.configurateURLs').simulate('click');
    expect(wrapper.find('.URLsForm').exists()).toBeTruthy();
    expect(instance.state.mode).toEqual('configurate-urls');
  });
  it('configurate-contacts mode has impact on the displayed form', () => {
    const match = { params: { mode: 'configurate-contacts' } };
    const historyMock = { replace: jest.fn() };
    const wrapper = mount(
      <BrowserRouter>
        <AppContextProvider>
          <Admin.WrappedComponent match={match} history={historyMock} />
        </AppContextProvider>
      </BrowserRouter>
    );
    const context = wrapper.find('AppContextProvider').instance();
    context.setState({
      userLogin: 'testLogin',
      userId: 'testId',
      userToken: 'testToken',
      userRole: 'admin',
      userAuthenticated: true,
      authenticationMethod: undefined,
      lang: 'en',
      labels,
      fetchInProgress: false,
      mobileMode: true,
      showNavigation: false,
      togglePosition: 'absolute'
    });
    wrapper.update();
    const instance = wrapper.find('Admin').instance();
    wrapper.find('.configurateContacts').simulate('click');
    expect(wrapper.find('.ContactsForm').exists()).toBeTruthy();
    expect(instance.state.mode).toEqual('configurate-contacts');
  });
  it('configurate-labels mode has impact on the displayed form', () => {
    const match = { params: { mode: 'configurate-labels' } };
    const historyMock = { replace: jest.fn() };
    const wrapper = mount(
      <BrowserRouter>
        <AppContextProvider>
          <Admin.WrappedComponent match={match} history={historyMock} />
        </AppContextProvider>
      </BrowserRouter>
    );
    const context = wrapper.find('AppContextProvider').instance();
    context.setState({
      userLogin: 'testLogin',
      userId: 'testId',
      userToken: 'testToken',
      userRole: 'admin',
      userAuthenticated: true,
      authenticationMethod: undefined,
      lang: 'en',
      labels,
      fetchInProgress: false,
      mobileMode: true,
      showNavigation: false,
      togglePosition: 'absolute'
    });
    wrapper.update();
    const instance = wrapper.find('Admin').instance();
    wrapper.find('.configurateLabels').simulate('click');
    expect(wrapper.find('.LabelsForm').exists()).toBeTruthy();
    expect(instance.state.mode).toEqual('configurate-labels');
  });
  it('unscpecified mode has impact on the displayed form', () => {
    const match = { params: { mode: 'unspecified-test' } };
    const historyMock = { replace: jest.fn() };
    const wrapper = mount(
      <BrowserRouter>
        <AppContextProvider>
          <Admin.WrappedComponent match={match} history={historyMock} />
        </AppContextProvider>
      </BrowserRouter>
    );
    const context = wrapper.find('AppContextProvider').instance();
    context.setState({
      userLogin: 'testLogin',
      userId: 'testId',
      userToken: 'testToken',
      userRole: 'admin',
      userAuthenticated: true,
      authenticationMethod: undefined,
      lang: 'en',
      labels,
      fetchInProgress: false,
      mobileMode: true,
      showNavigation: false,
      togglePosition: 'absolute'
    });
    wrapper.update();
    expect(wrapper.find('.form').exists()).toBeFalsy();
  });
});
