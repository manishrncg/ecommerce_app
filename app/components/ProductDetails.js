import React from 'react';
import { productDetailingApi } from '../../config/productDetailingApi';

class ProductDetails extends React.Component {
	constructor(){
		super();
		this.onAttributeChange = this.onAttributeChange.bind(this);
		this.state = {
		  primary_Details: {},
		  attributes: [],
		  show_more: false,
		  attributesChecked: {}
		};
	}
	fetchProductList() {
		fetch(productDetailingApi+this.props.match.params.id)
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
          primary_Details: data.primary_product,
          attributes: data.attributes,
          options: data.options
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

  revealText(e){
  	this.setState({
  		show_more: true
  	});
  }

  onAttributeChange(e){
  	let attrId = e.target.value;
  	let modifiedAttributes = Object.assign({},this.state.attributesChecked);
  	modifiedAttributes[attrId] = 1;
  	this.setState({
  		attributesChecked: modifiedAttributes
  	})
  }

  render() {  // Basic component for every product being displayed while listing
  	const primary_Details = this.state.primary_Details;
  	const show = this.state.show_more ? "" : "pDesc";
  	const hideMore = !this.state.show_more ? "more_desc custom_blue" : "hide";
  	const discount = primary_Details.mark_price-primary_Details.sale_price;
  	const discountPercent = (primary_Details.mark_price-primary_Details.sale_price)/100;
	let optionsName = {};

  	const attrs = this.state.attributes && 
	  	this.state.attributes
	  	.map((attr)=>{
	  		//this.state.attributesChecked[attr._id] = 1;
	  		optionsName[attr._id] = [<h3 key={attr._id}>{attr.name}</h3>];
	  		let opts = this.state.options
			  	.map((opt)=>{
			  		let attrState = this.state.attributesChecked[opt._id];
			  		if(attr._id == opt.attrib_id){
			  			optionsName[attr._id].push(<React.Fragment key={opt._id}>
			  				<input type="radio" name={attr._id} 
                                   value={opt._id}
                                   checked={attrState ? "checked" : ""} 
                                   onChange={(e)=>this.onAttributeChange(e)} />{opt.name} 
                               </React.Fragment>);
			  		}
			  		// else{
			  		// 	optionsName[attr._id] = [<p>{opt.name}</p>];
			  		// }
			  	});
	  		return optionsName;
	  	});

	  	let optionsVar = Object.keys(optionsName).map((e)=>optionsName[e]);

  	if(primary_Details.name){
	    return (<div className="col-md-8 col-sm-8 col-xs-8  offset-md-2 offset-sm-2 offset-x2-4" >
			<div className="row">
				<div className="col-md-6 col-sm-6 col-xs-6" >
		  			<img src={primary_Details.images[0]} alt={primary_Details.name} className="" />
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