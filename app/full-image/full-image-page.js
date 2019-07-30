var frameModule = require("tns-core-modules/ui/frame");
var cameraModel;
var orientation = require('nativescript-orientation');
orientation.disableRotation();

exports.navigatingTo = function (args) {
  args.object.bindingContext = args.context;
  cameraModel = args.context.cameraModel;
};
exports.navigatingFrom = function (args) {
  cameraModel.storeData();
}
exports.onNavBtnTap = function (args) {
  var topmost = frameModule.topmost();
  topmost.goBack();
};
exports.deletePicture = function (args) {
  cameraModel.deletePicture(args);
  exports.onNavBtnTap();
};