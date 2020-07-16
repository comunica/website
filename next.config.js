// next.config.js
module.exports = {
    exportTrailingSlash: true,
    target: 'serverless',
    webpack: function (config) {
        config.module.rules.push({
            test: /\.md$/,
            use: 'raw-loader',
        })
        return config
    },
    devIndicators: {
        autoPrerender: false,
    },
}
