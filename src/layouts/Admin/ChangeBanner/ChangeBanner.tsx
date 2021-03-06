import React, { Component } from 'react';

import { AppContext } from '../../../AppContext';
import { storageRef, homeImagesRef, database } from '../../../firebase';
import './ChangeBanner.less';
import { uploadBannerImage } from '../../../services/admin/uploadBannerImage';
import { getBannerImageDownloadURL } from '../../../services/admin/getBannerImageDownloadURL';
import { setDesktopBannerParams } from '../../../services/admin/setDesktopBannerParams';

interface ChangeBannerProps {}

interface ChangeBannerState {
  images: FileList[];
  totalImagesNumber: number;
  desktopBannerWrapperWidth: string;
  desktopBannerWrapperHeight: string;
  bannerWidthUnits: string;
  bannerHeightUnits: string;
}

class ChangeBanner extends Component<ChangeBannerProps, ChangeBannerState> {
  constructor(props: ChangeBannerProps) {
    super(props);
    this.state = {
      images: [],
      totalImagesNumber: 0,
      desktopBannerWrapperHeight: '',
      desktopBannerWrapperWidth: '',
      bannerWidthUnits: '%',
      bannerHeightUnits: 'px'
    };
  }

  public componentDidMount() {
    homeImagesRef.on('value', snapshot => {
      this.setState({
        totalImagesNumber: Object.keys(snapshot!.val()).length
      });
    });
  }

  private imgInputChangedHandler = (
    position: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedImages: FileList[] = [...this.state.images];
    updatedImages[position] = event.target.files as FileList;
    this.setState({
      images: updatedImages
    });
  };

  private bannerImageAddedHandler = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const { images } = this.state;
    const {} = this.state;
    this.setState({
      images: []
    });
    images.map(async (image: FileList) => {
      const file = image[0];
      const formattedFileName = image[0].name;
      await uploadBannerImage(file, formattedFileName);
      getBannerImageDownloadURL(formattedFileName)
        .then(res => {
          return res;
        })
        .then(imgURL => {
          homeImagesRef.push(imgURL);
        });
    });
  };

  private bannerChangedHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      desktopBannerWrapperHeight,
      desktopBannerWrapperWidth,
      bannerWidthUnits,
      bannerHeightUnits
    } = this.state;
    const {} = this.state;
    const width =
      desktopBannerWrapperWidth === ''
        ? '0px'
        : desktopBannerWrapperWidth + bannerWidthUnits;
    const height =
      desktopBannerWrapperHeight === ''
        ? '0px'
        : desktopBannerWrapperHeight + bannerHeightUnits;
    setDesktopBannerParams(width, height);
  };

  private widthInputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({
      desktopBannerWrapperWidth: event.target.value
    });
  };

  private widthSelectChangedHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    this.setState({
      bannerWidthUnits: event.target.value
    });
  };

  private heightInputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({
      desktopBannerWrapperHeight: event.target.value
    });
  };

  private heightSelectChangedHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    this.setState({
      bannerHeightUnits: event.target.value
    });
  };

  public render() {
    const context = this.context;
    const labels = context.state.labels;
    const lang = context.state.lang;

    const labelsRoot = labels[lang].pages.admin.changeBannerForm;
    const submitBtnLabel = labels[lang].pages.admin.submitBtn;

    return (
      <AppContext.Consumer>
        {value =>
          value && (
            <div>
              <form
                onSubmit={this.bannerImageAddedHandler}
                className="AddGalleryImage form"
              >
                <div className="form-control product-images">
                  <p className="gallery-info">
                    {labelsRoot.info.totalImagesNumber}{' '}
                    {this.state.totalImagesNumber}
                  </p>
                  <hr />
                  <label className="accent">{labelsRoot.add}</label>
                  <br />
                  <div className="input-wrapper">
                    <input
                      type="file"
                      onChange={this.imgInputChangedHandler.bind(this, 0)}
                    />
                  </div>
                </div>
                <button type="submit">{submitBtnLabel}</button>
              </form>

              <form
                className="ChangeDesktopBanner form"
                onSubmit={this.bannerChangedHandler}
              >
                <div className="form-control">
                  <label className="accent">
                    {labelsRoot.change.desktopWrapperWidth}
                  </label>
                  <br />
                  <div className="wrapper">
                    <input
                      type="number"
                      onChange={this.widthInputChangedHandler}
                      className="widthInput"
                    />
                    <select
                      onChange={this.widthSelectChangedHandler}
                      defaultValue={this.state.bannerWidthUnits}
                      className="widthSelect"
                    >
                      <option value="px">px</option>
                      <option value="%">%</option>
                      <option value="rem">rem</option>
                      <option value="em">em</option>
                      <option value="vw">vw</option>
                    </select>
                  </div>
                </div>
                <div className="form-control">
                  <label className="accent">
                    {labelsRoot.change.desktopWrapperHeight}
                  </label>
                  <br />
                  <div className="wrapper">
                    <input
                      type="number"
                      onChange={this.heightInputChangedHandler}
                      className="heightInput"
                    />
                    <select
                      onChange={this.heightSelectChangedHandler}
                      defaultValue={this.state.bannerHeightUnits}
                      className="heightSelect"
                    >
                      <option value="px">px</option>
                      <option value="%">%</option>
                      <option value="rem">rem</option>
                      <option value="em">em</option>
                      <option value="vw">vh</option>
                    </select>
                  </div>
                </div>
                <button type="submit">{submitBtnLabel}</button>
              </form>
            </div>
          )
        }
      </AppContext.Consumer>
    );
  }
}

ChangeBanner.contextType = AppContext;

export default ChangeBanner;
