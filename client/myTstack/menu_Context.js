var csInterface = new CSInterface();

var menu_ContextXML = '<Menu> \
   <MenuItem Id="refresh" Label="Refresh panel" Enabled="true" Checked="false"/> \
   <MenuItem Id="read" Label="Checkbox" Enabled="true" Checkable="true" Checked="false"/> \
  </Menu>';

csInterface.setContextMenu(menu_ContextXML, setContextMenuCallback);

function setContextMenuCallback(event) {
  if (event == "refresh") {
    location.reload();
  } else if (event === 'read') {

  csInterface.evalScript(`readDir()`, function(e) {
    console.log(e + ' returning');
  })

  } else {
    console.log(event);
  }
}
