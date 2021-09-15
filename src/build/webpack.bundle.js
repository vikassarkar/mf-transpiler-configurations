import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { MergeTranslatorPlugin } from './webpack.translator';
import ModuleFederationPlugin from 'webpack/lib/container/ModuleFederationPlugin';

/**
 *   //target: ['web', 'es5']
 *    For HMR webpack 5 - once webpack-dev-server comes try adding above line
 *    also can try removing browserslist from package.json and targets from babel.config.js file
 */
export const getBundleConfiguration = (config) => {
  const bundleEntryFile = path.resolve(config.rootpath, `src/index.${config.isTs ? 'ts' : 'js'}`);
  const bundleOutput = path.resolve(config.rootpath, 'dist/');
  const configuration = {
    mode: 'production',
    entry: {
      [config.bundleName || 'index']: [bundleEntryFile],
    },
    output: {
      path: bundleOutput,
      publicPath: '/',
      filename: '[name].min.js'
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name]-style.min.css',
      })
    ],
  };
  if (config.translatorPath) {
    configuration.plugins.push(
      new MergeTranslatorPlugin({
        srcPath: config.translatorPath,
        fileName: 'translator.json',
        outFileName: 'translator.json'
      })
    );
  }
  if (config.mfPluginObj) {
    configuration.plugins.push(
      new ModuleFederationPlugin({
        ...config.mfPluginObj
      })
    )
  }
  return configuration;
};
