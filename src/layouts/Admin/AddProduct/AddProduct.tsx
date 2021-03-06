import React, { Component } from 'react';

import './AddProduct.less';
import { AppContext } from '../../../AppContext';
import { storageRef, productsRef } from '../../../firebase';
import { withRouter, RouteComponentProps } from 'react-router';
import { deleteProductImages } from '../../../services/admin/deleteProductImages';
import { deleteProductImagesFromDB } from '../../../services/admin/deleteProductImagesFromDB';
import { setProductData } from '../../../services/admin/setProductData';
import { updateProductImagesURLs } from '../../../services/admin/updateProductImagesURLs';
import { uploadProductImagesAndReturnURLs } from '../../../services/admin/uploadProductImagesAndReturnURLs';

interface AddProductProps {
  editModeEnabled?: boolean;
}
interface AddProductState {
  available: boolean;
  title: string;
  title_ua: string;
  images: FileList[];
  price: number;
  currency: string;
  description: string;
  description_ua: string;
  productId?: string;
  imagesFolderName?: string;
  editProductForm?: JSX.Element | null;
  addProductForm?: JSX.Element | null;
}

class AddProduct extends Component<
  RouteComponentProps<{}> & AddProductProps,
  AddProductState
> {
  public static getDerivedStateFromProps(
    props: RouteComponentProps<{}> & AddProductProps,
    state: AddProductState
  ) {
    const url = props.location.search;
    const params = new URLSearchParams(url);
    const extractedId = params.get('id');
    if (extractedId !== null && extractedId !== undefined) {
      return {
        productId: extractedId
      };
    } else {
      return {};
    }
  }
  private editAvailableRef: React.RefObject<HTMLSelectElement>;

  constructor(props: RouteComponentProps<{}> & AddProductProps) {
    super(props);
    this.state = {
      available: true,
      title: '',
      title_ua: '',
      images: [],
      price: 0,
      currency: 'usd',
      description: '',
      description_ua: '',
      editProductForm: null,
      addProductForm: null
    };
    this.editAvailableRef = React.createRef();
  }
  public componentDidMount = async () => {
    if (this.props.editModeEnabled === true) {
      productsRef
        .child(this.state.productId as string)
        .on('value', snapshot => {
          const {
            available,
            title,
            title_ua,
            price,
            currency,
            description,
            description_ua
          } = snapshot!.val();
          this.setState({
            available,
            title,
            title_ua,
            price,
            currency,
            description,
            description_ua,
            imagesFolderName: title.toLowerCase()
          });
        });
    }
  };

  private descriptionChangedHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    this.setState({
      description: event.target.value
    });
  };

  private descriptionUAChangedHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    this.setState({
      description_ua: event.target.value
    });
  };

  private currencyChangedHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    this.setState({
      currency: event.target.value
    });
  };

  private priceInputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({
      price: +event.target.value
    });
  };

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

  private titleInputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({
      title: event.target.value
    });
  };

  private titleUAInputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({
      title_ua: event.target.value
    });
  };

  private availableChangedHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    this.setState({
      available: event.target.value === 'true'
    });
  };

  private formSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const {
      available,
      images,
      title,
      title_ua,
      price,
      currency,
      description,
      description_ua
    } = this.state;

    const formattedFolderName = title.toLowerCase();
    const imagesRef = storageRef
      .child('products-images')
      .child(formattedFolderName);
    const imageURLs: string[] = [];
    let productKey: string = '';

    const newProduct = {
      title,
      title_ua,
      price,
      available,
      description,
      description_ua,
      currency,
      images
    };

    if (this.props.editModeEnabled === true) {
      productKey = this.state.productId as string;
      await deleteProductImages(
        this.state.productId as string,
        this.state.imagesFolderName as string
      );
      await deleteProductImagesFromDB(this.state.productId as string);

      await setProductData(this.state.productId as string, newProduct);

      const arr = await uploadProductImagesAndReturnURLs(images, newProduct);
      arr.forEach(imageURL => {
        imageURLs.push(imageURL);
      });

      await updateProductImagesURLs(productKey, imageURLs);
    } else {
      await productsRef
        .push(newProduct)
        .then(response => {
          productKey = response.key as string;
        })
        .catch(err => {
          console.log(err);
        });
      const arr = await uploadProductImagesAndReturnURLs(images, newProduct);
      arr.forEach(imageURL => {
        imageURLs.push(imageURL);
      });
      await updateProductImagesURLs(productKey, imageURLs);
    }
    this.setState({
      available: true,
      title: '',
      title_ua: '',
      images: [],
      price: 0,
      currency: 'usd',
      description: '',
      description_ua: ''
    });
  };

  public render() {
    const context = this.context;
    const labels = context.state.labels;
    const lang = context.state.lang;

    const labelsRoot = labels[lang].pages.admin.addProductForm;
    const submitBtnLabel = labels[lang].pages.admin.submitBtn;

    const editModeEnabled = this.props.editModeEnabled;
    let editProductForm: JSX.Element | null;
    let addProductForm: JSX.Element | null;

    if (editModeEnabled === true) {
      editProductForm = (
        <form onSubmit={this.formSubmitHandler} className="EditProduct form">
          <div className="form-control">
            <label className="accent">{labelsRoot.available.title}</label>
            <br />
            <select
              onChange={this.availableChangedHandler}
              ref={this.editAvailableRef}
              value={this.state.available.toString()}
              className="availableSelect"
            >
              <option value="true">{labelsRoot.available.option1}</option>
              <option value="false">{labelsRoot.available.option2}</option>
            </select>
          </div>
          <div className="form-control">
            <label className="accent">{labelsRoot.title}</label>
            <br />
            <input
              type="text"
              onChange={this.titleInputChangedHandler}
              required
              value={this.state.title as string}
              placeholder={this.state.title}
              className="titleInput"
            />
            <label className="accent">{labelsRoot.title_ua}</label>
            <br />
            <input
              type="text"
              onChange={this.titleUAInputChangedHandler}
              required
              value={this.state.title_ua as string}
              placeholder={this.state.title_ua}
              className="titleUAInput"
            />
          </div>
          <div className="form-control product-images">
            <label className="accent">{labelsRoot.images}</label>
            <br />
            <div className="input-wrapper">
              <input
                type="file"
                onChange={this.imgInputChangedHandler.bind(this, 0)}
                required
                className="fileInput"
              />
            </div>
            <div className="input-wrapper">
              <input
                type="file"
                onChange={this.imgInputChangedHandler.bind(this, 1)}
                required
                className="fileInput"
              />
            </div>
            <div className="input-wrapper">
              <input
                type="file"
                onChange={this.imgInputChangedHandler.bind(this, 2)}
                required
                className="fileInput"
              />
            </div>
          </div>
          <div className="form-control">
            <label className="accent">{labelsRoot.price}</label>
            <br />
            <div className="price">
              <input
                type="number"
                required
                onChange={this.priceInputChangedHandler}
                value={this.state.price as number}
                placeholder={this.state.price.toString()}
                className="priceInput"
              />
              <select
                onChange={this.currencyChangedHandler}
                value={this.state.currency}
                className="currencySelect"
              >
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="uah">UAH</option>
              </select>
            </div>
          </div>
          <div className="form-control">
            <label className="accent">{labelsRoot.description}</label>
            <br />
            <textarea
              required
              placeholder={this.state.description}
              onChange={this.descriptionChangedHandler}
              value={this.state.description as string}
              className="descriptionText"
            />
            <label className="accent">{labelsRoot.description_ua}</label>
            <br />
            <textarea
              required
              placeholder={this.state.description_ua}
              onChange={this.descriptionUAChangedHandler}
              value={this.state.description_ua as string}
              className="descriptionUAText"
            />
          </div>
          <button type="submit">{submitBtnLabel}</button>
        </form>
      );
    }

    addProductForm = (
      <form onSubmit={this.formSubmitHandler} className="AddProduct form">
        <div className="form-control">
          <label className="accent">{labelsRoot.available.title}</label>
          <br />
          <select
            onChange={this.availableChangedHandler}
            className="availableSelect"
          >
            <option value="true">{labelsRoot.available.option1}</option>
            <option value="false">{labelsRoot.available.option2}</option>
          </select>
        </div>
        <div className="form-control">
          <label className="accent">{labelsRoot.title}</label>
          <br />
          <input
            type="text"
            onChange={this.titleInputChangedHandler}
            required
            value={this.state.title as string}
            className="titleInput"
          />
          <label className="accent">{labelsRoot.title_ua}</label>
          <br />
          <input
            type="text"
            onChange={this.titleUAInputChangedHandler}
            required
            value={this.state.title_ua as string}
            className="titleUAInput"
          />
        </div>
        <div className="form-control product-images">
          <label className="accent">{labelsRoot.images}</label>
          <br />
          <div className="input-wrapper">
            <input
              type="file"
              onChange={this.imgInputChangedHandler.bind(this, 0)}
              required
              className="fileInput"
            />
          </div>
          <div className="input-wrapper">
            <input
              type="file"
              onChange={this.imgInputChangedHandler.bind(this, 1)}
              required
              className="fileInput"
            />
          </div>
          <div className="input-wrapper">
            <input
              type="file"
              onChange={this.imgInputChangedHandler.bind(this, 2)}
              required
              className="fileInput"
            />
          </div>
        </div>
        <div className="form-control">
          <label className="accent">{labelsRoot.price}</label>
          <br />
          <div className="price">
            <input
              type="number"
              required
              onChange={this.priceInputChangedHandler}
              value={this.state.price as number}
              className="priceInput"
            />
            <select
              onChange={this.currencyChangedHandler}
              className="currencySelect"
            >
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="uah">UAH</option>
            </select>
          </div>
        </div>
        <div className="form-control">
          <label className="accent">{labelsRoot.description}</label>
          <br />
          <textarea
            required
            placeholder="Add product description"
            onChange={this.descriptionChangedHandler}
            value={this.state.description as string}
            className="descriptionText"
          />
          <label className="accent">{labelsRoot.description_ua}</label>
          <br />
          <textarea
            required
            placeholder="Add product description"
            onChange={this.descriptionUAChangedHandler}
            value={this.state.description_ua as string}
            className="descriptionUAText"
          />
        </div>
        <button type="submit">{submitBtnLabel}</button>
      </form>
    );

    return (
      <AppContext.Consumer>
        {value =>
          value && (editModeEnabled === true ? editProductForm : addProductForm)
        }
      </AppContext.Consumer>
    );
  }
}

AddProduct.contextType = AppContext;
export default withRouter<AddProductProps & RouteComponentProps<{}>>(
  AddProduct
);
