export default {
  presets: [
    '@babel/preset-flow',
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript'
  ],
};
