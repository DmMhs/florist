import React, { Component, Children } from 'react';

import './AddProduct.less';
import { AppContext } from '../../../AppContext';
import { storageRef, productsRef } from '../../../firebase';
import { Product } from '../../../models/Product';
import { withRouter, RouteComponentProps } from 'react-router';
import { CartItem } from '../../../models/CartItem';
import { deleteProductImages } from '../../../services/deleteProductImages';

interface AddProductProps {
  editModeEnabled?: boolean;
}
interface AddProductState {
  available: boolean;
  title: string;
  title_uk: string;
  images: File[];
  price: number;
  currency: string;
  description: string;
  description_uk: string;
  productId?: string;
  imagesFolderName?: string;
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
      title_uk: '',
      images: [],
      price: 0,
      currency: 'usd',
      description: '',
      description_uk: ''
    };
    this.editAvailableRef = React.createRef();
  }

  public componentDidMount() {
    if (this.props.editModeEnabled === true) {
      productsRef
        .child(this.state.productId as string)
        .on('value', snapshot => {
          const {
            available,
            title,
            title_uk,
            price,
            currency,
            description,
            description_uk
          } = snapshot!.val();
          this.setState({
            available,
            title,
            title_uk,
            price,
            currency,
            description,
            description_uk,
            imagesFolderName: title.toLowerCase()
          });
        });
    }
  }

  private descriptionChangedHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    this.setState({
      description: event.target.value
    });
  };

  private descriptionUkChangedHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    this.setState({
      description_uk: event.target.value
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
    const updatedImages: File[] = [...this.state.images];
    updatedImages[position] = event.target.files as any;
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

  private titleUkInputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({
      title_uk: event.target.value
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
      title_uk,
      price,
      currency,
      description,
      description_uk
    } = this.state;

    const formattedFolderName = title.toLowerCase();
    const imagesRef = storageRef
      .child('products-images')
      .child(formattedFolderName);
    const imageURLs: string[] = [];
    let productKey: string = '';

    const newProduct = {
      title,
      title_uk,
      price,
      available,
      description,
      description_uk,
      currency,
      images
    };

    if (this.props.editModeEnabled === true) {
      productKey = this.state.productId as string;
      await deleteProductImages(
        this.state.productId as string,
        this.state.imagesFolderName as string
      );
      await productsRef
        .child(this.state.productId as string)
        .child('images')
        .remove()
        .catch(err => console.log(err));

      await productsRef
        .child(this.state.productId as string)
        .set({ ...newProduct })
        .catch(err => console.log(err));

      await Promise.all(
        images.map(async (image: File) => {
          const file = (image as any)[0];
          const formattedFileName = (image as any)[0].name.split('.')[0];
          await storageRef
            .child('products-images')
            .child(newProduct.title.toLowerCase())
            .child(formattedFileName)
            .put(file)
            .catch(err => {
              console.log(err);
            });

          const imageURL = await storageRef
            .child('products-images')
            .child(newProduct.title.toLowerCase())
            .child(formattedFileName)
            .getDownloadURL()
            .catch(err => console.log(err));
          imageURLs.push(imageURL);
        })
      );

      productsRef
        .child(productKey)
        .update({
          images: imageURLs
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      await productsRef
        .push(newProduct)
        .then(response => {
          productKey = response.key as string;
        })
        .catch(err => {
          console.log(err);
        });

      await Promise.all(
        images.map(async (image: File) => {
          const file = (image as any)[0];
          const formattedFileName = (image as any)[0].name.split('.')[0];
          await imagesRef
            .child(formattedFileName)
            .put(file)
            .catch(err => {
              console.log(err);
            });
          const imageURL = await imagesRef
            .child(formattedFileName)
            .getDownloadURL();
          imageURLs.push(imageURL);
        })
      );

      productsRef
        .child(productKey)
        .update({
          images: imageURLs
        })
        .catch(err => {
          console.log(err);
        });
    }
    this.setState({
      available: true,
      title: '',
      title_uk: '',
      images: [],
      price: 0,
      currency: 'usd',
      description: '',
      description_uk: ''
    });
  };

  public render() {
    const context = this.context;
    const labels = context.state.labels;
    const lang = context.state.lang;

    const labelsRoot = labels[lang].pages.admin.addProductForm;
    const submitBtnLabel = labels[lang].pages.admin.submitBtn;

    const editModeEnabled = this.props.editModeEnabled;
    let editProductForm: JSX.Element;

    console.log(this.state.images);

    if (editModeEnabled === true) {
      const editAvailable = this.state.available;
      const editTitleUA = this.state.title_uk;
      const editTitleEN = this.state.title;
      const editPrice = this.state.price;
      const editDescriptionEN = this.state.description;
      const editDescriptionUA = this.state.description_uk;
      const editCurrency = this.state.currency;
      const editImages = this.state.images;

      editProductForm = (
        <form onSubmit={this.formSubmitHandler} className="AddProduct form">
          <div className="form-control">
            <label>{labelsRoot.available.title}</label>
            <br />
            <select
              onChange={this.availableChangedHandler}
              ref={this.editAvailableRef}
            >
              <option value="true">{labelsRoot.available.option1}</option>
              <option value="false">{labelsRoot.available.option2}</option>
            </select>
          </div>
          <div className="form-control">
            <label>{labelsRoot.title}</label>
            <br />
            <input
              type="text"
              onChange={this.titleInputChangedHandler}
              required
              value={this.state.title as string}
              placeholder={editTitleEN}
            />
            <label>{labelsRoot.title_ua}</label>
            <br />
            <input
              type="text"
              onChange={this.titleUkInputChangedHandler}
              required
              value={this.state.title_uk as string}
              placeholder={editTitleUA}
            />
          </div>
          <div className="form-control product-images">
            <label>{labelsRoot.images}</label>
            <br />
            <div className="input-wrapper">
              <input
                type="file"
                onChange={this.imgInputChangedHandler.bind(this, 0)}
                required
              />
            </div>
            <div className="input-wrapper">
              <input
                type="file"
                onChange={this.imgInputChangedHandler.bind(this, 1)}
                required
              />
            </div>
            <div className="input-wrapper">
              <input
                type="file"
                onChange={this.imgInputChangedHandler.bind(this, 2)}
                required
              />
            </div>
          </div>
          <div className="form-control">
            <label>{labelsRoot.price}</label>
            <br />
            <div className="price">
              <input
                type="number"
                required
                onChange={this.priceInputChangedHandler}
                value={this.state.price as number}
                placeholder={editPrice.toString()}
              />
              <select
                onChange={this.currencyChangedHandler}
                value={editCurrency}
              >
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="uah">UAH</option>
              </select>
            </div>
          </div>
          <div className="form-control">
            <label>{labelsRoot.description}</label>
            <br />
            <textarea
              required
              placeholder={editDescriptionEN}
              onChange={this.descriptionChangedHandler}
              value={this.state.description as string}
            />
            <label>{labelsRoot.description_ua}</label>
            <br />
            <textarea
              required
              placeholder={editDescriptionUA}
              onChange={this.descriptionUkChangedHandler}
              value={this.state.description_uk as string}
            />
          </div>
          <button type="submit">{submitBtnLabel}</button>
        </form>
      );
    }

    const addProductForm = (
      <form onSubmit={this.formSubmitHandler} className="AddProduct form">
        <div className="form-control">
          <label>{labelsRoot.available.title}</label>
          <br />
          <select onChange={this.availableChangedHandler}>
            <option value="true">{labelsRoot.available.option1}</option>
            <option value="false">{labelsRoot.available.option2}</option>
          </select>
        </div>
        <div className="form-control">
          <label>{labelsRoot.title}</label>
          <br />
          <input
            type="text"
            onChange={this.titleInputChangedHandler}
            required
            value={this.state.title as string}
          />
          <label>{labelsRoot.title_ua}</label>
          <br />
          <input
            type="text"
            onChange={this.titleUkInputChangedHandler}
            required
            value={this.state.title_uk as string}
          />
        </div>
        <div className="form-control product-images">
          <label>{labelsRoot.images}</label>
          <br />
          <div className="input-wrapper">
            <input
              type="file"
              onChange={this.imgInputChangedHandler.bind(this, 0)}
              required
            />
          </div>
          <div className="input-wrapper">
            <input
              type="file"
              onChange={this.imgInputChangedHandler.bind(this, 1)}
              required
            />
          </div>
          <div className="input-wrapper">
            <input
              type="file"
              onChange={this.imgInputChangedHandler.bind(this, 2)}
              required
            />
          </div>
        </div>
        <div className="form-control">
          <label>{labelsRoot.price}</label>
          <br />
          <div className="price">
            <input
              type="number"
              required
              onChange={this.priceInputChangedHandler}
              value={this.state.price as number}
            />
            <select onChange={this.currencyChangedHandler}>
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="uah">UAH</option>
            </select>
          </div>
        </div>
        <div className="form-control">
          <label>{labelsRoot.description}</label>
          <br />
          <textarea
            required
            placeholder="Add product description"
            onChange={this.descriptionChangedHandler}
            value={this.state.description as string}
          />
          <label>{labelsRoot.description_ua}</label>
          <br />
          <textarea
            required
            placeholder="Add product description"
            onChange={this.descriptionUkChangedHandler}
            value={this.state.description_uk as string}
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