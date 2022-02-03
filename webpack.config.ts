import {Configuration} from 'webpack';
import path from 'path';
import {dirname} from 'path';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import {fileURLToPath} from 'url';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: Configuration = {
  mode: "production",
  entry: './src/entry.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: [
        'ts-loader',
      ],
      exclude: /node_modules/
    }]
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: './dist/bundleContentReport.html'
    })],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          compress: {
            defaults: false, // set all recommended configs to false since we want to demo only some configs
            dead_code: true, // remove dead_code in functions
            unused: true, // remove unused functions
            keep_fnames: true,
            keep_classnames: true,
            keep_fargs: true
          },
          mangle: false, // don't minify variable names
          format: {
            beautify: true,
            comments: false,
          },
        },
      })
    ]
  }

}

export default config;
