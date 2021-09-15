import path from 'path';
import webpack from 'webpack';
// import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { MergeTranslatorPlugin } from './webpack.translator';

/**
 *   //target: ['web', 'es5']
 *    For HMR webpack 5 - once webpack-dev-server comes try adding above line
 *    also can try removing browserslist from package.json and targets from babel.config.js file
 */
export const getProdConfiguration = (config) => {
  const prodEntryFile = path.resolve(config.rootpath, `src/index.${config.isTs ? 'tsx' : 'js'}`);
  const prodOutput = path.resolve(config.rootpath, 'dist/');
  const sourceMapKey = `${config.appType}_mapping_1q2w3e4k`;
  const configuration = {
    mode: 'production',
    entry: {
      main: config.bootstrapStyle ? [prodEntryFile, config.bootstrapStyle] : [prodEntryFile]
    },
    output: {
      path: prodOutput,
      publicPath: '/',
      filename: '[name]_[contenthash].js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: config.htmlTemplate,
        filename: 'index.html',
        title: config.appName
      }),
      new MiniCssExtractPlugin({
        filename: '[name]-styles_[contenthash].min.css',
      }),
      new WebpackManifestPlugin(),
      new MergeTranslatorPlugin({
        srcPath: config.translatorPath,
        fileName: 'translator.json',
        outFileName: 'translator.json'
      }),
      new webpack.SourceMapDevToolPlugin({
        filename: `${sourceMapKey}/[file].map[query]`,
        append: false,
        module: true,
        columns: true,
        noSources: false,
        namespace: ''
      })
    ],
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(config.styleRootpath, './src/assets'),
    //       to: path.resolve(prodOutput, './assets')
    //     }
    //   ]
    // }),
  };

  if (config.mfPluginObj) {
    configuration.plugins.push(
      new ModuleFederationPlugin({
        ...config.mfPluginObj
      })
    )
  }
  return configuration;
};
