import React from 'react';
import Header from './Header';
import { productDetailingApi } from '../../config/productDetailingApi';

class CartPage extends React.Component{
	constructor(props){
		super(props);
		this.getBag = this.props.getBagData();
		this.state = {
		  primary_Details: {},
		  currentImage: '',
		  product_variations: []
		};
	}

	componentWillMount(){
		Object.keys(this.getBag)
				.map((id, index)=>{
					return this.state.id ? '' : this.fetchProductDetail(id);
				});

  	}

	fetchProductDetail(prodID) {
		let addPrimaryDetails = {}; 
      	addPrimaryDetails[prodID] = {};
      	let product_variations = [];

		fetch(productDetailingApi+prodID)
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
      	addPrimaryDetails = Object.assign({}, this.state.primary_Details);
      	product_variations = [...data.product_variations, ...this.state.product_variations];
      	addPrimaryDetails[prodID] = data.primary_product;
        this.setState({
          primary_Details: addPrimaryDetails,
          product_variations: product_variations
        });
      })
      .catch(function(error) {
        console.log(`Error: ${error.message}`);
      });
  	}

  	renderBagDetails(addPrimaryDetails){
		const product_variations = {};
		const prodV = this.state.product_variations;
		const bagData = this.props.getBagData();

		for(let i=0; i<prodV.length; i++){
			product_variations[prodV[i]._id] = prodV[i];
		}						
				
  		return (
  			<React.Fragment>
  				{addPrimaryDetails && Object.keys(addPrimaryDetails)
  					.map((id, index)=>{
						return (<React.Fragment key={index}>
								{ index==0 || !(index%2) ? <div className="col-md-3 col-sm-3 col-xs-3"></div> : ''}
								<div className="col-md-3 col-sm-3 col-xs-3 bagMarginBottom">
									<h6>{product_variations[id].name}</h6>
									<img 
									src={product_variations[id].images[0]}
									className="productImageBag" 
									/>
									<p>Quantity: {bagData[id]}</p> 
									<p>Price: &#8377; {product_variations[id].sale_price.toFixed(2)}</p>
								</div>
								{!( (index+1)%2) ? <div className="col-md-3 col-sm-3 col-xs-3"></div> : ''}
							</React.Fragment>);
  						}
					)}
				</React.Fragment>
			);
  	}

	render(){
		const addPrimaryDetails = this.state.primary_Details;
		const renderBagDetails = Object.keys(this.getBag).length == 0
									? <h3 className="alignCenter">Your Bag is empty!</h3>
									: this.renderBagDetails(addPrimaryDetails);
		return (<React.Fragment>
					<Header getBagData={this.props.getBagData} />
					<h1 className="text-center productMarginTop">Your Bag</h1>
					<div className="row" >
							{renderBagDetails}
						
					</div>
				</React.Fragment>
			)
	}
}

export default CartPage;