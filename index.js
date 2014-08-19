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

module.exports.createQR = function (text, callback){

    var bw = new BWIPJS;
    var rot = 'N';
    var opts= {};
    opts.inkspread = bw.value(0);
    opts.alttext = bw.value(text);
    opts.includetext = bw.value(true);

    bw.bitmap(new Bitmap);
    bw.scale(1, 1);
    bw.push(text);
    bw.push(opts);
    bw.call("qrcode");
    var png = bw.bitmap().getPNG(rot);
    callback(png);
}

module.exports.createBarcode = function (text, callback){

    var bw = new BWIPJS;
    var rot = 'N';
    var opts= {};
    opts.inkspread = bw.value(0);
    opts.alttext = bw.value(text);
    opts.includetext = bw.value(true);

    bw.bitmap(new Bitmap);
    bw.scale(1, 1);
    bw.push(text);
    bw.push(opts);
    bw.call("interleaved2of5");
    var png = bw.bitmap().getPNG(rot);
    callback(png);

}