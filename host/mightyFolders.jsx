// thanks @SillyV
function createDirectoryTree(path){
  var f = Folder(path);
  return getChildNodes(f);
}

function testerJSX(str) {
  return 'Goodbye';
}

function getChildNodes(fsNode){
  if(fsNode instanceof Folder){
  	var children = [];
	var allFiles = fsNode.getFiles();
	for (var i = 0; i < allFiles.length; i++) {
	  children.push(getChildNodes(allFiles[i]));
	}
  	return {
      name : decodeURI(fsNode.name),
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
