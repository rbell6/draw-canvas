module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'js/vendor.js': /^(?!app)/,
        'js/app.js': /^app/
      }
    },
    stylesheets: {joinTo: 'css/app.css'}
  },
  paths: {
    public: '../server/public'
  },
  plugins: {
    babel: {presets: ['es2015', 'react']},
    less: {}
  }
};
