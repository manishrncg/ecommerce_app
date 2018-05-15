import React from 'react';
import ReactDOM from 'react-dom';
import Listing from './components/Listing';
import ProductDetails from './components/ProductDetails';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NotFound from './components/NotFound';

class App extends React.Component {
	constructor(){
		super();
		this.addToCart = this.addToCart.bind(this);
		this.getCartData = this.getCartData.bind(this);
		this.state = {
			cart: {}
		};
	}

	getCartData(id){
		if(id){
			return this.state.cart[id];
		}
		else{
			return cart;
		}
	}

	addToCart(id, quantity){
		const cart = Object.assign( {}, this.state.cart );
		cart[id] = ( cart[id] ? cart[id] + quantity : quantity );
		alert('Product added to cart!');
		this.setState({
			cart: cart
		});
	}

	render(){
		return (
		  <BrowserRouter>
			   <Switch>
			    <Route exact path='/' component={()=> <Listing page_number="1" />}/>
			    <Route path='/id/:id' render={(props)=> <ProductDetails {...props} addToCart={this.addToCart} />} />
			  </Switch>
		  </BrowserRouter>);
	}
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('tabs')
);