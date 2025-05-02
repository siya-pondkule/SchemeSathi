module.exports = function override(config) {
    config.resolve.fallback = {
      stream: require.resolve('stream-browserify'),
      https: require.resolve('https-browserify'),
      crypto: require.resolve('crypto-browserify'),
      querystring: require.resolve('querystring-es3'),
      assert: require.resolve('assert/'),
      os: require.resolve('os-browserify/browser'),
      http: require.resolve('stream-http'),
      net: false,
      tls: false
    };
    return config;
  };
  