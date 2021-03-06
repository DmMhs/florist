import React from 'react';
import { shallow, mount } from 'enzyme';

import ShoppingCartContent from './ShoppingCartContent';
import { BrowserRouter } from 'react-router-dom';
import AppContextProvider from '../../../AppContext';
import labels from '../../../config/labels';

describe('ShoppingCartContent works as expected', () => {
  it('matches a snapshot', () => {
    const TestJSX = <span key={1}>just a test</span>;
    const wrapper = mount(
      <BrowserRouter>
        <AppContextProvider>
          <ShoppingCartContent
            totalPrice={100}
            cartItemsList={[TestJSX]}
            fixEmptyCart={() => {}}
          />
        </AppContextProvider>
      </BrowserRouter>
    );
    const context = wrapper.find('AppContextProvider').instance();
    context.setState({
      lang: 'en',
      labels: labels,
      fetchInProgress: false
    });
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });
});
