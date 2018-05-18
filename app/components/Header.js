import React from 'react';
import { Link } from 'react-router-dom';

class Header extends React.PureComponent{
	getSum(total, num) {
	    return total + num;
	}
	
	render(){
		const getBagData = this.props.getBagData();
		const countItemsBag = Object.keys(getBagData)
								.map((id, index)=>{
									return getBagData[id];
								});
		return (
			<header className="header">
				<div className="col-md-3 col-sm-3 col-xs-3 offset-md-2 offset-sm-2 offset-xs-2">
					<p className="logo">
						<Link to={`/`} >My Awesome Shop</Link>
					</p>
				</div>
				
					<ul className="main-nav">
					  <li>
					  	<Link to={`/`} >Home</Link>
					  </li>
					  <li><a href="#">About</a></li>
					  <li><a href="#">Contact us</a></li>
					  <li>
					  	<Link to={`/bag`} >Bag ({countItemsBag.length && countItemsBag.reduce(this.getSum)} items)</Link>
					  </li>
					</ul>
					<div className=" offset-md-2 offset-sm-2 offset-xs-2"></div>
			</header> 
			)
	}
}

export default Header;