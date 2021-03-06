import React, { Component, RefObject } from 'react';

import {Spinner} from '../../../components';
import './GoogleMap.less';

interface GoogleMapProps {
  url: string;
}
interface GoogleMapState {
  mobileMode: boolean;
  mapIsFetching: boolean;
}

let resizeListener: EventListener;

class GoogleMap extends Component<GoogleMapProps, GoogleMapState> {
  private mapRef: RefObject<HTMLIFrameElement>;
  constructor(props: GoogleMapProps) {
    super(props);
    this.state = {
      mobileMode: false,
      mapIsFetching: true
    };
    this.mapRef = React.createRef();
  }
  public componentDidMount() {
    if (window.innerWidth < 768) {
      this.setState({
        mobileMode: true
      });
    } else {
      this.setState({
        mobileMode: false
      });
    }
    resizeListener = () => {
      if (window.innerWidth < 768) {
        this.setState({
          mobileMode: true
        });
      } else {
        this.setState({
          mobileMode: false
        });
      }
    };
    window.addEventListener('resize', resizeListener);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', resizeListener);
  }

  private mapFetchedHandler = () => {
    this.setState({
      mapIsFetching: false
    });
  };

  public render() {
    const { url } = this.props;
    const googleMap =
      this.state.mobileMode === true ? (
        <div
          className="mapouter Map"
          style={{
            position: 'relative',
            textAlign: 'right',
            height: '400px',
            width: `${window.innerWidth - 50}px`
          }}
        >
          <div
            className="gmap_canvas"
            style={{
              overflow: 'hidden',
              background: 'none!important',
              height: '400px',
              width: `${window.innerWidth - 50}px`
            }}
          >
            <iframe
              width={`${window.innerWidth - 50}px`}
              height="400"
              id="gmap_canvas"
              src={url}
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              onLoad={this.mapFetchedHandler}
            />
          </div>
        </div>
      ) : (
        <div
          className="mapouter Map"
          style={{
            position: 'relative',
            textAlign: 'right',
            height: '450px',
            width: `${window.innerWidth - 300}px`
          }}
        >
          <div
            className="gmap_canvas"
            style={{
              overflow: 'hidden',
              background: 'none!important',
              height: '450px',
              width: `${window.innerWidth - 300}px`
            }}
          >
            <iframe
              width={`${window.innerWidth - 300}px`}
              height="450"
              id="gmap_canvas"
              src={url}
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              onLoad={this.mapFetchedHandler}
              ref={this.mapRef}
            />
          </div>
        </div>
      );

    return (
      <div>
        {this.state.mapIsFetching === true ? <Spinner /> : null}
        {googleMap}
      </div>
    );
  }
}

export default GoogleMap;
