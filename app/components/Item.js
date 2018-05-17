import React from 'react';
import { Link } from 'react-router-dom';

class Item extends React.Component {
  render() {  // Basic component for every product being displayed while listing
    const {name, image, price, id} = this.props;
  
    return (<div className="col-md-3 col-sm-3 col-xs-3 inline productBox" >
		    	<Link to={`/id/${id}`} >
		          <img src={image} alt={name} className="productListImage" />
		          <p>{name}</p>
		          <b>&#8377; {price.toFixed(2)} </b>
		        </Link>
	        </div>);
  }
}

export default Item;