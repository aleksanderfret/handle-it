import autoprefixer from 'autoprefixer';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import path from 'path';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

interface IConfiguration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: IConfiguration = {
  devServer: {
    allowedHosts: 'all',
    devMiddleware: {
      publicPath: '/'
    },
    historyApiFallback: true,
    hot: true,
    open: true,
    port: 4000,
    proxy: {
      '/api': 'http://localhost:5000',
      '/graphql': 'http://localhost:5000/graphql'
    },
    static: {
      watch: {
        ignored: /node_modules/
      }
    }
  },
  devtool: 'inline-source-map',
  entry: './src/index.tsx',
  mode: 'development',
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
          'style-loader',
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
  output: {
    clean: true,
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../../dist/public'),
    publicPath: '/'
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new HtmlWebPackPlugin({ template: path.resolve('public/index.html') })
  ],
  resolve: {
    extensions: ['.ts', '.generated.tsx', '.tsx', '.js', '.jsx', '.json'],
    modules: [path.resolve(__dirname, 'src'), 'tests', 'node_modules']
  },
  target: 'web'
};

export default config;
