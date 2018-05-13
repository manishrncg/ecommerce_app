import React from 'react';

class Item extends React.Component {
  render() {  // Basic component for every product being displayed while listing
    const {name, image, price} = this.props;
  
    return (<div className="col-md-3 col-sm-3 col-xs-3 inline productBox" >
          <img src={image} alt={name} className="productListImage" />
          <p>{name}</p>
          <b>&#8377; {price} </b>
        </div>);
  }
}

export default Item;