Vue.config.devtools = false;
Vue.config.productionTip = false;
console.log('Loading mightyFolders...');
loadUniversalJSXLibraries()
loadJSX('mightyFolders.jsx')

window.Event = new class {
  constructor() {
    this.vue = new Vue()
  }
  fire(event, data = null) {
    this.vue.$emit(event, data);
  }
  listen(event, callback) {
    this.vue.$on(event, callback);
  }
}

Vue.component('background', {
  template: `
    <div class="background"></div>
  `,
})

Vue.component('branch', {
  template: `
  <li>
    <div
      class="collapseCol"
      @click="collapseThis"
      @mouseover="highlightCollapse">
    </div>
    <div :class="(hasFocus) ? 'focus' : 'noFocus'">
      <div
        :class="(highlight) ? styleHigh : styleHighFocus"
        @click="toggle"
        @mouseover="ifLocked ? nulli : highlightThis(true)"
        @mouseout="ifLocked ? nulli : highlightThis(false)">
        <div :class="open ? 'branch-angleDown' : 'branch-angleRight'">
          <span v-if="isFolder" :class="open ? 'adobe-icon-angleDown' : 'adobe-icon-angleRight'"></span>
          <span v-if="!isFolder" class="angleNull"></span>
        </div>
        <div class="branch-type">
          <span :class="isFolder ? 'adobe-icon-folder' : 'adobe-icon-file'"></span>
        </div>
        <span class="branch-name">{{ nameType }}</span>
      </div>
      <ul class="childBranch" v-show="open" v-if="isFolder">
        <div class="limitMar">
          <div :class="open ? 'marMax' : 'marMin'"
          v-if="!ifLocked"
          @click="toggle"
          @mouseover="highlightThis(true)"
          @mouseout="highlightThis(false)"></div>
          <branch
            class="branch"
            v-for="(model, index) in model.children"
            :key="index"
            :model="model">
          </branch>
        </div>
      </ul>
    </div>
  </li>
  `,
  props: {
    model: Object
  },
  data: function () {
    return {
      open: false,
      highlight: false,
      hasFocus: '',
      geneRoot: '',
      geneList: [],
    }
  },
  created: function() {
    if(this.model.children &&
        this.model.children.length){
      this.model.children.sort(function(a,b){
         return !(a.children && a.children.length);
      });
    }
  },
  computed: {
    nameType: function() {
      var name = '';
      if (this.isFolder) {
        name = trimR(this.model.name, 1);
      } else {
        name = this.model.name;
      }
      return name;
    },
    ifLocked: function() {
      if (!this.$root.isLocked) {
        return false;
      } else {
        return true;
      }
    },
    styleHighFocus: function() {
      var foci = (this.hasFocus) ? 'branch-active' : 'branch-idle';
      var sele = (this.highlight) ? 'branch-parentHighlight' : 'branch-parentDef';
      // console.log(foci + " " + sele);
      return foci + " " + sele
    },
    styleHigh: function() {
      var foci = (this.hasFocus) ? 'branch-active' : 'branch-idle';
      var sele = 'branch-parentHighlight';
      // console.log(foci + " " + sele);
      return foci + " " + sele
    },
    isFolder: function (){
      return this.model.children &&
        this.model.children.length;
    },
    geneology: function() {
      var result = '';
      for (var i = 0; i < this.geneList.length; i++) {
        var target = this.geneList[i];
        if (i > 0) {
          if (i == this.geneList.length - 1) {
            result += target
          } else {
            result += target
          }
        } else {
          result += './'
        }
      }
      this.geneList = [];
      return result;
    },
  },
  methods: {
    getAncestry: function(parent) {
        if (parent.$children.length) {
          for (var i = 0; i < parent.$children.length; i++) {
            if (parent.$children[i] !== this.geneRoot) {
              if (parent.$children[i].$children.length)
                this.getAncestry(parent.$children[i])
            } else {
              this.familyTree = [];
              this.traceAncestry(this.geneRoot)
            }
          };
        }
    },
    traceAncestry: function(gene) {
      this.geneList.unshift(gene.model.name)
      if (gene.$parent !== gene.$root) {
        this.traceAncestry(gene.$parent)
      }
    },
    nulli: function() {
      // console.log('nothing happens');
    },
    locked: function(e) {
      console.log('This is locked, no pass through');
    },
    toggle: function(e) {
      if (!this.$root.isLocked) {
        this.setFocus(e);
        this.geneRoot = this;
        this.getAncestry(this.$root)
        // console.log(this.geneology);
        var selectedPath = this.$root.masterPath + trimL(this.geneology, 1)
        if (/\/$/gm.test(selectedPath))
          selectedPath = trimR(selectedPath, 1);
        this.$root.selectedPath = selectedPath;
        // console.log(this.$root.selectedPath);
        this.$root.masterText = this.geneology;
        if (this.isFolder) {
          this.open = !this.open;
        }
        // console.log('Not locked');
      } else {
        // console.log('Locked');
      }
    },
    highlightThis: function(state) {
      if (state) {
        this.highlight = true;
      } else {
        this.highlight = false;
      }
    },
    highlightCollapse: function() {

    },
    setFocus : function(e) {
      if (!this.hasFocus) {
        this.clearFocus(this.$root);
        this.hasFocus = true;
        this.$root.selected = e.currentTarget;
      }
    },
    clearFocus: function(parent) {
        if (parent.$children.length) {
          for (var i = 0; i < parent.$children.length; i++) {
            var targ = parent.$children[i];
            targ.hasFocus = false;
            this.clearFocus(targ);
          };
        }
    },
    collapseThis: function(e) {
      console.log(e);
    },
  },
})


Vue.component('treetools', {
  props: ['path'],
  template: `
  <div class="treeTools">
    <lift path="path"></lift>
    <lock path="path"></lock>
  </div>
  `
})

Vue.component('lock', {
  props: ['path'],
  template: `
  <div class="lockwrap"
    @click="checker"
    @mouseover="highlight = true"
    @mouseout="highlight = false">
    <div :class="(this.$root.isLocked) ? 'lockbtn-on' : 'lockbtn'">
      <span class="adobe-icon-lock"></span>
    </div>
  </div>
  `,
  data() {
    return {
      highlight: false,
    }
  },
  methods: {
    checker: function(e) {
      this.$root.isLocked = !this.$root.isLocked
    }
  }
})

Vue.component('lift', {
  props: ['path'],
  template: `
    <div :class="LockandHigh"
      @click="gotoParent"
      @mouseover="highlight = true"
      @mouseout="highlight = false">
      <div :class="highlight ? 'liftHov' : 'liftbtn'">
        <span class="adobe-icon-angleUp"></span>
      </div>
    </div>
  `,
  data() {
    return {
      highlight: false
    }
  },
  computed: {
    ifLocked: function() {
      if (!this.$root.isLocked) {
        return false;
      } else {
        return true;
      }
    },
    LockandHigh: function() {
      var res = '';
      if (!this.ifLocked) {
        res = 'liftwrap'
        if (this.highlight) {
          res += ' liftHovwrap'
        }
      } else {
        res = 'liftwrap liftLock'
        console.log('locked...');
      }
      return res
    }
  },
  methods: {
    gotoParent: function() {
      Event.fire('toParent');
    }
  }
});

Vue.component('selector', {
  props: ['value'],
  template: `
    <div class="selectContainer">
      <div class="selectAnno">
        <div class="annoBox">
          {{ anno }}
        </div>
      </div>
      <div class="selectLine">
        <div class="selectPrefix">
          <div :class="(this.toggle.isSelect) ? 'xtag-select-active' : 'xtag-select-idle'" @click="setActive('select')">
            <span class="adobe-icon-cursor"></span>
          </div>
          <div :class="(this.toggle.isFind) ? 'xtag-find-active' : 'xtag-find-idle'" @click="setActive('find')">
            <span class="adobe-icon-find"></span>
          </div>
          <div id="selectorInput" :class="inputClass" contenteditable="contenteditable" @input="updateInput">
            <div class="editable">{{ mixin }}</div>
          </div>
          <div v-if="suffix" class="editSuffix">
            <span :class="checkExist"></span>
          </div>
        </div>
        <div class="selectSuffix">
          <div
            :class="open.style"
            @click="quickOpen()">
            <span :class="open.icon"></span>
          </div>
          <div
            :class="save.style"
            @click="quickSave()">
            <span :class="save.icon"></span>
          </div>
        </div>
      </div>
    </div>

  `,
  // <span class="code">./</span>
  // <input :class="(toggle.isActive) ? 'select-input-active' : 'select-input-idle'" type="text" v-model="msg">

  data() {
    return {
      content: '',
      toggleList : ['isActive', 'isSelect', 'isFind'],
      targEl: this.$el,
      toggle : {
        isActive: false,
        isSelect: false,
        isFind: false,
      },
      highlight: false,
      doesExist: false,
      fullText: '',
      suffix: false,
      // title: '',
    }
  },
  computed: {
    anno: function() {
      var desc = 'no action';
      if (this.canQuicksave)
        desc = 'quicksave'
      if (this.canLoad)
        desc = 'quickload'
      if (this.canExport)
        desc = 'export'
      if (this.canImport)
        desc = 'import'
      // if (this.newFolder)
      //   desc = 'new'
      return desc;
    },
    // checkExist: function() {
    //   var style = '';
    //   if (this.doesExist)
    //     style = 'adobe-icon-checkBoxOn'
    //   else
    //     style = 'adobe-icon-checkBoxOff'
    //   return style;
    // },
    inputClass: function() {
      var res = '';
      if (this.toggle.isActive)
        res += 'select-input-active'
      else
        res += 'select-input-idle'
      if (this.doesExist) {
        res += ' inputExist'
      } else {
        if (this.fullText == './') {
          res += ' inputExist'
        } else {
          res += ' inputNew'
        }
      }
      return res;
    },
    mixin: function() {
      return this.content || this.$root.masterText;
    },
    input: function() {
      var selectorInput = document.getElementById('selectorInput');
      try {
        var innerText = selectorInput.innerText
        // console.log(innerText.trim());
        return innerText.trim();
      } catch(e) {return ''};
    },
    open: function() {
      var mirror = {};
      if (this.canLoad) {
        mirror.icon = 'adobe-icon-open';
        mirror.style = 'xtag-load xtag-lit';
      } else if (this.canImport) {
        mirror.icon = 'adobe-icon-import';
        mirror.style = 'xtag-load xtag-lit';
      } else {
        mirror.icon = 'adobe-icon-close';
        mirror.style = 'xtag-load xtag-dark';
      }
      return mirror;
    },
    // fileType: function() {
    //   var res = false;
    //   var targ = this.$root.masterText;
    //   if (this.isFile(targ)) {
    //     if (/\.(ai|psd|pdf|svg|dxf)/gm.test(targ)) {
    //       res = 'adobe';
    //       // console.log('Can load this file');
    //     } else if (/\.(png|pdf|)/gm.test(targ)) {
    //       res = 'image';
    //     } else {
    //       res = 'unknown'
    //     }
    //   }
    //   return res;
    // },
    save: function() {
      var mirror = {};
      if (this.canQuicksave) {
        mirror.icon = 'adobe-icon-saveNew';
        mirror.style = 'xtag-save xtag-lit';
      } else if (this.canExport) {
        mirror.icon = 'adobe-icon-export';
        mirror.style = 'xtag-save xtag-lit';
      } else {
        mirror.icon = 'adobe-icon-close';
        mirror.style = 'xtag-save xtag-dark';
      }
      return mirror;
    },
    canLoad: function() {
      var res = false;
      var targ = this.fullText;
      if (this.isFile(targ)) {
        if (/\.(ai|psd|pdf)/gm.test(targ)) {
          if (this.withinFiles(targ.substr(targ.lastIndexOf('/') + 1))) {
            res = true
          }
        }
      }
      return res;
    },
    canQuicksave: function() {
      var res = false;
      var targ = this.fullText;
      if (this.isFile(targ)) {
        if (/\.(ai|pdf|png|jpg)/gm.test(targ)) {
          if (!this.withinFiles(targ.substr(targ.lastIndexOf('/') + 1))) {
            res = true
          }
        }
      }
      return res;
    },
    // newFolder: function() {
    //   var res = false;
    //   if (this.fullText.substr(this.fullText.length - 1) == '/') {
    //     var splitter = root.split('/')
    //     splitter.pop();
    //     while (splitter.length > 1)
    //       splitter.shift();
    //     var splitResult = splitter[0] + '/';
    //     if (!this.withinFolders(splitResult)) {
    //       console.log('This should be a folder');
    //       res = true;
    //     }
    //   }
    // },
    canImport: function() {
      var res = false;
      var targ = this.fullText;
      if (this.isFile(targ)) {
        if (/\.(png|jpg|svg|dxf)/gm.test(targ)) {
          if (this.withinFiles(targ.substr(targ.lastIndexOf('/') + 1))) {
            res = true
          }
        }
      }
      return res;
    },
    canExport: function() {
      var res = false;
      var targ = this.fullText;
      if (this.isFile(targ)) {
        if (/\.(svg|dxf)/gm.test(targ)) {
          if (!this.withinFiles(targ.substr(targ.lastIndexOf('/') + 1))) {
            res = true
          }
        }
      }
      return res;
    },
    canSave: function() {
      var res = false;
      var targ = this.title;
      if (this.isFolder(targ)) {
        if (/\.ai/gm.test(this.content)) {
          res = true
          console.log('Can quicksave');
        }
      }
      return res;
    },
    repoList: function() {
      var reflect = [];
      reflect = this.repoCollect(this.$root.treeData);
      return reflect;
    },
    fileList: function() {
      var list = this.repoList[1];
      var mirr = [];
      list.forEach(function(v,i,a){
        if (/.*\..*/gm.test(v))
          mirr.push(v)
        else if ((v == ".debug") || (v == "LICENSE")) {
          mirr.push(v)
        }
      });
      return mirr;
    },
    folderList: function() {
      var list = this.repoList[1];
      var mirr = [];
      list.forEach(function(v,i,a){
        if (/.*\..*/gm.test(v)){
          // file
        } else {
          if ((v !== ".debug") && (v !== "LICENSE"))
            mirr.push(v)
        }
      });
      return mirr;
    },
    inFolders: function() {
      var result = false;
      this.folderList.forEach(function(v,i,a){
        if (this.title == v) {
          result = true;
        }
      })
      return result;
    },
    inFiles: function() {
      var result = false;
      this.fileList.forEach(function(v,i,a){
        if (this.title == v) {
          result = true;
        }
      })
      return result;
    }
  },
  mounted() {
    this.updateInput();
  },
  updated() {
    this.updateInput();
    this.inputHeal();
    // this.checkFolderSlash();
  },
  methods : {
    inputHeal: function() {
      // console.log(this.fullText);
    },
    // checkFolderSlash: function() {
    //   var root = this.fullText;
    //   if (this.withinFolders(root.substr(root.lastIndexOf('/') + 1))) {
    //     console.log('This is a valid folder');
    //     this.$el.innerText += '/';
    //   }
    // },
    withinFolders: function(data) {
      var result = false;
      this.folderList.forEach(function(v,i,a){
        if (data == v) {
          result = true;
        }
      })
      return result;
    },
    withinFiles: function(data) {
      var result = false;
      this.fileList.forEach(function(v,i,a){
        if (data == v) {
          result = true;
        }
      })
      return result;
    },

    exists: function(data) {
      var result = false;
      for (var i = 0; i < this.fileList.length; i++) {
        if (data == this.fileList[i]) {
          result = true;
        }
        // console.log(this.fileList[i] + " is " + result);
      }
      for (var i = 0; i < this.folderList.length; i++) {
        if (data == this.folderList[i])
          result = true;
        // console.log(this.folderList[i] + " is " + result);
      }
      return result;
    },
    repoCollect: function(parent, ...arrs) {
      if (arrs.length < 1) {
        var fList = [];
        var dList = [];
        var arrs = [fList, dList];
      }
      try {
        if (parent.children.length) {
          for (var i = 0; i < parent.children.length; i++) {
            var targ = parent.children[i];
            this.repoCollect(targ, arrs[0], arrs[1]);
          };
        }
      } catch(e){}
      arrs[1].push(parent.name)
      return arrs;
    },
    setInput: function(e) {
      this.content = e;
    },
    updateInput() {
      var lastText = this.fullText;
      var thisText = this.$el.innerText;
      // thisText = strReplace(thisText, '//', '/')
      var isOpen = false;
      // console.log('start:');
      // console.log(thisText);
      var openFolder = thisText.substr(thisText.lastIndexOf('/') + 1).trim() + '/';
      if (this.withinFolders(openFolder)) {
        // console.log('Within folders');
        isOpen = true;
      }
      if (thisText !== this.fullText) {
        thisText = thisText.trim();
        if (isOpen) {
          // console.log('Open folder detected');
          // console.log(thisText);
        }
        this.fullText = thisText;
        var title = this.getTitle(thisText);
        this.title = title;
        this.doesExist = this.exists(title);
        if (!this.doesExist) {
          // console.log('This does not exist');
          this.title = thisText.substr(thisText.lastIndexOf('/') + 1).trim()
        }
        lastText = thisText;
        console.log(this.title);
        this.$emit('input', this.fullText);
      }
    },
    getTitle: function(data) {
      var root = data;
      var result = '';
      if (root == './') {
        result = this.$root.treeData.name
      } else {
        if (this.withinFiles(root.substr(root.lastIndexOf('/') + 1))) {
          // console.log('This is an existing file');
          result = root.substr(root.lastIndexOf('/') + 1);
        } else if (root.substr(root.length - 1) == '/') {
          // console.log('Trace like a folder');
          var splitter = root.split('/')
          splitter.pop();
          while (splitter.length > 1)
            splitter.shift();
          var splitResult = splitter[0] + '/';
          if (this.withinFolders(splitResult)) {
            // console.log('This is an existing folder');
            result = splitResult;
          }
        }
      }
      // console.log('title result:');
      // console.log(result);
      return result;
    },
    isFolder: function(str) {
      var res;
      if (/.*\/.*\..*/gm.test(str))
        res = false;
      else
        res = true;
      return res;
    },
    isFile: function(str) {
      var res;
      if (/.*\/.*\..*/gm.test(str))
        res = true;
      else
        res = false;
      return res;
    },
    quickSave: function(e) {
      console.log(this.$root.masterText + ' should save');
    },
    quickOpen: function(e) {
      // console.log(this.canLoad);
      // console.log(this.$root.masterText + ' should load');
    },
    quickExport: function(e) {
      console.log(this.$root.masterText + ' should export');
    },
    quickImport: function(e) {
      console.log(this.$root.masterText + ' should import');
    },
    setActive : function(lower) {
      var upper = lower.charAt(0).toUpperCase() + lower.substr(1);
      var lock = '';
      for (var m = 0; m < this.toggleList.length; m++) {
        var select = this.toggleList[m];
        if (select !== 'is' + upper) {
          this.toggle[select] = false;
        } else {
          this.toggle[select] = !this.toggle[select];
          lock = upper;
          if (this.toggle[select])
            changeCSSVar('color' + upper + 'Icon', getCSSVar('color' + upper + 'Active'))
          else
            changeCSSVar('color' + upper + 'Icon', getCSSVar('color' + upper + 'Idle'))
        }
      }
      for (var n = 0; n < this.toggleList.length; n++) {
        var select = trimL(this.toggleList[n], 2);
        if (select !== lock) {
          changeCSSVar('color' + select + 'Icon', '#a1a1a1')
        }
      }
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    treeData: { name : 'Something went wrong.' },
    selected: 'none',
    masterText: './',
    masterPath: sysPath,
    selectedPath: '',
    isLocked: false,
  },
  computed: {
    input: function() {
      var selectorInput = document.getElementById('selectorInput');
      console.log(selectorInput.innerText);
      return selectorInput.innerText;
    }
  },
  methods: {
    toParent: function() {
      var prev = this.masterPath;
      var newPath = prev.match(/.*\/.*(?=\/)/gm);
      newPath = newPath[0];
      console.log(newPath);
    },
    getData: function(path) {
      csInterface.evalScript(`callTree('${path}')`, this.setData)
    },
    setData: function(res) {
      this.treeData = JSON.parse(res);
    },
  },
  created() {
    document.body.setAttribute('spellcheck', false);
    var that = this;
    console.log(this.treeData);
    Event.listen('toParent', that.toParent)
    // Event.listen('toParent', function() {
    //   that.toParent();
    // })
  },
  mounted() {
    this.getData(`${this.masterPath}`)
  }
})


// var dirData = {
//   "name":"mightyFolders",
//   "children":
//   [
//     {"name":".debug"},
//     {"name":"client",
//     "children":[
//       {"name":"index.html"},
//       {"name":"main.js"},
//       {"name":"myTstack",
//       "children":[
//         {"name":"adobeStyle.css"},
//         {"name":"anima.css"},
//         {"name":"CSInterface.js"},
//         {"name":"eventManager.js"},
//         {"name":"fonts",
//         "children":[
//           {"name":"Adobe-Font.svg"},
//           {"name":"Adobe-Font.ttf"},
//           {"name":"Adobe-Font.woff"}
//         ]},
//         {"name":"magicMirror.js"},
//         {"name":"menu_Context.js"},
//         {"name":"menu_Flyout.js"},
//         {"name":"mightyFiles.js"},
//         {"name":"mightyFunctions.js"},
//         {"name":"ReqLibs.js"},
//         {"name":"reset.css"}
//       ]},
//       {"name":"style.css"}
//     ]},
//     {"name":"CSXS",
//     "children":[
//       {"name":"manifest.xml"}
//     ]},
//     {"name":"host",
//     "children":[
//       {"name":"mightyFolders.jsx"},
//       {"name":"universal",
//       "children":[
//         {"name":"Console.jsx"},
//         {"name":"json2.jsx"}
//       ]}
//     ]},
//     {"name":"icons",
//     "children":[
//       {"name":"iconLight.png"}
//     ]},
//   {"name":"LICENSE"},
//   {"name":"log",
//   "children":[
//     {"name":"scribe.js"}
//   ]},
//   {"name":"README.md"}]
// }



// if(this.model.children &&
//     this.model.children.length){
//   this.model.children.sort(function(a,b){
//      return !(a.children && a.children.length);
//   });
// }

// methods: {
//   getData: function(path) {
//     csInterface.evalScript(`callTree('${path}')`, function(e) {
//       this.treeData = JSON.parse(res)
//     })
//   },



// var sampdata = {
//   name: 'root folder',
//   children: [
//     { name: 'readme.md' },
//     { name: 'text.txt' },
//     {
//       name: 'child folder',
//       children: [
//         {
//           name: 'branch',
//           children: [
//             { name: 'potatoad.txt' },
//             { name: 'tuneshine.md' }
//           ]
//         },
//         { name: 'spineapple.txt' },
//         {
//           name: 'crops',
//           children: [
//             { name: 'plumpkin.txt' },
//             { name: 'cluecumber.js' }
//           ]
//         },
//         { name: 'lielax.txt' },
//       ]
//     }
//   ]
// }
