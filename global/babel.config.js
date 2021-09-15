module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        targets: {
          edge: '16',
          firefox: '56',
          chrome: '58',
          safari: '11',
          ie: '11'
        }
      }
    ],
    '@babel/preset-react',    
    "@babel/preset-typescript"
  ],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    '@babel/plugin-transform-arrow-functions',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-async-generator-functions',
    '@babel/plugin-transform-runtime'
  ]
};
