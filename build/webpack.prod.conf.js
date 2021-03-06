'use strict';
const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// 清理 dist 文件夹
const CleanWebpackPlugin = require('clean-webpack-plugin');

const env = require('../config/prod.env');

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    /*
     /!* copy *!/
     new UglifyJsPlugin({
     uglifyOptions: {
     compress: {
     warnings: false
     }
     },
     sourceMap: config.build.productionSourceMap,
     parallel: true
     }),
     // extract css into its own file
     new ExtractTextPlugin({
     filename: utils.assetsPath('css/[name].[contenthash].css'),
     // Setting the following option to `false` will not extract CSS from codesplit chunks.
     // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
     // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
     // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
     allChunks: true
     }),
     // Compress extracted CSS. We are using this plugin so that possible
     // duplicated CSS from different components can be deduped.
     new OptimizeCSSPlugin({
     cssProcessorOptions: config.build.productionSourceMap
     ? {safe: true, map: {inline: false}}
     : {safe: true}
     }),
     // generate dist index.html with correct asset hash for caching.
     // you can customize output by editing /index.html
     // see https://github.com/ampedandwired/html-webpack-plugin
     // keep module.id stable when vendor modules does not change
     new webpack.HashedModuleIdsPlugin(),
     // enable scope hoisting
     new webpack.optimize.ModuleConcatenationPlugin(),
     // split vendor js into its own file

     // extract webpack runtime and module manifest to its own file in order to
     // prevent vendor hash from being updated whenever src bundle is updated
     */
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),

    new utils.delScriptTag({options: ''}),
    // 自动清理 dist 文件夹
    new CleanWebpackPlugin(['../dist']),
    // 将 css 抽取到某个文件夹
    new ExtractTextPlugin('./dist/css/'),
    // 代码压缩
    new webpack.optimize.UglifyJsPlugin({
      // 开启 sourceMap
      sourceMap: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            // path.join(__dirname, '../node_modules')
            path.join(__dirname, '../src/lib')
          ) === 0
        );
      }
    }),
    // 提取公共 JavaScript 代码
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',  // chunk 名为 commons
      filename: utils.assetsPath('js/[name].[chunkhash].js')
    })

  ]
});

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin');
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  );
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;

