import React, { Component } from 'react';
import firebase from 'firebase';

import './Admin.less';
import { AppContext } from '../../AppContext';
import {
  RouteComponentProps as RCProps,
  withRouter,
  Redirect
} from 'react-router';
import AddProduct from './AddProduct/AddProduct';
import AddGalleryImage from './AddGalleryImage/AddGalleryImage';
import ChangeLabels from './ChangeLabels/ChangeLabels';
import ChangeContacts from './ChangeContacts/ChangeContacts';
import ChangeURLs from './ChangeURLs/ChangeURLs';
interface MatchParams {
  mode: string;
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

interface AdminState {
  mode:
    | 'add-product'
    | 'edit-product'
    | 'configurate-gallery'
    | 'configurate-labels'
    | 'configurate-urls'
    | 'configurate-contacts';
}

class Admin extends Component<
  RouteComponentProps<MatchParams> & RCProps<{}>,
  AdminState
> {
  public static getDerivedStateFromProps(
    props: RouteComponentProps<MatchParams> & RCProps<{}>,
    state: AdminState
  ) {
    return {
      mode: props.match.params.mode
    };
  }

  constructor(props: RouteComponentProps<MatchParams> & RCProps<{}>) {
    super(props);
    this.state = {
      mode: 'add-product'
    };
  }

  private switchModeTo = (
    mode:
      | 'add-product'
      | 'edit-product'
      | 'configurate-gallery'
      | 'configurate-labels'
      | 'configurate-urls'
      | 'configurate-contacts'
  ) => {
    (this.props as RouteComponentProps<MatchParams> &
      RCProps<{}>).history.replace(`${mode}`);
  };

  public render() {
    const { mode } = this.state;
    const context = this.context;
    const lang = context.state.lang;
    const labels = context.state.labels;
    const labelsRoot = labels[lang].pages.admin;

    let form: JSX.Element;
    switch (mode) {
      case 'add-product':
        form = <AddProduct />;
        break;
      case 'edit-product':
        form = <AddProduct editModeEnabled={true} />;
        break;
      case 'configurate-gallery':
        form = <AddGalleryImage />;
        break;
      case 'configurate-labels':
        form = <ChangeLabels />;
        break;
      case 'configurate-urls':
        form = <ChangeURLs />;
        break;
      case 'configurate-contacts':
        form = <ChangeContacts />;
        break;
      default:
        form = <h3>Hm...</h3>;
    }
    return (
      <AppContext.Consumer>
        {value =>
          value && value.state.userRole === 'admin' ? (
            <div className="Admin">
              <h1>{labelsRoot.title}</h1>
              <hr />
              <ul className="admin-actions">
                <li>
                  <a onClick={this.switchModeTo.bind(this, 'add-product')}>
                    {labelsRoot.navigation.addProduct}
                  </a>
                </li>
                <li>
                  <a
                    onClick={this.switchModeTo.bind(
                      this,
                      'configurate-gallery'
                    )}
                  >
                    {labelsRoot.navigation.galleryImages}
                  </a>
                </li>
                <li>
                  <a
                    onClick={this.switchModeTo.bind(this, 'configurate-labels')}
                  >
                    {labelsRoot.navigation.labels}
                  </a>
                </li>
                <li>
                  <a onClick={this.switchModeTo.bind(this, 'configurate-urls')}>
                    {labelsRoot.navigation.urls}
                  </a>
                </li>
                <li>
                  <a
                    onClick={this.switchModeTo.bind(
                      this,
                      'configurate-contacts'
                    )}
                  >
                    {labelsRoot.navigation.contacts}
                  </a>
                </li>
              </ul>
              <div className="form-wrapper">{form}</div>
            </div>
          ) : (
            <Redirect to="/" />
          )
        }
      </AppContext.Consumer>
    );
  }
}

Admin.contextType = AppContext;

export default withRouter<RouteComponentProps<MatchParams> & RCProps<{}>>(
  Admin
);