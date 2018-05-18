var HTMLWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
	template: __dirname + '/app/index.html',
	filename: 'index.html',
	inject: 'body'
});


module.exports = {
	entry: __dirname + '/app/App.js',
	devServer: {
    	historyApiFallback: true,
  	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	},
	devtool: 'source-map',
	output: {
		filename: 'transformed.js',
		path: __dirname + '/build',
		publicPath: '/'
	},
	plugins: [HTMLWebpackPluginConfig]
};