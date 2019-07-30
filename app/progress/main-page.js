const cameraModule = require("nativescript-camera");
const Observable = require("tns-core-modules/data/observable").Observable;
const ObservableArray = require("data/observable-array").ObservableArray;
const fromObject = require("tns-core-modules/data/observable").fromObject;
const topmost = require("tns-core-modules/ui/frame").topmost;
var orientation = require('nativescript-orientation');
var statsService = require("~/services/stats-service");
const applicationSettings = require("application-settings");
const fsModule = require("tns-core-modules/file-system");
const imageSourceModule = require("tns-core-modules/image-source");
const utilsModule = require("utils/utils");
var bghttpModule = require("nativescript-background-http");
var session = bghttpModule.session("image-upload");
var initFlag = 0;

var currentPage;
var cameraModel = new PhotoGalleryComponent();
orientation.disableRotation();

function PhotoGalleryComponent() {
  var PhotoGalleryObj = new Observable();
  PhotoGalleryObj.arrayPictures = new ObservableArray();

  PhotoGalleryObj.takePicture = function () {
    cameraModule
      .takePicture({
        keepAspectRatio: true,
        saveToGallery: true
      })
      .then(picture => {
        imageSourceModule.fromAsset(picture).then(
          savedImage => {
            let filename = "image" + "-" + new Date().getTime() + ".png";
            let folder = fsModule.knownFolders.documents();
            let path = fsModule.path.join(folder.path, filename);
            savedImage.saveToFile(path, "png");
            var loadedImage = imageSourceModule.fromFile(path);
            loadedImage.filename = filename;
            var ts = new Date();
            var timeNow = ts.toLocaleString();
            loadedImage.note = timeNow.substring(0, timeNow.length - 15);
            this.arrayPictures.unshift(loadedImage);

            //store image in database
            var request = {
              url: "https://joshkraken.com/sqlconnect/uploadPic.php",
              method: "POST",
              headers: {
                "Content-Type": "application/octet-stream"
              },
              description: "{ 'uploading': " + filename + " }",
              androidDisplayNotificationProgress: "false",
              androidNotificationTitle: "Progress picture uploaded"
            };
            var params = [{
                name: "lastName",
                value: applicationSettings.getString("lastName").toLowerCase()
              },
              {
                name: "firstName",
                value: applicationSettings.getString("firstName").toLowerCase()
              },
              {
                name: "id",
                value: applicationSettings.getString("id")
              },
              {
                name: "note",
                value: loadedImage.note
              },
              {
                name: "fileToUpload",
                filename: path,
                mimeType: "image/png"
              }
            ];
            var task = session.multipartUpload(params, request);
            // task.on("progress", logEvent);
            // task.on("error", logEvent);
            // task.on("complete", logEvent);

            // // only for logging image upload
            // function logEvent(e) {
            //   console.log("----------------");
            //   console.log('Status: ' + e.eventName);
            //   if (e.totalBytes !== undefined) {
            //     console.log('current bytes transfered: ' + e.currentBytes);
            //     console.log('Total bytes to transfer: ' + e.totalBytes);
            //   }
            // }

            this.storeData();
            if (currentPage.android) {
              let tmpfolder = fsModule.Folder.fromPath(
                utilsModule.ad
                .getApplicationContext()
                .getExternalFilesDir(null)
                .getAbsolutePath()
              );
              tmpfolder.getEntities().then(
                function (entities) {
                  entities.forEach(function (entity) {
                    if (entity.name.substr(0, 5) == "NSIMG") {
                      var tmpfile = tmpfolder.getFile(entity.name);
                      tmpfile.remove();
                    }
                  });
                },
                function (error) {
                  console.log(error.message);
                }
              );
              utilsModule.GC(); //trigger garbage collection for android
            }
          },
          err => {
            console.log("Failed to load from asset");
          }
        );
      });
  };

  PhotoGalleryObj.deletePicture = function (args) {
    const documents = fsModule.knownFolders.documents();
    let parentobj = args.object.parent.parent;
    let imgobj = parentobj.getViewById("fullImage");
    const filename = imgobj.src.filename;
    var file = documents.getFile(filename);
    file.remove();
    let pictureIndex = this.arrayPictures.indexOf(imgobj.src);
    this.arrayPictures.splice(pictureIndex, 1);
    this.storeData();
  };

  PhotoGalleryObj.storeData = function () {
    let localArr = [];
    for (var i = 0; i < this.arrayPictures.length; i++) {
      let entry = this.arrayPictures.getItem(i);
      localArr.push({
        note: entry.note,
        filename: entry.filename
      });
    }
    applicationSettings.setString("localdata", JSON.stringify(localArr));
    if (this.arrayPictures.length) {
      var loadedImage = this.arrayPictures.shift();
      this.arrayPictures.unshift(loadedImage);
    }
  };

  PhotoGalleryObj.loadData = function (args) {
    statsService.getPhotos()  
      .then(function (data) {
        args.busy = false;
        for (var i = 0; i < data.length; i++) {
          var row = JSON.parse(data[i]);
          var loadedImage = imageSourceModule.fromBase64(row.img);
          loadedImage.note = row.note;
          loadedImage.filename = row.filename;
          PhotoGalleryObj.arrayPictures.unshift(loadedImage);
        }
      })
  };  
  return PhotoGalleryObj;
}

exports.tapPicture = function (eventData) {
  var imgObj = eventData.object;
  navContextObj = {
    srcPicture: imgObj.src,
    cameraModel: cameraModel
  };
  topmost().navigate({
    moduleName: "full-image/full-image-page",
    context: navContextObj,
    animated: true,
    transition: {
      name: "slideLeft",
      duration: 80,
      curve: "linear"
    }
  });
};

exports.onNavBtnTap = function () {
  console.log("tapped");
  topmost().navigate({
    moduleName: "home/home-page",
    clearHistory: true
  });
}

function onLoaded(args) {
  args.object.page.bindingContext = fromObject(cameraModel);
  if (initFlag == 0) {
    currentPage = args.object;
    var buttonCamera = currentPage.getViewById("buttonCamera");
    if (cameraModule.isAvailable()) {
      //checks to make sure device has a camera
    } else {
      //ignore this on simulators for now
    }
    cameraModule.requestPermissions().then(
      //request permissions for camera
      success => {
        //have permissions
      },
      failure => {
        //no permissions for camera,disable picture button
        buttonCamera.isEnabled = false;
      }
    );
    var indicator = currentPage.getViewById("actv");
    indicator.busy = true;
    cameraModel.loadData(currentPage.getViewById("actv"));
    initFlag = 1;
  }
}
exports.onLoaded = onLoaded;