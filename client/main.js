// var sysPath = csInterface.getSystemPath(SystemPath.EXTENSION);
loadUniversalJSXLibraries()
loadJSX('mightyFolders.jsx')
window.onload = build;

var testPath = 'C:/Users/PortablePawnShop/Documents/GitMaster/Templates/Adobe-Panels/_master/samp';
function build(){
  // csInterface.evalScript(`readFullDirectory('${testPath}')`, function(mirror){
    // csInterface.evalScript(`alertPath('${sysPath}')`)
  csInterface.evalScript(`createTree('${testPath}')`, function(mirror){
    var soil = parseAll(mirror);
    console.log(soil);
  });
}

function parseAll(str){
  var result = JSON.parse(str);
  for (let [key, value] of Object.entries(result)) {
    if (typeof value !== 'object')
      result[key] = parseAll(value);
    else
      result[key] = key;
  }
  return result;
}


var data = {
  name: 'root folder',
  children: [
    { name: 'readme.md' },
    { name: 'text.txt' },
    {
      name: 'child folder',
      children: [
        {
          name: 'child folder',
          children: [
            { name: 'text.txt' },
            { name: 'text.txt' }
          ]
        },
        {
          name: 'child folder',
          children: [
            { name: 'text.txt' },
            { name: 'text.txt' }
          ]
        },
        { name: 'text.txt' },
        { name: 'text.txt' },
      ]
    }
  ]
}

console.log(data);

Vue.component('branch', {
  template: `
  <li>
    <div
      :class="highlight ? 'branch-active' : 'branch-idle'"
      @click="toggle"
      @mouseover="highlightThis(true)"
      @mouseout="highlightThis(false)">
      <div :class="open ? 'branch-angleDown' : 'branch-angleRight'">
        <span v-if="isFolder" :class="open ? 'adobe-icon-angleDown' : 'adobe-icon-angleRight'"></span>
        <span v-if="!isFolder" class="angleNull"></span>
      </div>
      <div class="branch-type">
        <span :class="isFolder ? 'adobe-icon-folder' : 'adobe-icon-file'"></span>
      </div>
      <span class="branch-name">{{ model.name }}</span>
    </div>

    <ul class="childBranch" v-show="open" v-if="isFolder">
      <branch
        class="branch"
        v-for="(model, index) in model.children"
        :key="index"
        :model="model">
      </branch>
    </ul>
  </li>
  `,
  props: {
    model: Object
  },
  data: function () {
    return {
      open: false,
      highlight: false,
    }
  },
  computed: {
    isFolder: function () {
      return this.model.children &&
        this.model.children.length;
    }
  },
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.open = !this.open;
      }
    },
    highlightThis: function(state) {
      if (state) {
        this.highlight = true;
      } else {
        this.highlight = false;
      }
    }
    // changeType: function () {
    //   if (!this.isFolder) {
    //     Vue.set(this.model, 'children', [])
    //     this.addChild()
    //     this.open = true
    //   }
    // },
    // addChild: function () {
    //   this.model.children.push({
    //     name: 'new stuff'
    //   })
    // }
  }
})

// boot up the app
var app = new Vue({
  el: '#app',
  data: {
    treeData: data
  }
})
