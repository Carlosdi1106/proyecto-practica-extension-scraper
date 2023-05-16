module.exports = {
    mode: 'production', 
    target: 'node', 
    externals: { 
      "chrome": "commonjs2 chrome" 
    },
    entry: {
      background: './background.js'
    },
    output: {
      path: '/dist',
      filename: '[name].js' 
    }  
  };