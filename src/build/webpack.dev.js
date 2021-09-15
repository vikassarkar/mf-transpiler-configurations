import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { MergeTranslatorPlugin } from './webpack.translator';
import ModuleFederationPlugin from 'webpack/lib/container/ModuleFederationPlugin';

/**
 *   //target: ['web', 'es5']
 *    For HMR webpack 5 - once webpack-dev-server comes try adding above line
 *    also can try removing browserslist from package.json and targets from babel.config.js file
 */
export const getDevConfiguration = (config, devEntry, devContainer) => {
    const devOutput = path.resolve(config.rootpath, 'lib/');
    const configuration = {
        mode: 'development',
        entry: {
            main: config.bootstrapStyle ? [devEntry, config.bootstrapStyle] : [devEntry]
        },
        target: 'web',
        output: {
            path: devOutput,
            publicPath: config.mfPluginObj ? `http://${config.localhost}:${config.devPort}/` : '/',
            filename: '[name]_[contenthash].js'
        },
        devtool: 'eval-cheap-module-source-map',
        watch: true,
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css'],
            alias: {
                moduleContainer: devContainer
            },
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: config.htmlTemplate,
                filename: 'index.html',
                title: config.appName
            }),
            new MiniCssExtractPlugin({
                filename: '[name]-style_[contenthash].min.css',
            }),
            new MergeTranslatorPlugin({
                srcPath: config.translatorPath,
                fileName: 'translator.json',
                outFileName: 'translator.json'
            })
        ],
        devServer: {
            stats: {
                chunks: true,
                colors: true,
                timings: true,
                errors: true,
            },
            lazy: true,
            overlay: true,
            disableHostCheck: true,
            contentBase: devOutput,
            port: config.devPort,
            host: config.localhost,
            filename: 'index.html',
            compress: false,
            https: false,
            noInfo: true,
            public: undefined,
            hot: true,
            historyApiFallback: {
                disableDotRule: true,
            },
            open: true,
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }
    };
    if (config.mocksPath) {
        configuration.plugins.push(
            new CopyPlugin({
                patterns: [
                    {
                        from: config.mocksPath,
                        to: path.resolve(devOutput, config.envConfig.localConfigs.mockUrl || './mocks')
                    }
                ]
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
