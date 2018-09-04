function readFullDirectory(path){
  var mirror = {
    name : ''
  }
  var f = Folder(path);
  var allFiles = f.getFiles();
  var thisFile;
  for (var i = 0; i < allFiles.length; i++) {
    var name = this;
    thisFile = allFiles[i];
    if (thisFile instanceof Folder) {
      mirror[thisFile.name] = readFullDirectory(thisFile);
    } else {
      mirror[thisFile.name] = thisFile;
    }
  }
  return JSON.stringify(mirror);
}

function alertPath(str) {
  // alert(str);
}


function createTree(path){
  var mirror = {}
  var f = Folder(path);
  var allFiles = f.getFiles();
  var thisFile;
  for (var i = 0; i < allFiles.length; i++) {
    thisFile = allFiles[i];
    if (thisFile instanceof Folder) {
      mirror.name = thisFile;
      // mirror.children.push(createTree(thisFile));
    } else {
      mirror['name'] = thisFile.name;
    }
  }
  return JSON.stringify(mirror);
}
