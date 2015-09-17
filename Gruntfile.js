module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-include-source');

    grunt.initConfig({

        includeSource: {
            options: {
                basePath: 'app',
                baseUrl: '/',
            },
            server: {
                files: {
                    '.tmp/index.html': '<%= yeoman.app %>/index.html'
                }
            },
            dist: {
                files: {
                    '<%= yeoman.dist %>/index.html': '<%= yeoman.app %>/index.html'
                }
            }
        },
        watch: {
          includeSource: {
            files: ['<%= yeoman.app %>/index.html'],
            tasks: ['includeSource:server']
          }
        },
        useminPrepare: {
          // changed from app to dist, to take index.html processed by includeSource in dist
          html: '<%= yeoman.dist %>/index.html',
          options: {
            dest: '<%= yeoman.dist %>'
          }
        }

    });

    grunt.registerTask('default', ['process', 'watch']);
    grunt.registerTask('init', ['reprocess', 'watch']);
    grunt.registerTask('process', []);
    grunt.registerTask('build', [
        'clean:dist',
        'includeSource:dist',
        'useminPrepare'
    ]);
};


// /*global module:false*/
// module.exports = function(grunt) {

//     var stack = new Stack(),
//         initConfig = {
//             package: stack.utils.getPackageJSON(),
//             theme: stack.utils.getThemeJSON()
//         },
//         sass = require('node-sass');

//     // Project configuration.
//     grunt.initConfig(stack.utils.extend(initConfig, {

//         // Metadata.
//         banner: '/*! <%= theme.name %> - v<%= theme.version %> - ' +
//             '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
//             '* <%= theme.website %>\n' +
//             '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
//             '<%= theme.author %>; Licensed MIT */\n',

//         // Task configuration.
//         bower: {
//             install: {}
//         },
//         sprite: stack.utils.setSprites(),
//         sass: {
//             styles: {
//                 src: stack.dir.src('css'),
//                 dest: stack.dir.temp('css/'),
//                 includePaths: ['bower_components', stack.dir.temp('sprites')]
//             }
//         },
//         concat: stack.utils.setScripts(initConfig.theme),
//         uglify: stack.utils.setScripts(initConfig.theme, true),
//         copy: {
//             templates: {
//                 expand: true,
//                 cwd: stack.dir.src(),
//                 src: ['templates/**'],
//                 dest: stack.dir.theme()
//             },
//             fonts: {
//                 expand: true,
//                 cwd: stack.dir.src(),
//                 src: ['fonts/**'],
//                 dest: stack.dir.theme()
//             },
//             images: {
//                 expand: true,
//                 cwd: stack.dir.src(),
//                 src: ['images/**'],
//                 dest: stack.dir.theme()
//             },
//             sprites: {
//                 expand: true,
//                 flatten: true,
//                 cwd: stack.dir.temp(),
//                 src: ['sprites/**/*.png'],
//                 dest: stack.dir.theme('images')
//             },
//             styles: {
//                 expand: true,
//                 cwd: stack.dir.temp(),
//                 flatten: true,
//                 src: ['css/**/*.{css,map}'],
//                 dest: stack.dir.theme('css/')
//             },
//             theme: {
//                 expand: true,
//                 cwd: stack.dir.theme(),
//                 src: ['**/*'],
//                 dest: initConfig.theme.theme_folder
//             }
//         },
//         jshint: {
//             options: {
//                 curly: true,
//                 eqeqeq: true,
//                 immed: true,
//                 latedef: 'nofunc',
//                 newcap: true,
//                 noarg: true,
//                 sub: true,
//                 undef: true,
//                 unused: 'vars',
//                 boss: true,
//                 eqnull: true,
//                 globals: {
//                     jQuery: true
//                 }
//             },
//             gruntfile: {
//                 src: 'Gruntfile.js'
//             },
//             scripts: {
//                 src: [stack.dir.src('js/**/*.js')]
//             }
//         },
//         imagemin: {
//             theme: {
//                 files: [{
//                     expand: true,
//                     cwd: stack.dir.theme('images/'),
//                     src: ['**/*.png'],
//                     dest: stack.dir.theme('images/')
//                 }]
//             }
//         },
//         zip: {
//             src: {
//                 src: stack.dir.src('**'),
//                 dest: stack.dir.theme('theme-source.zip')
//             },
//             theme: {
//                 src: stack.dir.theme('**'),
//                 dest: 'theme.zip',
//                 dot: true
//             }
//         },
//         unzip: {
//             src: {
//                 src: 'theme-source.zip',
//                 dest: '.'
//             },
//             theme: {
//                 src: 'theme.zip',
//                 dest: '.'
//             }
//         },
//         notify: {
//             process: {
//                 options: {
//                     message: "teste"
//                 }
//             }
//         },
//         watch: {
//             gruntfile: {
//                 files: '<%= jshint.gruntfile.src %>',
//                 tasks: [/*'jshint:gruntfile',*/ 'process']
//             },
//             "theme.json": {
//                 files: stack.dir.src('theme.json'),
//                 tasks: ['reload-theme', 'reprocess']
//             },
//             scripts: {
//                 files: [stack.dir.src('js/**/*.js')],
//                 tasks: ['concat', 'uglify', 'zip:src', 'copy:theme']
//             },
//             styles: {
//                 files: [stack.dir.src('css/**/*.{scss,sass}')],
//                 tasks: ['parse-styles', 'imagemin', 'zip:src', 'copy:theme']
//             },
//             fonts: {
//                 files: [stack.dir.src('fonts/**')],
//                 tasks: ['copy:fonts', 'zip:src', 'copy:theme']
//             },
//             templates: {
//                 files: [stack.dir.src('templates/**')],
//                 tasks: ['copy:templates', 'zip:src', 'copy:theme']
//             },
//             images_static: {
//                 files: [stack.dir.src('images/**')],
//                 tasks: ['copy:images', 'imagemin', 'zip:src', 'copy:theme']
//             },
//             images_sprites: {
//                 files: [stack.dir.src('sprites/**')],
//                 tasks: ['parse-styles', 'copy:sprites', 'imagemin', 'zip:src', 'copy:theme']
//             },
//             docs: {
//                 files: [stack.dir.docs('*.md')],
//                 tasks: ['docs']
//             }
//         }
//     }));

//     grunt.loadNpmTasks('grunt-contrib-copy');
//     grunt.loadNpmTasks('grunt-contrib-concat');
//     grunt.loadNpmTasks('grunt-contrib-uglify');
//     grunt.loadNpmTasks('grunt-contrib-jshint');
//     grunt.loadNpmTasks('grunt-contrib-watch');
//     grunt.loadNpmTasks('grunt-bower-task');
//     grunt.loadNpmTasks('grunt-zip');
//     grunt.loadNpmTasks('grunt-contrib-imagemin');
//     grunt.loadNpmTasks('grunt-notify');
//     grunt.loadNpmTasks('grunt-spritesmith');
    

//     /*
//         MAIN
//     */

//     /**/
//     grunt.registerTask('default', ['process', 'watch']);
//     grunt.registerTask('parse-styles', ['parse-sprites', 'sass:styles', 'copy:styles']);
    
//     grunt.registerTask('copy-static', ['copy:templates', 'copy:fonts', 'copy:images', 'custom-copy']);
//     grunt.registerTask('copy-parsed', ['copy-static', 'copy:sprites', 'copy:styles']);
    
//     grunt.registerTask('process', ['clean-theme', 'clean-temp', 'parse-styles', 'copy-parsed', 'imagemin', 'concat', 'uglify', 'zip:src', 'copy:theme', 'clean-temp']);
//     grunt.registerTask('reprocess', ['pre-bower', 'bower', 'process']);
//     grunt.registerTask('init', ['reprocess', 'watch']);

//     /**/

//     /*
//         LABS
//     */
//     /**/
//     grunt.registerTask('animations', function(){
//         var animations_includes = '',
//             animations_import = '';
//         grunt.file.recurse('animations/css/', function(abspath, rootdir, subdir, filename){
//             if (!!~filename.indexOf('_animations__')){
//                 var fn = filename.split('__')[1].split('.')[0];
//                 animations_includes += '\n@if $moduleStr == '+fn+' {\n    @include page-transition__'+fn+';\n}';

//                 var mixin = '@mixin page-transitions__animations__'+fn+' {\n'+grunt.file.read(abspath)+'\n}';
//                 grunt.file.write('animations/out/'+filename.replace('animations__',''),mixin);

//                 animations_import += '@import "'+filename.substr(1).replace('.scss','')+'";\n';
//             }
//         });
//         grunt.file.write('animations/imports', animations_import);
//         grunt.file.write('animations/includes', animations_includes);
//     });
//     /**/

//     /*
//         BOWER
//     */
//     /**/
//     grunt.registerTask('pre-bower', 'Preparation to use bower', function(){
//         var theme = grunt.config('theme'),
//             defaultOptions = {
//                 name: theme.name,
//                 version: theme.version,
//                 description: theme.description,
//                 authors: [theme.author],
//                 webstite: theme.website,
//                 license: theme.license,
//                 "private": true,
//                 ignore: [
//                     "**/.*",
//                     "node_modules",
//                     "bower_components",
//                     "test",
//                     "tests"
//                 ]
//             },
//             bower = stack.utils.extend(defaultOptions, { devDependencies: theme.bower });

//         grunt.file.write('bower.json', JSON.stringify(bower, false, '  '));
//     });

//     grunt.registerTask('reload-theme', 'Reload theme.json', function(){
//         var theme = stack.utils.getThemeJSON();

//         grunt.config('theme', theme);
//         grunt.config('uglify', stack.utils.setScripts(true));
//         grunt.config('concat', stack.utils.setScripts());

//         grunt.log.ok('Theme.json reloaded');
//     });
//     /**/

//     /*
//         SASS
//     */
//     /**/
//     grunt.registerMultiTask('sass', 'node-sass task', function(){
//         var options = this.data;

//         grunt.file.recurse(options.src, function(abspath, rootdir, subdir, filename) {
//             if (filename.substr(0,1) !== '_') {
//                 var rendered, newFilename;

//                 try {
//                     rendered = sass.renderSync({
//                         file: abspath,
//                         error: function(error){ log('sass error', error); },
//                         includePaths: options.includePaths.concat([options.src])
//                     });
//                     newFilename = filename.replace(/(\.scss|\.sass)$/, '.css');
//                     grunt.file.write(options.dest + newFilename, rendered);
//                     grunt.log.ok('File generated:', newFilename);
//                 }
//                 catch (e) {
//                     grunt.log.error(e);
//                 }
//             }
//         });
//     });

//     /**/

//     /*
//         Sprites
//     */
//     /**/
//     grunt.registerTask('set-sprites', 'Set sprites configuration', function(){
//         grunt.config('sprite', stack.utils.setSprites());
//         grunt.log.ok('Sprites configured');
//     });

//     grunt.registerTask('parse-sprites', 'Parse sprites', function(){
//         grunt.task.run('set-sprites');

//         if (grunt.config('sprite')) {
//             grunt.task.run('sprite');
//         }
//     });
//     /**/

//     /*
//         TEMP FOLDER
//     */
//     /**/
//     grunt.registerTask('clean-temp', 'Clean temp dir', function(){
//         var structure = grunt.file.expand(stack.dir.temp('*'));

//         structure.forEach(function(path){
//             grunt.file.delete(path);
//         });
//         grunt.log.ok('Temp folder cleaned');
//     });
//     /**/

//     /*
//         THEME FOLDER
//     */
//     /**/
//     grunt.registerTask('clean-theme', 'Clean theme dir', function(){
//         var structure = grunt.file.expand(stack.dir.theme('*'));

//         structure.forEach(function(path){
//             grunt.file.delete(path);
//         });
//         grunt.log.ok('Theme folder cleaned');
//     });

//     /*
//         CUSTOM-COPY
//     */
//     /**/
//     grunt.registerTask('custom-copy', 'Copy files as instructed by theme.json', function(){
//         var targets = grunt.config('theme').copy;

//         stack.utils.each(targets, function(target, targetName){
//             var srcs = grunt.file.expand(target.src),
//                 dest = target.dest;
            
//             dest = dest + (dest[dest.length-1] === '/' ? '':'/');

//             srcs.forEach(function(src){
//                 var filename = src.split('/').pop();

//                 grunt.file.copy(src, stack.dir.theme(dest + filename));
//             });
//             grunt.log.ok(targetName + ' -> ' + srcs.length + ' files copied');
//         });
//     });
//     /**/

//     /*
//         DOCS
//     */
//     /**/
//     grunt.registerTask('docs', 'Concatenate files indo README.md', function(){
//         var readme = '';
//         grunt.file.recurse(stack.dir.docs(), function(abspath, rootdir, subdir, filename){
//             if (!!~abspath.indexOf('.md')) {
//                 readme += '\n\n' + grunt.file.read(abspath);
//             }
//         });

//         grunt.file.write('README.md', readme);
//         grunt.log.ok('README.md created');
//     });
//     /**/


//     function Stack(options) {
//         options = options || {};

//         var __temp = options.temp || 'temp/',
//             __src = options.src || 'src/',
//             __theme = options.theme || 'theme/',
//             __docs = options.docs || 'docs/';

//         return {
//             dir: {
//                 src: getDir(__src),
//                 temp: getDir(__temp),
//                 theme: getDir(__theme),
//                 docs: getDir(__docs)
//             },
//             utils: {
//                 getPackageJSON: getPackageJSON,
//                 getThemeJSON: getThemeJSON,
//                 setScripts: setScripts,
//                 setSprites: setSprites,
//                 extend: extend,
//                 each: each
//             }
//         };

        
//         /*
//             UTILS
//         */
//         /**/

//         function getDir(dir){
//             return function(path){
//                 return dir + (path || '');
//             };
//         }

//         function each(entity, cb){
//             if (entity.isArray && entity.isArray()) {
//                 entity.forEach(cb);
//             }
//             else {
//                 for (var k in entity) if (entity.hasOwnProperty(k)) {
//                     cb(entity[k], k);
//                 }
//             }
//         }

//         /**
//          * Retorna package.json como um objeto
//          * 
//          * @return {Object} package.json
//          */
//         function getPackageJSON() {
//             return grunt.file.readJSON('package.json');
//         }
//         /**
//          * Retorna theme.json como um objeto
//          * 
//          * @return {Object} theme.json
//          */
//         function getThemeJSON() {
//             return grunt.file.readJSON(__src + 'theme.json');
//         }
//         /**
//          * Retorna configurações das tasks uglify e concat
//          * 
//          * Como as configurações das tasks `concat` e `uglify` são parecidas e 
//          * precisam ser alteradas quando `theme.json` é alterado, esse método 
//          * se encarrega de construir as configurações.
//          *
//          * setScripts(theme[, uglify])
//          * - utilizado na primeira chamada em initConfig apenas
//          * @param {Object} theme
//          * @param {Boolean} uglify
//          * 
//          * setScripts([uglify])
//          * - utilizado dentro das tasks
//          * @param {Boolean} uglify
//          *
//          * @return {object} Task config
//          */
//         function setScripts() {
//             var args = Array.prototype.slice.call(arguments),
//                 theme = (typeof args[0] === 'object' ? args[0] : getThemeJSON()),
//                 uglify = (typeof args[0] === 'boolean' ? args[0] : args[1]),
//                 task = {
//                     options: {
//                         banner: '<%= banner %>',
//                         wrap: true
//                     }
//                 };

//             stack.utils.each(theme.scripts, function(src, targetName){
//                 task[targetName] = {
//                     src: src,
//                     dest: __theme + 'js/' + targetName + (uglify ? '.min' : '') + '.js'
//                 };
//                 if (uglify) {
//                     task[targetName].options = {
//                         sourceMap: __theme + 'js/' + targetName + '.min.map',
//                         sourceMapRoot: '../../',
//                         sourceMappingURL: targetName + '.min.map'
//                     };
//                 }
//             });
            
//             return task;
//         }

//         /**
//          * Set sprites target definitions
//          *
//          * @return {Object} Sprites target definitions
//          */
//         function setSprites() {
//             var folders = grunt.file.expand(__src + 'sprites/*')
//                 .filter(function(item){
//                     return grunt.file.isDir(item);
//                 })
//                 .map(function(item){
//                     var target = {},
//                         filename = item.replace(__src + 'sprites/','');

//                     target[filename] = {
//                         src: [item + '/*.png', item + '/*.jpg'],
//                         destImg: __temp + 'sprites/' + filename + '.png',
//                         destCSS: __temp + 'sprites/_' + filename + '.scss',
//                         engine: 'pngsmith',
//                         cssOpts: {
//                             sprite_name: filename
//                         }
//                     };

//                     if (grunt.file.isFile(item + '/scss.template.mustache')) {
//                         target[filename].cssTemplate = item + '/scss.template.mustache';
//                     }

//                     return target;
//                 });

//             return extend.apply(this, folders);
//         }

//         /**
//          * Extend an object
//          * 
//          * Retirado da biblioteca allong.es, retorna  um objeto com a combinação 
//          * extendida dos objetos fornecidos.
//          * https://github.com/raganwald/allong.es/
//          * 
//          * @return {object}
//          */
//         function extend() {
//             var __slice = Array.prototype.slice,
//                 consumer = arguments[0],
//                 providers = __slice.call(arguments, 1),
//                 key,
//                 i,
//                 provider,
//                 except;

//             for (i = 0; i < providers.length; ++i) {
//                 provider = providers[i];
//                 except = provider['except'] || [];
//                 except.push('except');
//                 for (key in provider) {
//                     if (except.indexOf(key) < 0 && provider.hasOwnProperty(key)) {
//                         consumer[key] = provider[key];
//                     }
//                 }
//             }
//             return consumer;
//         }
//         /**/
//     }
   
// };
//     