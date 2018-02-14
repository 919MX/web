const env = process.env.NODE_ENV === 'development' ? require('./env.dev') : require('./env.prod')

const common = {
  mapbox: {
    accessToken: 'pk.eyJ1Ijoia3lsZWJlYmFrIiwiYSI6ImNqOTV2emYzdjIxbXEyd3A2Ynd2d2s0dG4ifQ.W9vKUEkm1KtmR66z_dhixA',
    sourceOptions: {
      type: 'vector',
      url: 'mapbox://kylebebak.dr7kbl4u',
    },
    sourceLayer: 'tileset-2018-02-13-b7pu9b',
  },
}

export default { ...common, ...env }
