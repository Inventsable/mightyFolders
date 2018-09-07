Vue.config.devtools = false;
Vue.config.productionTip = false;
console.log('Loading mightyFolders...');
// loads console.jsx and json2.jsx
loadUniversalJSXLibraries()
// loads ext-specific script from ./host
loadJSX('mightyFolders.jsx')

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
        :class="(hasFocus) ? 'branch-active' : 'branch-idle'"
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
    isFolder: function () {
      return this.model.children &&
        this.model.children.length;
    },
  },
  methods: {
    toggle: function(e) {
      this.setFocus(e);
      var targ = e.currentTarget.parentNode;
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

Vue.component('lift', {
  template: `
    <div class="liftwrap" @click="gotoParent">
      <div class="liftbtn">
        <span class="adobe-icon-angleUp"></span>
      </div>
    </div>
  `,
  methods: {
    gotoParent: function(e) {
      var prev = this.$root.masterPath;
      var newPath = prev.match(/.*\/.*(?=\/)/gm);
      newPath = newPath[0];
      console.log(newPath);
      
      // This doesn't work.

      // this.$root.getData(newPath);
      // this.$root.masterPath = newPath;
      // this.$root.getData(`${newPath}`)
      // console.log(newPath);
    }
  }
});

Vue.component('selector', {
  template: `
    <div class="selectLine">
      <div class="selectPrefix">
        <div :class="(this.toggle.isSelect) ? 'xtag-select-active' : 'xtag-select-idle'" @click="setActive('select')">
          <span class="adobe-icon-cursor"></span>
        </div>
        <div :class="(this.toggle.isFind) ? 'xtag-find-active' : 'xtag-find-idle'" @click="setActive('find')">
          <span class="adobe-icon-find"></span>
        </div>
        <input :class="(toggle.isActive) ? 'select-input-active' : 'select-input-idle'" type="text" v-model="msg">
      </div>
      <div class="selectSuffix">
        <div :class="(this.isPlus) ? 'xtag-plus-active' : 'xtag-plus-idle'" @click="setFavorite('plus')">
          <span class="adobe-icon-plus"></span>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      msg: 'app.selection',
      toggleList : ['isActive', 'isSelect', 'isFind'],
      toggle : {
        isActive: false,
        isSelect: false,
        isFind: false,
      },
      isPlus: false,
    }
  },
  methods : {
    setFavorite: function(lower) {
      var upper = lower.charAt(0).toUpperCase() + lower.substr(1);
      this.isPlus = !this.isPlus;
      if (this.isPlus)
        changeCSSVar('colorPlusIcon', getCSSVar('colorPlusActive'))
      else
        changeCSSVar('colorPlusIcon', getCSSVar('colorPlusIdle'))
      console.log(this.isPlus);
      console.log(getCSSVar('colorNoteIcon'));
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
    treeData: { name : 'Loading...' },
    selected: 'none',
    masterText: 'Select a file',
    masterPath: sysPath,
  },
  methods: {
    getData: function(path) {
      csInterface.evalScript(`callTree('${path}')`, this.setData)
    },
    setData: function(res) {
      this.treeData = JSON.parse(res);
      console.log(this.treeData);
      console.log(JSON.stringify(this.treeData));
    },
  },
  created() {
    this.$on('change', function(e){
      console.log(e);
    })
  },
  mounted() {
    this.getData(`${sysPath}`)
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
