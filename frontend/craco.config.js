// craco.config.js
module.exports = {
    style: {
        postcss: {
            plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
            ],
        },
        sass: {
            loaderOptions: {
                // Prefer 'sass' (dart-sass) over 'node-sass' if both packages are installed.
                implementation: require('node-sass'),
                // Workaround for this bug: https://github.com/webpack-contrib/sass-loader/issues/804
                webpackImporter: false
            }
        },
    },
}
