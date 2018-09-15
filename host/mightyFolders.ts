var doc = app.activeDocument;
var exist = app.documents.length > 0;
var hasSelection = app.selection.length > 0;

// File menu generation
// thanks @SillyV
//
  function createDirectoryTree(path) {
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

  function writeConfig(path, text) {

    var JSONfile = new File(path + '/MFconfig.json');
    JSONfile.open('w')
    JSONfile.write(text);
    JSONfile.close();
  }

  function callTree(path) {
    // console.log('Creating tree');
    var allNodes = createDirectoryTree(path);
    var allNodesInJson = JSON.stringify(allNodes, null, 2);
    // console.log(path);
    // console.log(allNodes);
    // console.log(allNodesInJson);
    writeConfig(path, allNodesInJson)
    return allNodesInJson;
  }

//        Quick actions
//
//
  function thisDoc() {
    return doc.fullName;
  }

  function saveDoc(dest) {
    if (exist) {
      var aiDoc = new File(dest);
      var saveOptions = new IllustratorSaveOptions();
      if (hasSelection)
        doc.exportSelectionAsAi(aiDoc);
      else
        doc.saveAs(aiDoc, saveOptions);
    }
  }

  function openDoc(dest) {
    var thisFile = File(path);
    app.open(thisFile);
  }

  function setOptionsForSVGExport(){
    var options = new ExportOptionsWebOptimizedSVG();
    options.artboardRange = 1;
    options.coordinatePrecision = 2;
    options.fontType = SVGFontType.OUTLINEFONT;
    options.svgId = SVGIdType.SVGIDREGULAR;
    options.cssProperties = SVGCSSPropertyLocation.STYLEELEMENTS;
    return options;
  }

  function exportSVG(path){
    var thisFile = new File(path);
    var type = ExportType.WOSVG;
    doc.exportFile(thisFile, type, setOptionsForSVGExport());
  }

  function exporter(dest) {
    if (/\.svg$/gm.test(dest)) {
      exportSVG(dest);
    } else if (/\.(png|jpeg|psd|eps|gif|tiff)$/gm.test(dest)) {
      exportAs(dest);
    } else {
      alert('Unsupported file format')
    }
  }

  function setOptionsForPNG24Export(){
    var options = new ExportOptionsWebOptimizedSVG();
    return options;
  }

  function runScript(path) {
    try {
      $.evalFile(path)
    } catch (e) {
      JSXEvent(e.name + "," + e.line + "," + e + "," + e.message, "console")
    }
  }

  function exportAs(path) {
    var thisFile = new File(path);
    if (/\.png$/gm.test(path)) {
      if (hasSelection)
        doc.exportSelectionAsPNG(thisFile)
      else
        doc.exportFile(thisFile, ExportType.PNG24)
    } else if (/\.psd$/gm.test(path)) {
      doc.exportFile(thisFile, ExportType.PHOTOSHOP)
    } else {
      var ext = /\.(\w*)$/gm;
      var result = path.match(ext);
      result = result[0]
      try {
        // doc.exportFile(thisFile, ExportType[result])
        alert('Export as ' + result)
      } catch(e) {alert(e)}
    }
  }
