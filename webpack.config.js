/**
 * Created by liaoyf on 2017/3/6 0006.
 */
function buildConfig(env){
    return require('./config/' + env + '.js')({
        env: env
    });
}

module.exports = buildConfig;