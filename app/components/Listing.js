import React from 'react';
import ReactDOM from 'react-dom';
import Item from './Item';
import ProductDetails from './ProductDetails';
import { Link } from 'react-router-dom';

class Listing extends React.Component {
  constructor(){
    super();
    this.state = {
      products: []
    };
  }

  fetchProductList() {
    fetch("https://assignment-appstreet.herokuapp.com/api/v1/products?page="+this.props.page_number)
      .then(response => {
        if (response.ok) {
          return Promise.resolve(response);
        }
        else {
          return Promise.reject(new Error('Failed to load')); 
        }
      })
      .then(response => response.json()) // parse response as JSON
      .then(data => {
        this.setState({
          products: data.products
        });
      })
      .catch(function(error) {
        console.log(`Error: ${error.message}`);
      });
  }
  // fetch data from api
  // if doing SSR move it to from here
  componentWillMount(){
    this.fetchProductList();
  }

  render() {
    let products = this.state.products;
    const productsHtml = products.length!=0 && products.filter((details, index) => 
      { // check for same product with different specs
        if(details.name.split("(")[0] == (products[index+1] && products[index+1].name.split("(")[0])){
          return false;
        }
        else{
          return true;
        }
      }
    ).map( (details) => {
      return <Link to={`/id/${details._id}`} key={details._id} >
          <Item 
            key={details._id} 
            name={details.name} 
            image={details.images[0]} 
            price={details.sale_price}>
          </Item>
        </Link>
    });

    // const productsHtml = <ProductDetails></ProductDetails>;
    
    return (<React.Fragment> {productsHtml} </React.Fragment>)
  }
}

export default Listing;