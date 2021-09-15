
import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { getCompilerHooks } from 'webpack-manifest-plugin';
import { merge } from 'webpack-merge';
import { promtModuleToLoadInServer } from './webpack.prompt';
import { getDevConfiguration } from './webpack.dev';
import { getProdConfiguration } from './webpack.prod';
import { getBundleConfiguration } from './webpack.bundle';

// eslint-disable-next-line import/extensions
import bableConfig from '../../global/babel.config.js';

/**
 *   //target: ['web', 'es5']
 *    For HMR webpack 5 - once webpack-dev-server comes try adding above line
 *    also can try removing browserslist from package.json and targets from babel.config.js file
 */

export class WebpackBuild {
  constructor(params) {
    this.config = {
      // root path of application
      rootpath: params.rootpath,
      // application type (container/module/widget)
      appType: params.appType,
      // application name 
      appName: params.appName || this.getRootFolderName(params.rootpath),
      // environment type (development/production)
      env: params.env,
      // build process for typescript application
      isTs: params.isTs,
      // localhost url for dev environment
      localhost: params.localhost || 'localhost.specialurl.com',
      // port for local dev environment
      devPort: params.port,
      // path for html template for build 
      htmlTemplate: params.htmlTemplate,
      // main entry file path for launching widgets individually
      devLauncherFile: params.devLauncherFile,
      // es-lint path for es-lint rules
      eslint: path.resolve(__dirname, '../../global/eslintrc.json'),
      // bundle name for production bundle  
      bundleName: params.bundleName,
      // path of translator ie usually widget for combining all il18 json
      translatorPath: params.translatorPath,
      // webpack module fedration configuration for microfrontend build
      mfPluginObj: params.mfPluginObj,
      // path for mocks in dev environment
      mocksPath: params.mocksPath,
      // all configuration for build process 
      envConfig: params.envConfig,
      // bootstrap style if required in build
      bootstrapStyle: params.bootstrapStyle ? 'bootstrap/dist/css/bootstrap.min.css' : null,
      // assets path for images and fonts
      styleAssets: '/assets/',
      // style rooth path for adding styling if not imported in js files
      styleRootpath: params.styleRootpath ? path.resolve(params.rootpath, params.styleRootpath) : null
    };
  }

  getRootFolderName(roothpath) {
    return 'React-microfrontend';
  }

  getProjectEnv() {
    if (this.config.envConfig) {
      const projectConfig = { ...this.config.envConfig };
      projectConfig.localConfigs.isMock = this.config.env === 'development';
      projectConfig.localConfigs.devTool = this.config.env === 'development';
      return projectConfig;
    }
    return {};
  }

  getCommonConfiguration() {
    return {
      mode: '',
      output: {},
      devtool: false,
      watch: false,
      cache: false,
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css'],
        alias: {}
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx|ts|tsx)?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: bableConfig
            }
          },
          {
            test: /\.(scss|css)$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader
              },
              'css-loader',
              'sass-loader',
            ]
          },
          {
            test: /\.json$/,
            loader: 'json-loader',
            type: 'javascript/auto'
          },
          {
            test: /\.html$/,
            use: ['raw-loader']
          },
          {
            test: /\.(gif|png|jpe?g)$/i,
            use: {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/images/'
              }
            }
          },
          {
            test: /\.(woff|woff2|eot|[ot]tf)$/i,
            use: {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/fonts/'
              }
            }
          },
          {
            test: /\.svg$/,
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: (filename, filePath) => {
                if (filePath.indexOf('images') > -1) {
                  return `assets/images/${filename}`;
                }
                if (filePath.indexOf('fonts') > -1) {
                  return `assets/fonts/${filename}`;
                }
                return `assets/${filename}`;
              },
            },
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            ENV_VAR: JSON.stringify(this.getProjectEnv()),
            APP_TYPE: JSON.stringify(this.config.appType),
            BUILD_TYPE: JSON.stringify(this.config.env)
          }
        }),
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin({
          verbose: true
        }),
        new ESLintWebpackPlugin({
          extensions: ['js', 'jsx', 'ts', 'tsx'],
          emitError: true,
          emitWarning: true,
          failOnError: true,
          context: this.config.rootpath
        })
      ],
      optimization: {
        minimizer: [
          new TerserPlugin({
            extractComments: false,
            terserOptions: {
              format: {
                comments: false,
              },
            },
          })
        ],
        moduleIds: 'deterministic',
        chunkIds: 'named',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // for prod / dev container chunks utils, services, components, widgets, pages
            // for bundle/dev pages chunks utils, services, components, widgets
            // for bundle/dev widgets chunks utils, services, components
            // for bundle services chunks utils 
            bootstrap: {
              test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
              name: 'bootstrap',
              priority: 10,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              priority: 20,
              reuseExistingChunk: true,
            }
          }
        }
      }
    };
  }

  displayWebpackStats(err, stats) {
    if (err) {
      console.error(`${err}`);
    } else {
      console.log(`${stats.toString({
        chunks: true,
        colors: true,
        assetsSort: 'size',
        entrypoints: false,
      })}`);
    }
  }

  startProductionBuild() {
    const commonConfiguration = this.getCommonConfiguration();
    const prodConfiguration = getProdConfiguration(this.config);
    const configuration = merge(commonConfiguration, prodConfiguration);
    const compiler = webpack(configuration, this.displayWebpackStats);
    const { beforeEmit } = getCompilerHooks(compiler);

    beforeEmit.tap('newMainfiest', (manifest) => {
      const newMainfiest = {};
      Object.keys(manifest).map((keyName) => {
        if (!keyName.includes('.js.map')) {
          newMainfiest[keyName] = manifest[keyName];
        }
        return true;
      });
      return newMainfiest;
    });
  }

  startBundling() {
    const commonConfiguration = this.getCommonConfiguration();
    const bundleConfiguration = getBundleConfiguration(this.config);
    const configuration = merge(commonConfiguration, bundleConfiguration);
    webpack(configuration, this.displayWebpackStats);
  }

  async startDevelopementServer() {
    let devEntry;
    let devContainer;
    let moduleName;
    const { rootpath, appType, devLauncherFile } = this.config;
    switch (appType) {
      case 'widgets':
        moduleName = await promtModuleToLoadInServer(path.resolve(rootpath, 'src'));
        devEntry = devLauncherFile;
        devContainer = path.resolve(rootpath, `src/${moduleName}/index.${this.config.isTs ? 'ts' : 'js'}`);
        break;
      case 'container':
      case 'module':
        devEntry = path.resolve(rootpath, `src/index.${this.config.isTs ? 'tsx' : 'js'}`);
        devContainer = path.resolve(rootpath, `src/router/MainAppRouter.${this.config.isTs ? 'tsx' : 'js'}`);
        break;
      default:
        devEntry = '';
        devContainer = '';
    }
    const commonConfiguration = this.getCommonConfiguration();
    const devConfiguration = getDevConfiguration(this.config, devEntry, devContainer);
    const configuration = merge(commonConfiguration, devConfiguration);
    const server = new WebpackDevServer(webpack(configuration, this.displayWebpackStats), configuration.devServer);
    server.listen(configuration.devServer.port, configuration.devServer.host, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('');
        console.log(` ****************************************** `);
        console.log(` ************ Server running at ***********`);
        console.log(`http://${configuration.devServer.host}:${configuration.devServer.port}`);
        console.log(` ****************************************** `);
      }
    });
  }

  runBuildProcess() {
    switch (this.config.env) {
      case 'development':
        this.startDevelopementServer();
        break;
      case 'production':
        if (this.config.bundleName) {
          this.startBundling();
          break;
        }
        this.startProductionBuild();
        break;
      default:
        throw new Error('No matching configuration was found!');
    }
  }
}
