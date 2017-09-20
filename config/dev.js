/**
 * Created by liaoyf on 2017/3/6 0006.
 */
const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./base');

//====================配置开始============================
//开发时访问的端口
let port = '3010';
//上下文目录
let context = 'http://192.168.0.235:6060/college';
//client端目录
let clientPath = 'http://192.168.0.235:6060/college';
// let clientPath = 'http://localhost:6060/college';
//====================配置结束============================

module.exports = function(){
    return webpackMerge(commonConfig(), {
        entry: {
            hot: [
                //开启 React 代码的模块热替换(HMR)
                'react-hot-loader/patch',
                // 为 webpack-dev-server 的环境打包代码
                // 然后连接到指定服务器域名与端口
                'webpack-dev-server/client?http://0.0.0.0:' + port,
                // 为热替换(HMR)打包好代码
                // only- 意味着只有成功更新运行代码才会执行热替换(HMR)
                'webpack/hot/only-dev-server'
            ],
            // config: context + '/config'
        },
        output: {
            filename: '[name].js',
            // 对于热替换(HMR)是必须的，让 webpack 知道在哪里载入热更新的模块(chunk)
            publicPath: ''
        },
        devtool: 'cheap-module-source-map',
        devServer: {
            port: port,
            host: '0.0.0.0',
            historyApiFallback: false,
            disableHostCheck: true,
            noInfo: false,
            stats: 'minimal',
            inline: true,
            //开启服务器的模块热替换(HMR)
            hot: true,
            // 和上文 output 的“publicPath”值保持一致
            publicPath: '',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
            },
            proxy: {
                '/config': {
                    target: clientPath,
                    secure: false,
                    changeOrigin: true
                },
                '/getSSoServerUrl': {
                    target: clientPath,
                    secure: false,
                    changeOrigin: true
                },
                '/remote': {
                    target: clientPath,
                    secure: false,
                    changeOrigin: true
                },
                '/upload': {
                    target: clientPath,
                    secure: false,
                    changeOrigin: true
                },
                '/excel': {
                    target: clientPath,
                    secure: false,
                    changeOrigin: true
                }
            }
        },
        plugins: [
            // 开启全局的模块热替换(HMR)
            new webpack.HotModuleReplacementPlugin(),
            // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息
            new webpack.NamedModulesPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                name: ['polyfills', 'vendor'].reverse()
            }),
            new webpack.DefinePlugin({
                CONTEXT_PATH: JSON.stringify(context)
            })
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader'
                        }
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader?sourceMap'
                        },
                        {
                            loader: 'resolve-url-loader'
                        },
                        {
                            loader: 'sass-loader?sourceMap'
                        }
                    ]
                }
            ]
        }
    })
};