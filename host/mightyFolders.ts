var doc = app.activeDocument;
var exist = app.documents.length > 0;

// thanks @SillyV
function thisDoc() {
  return doc.fullName;
}

function saveDoc(dest) {
  if (exist) {
    var aiDoc = new File(dest);
    var saveOptions = new IllustratorSaveOptions();
    if (arguments.length < 2)
      doc.saveAs(aiDoc, saveOptions);
    else if (arguments[1] == 'selection')
      doc.exportSelectionAsAi(aiDoc, saveOptions)
  }
}

function createDirectoryTree(path){
  var f = Folder(path);
  return getChildNodes(f);
}

function getChildNodes(fsNode) {
  var ignores = [".git", "node_modules"];
  if (fsNode instanceof Folder) {
  	var children = [];
	var allFiles = fsNode.getFiles();
	for (var i = 0; i < allFiles.length; i++) {
    // add custom ignore
    for (var a = 0; a < ignores.length; a++) {

    }
    if (allFiles[i].name !== ".git") {
      if (allFiles[i].name !== "node_modules")
        children.push(getChildNodes(allFiles[i]));
    }
	}
  	return {
      name : decodeURI(fsNode.name) + "/",
  	  children : children
  	};
  } else {
  	return {
      name : decodeURI(fsNode.name)
  	};
  }
}

function callTree(path) {
  var allNodes = createDirectoryTree(path);
  var allNodesInJson = JSON.stringify(allNodes, null, 2);
  return allNodesInJson;
}
