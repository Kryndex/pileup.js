'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      test: {
        files: {
          'dist/tests.js': ['dist/main/**/*.js', 'dist/test/**/*-test.js']
        }
      },
      watchDist: {
        files: {
          'dist/pileup.js': ['dist/main/**/*.js']
        },
        options: {
          watch: true,
          keepAlive: true,
          require: ['./dist/main/pileup.js:pileup']
        }
      },
      watchTest: {
        files: '<%= browserify.test.files %>',
        options: {
          watch: true,
          keepAlive: true,
        }
      },
      options: {
        browserifyOptions: {
          debug: true  // generate a source map
        }
      }
    },
    jscoverage: {
      src: {
        expand: true,
        cwd: 'dist/',
        src: ['tests.js'],
        dest: 'dist/cov/',
        ext: '.js'
      }
    },
    mocha_phantomjs: {
      run: {
        options: {
          urls: ['http://localhost:9501/src/test/runner.html']
        }
      },
      cov: {
        options: {
          urls: ['http://localhost:9501/src/test/coverage.html'],
          reporter: 'node_modules/mocha-lcov-reporter/lib/lcov.js',
          output: 'dist/bundled.lcov',
          silent: true
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 9501
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks("grunt-jscoverage");

  grunt.registerTask('test', ['browserify:test', 'connect', 'mocha_phantomjs:run']);
  grunt.registerTask('travis', ['test']);
  grunt.registerTask('coverage',
                     ['browserify:test', 'jscoverage', 'connect', 'mocha_phantomjs:cov']);
};
