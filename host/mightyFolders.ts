// thanks @SillyV
function thisDoc() {
  return app.activeDocument.fullName;
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
