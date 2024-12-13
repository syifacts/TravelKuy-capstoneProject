const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/templates/index.html'),
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/public/assets'),
          to: path.resolve(__dirname, 'dist/assets'),
        },
        {
          from: path.resolve(__dirname, 'src/public/app.webmanifest'),
          to: path.resolve(__dirname, 'dist/app.webmanifest'),
        },
        {
          from: path.resolve(__dirname, 'src/public/icons'),
          to: path.resolve(__dirname, 'dist/icons'),
        },
        {
          from: path.resolve(__dirname, 'src/public/data'),
          to: path.resolve(__dirname, 'dist/data'),
        },
      ],
    }),
    new WorkboxWebpackPlugin.GenerateSW({
      swDest: './sw.bundle.js',
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/agrowisataapi-1aaac8500e71\.herokuapp\.com\/agrowisata(\/|$)/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'agrowisata-api',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 24 * 60 * 60, // 1 day
            },
          },
        },
        {
          urlPattern: /^https:\/\/apidesawisata-353b9a2a7d66\.herokuapp\.com\/desawisata(\/|$)/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'desawisata-api',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 24 * 60 * 60, // 1 day
            },
          },
        },
        {
          urlPattern: ({ request }) => request.destination === 'document',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'html-cache',
          },
        },
        {
          urlPattern: ({ request }) => request.destination === 'style',
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'css-cache',
          },
        },
        {
          urlPattern: ({ request }) => request.destination === 'script',
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'js-cache',
          },
        },
        {
          urlPattern: ({ request }) => request.destination === 'image',
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
      ],
    }),
  ],
};