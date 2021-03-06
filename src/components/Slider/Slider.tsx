import React, { Component, RefObject } from 'react';

import Slide from './Slide/Slide';
import LeftArrow from './LeftArrow/LeftArrow';
import RightArrow from './RightArrow/RightArrow';
import './Slider.less';

interface SliderState {
  currentIndex: number;
  translateValue: number;
  timerInterval: number;
}

interface SliderProps {
  images: string[];
  auto: boolean;
  showControls: boolean;
  bannerModeEnabled?: boolean;
}

let interval: number;
let resizeListener: EventListener;

class Slider extends Component<SliderProps, SliderState> {
  private _isMounted = false;
  private sliderRef: RefObject<HTMLDivElement>;
  constructor(props: SliderProps) {
    super(props);
    this.state = {
      currentIndex: 0,
      translateValue: 0,
      timerInterval: 6000
    };
    this.sliderRef = React.createRef();
  }

  public componentDidMount() {
    this._isMounted = true;
    if (this.props.auto) {
      interval = window.setInterval(
        this.goToNextSlide,
        this.state.timerInterval
      );
    }

    resizeListener = () => {
      if (this._isMounted) {
        this.setState({
          currentIndex: 0,
          translateValue: 0
        });
      }
    };
    window.addEventListener('resize', resizeListener);
  }

  public componentWillUnmount() {
    this._isMounted = false;
    if (this.props.auto) {
      window.clearInterval(interval);
    }

    window.removeEventListener('resize', resizeListener);
  }

  private goToPrevSlide = () => {
    if (this.state.currentIndex === 0) {
      return this.setState({
        currentIndex: 0,
        translateValue: 0
      });
    }
    this.setState({
      currentIndex: this.state.currentIndex - 1,
      translateValue: this.state.translateValue + this.slideWidth()
    });
  };

  private goToNextSlide = () => {
    if (this.state.currentIndex === this.props.images.length - 1) {
      return this.setState({
        currentIndex: 0,
        translateValue: 0
      });
    }

    this.setState({
      currentIndex: this.state.currentIndex + 1,
      translateValue: this.state.translateValue + -this.slideWidth()
    });
  };

  private slideWidth = () => {
    return this.sliderRef.current ? this.sliderRef.current!.clientWidth : 0;
  };

  public render() {
    const { images } = this.props;
    const slides = images.map((i: string, index: number) => {
      return (
        <Slide
          key={index}
          imgSrc={i}
          forBanner={this.props.bannerModeEnabled === true ? true : false}
        />
      );
    });

    return (
      <div className="Slider" ref={this.sliderRef}>
        <div
          className="slides-wrapper"
          style={{
            transform: `translateX(${this.state.translateValue}px)`,
            transition: 'transform ease-out 1s'
          }}
        >
          {slides}
        </div>
        <LeftArrow
          goToPrevSlide={this.goToPrevSlide}
          show={this.props.showControls}
        />
        <RightArrow
          goToNextSlide={this.goToNextSlide}
          show={this.props.showControls}
        />
      </div>
    );
  }
}

export default Slider;
