import React from 'react';
import Listing from './components/Listing';
import CartPage from './components/CartPage';
import ProductDetails from './components/ProductDetails';
import NotFound from './components/NotFound';
import './App.css';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

class App extends React.Component {
  constructor(){
    super();
    this.addToBag = this.addToBag.bind(this);
    this.getBagData = this.getBagData.bind(this);
    this.cart = {};
  }

  getBagData(id){
    if(id){
      return this.cart[id];
    }
    else{
      return this.cart;
    }
  }

  addToBag(id, quantity){
    const cart = Object.assign( {}, this.cart );
    cart[id] = ( cart[id] ? cart[id] + quantity : quantity );
    alert('Product added to cart!');
    this.cart = cart;
  }

  render(){
    return (
      <BrowserRouter>
        <Switch>
          <Route 
            exact path='/' 
            component={ ()=> <Listing 
                      page_number="1" 
                      getBagData={this.getBagData} 
                    />
                  }
          />
                  
          <Route 
            path='/id/:id' 
            component={ (props)=> <ProductDetails 
                        {...props} 
                        addToBag={this.addToBag} 
                        getBagData={this.getBagData} 
                      />
                }
          />
          <Route 
            path='/bag' 
            render={ (props)=> <CartPage 
                        {...props} 
                        getBagData={this.getBagData} 
                      />
                }
          />
          <Route path='/404' component={NotFound} />
        <Redirect from='*' to='/404' />
        </Switch>
      </BrowserRouter>);
  }
}

export default App;
