import React from 'react';
import Header from './Header';
import { productDetailingApi } from '../../config/productDetailingApi';

class ProductDetails extends React.Component {
	constructor(){
		super();
		this.primary_Details = {};
		this.attributes = [];
		this.options = [];
		this.product_variations = [];

		this.onAttributeChange = this.onAttributeChange.bind(this);
		this.incrementQuantity = this.incrementQuantity.bind(this);
		this.decrementQuantity = this.decrementQuantity.bind(this);
		this.showImage = this.showImage.bind(this);
		this.state = {
		  show_more: false,
		  attributesChecked: {},
		  selected_option_ids: [],
		  selectedProduct: '',
		  selectedQuantity: 1,
		  currentImage: '',
		  totalCartQuantity: 0
		};
	}

	// fetch data from api
	// if doing SSR move it to from here
	componentWillMount(){
		this.fetchProductDetail(this.props.match.params.id);
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
			this.primary_Details = data.primary_product;
			this.attributes = data.attributes;
			this.options = data.options;
			this.product_variations = data.product_variations;

			this.setState({
				selected_option_ids: data.selected_option_ids,
				selectedProduct: prodID,
				currentImage: data.primary_product.images[0]
			});
		})
		.catch(function(error) {
			console.log(`Error: ${error.message}`);
	    });
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

	incrementQuantity(){
		let selectedQuantity = this.state.selectedQuantity;
		this.setState({
			selectedQuantity: (selectedQuantity+1)
		})
	}

	decrementQuantity(){
		let selectedQuantity = this.state.selectedQuantity;
		this.setState({
			selectedQuantity: selectedQuantity <= 1 ? 1 : (selectedQuantity-1)
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
		let selectedProduct = this.product_variations
			.filter((obj)=>{
				let match = selected_option_ids.map((id)=>{
					return obj.sign.indexOf(id);
				});
				return match.indexOf(-1) != -1 ? false : true;
			});

		this.fetchProductDetail(selectedProduct[0]._id);		
	}

	renderAttributes(options, attributes, attributesChecked, selected_option_ids){
		const optionsName = {},
			  optMap = {};

		options && options instanceof Array && options
			.map((obj)=>{
				let attrId = obj.attrib_id;
				optMap[attrId] ? optMap[attrId].push(obj._id) : (optMap[attrId]=[obj._id]);
			});

		attributes && attributes instanceof Array && attributes
			.map((attr, index)=>{
				attributesChecked[attr._id] = {};
				selected_option_ids
					.map((index)=>{
						if(optMap[attr._id].indexOf(index) != -1){
							attributesChecked[attr._id][index] =  1;
						}
					});
				optionsName[attr._id] = [<h6 key={attr._id}>{attr.name}</h6>];
				let opts = options
					.map((opt)=>{
						let attrState =  selected_option_ids.indexOf(opt._id) != -1 ? 1 : 0;
						if(attr._id == opt.attrib_id){

							// attributesChecked[opt._id] = 0;
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

		return optionsVar;
	}

	renderProductImages(productName, imagesData){
	  	return(
	  		<React.Fragment>
		  		{imagesData && imagesData instanceof Array && imagesData
					.map((src, index)=>{
						if(index==0){
							return <img 
									key={index}
									src={this.state.currentImage} 
									alt={productName} 
									className="productImageDetail" 
									/>
						}
						else if(index < 5){
							//slider can be added for images to be displayed
							return <img 
									key={index}
									src={imagesData[index]} 
									alt={productName} 
									className="thumbs" 
			  						onClick={(e)=>this.showImage(e)}
			  						/>
						}
					})
				}
			</React.Fragment>
		)
	}

	getSum(total, num) {
	    return total + num;
	}

	addAndUpdateBag(selectedProduct, selectedQuantity){
		this.props.addToBag(selectedProduct, selectedQuantity);

		const getBagData = this.props.getBagData();
		const countItemsBag = Object.keys(getBagData)
								.map((id, index)=>{
									return getBagData[id];
								});
								
		this.setState({
			totalCartQuantity: countItemsBag.length && countItemsBag.reduce(this.getSum)
		})
	}

	render() {  // Basic component for every product being displayed while listing
		const {
			selected_option_ids,
			selectedProduct,
			attributesChecked,
			show_more
		} = this.state;

		const {
			primary_Details,
			options,
			attributes
		} = this;
	  	const show = show_more ? "" : "pDesc";
	  	const hideMore = !show_more ? "more_desc custom_blue" : "hide";
	  	const discount = parseFloat(primary_Details.mark_price) - parseFloat(primary_Details.sale_price);
	  	const discountPercent = discount/100;

		let optionsVar = this.renderAttributes(options, attributes, attributesChecked, selected_option_ids);

	  	if(primary_Details.name){
	  		const productImages = this.renderProductImages(primary_Details.name, primary_Details.images);

		    return (
				<React.Fragment>
					<Header totalCartQuantity={this.state.totalCartQuantity} getBagData={this.props.getBagData} />
					<div className="col-md-8 col-sm-8 col-xs-8  offset-md-2 offset-sm-2 offset-xs-2 productMarginTop" >
						<div className="row">
							<div className="col-md-6 col-sm-6 col-xs-6" >
					  			{productImages}
					  			{/* <img src={primary_Details.images[0]} alt={primary_Details.name} className="" /> */}
							</div>
							<div className="col-md-6 col-sm-6 col-xs-6" >
								<h4>{primary_Details.name}</h4>
								<p className={show}>{primary_Details.desc}</p>
								<p className={hideMore} onClick={e => this.revealText(e)}>+MORE</p>
								<hr/>
								<div>&#8377; {primary_Details.sale_price.toFixed(2)} 
									<span className="mark_price">
										&#8377; {primary_Details.mark_price.toFixed(2)}
									</span>
								</div>
								<p className="sale_price custom_blue bottomMargin">
									You save &#8377; {discount.toFixed(2)} ({discountPercent.toFixed(2)}%)
								</p>
								<p className="mark_price sale_price">
									Local taxes included (where aplicable)
								</p>
								<hr/>
								{optionsVar}
								<h6>Quantity</h6>
								<div className="col-md-2 col-sm-12 col-xs-12 border4Box">
									<span className="cursorPointer plusminus" onClick={this.decrementQuantity}>
										&#x2796;
									</span>
									<span className="qty">
										{this.state.selectedQuantity} 
									</span>
									<span className="cursorPointer plusminus" onClick={this.incrementQuantity}>
										&#x2795;
									</span>
								</div>
								<div className="col-md-10 col-sm-12 col-xs-12"></div>
								<div className="col-md-12 col-sm-12 col-xs-12 cartButtonDiv">
									<button 
										className="cartButton cursorPointer"
										onClick={ () => this.addAndUpdateBag(selectedProduct, this.state.selectedQuantity)}
									>
										Add to cart
									</button>
								</div>
							</div>
						</div>
					</div>
				</React.Fragment>);
	  	}
	  	else{
	  		return <div></div>;
	  	}
  	}
}

export default ProductDetails;