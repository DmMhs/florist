import React, { Component, RefObject } from 'react';

import Slide from './Slide/Slide';
import './Slider.less';
import LeftArrow from './LeftArrow/LeftArrow';
import RightArrow from './RightArrow/RightArrow';

interface SliderState {
  images: Array<string>;
  currentIndex: number;
  translateValue: number;
  timerInterval: number;
}

interface SliderProps {
  images: string[];
}

let interval: number;
let resizeListener: EventListener;

class Slider extends Component<SliderProps, SliderState> {
  private sliderRef: RefObject<HTMLDivElement>;
  constructor(props: SliderProps) {
    super(props);
    this.state = {
      images: [],
      currentIndex: 0,
      translateValue: 0,
      timerInterval: 6000
    };
    this.sliderRef = React.createRef();
  }

  componentDidMount() {
    this.setState({
      images: this.props.images
    });
    interval = window.setInterval(this.goToNextSlide, this.state.timerInterval);
    resizeListener = () => {
      this.setState({
        currentIndex: 0,
        translateValue: 0
      });
    };
    window.addEventListener('resize', resizeListener);
  }

  componentWillUnmount() {
    window.clearInterval(interval);
    window.removeEventListener('resize', resizeListener);
  }

  goToPrevSlide = () => {
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

  goToNextSlide = () => {
    if (this.state.currentIndex === this.state.images.length - 1) {
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

  slideWidth = () => {
    this.sliderRef.current!.clientWidth;
    return this.sliderRef.current ? this.sliderRef.current!.clientWidth : 0;
  };

  render() {
    const slides = this.state.images.map((i: string, index: number) => {
      return <Slide key={index} imgSrc={i} />;
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
        <LeftArrow goToPrevSlide={this.goToPrevSlide} show={true} />
        <RightArrow goToNextSlide={this.goToNextSlide} show={true} />
      </div>
    );
  }
}

export default Slider;
