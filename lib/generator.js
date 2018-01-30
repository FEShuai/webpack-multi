const async = require('async');
const Metalsmith = require('metalsmith');
const render = require('consolidate').handlebars.render;

/**
 * Build.
 */
let gernerator = function(context) {
  var metalsmith = Metalsmith(__dirname)
    .source('./src')
    .destination('./build/')
    .clean(false)
    .use(template)
    .build(function(err) {
      if (err) throw err;
    });

  /**
   * Template in place plugin.
   *
   * @param {Object} files
   * @param {Metalsmith} metalsmith
   * @param {Function} done
   */

  function template(files, metalsmith, done) {
    var keys = Object.keys(files);
    var metadata = metalsmith.metadata();
    Object.assign(metadata, context);

    async.each(keys, run, done);

    function run(file, done) {
      var str = files[file].contents.toString();
      render(str, metadata, function(err, res) {
        if (err) return done(err);
        files[file].contents = new Buffer(res);
        done();
      });
    }
  }
};

module.exports = gernerator;