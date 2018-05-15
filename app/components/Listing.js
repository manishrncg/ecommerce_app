import React from 'react';
import ReactDOM from 'react-dom';
import Item from './Item';
import { productListingApi } from '../../config/productListingApi';
import { Link } from 'react-router-dom';

class Listing extends React.Component {
  constructor(){
    super();
    this.loadItems = this.loadItems.bind(this);
    this.state = {
      products: [],
      page_number: 1
    };
  }

  loadItems(next){
    let page_number;
    if(next){
      page_number = Number(this.state.page_number)+1;      
    }
    else{
      page_number = this.state.page_number;
    }

    fetch(productListingApi+"page="+page_number)
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
        const prevData = this.state.products;
        this.setState({
          products: [...prevData, ...data.products],
          page_number: page_number
        });
      })
      .catch(function(error) {
        console.log(`Error: ${error.message}`);
      });
  }

  // fetch data from api
  // if doing SSR move it to from here
  componentWillMount(){
    this.loadItems(false);
  }

  render() {
    let products = this.state.products;
    const productsHtml = products.length && products.filter((details, index) => 
      { // check for same product with different specs/variants
        if(details.name.split("(")[0] == (products[index+1] && products[index+1].name.split("(")[0])){
          return false;
        }
        else{
          return true;
        }
      }
    ).map( (details) => {
      return <React.Fragment key={details._id}>
        <Link to={`/id/${details._id}`} key={details._id} >
            <Item 
              key={details._id} 
              name={details.name} 
              image={details.images[0]} 
              price={details.sale_price}>
            </Item>
          </Link>
          
        </React.Fragment>
    });
    
    return (<React.Fragment> {productsHtml}<button onClick={(e)=>this.loadItems(e)}>Load more</button> </React.Fragment>)
  }
}

export default Listing;