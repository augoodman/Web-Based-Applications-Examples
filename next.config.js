
require('dotenv').config({ path: `./.env.${process.env.ENVIRONMENT}` }); // ENVIRONMENT is a variable set in kubernetes that holds qa, int or prod

module.exports = {
    cssModules: true,
    webpack(config) {
        config.module.rules.push(
            {
                test: /\.(jpg|png|gif|pdf|ttf|woff2?|eot|svg)$/,
                use: 'url-loader'
            }
        );

        return config;
    }
};