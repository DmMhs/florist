import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';

import AppContextProvider from '../../../AppContext';
import ProductCard from './ProductCard';

describe('ProductCard works as expected', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(
      <MemoryRouter>
        <ProductCard
          title="some"
          images={['test', 'product']}
          price={10.5}
          currency="usd"
          available={false}
          key={0}
          id={'asfasf'}
          inCart={false}
        />
      </MemoryRouter>
    );
    expect(wrapper.find(ProductCard)).toMatchSnapshot();
  });

  it('Property "available" has impact on price displaying', () => {
    let wrapper = mount(
      <BrowserRouter>
        <AppContextProvider>
          <ProductCard
            title="some"
            images={['test', 'product']}
            price={10.5}
            currency="usd"
            available={false}
            key={0}
            id={'asfasf'}
            inCart={false}
            addToCart={() => {}}
          />
        </AppContextProvider>
      </BrowserRouter>
    );
    expect(wrapper.find('.price').text()).toEqual('not available :(');
    wrapper = mount(
      <BrowserRouter>
        <ProductCard
          title="some"
          images={['test', 'product']}
          price={10.5}
          currency="usd"
          available={true}
          key={0}
          id={'asfasf'}
          inCart={false}
          addToCart={() => {}}
        />
      </BrowserRouter>
    );
    expect(wrapper.find('.price').text()).toEqual('10.5usd');
  });

  it('likeClickedHandler changes state of component', () => {
    const wrapper = mount(
      <BrowserRouter>
        <AppContextProvider>
          <ProductCard
            title="some"
            images={['test', 'product']}
            price={10.5}
            currency="usd"
            available={true}
            key={0}
            inCart={false}
            addToCart={() => {}}
          />
        </AppContextProvider>
      </BrowserRouter>
    );

    const context = wrapper.find('AppContextProvider').instance();
    context.setState({
      userLogin: 'safasf',
      userId: 'rqwrqw',
      userToken: 'safas',
      userAuthenticated: true,
      authenticationMethod: undefined,
      lang: 'en'
    });
    const instance = wrapper.find('ProductCard').instance();
    instance.setState({
      isLikedBy: [],
      isLiked: true
    });
    instance.likeClickedHandler();
    expect(
      instance.likeButtonRef!.current.classList.contains('active')
    ).toBeTruthy();
  });
});