module.exports = {
  client: {
    name: 'gilder',
    includes: ['./src/queries/**/*'],
    service: {
      url: 'https://api.gilder.xyz/graphql',
    },
  },
};
