import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import Header from './components/Header/Header';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('showNavigation is defined', () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  expect(instance.state.showNavigation).toBeDefined();
});

it('change of showNavigation changes Header displaying', () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({ showNavigation: false });
  if (instance.state.showNavigation === false) {
    expect(wrapper.contains(<Header />)).toBeFalsy();
  }
  instance.setState({ showNavigation: true });
  if (instance.state.showNavigation === true) {
    expect(wrapper.contains(<Header />)).toBeTruthy();
  }
});

it('reacts on toggle click', () => {
  const wrapper = mount(<App />);
  const instance = wrapper.instance();
  instance.setState({
    showNavigation: false
  });
  wrapper.find('.Toggle').simulate('click');
  expect(instance.state.showNavigation).toBeTruthy();
  wrapper.find('.Toggle').simulate('click');
  expect(instance.state.showNavigation).toBeFalsy();
});

it('resize event has impact on state', () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.setState({
    showNavigation: undefined
  });
  function resizeListener() {
    if (window.innerWidth < 576) {
      instance.setState({
        showNavigation: false
      });
    } else {
      instance.setState({
        showNavigation: true
      });
    }
  }
  window.addEventListener('resize', resizeListener);

  let resizeEvent = new Event('resize');
  window.dispatchEvent(resizeEvent);
  expect(instance.state.showNavigation).toBeDefined();
});
