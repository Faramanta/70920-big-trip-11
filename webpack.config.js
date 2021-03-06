const MomentLocalesPlugin = require(`moment-locales-webpack-plugin`);
const path = require(`path`);

module.exports = {
  mode: `development`, // режим сборки
  entry: `./src/main.js`, // nочка входа приложения
  output: { //Выходной файл
    filename: `bundle.js`,
    path: path.join(__dirname, `public`)
  },
  devtool: `source-map`, // подключение sourcemap
  devServer: {
    contentBase: path.join(__dirname, `public`), // где искать сборку
    watchContentBase: true // автоматическая перезагрузка страницы
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
    ],
  },
  plugins: [
    new MomentLocalesPlugin()
  ]
};