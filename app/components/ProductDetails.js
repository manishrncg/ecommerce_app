import React from 'react';
import { productDetailingApi } from '../../config/productDetailingApi';

class ProductDetails extends React.Component {
	constructor(){
		super();
		this.onAttributeChange = this.onAttributeChange.bind(this);
		this.plus = this.plus.bind(this);
		this.minus = this.minus.bind(this);
		this.showImage = this.showImage.bind(this);
		this.state = {
		  primary_Details: {},
		  attributes: [],
		  show_more: false,
		  attributesChecked: {},
		  selected_option_ids: [],
		  selectedProduct: '',
		  product_variations: [],
		  cartQuantity: 1,
		  currentImage: ''
		};
	}
	fetchProductDetail(prodID) {
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
      	console.log(data);
        this.setState({
          primary_Details: data.primary_product,
          attributes: data.attributes,
          options: data.options,
          selected_option_ids: data.selected_option_ids,
          product_variations: data.product_variations,
          selectedProduct: prodID,
          currentImage: data.primary_product.images[0]
        });
      })
      .catch(function(error) {
        console.log(`Error: ${error.message}`);
      });
  	}
	// fetch data from api
	// if doing SSR move it to from here
	componentWillMount(){
		this.fetchProductDetail(this.props.match.params.id);
	}

	revealText(e){
		this.setState({
			show_more: true
		});
	}

	showImage(e){
		let imageSRC = e.target.src;
		this.setState({
			currentImage: imageSRC
		});
	}

	plus(){
		let cartQuantity = this.state.cartQuantity;
		this.setState({
			cartQuantity: (cartQuantity+1)
		})
	}

	minus(){
		let cartQuantity = this.state.cartQuantity;
		this.setState({
			cartQuantity: cartQuantity <= 1 ? 1 : (cartQuantity-1)
		})
	}

  	onAttributeChange(e){
		let optId = e.target.value;
		let attrId = e.target.name;
		let modifiedAttributes = Object.assign({},this.state.attributesChecked);
		modifiedAttributes[attrId] = {};
		modifiedAttributes[attrId][optId] = 1;
		let selected_option_ids = Object.keys(modifiedAttributes)
			.map((attr)=> {
			return Object.keys(modifiedAttributes[attr])[0];
		});
		let selectedProduct = this.state.product_variations
			.filter((obj)=>{
				let match = selected_option_ids.map((id)=>{
					return obj.sign.indexOf(id);
				});
				return match.indexOf(-1) != -1 ? false : true;
			});

		this.fetchProductDetail(selectedProduct[0]._id);		
	}

	render() {  // Basic component for every product being displayed while listing
	  	const primary_Details = this.state.primary_Details;
	  	const show = this.state.show_more ? "" : "pDesc";
	  	const hideMore = !this.state.show_more ? "more_desc custom_blue" : "hide";
	  	const discount = primary_Details.mark_price-primary_Details.sale_price;
	  	const discountPercent = (primary_Details.mark_price-primary_Details.sale_price)/100;
		const optionsName = {};
		const selected_option_ids = this.state.selected_option_ids;
		const optMap = {};
		const selectedProduct = this.state.selectedProduct;

		this.state.options && this.state.options
			.map((obj)=>{
				let attrId = obj.attrib_id;
				optMap[attrId] ? optMap[attrId].push(obj._id) : (optMap[attrId]=[obj._id]);
			});

	  	const attrs = this.state.attributes && 
		  	this.state.attributes
		  	.map((attr, index)=>{

		  		this.state.attributesChecked[attr._id] = {};
		  		selected_option_ids
		  			.map((index)=>{
				  		if(optMap[attr._id].indexOf(index) != -1){
					  		this.state.attributesChecked[attr._id][index] =  1;
				  		}
		  			});
		  		optionsName[attr._id] = [<h6 key={attr._id}>{attr.name}</h6>];
		  		let opts = this.state.options
				  	.map((opt)=>{
				  		let attrState =  selected_option_ids.indexOf(opt._id) != -1 ? 1 : 0;
				  		if(attr._id == opt.attrib_id){

				  			// this.state.attributesChecked[opt._id] = 0;
				  			optionsName[attr._id].push(
				  				<span className="optionsInput" key={opt._id}>
				  					<input type="radio" name={attr._id} 
	                                   value={opt._id}
	                                   checked={attrState ? "checked" : ""} 
	                                   onChange={(e)=>this.onAttributeChange(e)} />{opt.name} 
	                           </span>
	                       	);

				  		}
				  	});
		  		return optionsName;
		  	});

		  	let optionsVar = Object.keys(optionsName).map((e)=>optionsName[e]);

	  	if(primary_Details.name){
		  	let Images = primary_Details && primary_Details.images
					.map((src, index)=>{
						if(index==0){
			  				return <img 
			  						key={index}
			  						src={this.state.currentImage} 
			  						alt={primary_Details.name} 
			  						className="productImageDetail" 
			  						/>
						}
						else if(index < 5){ //slider can be added for images to be displayed
			  				return <img 
			  						key={index}
			  						src={primary_Details.images[index]} 
			  						alt={primary_Details.name} 
			  						className="thumbs" 
			  						onClick={(e)=>this.showImage(e)}
			  						/>
						}
					});

		    return (<div className="col-md-8 col-sm-8 col-xs-8  offset-md-2 offset-sm-2 offset-x2-4" >
				<div className="row">
					<div className="col-md-6 col-sm-6 col-xs-6" >
			  			{Images}
			  			{/* <img src={primary_Details.images[0]} alt={primary_Details.name} className="" /> */}
					</div>
					<div className="col-md-6 col-sm-6 col-xs-6" >
				      <h4>{primary_Details.name}</h4>
				      <p className={show}>{primary_Details.desc}</p>
				      <p className={hideMore} onClick={e => this.revealText(e)}>+MORE</p>
				      <hr/>
				      <span>&#8377; {primary_Details.sale_price.toFixed(2)} 
				      	<span className="mark_price">&#8377; {primary_Details.mark_price.toFixed(2)}</span>
				      </span>
				      <p className="sale_price custom_blue bottomMargin">You save &#8377; {discount.toFixed(2)} ({discountPercent.toFixed(2)}%)</p>
				      <p className="mark_price sale_price">Local taxes included (where aplicable)</p>
				      <hr/>
				      {optionsVar}
				      	<h6>Quantity</h6>
				     	<div className="col-md-3 border4Box">
							<span className="cursorPointer plusminus" onClick={this.minus}>&#x2796;</span>
							<span className="qty"> {this.state.cartQuantity} </span>
							<span className="cursorPointer plusminus" onClick={this.plus}>&#x2795;</span>
						</div>
						<div className="col-md-12 cartButtonDiv">
							<button name="addToCart" className="cartButton cursorPointer" onClick={ () => this.props.addToCart(selectedProduct, this.state.cartQuantity)}> Add to cart</button>
						</div>
					</div>
				</div>
		    </div>);
	  	}
	  	else{
	  		return <div></div>;
	  	}
  	}
}

export default ProductDetails;