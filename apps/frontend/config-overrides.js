const { override, addBabelPlugins } = require('customize-cra');

// override
module.exports = {
  webpack: override(
    // customize-cra plugins here
    ...addBabelPlugins('jsx-control-statements'),
    config => {
      return config;
    },
  ),
};
