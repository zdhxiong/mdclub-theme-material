const FileSystem = require('fs');
const copyDir = require('copy-dir');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const { outputFolder, resolve } = require('./config');

const devConfig = merge(commonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    compress: true,
    host: 'localhost',
    port: 8080,
    open: false,
    allowedHosts: 'all',
    client: {
      logging: 'error',
      progress: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    static: {
      directory: outputFolder,
    },
  },
  output: {
    filename: 'index.js',
  },
  plugins: [
    // 替换 HTML 中的环境变量
    function() {
      const phpFiles = [
        resolve('./template/public/header.php'),
        resolve('./template/public/footer.php'),
      ];

      this.hooks.done.tap('replaceEnvironment', () => {
        phpFiles.forEach(phpFile => {
          let htmlOutput = FileSystem
            .readFileSync(phpFile, 'utf-8')
            .replace("$NODE_ENV = 'production'", "$NODE_ENV = 'development'");

          FileSystem.writeFileSync(phpFile, htmlOutput);
        });

        copyDir(resolve('./template'), resolve('../mdclub/templates/material'), { cover: true });
      });
    },
  ],
});

module.exports = devConfig;
