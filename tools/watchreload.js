'use strict';

var http = require('http');
var child_process = require('child_process');

var gaze = require('gaze');
var tinylr = require('tiny-lr');

var srcFiles = [
    ['src', '/**/*']
];
var dstFiles = [
    ['build', '/**/*'],
    ['test', '/*.html']
];

function log(msg) {
    var now = new Date();
    now = now.toString().match(/\d\d:\d\d:\d\d/)[0];
    process.stdout.write('>>> [' + now + '] ' + msg + '\n');
}

function make() {
    try {
        var cmd = 'make';
        log('running ' + cmd);
        cmd += ' -C ' + __dirname + '/../';
        child_process.execSync(cmd);
    } catch(e) {
        log(e);
    }
}

function reload(file) {
    http.get('http://localhost:35729/changed?files=' + file)
        .on('error', function(e) {
            log('reload error: ' + e.message);
        });
}

function watchRun(patterns, fn) {
    patterns.forEach(function(args) {
        var path = args[0];
        var pattern = __dirname + '/../' + path + args[1];
        gaze(pattern, function() {
            this.on('all', function(event, file) {
                var re = new RegExp('.*' + path + '/');
                file = file.replace(re, '');
                log('file "' + path + '/' + file + '" was ' + event);
                fn(file);
            });
        });
    });
}

tinylr().listen(35729);
watchRun(srcFiles, make);
watchRun(dstFiles, reload);
