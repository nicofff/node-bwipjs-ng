var fs  = require('fs');
var Bitmap =  require(__dirname+'/lib/bitmap.js');
var vm  = require('vm');


function load(path) {
    var rootPath = __dirname + "/" + path;
    var text = fs.readFileSync(rootPath);
    if (!text)
        var bwippPath = __dirname + "/bwipp/" + path;
    var text = fs.readFileSync(rootPath);
    if (!text)
        throw new Error(path + ": could not read file");

    console.log('loading: ' + path);
    vm.runInThisContext(text, path);
}

// Load the primary bwip-js script
load('bwip.js');


// Set the hook for demand-loading the remaining bwip-js files
BWIPJS.load = load;

module.exports.createBarcode = function (data, callback){

    /*data = {
     text : 'asd',
     type : 'interleaved2of5',
     scale : 2,
     rotate : 'N'
     }*/

    var bw = new BWIPJS;
    var rot = data.rotate || 'N';

    var opts= {
        inkspread : bw.value(0),
        alttext : bw.value(data.text),
        includetext : bw.value(true)
    };

    bw.bitmap(new Bitmap);
    bw.scale(data.scale, data.scale);
    bw.push(data.text);
    bw.push(opts);
    bw.call(data.type);
    var png = bw.bitmap().getPNG(rot);
    callback(png);

}