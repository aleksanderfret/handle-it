import autoprefixer from 'autoprefixer';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { Configuration as WebpackConfiguration } from 'webpack';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';

const config: WebpackConfiguration = {
  entry: './src/index.tsx',
  mode: 'production',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(j|t)sx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.json'
          }
        }
      },
      {
        exclude: /node_modules/,
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                includePaths: ['./src/scss'],
                indentWidth: 2
              },
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true
      }),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new OptimizeCssAssetsPlugin()
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../../dist/public'),
    publicPath: '/'
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new MiniCssExtractPlugin({
      filename: 'style.[hash].css'
    }),
    new HtmlWebPackPlugin({ template: path.resolve('public/index.html') })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: [path.resolve(__dirname, 'src'), 'tests', 'node_modules']
  }
};

export default config;
