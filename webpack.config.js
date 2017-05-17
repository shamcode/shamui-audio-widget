var fs = require( 'fs' );
var webpack = require( 'webpack' );

var libraryName = 'sham-ui-audio-widget';
var plugins = [];

var libraryConfig = {
    entry: __dirname + '/src/audio.js',
    devtool: 'source-map',
    output: {
        path: __dirname + '/lib',
        filename: libraryName + '.js',
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /(\.js)$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/
            }
        ]
    },
    resolve: {
        extensions: [ '.js' ]
    },
    plugins: plugins
};

var testConfig = {
    entry: __dirname + '/test/main.js',
    devtool: 'source-map',
    output: {
    path:  __dirname + '/test/assets',
        filename: 'bundle.js',
        umdNamedDefine: true
},
    module: {
        loaders: [
            {
                test: /(\.js)$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/
            }
        ]
    },
    resolve: {
        extensions: [ '.js' ]
    },
    plugins: plugins
};

module.exports = [ libraryConfig, testConfig ];