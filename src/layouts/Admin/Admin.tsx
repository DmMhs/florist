import React, { Component } from 'react';

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
import ChangeBanner from './ChangeBanner/ChangeBanner';

import './Admin.less';

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
    | 'configurate-contacts'
    | 'configurate-banner';
  form: JSX.Element | null;
}

class Admin extends Component<
  RouteComponentProps<MatchParams> & RCProps<{}>,
  AdminState
> {
  public static getDerivedStateFromProps(
    props: RouteComponentProps<MatchParams> & RCProps<{}>,
    state: AdminState
  ) {
    const currentMode = props.match.params.mode;
    let form: JSX.Element | null;
    switch (currentMode) {
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
      case 'configurate-banner':
        form = <ChangeBanner />;
        break;
      default:
        form = null;
    }
    return {
      mode: currentMode,
      form
    };
  }

  constructor(props: RouteComponentProps<MatchParams> & RCProps<{}>) {
    super(props);
    this.state = {
      mode: 'add-product',
      form: <AddProduct />
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
      | 'configurate-banner'
  ) => {
    (this.props as RouteComponentProps<MatchParams> &
      RCProps<{}>).history.replace(`${mode}`);
  };

  public render() {
    const context = this.context;
    const lang = context.state.lang;
    const labels = context.state.labels;
    const labelsRoot = labels[lang].pages.admin;

    return (
      <AppContext.Consumer>
        {value =>
          value && value.state.userRole === 'admin' ? (
            <div className="Admin">
              <h1>{labelsRoot.title}</h1>
              <hr />
              <ul className="admin-actions">
                <li
                  className={this.state.mode === 'add-product' ? 'active' : ''}
                >
                  <a
                    onClick={this.switchModeTo.bind(this, 'add-product')}
                    className="addProduct"
                  >
                    {labelsRoot.navigation.addProduct}
                  </a>
                </li>
                <li
                  className={
                    this.state.mode === 'configurate-gallery' ? 'active' : ''
                  }
                >
                  <a
                    onClick={this.switchModeTo.bind(
                      this,
                      'configurate-gallery'
                    )}
                    className="configurateGallery"
                  >
                    {labelsRoot.navigation.galleryImages}
                  </a>
                </li>
                <li
                  className={
                    this.state.mode === 'configurate-labels' ? 'active' : ''
                  }
                >
                  <a
                    onClick={this.switchModeTo.bind(this, 'configurate-labels')}
                    className="configurateLabels"
                  >
                    {labelsRoot.navigation.labels}
                  </a>
                </li>
                <li
                  className={
                    this.state.mode === 'configurate-urls' ? 'active' : ''
                  }
                >
                  <a
                    onClick={this.switchModeTo.bind(this, 'configurate-urls')}
                    className="configurateURLs"
                  >
                    {labelsRoot.navigation.urls}
                  </a>
                </li>
                <li
                  className={
                    this.state.mode === 'configurate-contacts' ? 'active' : ''
                  }
                >
                  <a
                    onClick={this.switchModeTo.bind(
                      this,
                      'configurate-contacts'
                    )}
                    className="configurateContacts"
                  >
                    {labelsRoot.navigation.contacts}
                  </a>
                </li>
                <li
                  className={
                    this.state.mode === 'configurate-banner' ? 'active' : ''
                  }
                >
                  <a
                    onClick={this.switchModeTo.bind(this, 'configurate-banner')}
                    className="configurateBanner"
                  >
                    {labelsRoot.navigation.banner}
                  </a>
                </li>
              </ul>
              <div className="form-wrapper">{this.state.form}</div>
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
