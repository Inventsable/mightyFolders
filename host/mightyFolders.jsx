// thanks @SillyV

function createDirectoryTree(path){
  var f = Folder(path);
  return getChildNodes(f);
}

function testJSX() {
  return 'JSX successful';
}

function getChildNodes(fsNode){
  if(fsNode instanceof Folder){
  	var children = [];
	var allFiles = fsNode.getFiles();
	for (var i = 0; i < allFiles.length; i++) {
    // add custom ignore
    if (allFiles[i].name !== ".git")
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
