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
    <div class="collapseCol">
    </div>
    <div :class="focusClass">
      <div
        :class="branchClass"
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
      isAltFocused: false,
      hasAltFocus: '',
      sibs: [],
      next: '',
      prev: '',
      // isDocAncestor: false,

      // aFParent: '',
      // aFChild: '',
    }
  },
  mounted() {
    // this.$root.$children[3].open = true;
    // this.$root.$children[3].$children[0].isAltFocused = true;
    // this.findAltFocus(this.$root);
    // Event.listen('altFocusChange', this.nextAltFocus)
    // this.searchDocAncestry()
  },
  created() {
    if(this.model.children &&
        this.model.children.length){
      this.model.children.sort(function(a,b){
         return !(a.children && a.children.length);
      });
    }
    // document.getElementById("name").addEventListener("click", , false);
    // document.body.addEventListener('keyup', this.keyHandler)
  },
  computed: {
    branchClass: function() {
      // this.isThisDocAncestor();
      var style;
      if (this.highlight)
        style = this.styleHigh;
      else
        style = this.styleHighFocus;
      if (this.model.name == this.$root.docName) {
        style += ' branch-thisDoc'
      }

      if (this.hasThisDoc) {
        //  || (this.isDocAncestor)
        // console.log('Has this doc as child');
        if (!this.open) {
          style += ' branch-thisDoc'
        }
      }
      return style;
    },
    focusClass: function() {
      var res = '';
      res += (this.hasFocus) ? 'focus' : 'noFocus';
      res += (this.isAltFocused) ? ' altFocus' : ' altNoFocus'
      return res;
    },
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
    geneString: function() {
      return this.geneList.join();
    },
    hasThisDoc: function() {
      var name = this.$root.docName;
      var res = false;
      if (this.isFolder) {
        for (var i = 0; i < this.model.children.length; i++) {
          if (name == this.model.children[i].name) {
            res = true;
          }
        }
      }
      return res;
    },
  },
  methods: {
    keyHandler: function(event) {
      // console.log(`${event.key} was pressed`);
      console.log(event);
    },
    isDocAncestor: function() {
      console.log(this.geneList);
      // var result = false;
      // var result = this.searchDocAncestry(this);
    },
    searchDocAncestry: function(parent) {
      var res = false;
      if (parent.isFolder) {
        var targ = parent.model.children;
        console.log(targ);
        for (var i = 0; i < targ.length; i++) {
          // console.log(targ[i]);
          if (targ[i].name == this.$root.docName) {
            res = true;
          } else {
            this.searchDocAncestry(targ)
          }
        }
      }
      return res;
    },
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
    findAltFocus: function(parent) {
      if (!this.isAltFocused) {
        if (parent.$children.length) {
          for (var i = 0; i < parent.$children.length; i++) {
            var targ = parent.$children[i];
            if (targ.isAltFocused) {
              this.hasAltFocus = targ;
              // this.$root.altFocus = targ;
              this.$root.aFParent = parent;
              this.$root.aFChild = targ;
              break
            }
            if (!this.isAltFocused)
              this.findAltFocus(targ);
            // targ.hasFocus = false;
          };
        }
      }
    },
    nextAltFocus : function(e) {
      // console.log(e);
      var childRef;
      try {
        var match = this.$root.aFChild;
        console.log(match);
        this.$root.aFParent.$children.forEach(function(v,i,a) {
          if (v == match) {
            console.log('Matching here:');
            console.log(v);
            sibs = a;
            next = i + 1;
            prev = i - 1;
            // v.isAltFocused = false;
          }
        });
        // if (sibs.length) {
        // }
        console.log(sibs);
        console.log(next);
        console.log(sibs[next]);
        console.log(this.$root.aFChild);
        console.log(aFChild);
        // sibs = [];
        // console.log(childRef);
        // console.log('Next should be');
        // console.log(matchRef);
      } catch(e){

      } finally {
        console.log('Matching next:')
        console.log(this.$root.$children[3].sibs);
        console.log('-----');
        this.$root.aFChild = this.$root.$children[3].sibs[next];
      }
    },

    // if (/.*\//gm.test(v.model.name)) {
    //   console.log('This is a folder');
      // if (this.open) {
      //   console.log('which is currently open');
      // } else {
      //   if (i < a.length - 1) {
      //     a[(i+1)].isAltFocused = true;
      //     this.aFChild = a[(i+1)];
      //   } else {
      //     console.log('Last');
      //   }
      // }
    // } else {
    //   console.log('This is a file');
    //   if (i < a.length - 1) {
    //     this.aFChild = a[(i+1)];
    //   } else {
    //     // this.aFChild = this.aFParent;
    //     // this.findAltFocus(this)
    //     // console.log('Last');
    //   }

        // console.log(v.model.name);
        // a[(i+1)].isAltFocused = true;
        // console.log(this.aFChild);
        // v.isAltFocused = false;
        // this.$root.aFChild.isAltFocused = false;
      // }

    clearAltFocus: function(parent) {
      if (parent.$children.length) {
        for (var i = 0; i < parent.$children.length; i++) {
          var targ = parent.$children[i];
          targ.hasFocus = false;
          this.clearAltFocus(targ);
        };
      }
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
        <div :class="annoClass">
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
            <div class="editableInput">{{ mixin }}</div>
          </div>
          <div v-if="suffix" class="editSuffix">
            <span :class="checkExist"></span>
          </div>
        </div>
        <div class="selectSuffix">
          <div
            :class="open.style"
            @click="whichAction">
            <span :class="open.icon"></span>
          </div>
        </div>
      </div>
    </div>
  `,
  // <div
  //   :class="save.style"
  //   @click="quickSave()">
  //   <span :class="save.icon"></span>
  // </div>
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
      newFolder: false,
      altFocus: '',
      // annotations: ['no action', 'quicksave', 'quickload']
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
      if (this.canCode)
        desc = 'view code'
      if (this.canScript)
        desc = 'run this'
      if (this.canText)
        desc = 'paste'
      if (this.newFolder) {
        if (inString(this.fullText, './ '))
          console.log('At root');
        desc = 'create'
      }
      return desc;
    },
    annoClass: function() {
      if (this.hasAction)
        return 'annoBoxOn'
      else
        return 'annoBox'
    },
    inputClass: function() {
      // console.log(this.fullText);
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
      if (this.hasAction) {
        mirror.style = 'xtag-save xtag-lit';
        if (this.canLoad) {
          mirror.icon = 'adobe-icon-open';
        } else if (this.canImport) {
          mirror.icon = 'adobe-icon-import';
        } else if (this.canQuicksave) {
          mirror.icon = 'adobe-icon-saveNew';
        } else if (this.canExport) {
          mirror.icon = 'adobe-icon-export';
        } else if (this.canCode) {
          mirror.icon = 'adobe-icon-code';
        } else if (this.canScript) {
          mirror.icon = 'adobe-icon-play';
        } else if (this.canText) {
          mirror.icon = 'adobe-icon-file';
        } else if (this.newFolder) {
          mirror.icon = 'adobe-icon-folder';
        }
      } else {
        mirror.icon = 'adobe-icon-close';
        mirror.style = 'xtag-load xtag-dark';
      }
      return mirror;
    },
    canLoad: function() {
      var res = false;
      var targ = this.fullText;
      if (this.isFile(targ)) {
        if (/\.(ai|psd|pdf|csv)/gm.test(targ)) {
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
        if (/\.(ai|pdf)/gm.test(targ)) {
          if (!this.withinFiles(targ.substr(targ.lastIndexOf('/') + 1))) {
            res = true
          }
        }
      }
      return res;
    },
    hasAction: function() {
      if ((this.canLoad) || (this.canQuicksave) || (this.canSave) || (this.canImport) || (this.canExport) || (this.newFolder) || (this.canScript) || (this.canCode) || (this.canText))
        return true;
      else
        return false;
    },
    canAction: function() {
      if ((this.canLoad) || (this.canQuicksave) || (this.canSave) || (this.canImport) || (this.canExport) || (this.canScript) || (this.canCode) || (this.canText))
        return true;
      else
        return false;
    },
    canCode: function() {
      var res = false;
      var targ = this.fullText;
      if (this.isFile(targ)) {
        if (/\.(js\s|js|css|html|json|xml|vue|ts|debug)/gm.test(targ)) {
          if (this.withinFiles(targ.substr(targ.lastIndexOf('/') + 1))) {
            // console.log(targ);
            if (/\.jsx/gm.test(targ)) {
              console.log('This is a script');
              res = false
            } else {
              // console.log('Is not a script');
              res = true
            }
          }
        }
      }
      return res;
    },
    canScript: function() {
      var res = false;
      var targ = this.fullText;
      if (this.isFile(targ)) {
        if (/\.jsx/gm.test(targ)) {
          if (this.withinFiles(targ.substr(targ.lastIndexOf('/') + 1))) {
            res = true
          }
        }
      }
      return res;
    },
    canText: function() {
      var res = false;
      var targ = this.fullText;
      if (this.isFile(targ)) {
        if (/\.(txt|md)/gm.test(targ)) {
          if (this.withinFiles(targ.substr(targ.lastIndexOf('/') + 1))) {
            res = true;
          }
        } else if (this.withinFiles(targ.substr(targ.lastIndexOf('/') + 1)) == 'LICENSE') {
          res = true;
        }
      }
      return res;
    },
    canImport: function() {
      var res = false;
      var targ = this.fullText;
      if (this.isFile(targ)) {
        if (/\.(png|jpg|svg|dxf|woff|ttf)/gm.test(targ)) {
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
        if (/\.(svg|dxf|png|jpg)/gm.test(targ)) {
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
      // mirr.push('./')
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
    var self = this;
    this.$el.addEventListener('keyup', function(e){
      if (e.key == 'Enter') {
        console.log('Submitting...');
        // console.log(this);
        // e.preventDefault();
        // e.stopPropagation();
        try {
          if (self.hasAction) {
            // console.log('Trying action');
            self.whichAction();
          } else if (self.isFolder) {
            console.log('No action for pre-existing folders.');
          } else {
            console.log(`Can't do anything.`);
          }
        } catch(e) {
        }
      }
    })
  },
  updated() {
    this.updateInput();
    this.inputHeal();
    // console.log(this.$root.$children[3].isFolder)
    // this.checkFolderSlash();
  },
  methods : {
    inputHeal: function() {
      if (this.canAction)
        this.newFolder = false;
    },
    whichAction: function() {
      // try {
      // console.log(this.hasAction);
        if (this.hasAction) {
          // console.log(`Why don't you work?`);
          if (this.canLoad) {
            this.quickLoad(this.title);
          } else if (this.canImport) {
            this.quickImport(this.title);
          } else if (this.canQuicksave) {
            this.quickSave(this.title);
          } else if (this.canExport) {
            this.quickExport(this.title);
          } else if (this.canCode) {
            this.quickCode(this.title);
          } else if (this.canScript) {
            this.quickScript(this.title);
          } else if (this.canText) {
            this.quickText(this.title);
          } else if (this.newFolder) {
            this.quickFolder(this.title);
          }
        } else {
          console.log(`No actions available right now.`);
        }
      // } catch(e) {}
    },
    withinFolders: function(data) {
      var result = false;
      this.folderList.forEach(function(v,i,a){
        if (data == v) {
          result = true;
        }
      })
      // Causes crash
      // if (data == '/') {
      //   result = true;
      // }
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
      // var regex = /.*[^./]/gm;
      // var data = data.replace(regex, '');
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
      // if (data == '.' | data == './')
      //   result = true;
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
        this.newFolder = false;
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
        // if (!this.doesExist) {
        //   this.title = thisText.substr(thisText.lastIndexOf('/') + 1).trim()
        // }
        // console.log(this.title);
        lastText = thisText;
        // if (this.$root.treeData.name = "Something went wrong") {
        //   this.title = 'Setting up data...';
        // }
        // console.log(this.title);
        this.$emit('input', this.fullText);
      }
    },
    getTitle: function(data) {
      // console.log(data);
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
          // console.log(splitResult);
          // console.log(do);
          if (this.withinFolders(splitResult)) {
            this.newFolder = false;
            // console.log('This is an existing folder');
            result = splitResult;
          } else {
            // console.log('This folder does not exist yet');
            this.newFolder = true;
            result = splitResult;
          }
        } else {
          // this.newFolder = false;
        }
      }
      // if (this.isFolder)
      // console.log();
      // console.log(result);
      return result;
    },
    isFolder: function(str) {
      var res;
      if (/(.*\/.*\..*)|(.*LICENSE)/gm.test(str))
        res = false;
      else if ((str == './') || (str = '/'))
        res = true;
      else
        res = true;
      return res;
    },
    isFile: function(str) {
      var res;
      if (/(.*\/.*\..*)|(.*LICENSE)/gm.test(str))
        res = true;
      else
        res = false;
      return res;
    },
    quickSave: function(e) {
      console.log(this.$root.masterText + ' should save as a new file');
      console.log(e);
    },
    quickLoad: function(e) {
      console.log(this.$root.masterText + ' should load as a new document');
      console.log(e);
    },
    quickExport: function(e) {
      console.log(this.$root.masterText + ' should export from this document');
      console.log(e);
    },
    quickImport: function(e) {
      console.log(this.$root.masterText + ' should import to current document');
      console.log(e);
    },
    quickScript: function(e) {
      console.log(this.$root.masterText + ' should run as a script');
      console.log(e);
    },
    quickCode: function(e) {
      console.log(this.$root.masterText + ' should display in PlayWrite');
      console.log(e);
    },
    quickText: function(e) {
      console.log(this.$root.masterText + ' should paste code into document');
      console.log(e);
    },
    quickFolder: function(e) {
      console.log(this.$root.masterText + ' should be created as a new folder');
      console.log(e);
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
    masterFolder: '',
    selectedPath: '',
    isLocked: false,
    aFParent: '',
    aFChild: '',
    docName: '',
    docPath: '',
  },
  computed: {
    input: function() {
      var selectorInput = document.getElementById('selectorInput');
      console.log(selectorInput.innerText);
      return selectorInput.innerText;
    },
    OS: function() {
      if (navigator.platform.indexOf('Win') > -1) {
        return 'Win';
      } else if (navigator.platform.indexOf('Mac') > -1) {
        return 'Mac';
      } else {
        return 'Unknown';
      }
    }
  },
  methods: {
    // @Vasily
    toParent: function() {
      var prev = this.masterPath;
      var newPath = prev.match(/.*\/.*(?=\/)/gm);
      newPath = newPath[0];
      console.log('Destination should be:');
      console.log(newPath);
      // ^ Correct path
      // But try below and Illustrator will crash:
      // this.getData(newPath)
    },
    getDoc: function() {
      csInterface.evalScript(`thisDoc()`, this.setDoc)
    },
    setDoc: function(doc) {
      this.docName = doc.substr(doc.lastIndexOf('/') + 1);
      this.docPath = doc.match(/.*\/(?=[^.*])/gm)[0];
      // if (inString(this.docPath, this.masterFolder))
        // console.log('Has current doc');
        // this.findDoc();
    },
    // findDoc: function(parent) {
    //     if (parent.$children.length) {
    //       for (var i = 0; i < parent.$children.length; i++) {
    //         var targ = parent.$children[i];
    //         if (targ.isAltFocused) {
    //           this.hasAltFocus = targ;
    //           // this.$root.altFocus = targ;
    //           this.$root.aFParent = parent;
    //           this.$root.aFChild = targ;
    //           break
    //         }
    //         if (!this.isAltFocused)
    //           this.findAltFocus(targ);
    //         // targ.hasFocus = false;
    //       };
    //     }
    // },
    getData: function(path) {
      csInterface.evalScript(`callTree('${path}')`, this.setData)
    },
    setData: function(res) {
      this.treeData = JSON.parse(res);
      this.masterFolder = this.treeData.name;
    },
    navigate: function(direction) {
      console.log(direction);
      Event.fire('altFocusChange', direction);
      // console.log(this.$root.$children[3]);

    }
  },
  created() {
    var self = this;
    document.body.addEventListener('keyup', function(e){
      var arrowKeys = ['Left', 'Right', 'Up', 'Down'];
      arrowKeys.forEach(function(v,i,a){
        if ((e.key == 'Arrow' + v) && (e.altKey)) {
          var dir = e.key.replace(/Arrow/gm, '');
          console.log(self.$root.$children[3]);
          self.navigate(dir);
        }
      });
      // console.log('Hello?');
    })
    document.body.setAttribute('spellcheck', false);
    // var that = this;
    console.log(`This is running on ${this.OS}`);
    // Using separate vue instance to communicate to root instance:
    // Event.listen('toParent', that.toParent)
    // Event.listen('toParent', function() {
    //   that.toParent();
    // })
  },
  mounted() {
    this.getData(`${this.masterPath}`);
    this.getDoc();
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
