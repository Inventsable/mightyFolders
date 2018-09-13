// thanks @SillyV
function thisDoc() {
  return app.activeDocument.fullName;
}

function createDirectoryTree(path){
  var f = Folder(path);
  return getChildNodes(f);
}

function getChildNodes(fsNode){
  if(fsNode instanceof Folder){
  	var children = [];
	var allFiles = fsNode.getFiles();
	for (var i = 0; i < allFiles.length; i++) {
    // add custom ignore
    if ((allFiles[i].name !== ".git") || (allFiles[i].name !== "node_modules"))
	   children.push(getChildNodes(allFiles[i]));
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
