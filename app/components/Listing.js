import React from 'react';
import ReactDOM from 'react-dom';
import Item from './Item';
import Header from './Header';
import { productListingApi } from '../../config/productListingApi';

class Listing extends React.Component {
  constructor(){
    super();
    this.loadItems = this.loadItems.bind(this);
    this.state = {
      products: [],
      page_number: 1
    };
  }

  // fetch data from api
  // if doing SSR move it to from here
  componentWillMount(){
    this.loadItems(false);
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

  render() {
    let indexOfFilter = 0;
    const products = this.state.products;
    const  productsHtml = products instanceof Array && products.length && products
      .filter((details, index) => { // check for same product with different specs/variants
          if(details.name.split("(")[0] == (products[index+1] && products[index+1].name.split("(")[0])){
            return false;
          }
          else{
            indexOfFilter++;
            return true;
          }
        }
      )
      .map( (details, index) => {
        return <React.Fragment key={details._id}>
              { index==0 || !(index%2) ? <div className="col-md-3 col-sm-3 col-xs-3"></div> : ''}
              <Item 
                key={details._id}
                id={details._id}
                name={details.name} 
                image={details.images[0]} 
                price={details.sale_price}>
              </Item>
              {!( (index+1)%2) ? <div className="col-md-3 col-sm-3 col-xs-3"></div> : ''}
          </React.Fragment>
      });
    
    return (<React.Fragment> 
              <Header getBagData={this.props.getBagData} bagQuantity={this.props.bagQuantity} />
              
              <div className="row">
                
                {productsHtml}
              </div>
              <div className="row">
                <div className="col-md-3 col-sm-3 col-xs-3 offset-md-5 offset-sm-5 offset-xs-5 ">
                  <button onClick={(e)=>this.loadItems(e)}>Load more</button>
                </div> 
              </div>
            </React.Fragment>)
  }
}

export default Listing;