const { override, addBabelPlugins } = require('customize-cra');

module.exports = {
  webpack: override(
    // customize-cra plugins here
    ...addBabelPlugins('jsx-control-statements'),
    config => {
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
    };
    return config;
  },
};
