var Fontmin = require('fontmin');
 
var fontmin = new Fontmin()
    .src('./fonts/*.ttf')
    .dest('./.production/fonts/')
	.dest('./.create/fonts/');
 
fontmin.run(function (err, files) {
    if (err) {
        throw err;
    } 
    console.log(files[0]);
});