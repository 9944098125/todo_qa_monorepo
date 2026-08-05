const { override, addBabelPlugins, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = {
  webpack: override(
    // customize-cra plugins here
    ...addBabelPlugins('jsx-control-statements'),
    addWebpackAlias({
      '@': path.resolve(__dirname, 'src'),
    }),
    config => {
      // Find css-loader in the Webpack config and tell it to ignore absolute URLs
      config.module.rules.forEach(rule => {
        if (rule.oneOf) {
          rule.oneOf.forEach(oneOfRule => {
            if (oneOfRule.use && Array.isArray(oneOfRule.use)) {
              oneOfRule.use.forEach(useItem => {
                if (
                  useItem.loader &&
                  useItem.loader.includes('css-loader') &&
                  !useItem.loader.includes('postcss-loader') &&
                  typeof useItem.options === 'object'
                ) {
                  useItem.options.url = {
                    filter: url => !url.startsWith('/'),
                  };
                }
              });
            }
          });
        }
      });
      return config;
    },
  ),
  jest: config => {
    // 1. Tell Jest to transpile modern ES modules from these specific node_modules
    config.transformIgnorePatterns = [
      '[/\\\\]node_modules[/\\\\](?!(@standard-schema|@reduxjs|react-router-dom|react-router|@remix-run)).+\\.(js|jsx|mjs|cjs|ts|tsx)$',
      '^.+\\.module\\.(css|sass|scss)$',
    ];
    // 2. Fix the missing exports map resolution in Jest 27 for react-router-dom
    config.moduleNameMapper = {
      ...config.moduleNameMapper,
      '^react-router/dom$': require.resolve('react-router-dom'),
      '^@/(.*)$': '<rootDir>/src/$1',
    };
    return config;
  },
};
