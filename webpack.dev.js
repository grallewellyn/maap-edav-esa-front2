const path = require('path');
const { merge } = require('webpack-merge');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const commonConfig = require('./webpack.common.js');

const config = (env = {}) => {
    return merge(commonConfig({
        mode: 'development',
        ...env
    }),{
        mode: 'development',
        devtool: 'eval-source-map',
        devServer: {
            port: 8449,
            hot: true,
            historyApiFallback: true,
            static: [
                {
                    directory: path.resolve(__dirname, './data'),
                    publicPath: '/data'
                }
            ],
            client: {
                overlay: false,
                logging: 'warn'
            }
        },
        snapshot: {
            // by default webpack does not track changes to node_modules directory
            // when working with linked oida libraries we want to track changes to them
            managedPaths: [/node_modules\/(!oidajs)/]
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 0,
                                sourceMap: true,
                                import: false,
                                modules: false
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                typescript: {
                    configOverwrite: {
                        include: [
                            "src/**/*",
                            // this ensures that when using npm linked libraries, changes to the node_modules library types
                            // are tracked by the type checker plugin
                            "node_modules/@oidajs/*/types/**/*"
                        ]
                    }
                }
            })
        ]
    });
}

module.exports = config;
