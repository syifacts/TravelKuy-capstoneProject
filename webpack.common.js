const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
    sw: path.resolve(__dirname, 'src/scripts/sw.js'),
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
      // Menambahkan loader untuk gambar
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: 
          {
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
    new MiniCssExtractPlugin({ // Tambahkan ini
      filename: 'style.css', // Nama file CSS yang dihasilkan
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
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
  ],
};
