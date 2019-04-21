import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import Spinner from '../../Spinner/Spinner';
import { Product } from '../../../models/Product';
import { productsRef } from '../../../firebase';
import './ProductDetails.less';
import { AuthContext } from '../../Auth/AuthContext';
import {BASE_URL} from '../../../config/main';

interface MatchParams {
  id: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

interface RouteComponentProps<P> {
  match: match<P>;
}

interface match<P> {
  params: P;
  isExact: boolean;
  path: string;
  url: string;
}
interface ProductDetailsState {
  productData: Product;
  fetchInProgress: boolean;
}

class ProductDetails extends Component<
  RouteComponentProps<MatchParams>,
  ProductDetailsState
> {
  constructor(props: RouteComponentProps<MatchParams>) {
    super(props);
    this.state = {
      productData: {
        title: '',
        images: [],
        price: 0,
        currency: '',
        available: false,
        description: ''
      },
      fetchInProgress: false
    };
  }
  componentDidMount() {
    this.setState({
      fetchInProgress: true
    });
    productsRef
      .child(this.props.match.params.id)
      .once('value')
      .then(snapshot => {
        this.setState({
          productData: snapshot.val(),
          fetchInProgress: false
        });
      })
      .catch(error => console.log(error));
  }
  shareOverrideOGMeta = (
    overrideLink: string,
    overrideTitle: string,
    overrideDescription: string,
    overrideImage: string
  ) => {
    console.log(overrideLink, overrideTitle, overrideDescription, overrideImage);
    const params: fb.ShareOpenGraphDialogParams = {
      method: 'share_open_graph',
      action_type: 'og.likes',
      action_properties: JSON.stringify({
        object: {
          'og:url': overrideLink,
          'og:title': overrideTitle.toUpperCase(),
          'og:description': overrideDescription,
          'og:image': overrideImage
        }
      }) as any,
      href: overrideLink
    };

    FB.ui(params, (response: any) => {
      console.log(response);
    });
  };
  render() {
    const imgStyle = {
      backgroundImage: `url(${this.state.productData.images[0]})`
    };
    return (
      <AuthContext.Consumer>
        {value =>
          value && (
            <div className="ProductDetails">
              {this.state.fetchInProgress === false ? (
                <div>
                  <h1>{this.state.productData.title.toUpperCase()}</h1>
                  <div className="product-info-wrapper">
                    <div className="image-wrapper">
                      <div className="image" style={imgStyle} />
                      <h3 className="price">
                        {this.state.productData.available === false ? (
                          <span>
                            not in stock <i className="far fa-frown" />
                          </span>
                        ) : (
                          <div>
                            only{' '}
                            <span className="accent">
                              {this.state.productData.price}$
                            </span>
                          </div>
                        )}
                      </h3>
                      {value.state.authenticationMethod === 'facebook' ? (
                        <div
                          className="button"
                          onClick={() => this.shareOverrideOGMeta(
                            BASE_URL + `/product-details/${this.props.match.params.id}`,
                            this.state.productData.title,
                            this.state.productData.description as string,
                            this.state.productData.images[0]
                          )}
                        >
                          <span> SHARE</span>
                        </div>
                      ) : null}

                      <button className="shopping-btn" type="button">
                        <NavLink to="/shop">
                          GO SHOPPING <i className="fas fa-shopping-cart" />
                        </NavLink>
                      </button>
                    </div>

                    <div className="info">
                      <h2>Description</h2>
                      <hr />
                      <p>{this.state.productData.description}</p>
                      <img
                        src={this.state.productData.images[1]}
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <Spinner />
              )}
            </div>
          )
        }
      </AuthContext.Consumer>
    );
  }
}

export default ProductDetails;
