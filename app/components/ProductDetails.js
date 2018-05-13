import React from 'react';

class ProductDetails extends React.Component {
	constructor(){
		super();
		this.state = {
		  primary_Details: {},
		  show_more: false
		};
	}
	fetchProductList() {
		fetch("https://assignment-appstreet.herokuapp.com/api/v1/products/5aec58965a39460004b3f6dd")
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
          primary_Details: data.primary_product
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

  render() {  // Basic component for every product being displayed while listing
  	const primary_Details = this.state.primary_Details;
  	const show = this.state.show_more ? "" : "pDesc";
  	const hideMore = !this.state.show_more ? "more_desc custom_blue" : "hide";
  	const discount = primary_Details.mark_price-primary_Details.sale_price;
  	const discountPercent = (primary_Details.mark_price-primary_Details.sale_price)/100;

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
			      <span>&#8377; {primary_Details.sale_price} 
			      	<span className="mark_price">&#8377; {primary_Details.mark_price}</span>
			      </span>
			      <p className="sale_price custom_blue bottomMargin">You save &#8377; {discount} ({discountPercent}%)</p>
			      <p className="mark_price sale_price">Local taxes included (where aplicable)</p>
			      <hr/>
			      
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