import React from 'react';
import ReactDOM from 'react-dom';
import Listing from './components/Listing';
// import { BrowserRouter, Switch, Route } from 'react-router-dom';
// import NotFound from './components/NotFound';

class App extends React.Component {

  render(){
      return (
      	<React.Fragment>
	  		<Listing page_number="1"></Listing>
		</React.Fragment>
	);
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('tabs')
);