//包装函数
module.exports = function(grunt) {

	//计划执行Task所需要的时间  
	require('time-grunt')(grunt);
	// 加载Task任务
	require('load-grunt-tasks')(grunt, {
		scope: 'devDependencies', 
		requireResolution: true
	});
	
	//任务配置，所有插件的配置信息
	grunt.initConfig({

		//获取package.json的信息
		pkg: grunt.file.readJSON('package.json'),

		// Metadata.
		meta: {
//			currentPath: 'FX/channel/lp62',//****************1、FX项目所在文件夹
//			currentPath: 'FX/main',//****************1、FX项目所在文件夹
//			currentPath: 'FX/special/referral201701',//****************1、FX项目所在文件夹
//			currentPath: 'FX/special/Trump',//****************1、FX项目所在文件夹
//			currentPath: 'PM/promote/lp164',//****************1、PM项目所在文件夹
//			currentPath: 'PM/special/2016report',//****************1、PM项目所在文件夹
//			currentPath: 'PM/activity/silver201701',//****************1、PM项目所在文件夹
//			currentPath: 'PM-M/yy_live/V2',//****************1、PM-M项目所在文件夹
			jsPath: 'js',
			cssPath: 'css',
			lessPath:'less',
			examplePath: 'html'
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: false,
				eqnull: true,
				browser: true,
				globals: {
					jQuery: true
				},
			},
			docs: {
				src: ['Gruntfile.js','<%= meta.examplePath %>/<%= meta.currentPath %>/*.js']
			}
		},
		uglify: {
			options: {
				compress: {
					warnings: false
				},
				mangle: true,
				preserveComments: 'some'
			},
			core: {
				files: [{
					expand: true, // 设置为true，表示要支持cwd等更多配置
					cwd: '<%= meta.examplePath %>/<%= meta.currentPath %>/js',
					src: ['*.js', '!j*.js', '!*.min.js'], //所有js文件除j开头和压缩版min
					dest: '<%= meta.examplePath %>/<%= meta.currentPath %>/js', //输出到此目录下
					ext: '.min.js'
				}],
			},
		},
		csslint: {
			docs: {
				options: {
					ids: false,
					'overqualified-elements': false
				},
				src: '<%= meta.cssPath %>/<%= meta.currentPath %>/**/*.css'
			}
		},
		cssmin: {
			options: {
				compatibility: 'ie8',
				keepSpecialComments: '*',
				advanced: false
			},
			core: {
				files: [{
					expand: true, 
					cwd: '<%= meta.examplePath %>/<%= meta.currentPath %>/css',
      				src: ['*.css', '!*.min.css'],
					dest: '<%= meta.examplePath %>/<%= meta.currentPath %>/css',
      				ext: '.min.css'
				}],
			}
		},
        less: {
            build: {
                options: {
                    strictMath: true,
                    compress: false
                },
                files: [{
                    expand: true, // 设置为true，表示要支持cwd等更多配置
                    cwd: '<%= meta.lessPath %>/<%= meta.currentPath %>/css', //less目录下   //****************2、设置项目对应的less文件
                    src: '*.less', //less文件           //****************3、所有less文件或者指定的less文件
                    dest: '<%= meta.examplePath %>/<%= meta.currentPath %>/css',    
                    ext: '.css'//4、输出到此目录下指定文件        
                }]
////			    files: {
////			      '<%= meta.examplePath %>/<%= meta.currentPath %>/css/nzaccount.css': '<%= meta.lessPath %>/<%= meta.currentPath %>/index.less'
////			    }
//			    files: {
//			      '<%= meta.examplePath %>/<%= meta.currentPath %>/css/ukaccount.css': '<%= meta.lessPath %>/<%= meta.currentPath %>/ukaccount.less'
//			    }
            },
//          oneless: { //指定一个文件压缩
//              options: {
//                  strictMath: true, //如果设置为true，表达式需要用括号括起来
//                  compress: false //压缩编译之后的css文件，即删除css文件中的空行和空格
//              },
//			    files: {
//			      '<%= meta.examplePath %>/<%= meta.currentPath %>/css/heatmap.css': '<%= meta.lessPath %>/<%= meta.currentPath %>/css.less'
//			    }
//          }
        },
		sprite: {
			options: {
				// sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
				imagepath: '<%= meta.examplePath %>/<%= meta.currentPath %>/images/slice/',
				// 映射CSS中背景路径，支持函数和数组，默认为 null
				imagepath_map: null,
				// 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
				spritedest: '<%= meta.examplePath %>/<%= meta.currentPath %>/images/',
				// 替换后的背景路径，默认为 file.dest 和 spritedest 的相对路径
				spritepath: null,
				// 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
				padding: 10,
				// 是否使用 image-set 作为2x图片实现，默认不使用
				useimageset: false,
				// 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
				newsprite: false,
				// 给雪碧图追加时间戳，默认不追加
				spritestamp: true,
				// 在CSS文件末尾追加时间戳，默认不追加
				cssstamp: true,
				// 默认使用二叉树最优排列算法
				algorithm: 'top-down',
				// 默认使用`pixelsmith`图像处理引擎
				engine: 'pixelsmith'
			},
			autoSprite: {
				files: [{
					// 启用动态扩展
					expand: true,
					// css文件源的文件夹
					cwd: '<%= meta.examplePath %>/<%= meta.currentPath %>/css/',
					// 匹配规则
					src: '*.css',
					// 导出css和sprite的路径地址
					dest: '<%= meta.examplePath %>/<%= meta.currentPath %>/css/',
					// 导出的css名
					ext: '.sprite.css'
				}]
			}
		},
		watch: {
			options: {
				dateFormat: function(time) {
					grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
					grunt.log.writeln('Waiting for more changes...');
				},
				livereload: true
			},
			docs: {
				files: [
					'<%= meta.imgPath %>/<%= meta.currentPath %>/*.{png,jpg,gif}',
					'<%= meta.lessPath %>/**/*.less',
					'<%= meta.examplePath %>/<%= meta.currentPath %>/*.css',
					'<%= meta.jsPath %>/<%= meta.currentPath %>/*.js'
				],
				tasks: ['lesscss','min-css']
			}
		}

	});
	

	grunt.registerTask('ug-js', ['uglify:core']);
	grunt.registerTask('hint-docs-js', ['jshint:docs']);
	grunt.registerTask('lint-docs-css', ['csslint:docs']);
	grunt.registerTask('min-css', ['cssmin:core']);
	grunt.registerTask('lesscss', ['less']);
	grunt.registerTask('docs', ['lint-docs-css',/*'ug-js','hint-docs-js','clean:dist', 'copy:docs','imagemin:docs',,'sprite'*/'lesscss','min-css']);


	grunt.registerTask('server', ['docs','watch']);


	grunt.event.on('watch', function(action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});
};