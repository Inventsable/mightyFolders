Vue.config.devtools = false;
Vue.config.productionTip = false;
// loads console.jsx and json2.jsx
loadUniversalJSXLibraries()
// loads ext-specific script from ./host
loadJSX('mightyFolders.jsx')

// simplified event handler
// window.Event = new Vue();
    // Event.$on(event, callback)
    // Event.$emit(event, data)

// class for handling events
  // Event.fire('name', 'data')
  // Event.listen('name', callback)
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
      // Does work
      Event.fire('test', 'testing event manager')
    },
    highlightThis: function(state) {
      if (state) {
        this.highlight = true;
      } else {
        this.highlight = false;
      }
    }
  },
  // Does work
  //
  // created() {
  //   Event.listen('test', function(e) {
  //     console.log('received test');
  //     console.log(e);
  //   })
  // }
})

var sampdata = {
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
        { name: 'text.txt' },
        {
          name: 'child folder',
          children: [
            { name: 'text.txt' },
            { name: 'text.txt' }
          ]
        },
        { name: 'text.txt' },
      ]
    }
  ]
}

var app = new Vue({
  el: '#app',
  data: {
    treeData: sampdata,
    // treeData: data,
    testData: 'none'
  },
  beforeCreate() {
    console.log('beforeCreate data is:');
    console.log(this.treeData);
  },
  mounted() {
    console.log('mounted data is:');
    console.log(this.treeData);
    this.getData()
  },
  created() {
    Event.listen('reroot', function(e) {
      console.log(`But the menu doesn't change`);
    })
  },
  methods: {
    getData: function() {
      csInterface.evalScript(`callTree('${sysPath}')`, function(str) {
        this.treeData = JSON.parse(str);
        console.log(`Vue's current data is:`);
        console.log(this.treeData);
        Event.fire('reroot')
      })
      // Vue.nextTick(function () {
      //   console.log('Data updated');
      // })
    }
  },
  computed: {
    tester: function() {
      var testData;
      csInterface.evalScript(`testerJSX('hello')`, function(e) {
        console.log(e);
        testData = e;
      });
      this.testData = testData;
      console.log(this.testData);
    }
  }
})

// I thought I could solve this by bringing the original source into JS,
// using event managers to communicate the data change for menu rebuild. No luck.
// this is commented out.
// Vue.component('treeview', {
//   // props: {
//   //   root: Object
//   // },
//   template: `
//   <ul class="roots">
//     <branch
//       class="slot"
//       :model="root">
//     </branch>
//   </ul>
//   `,
//   data: function () {
//     return {
//       // pointing to the placeholder JSON
//       root: sampdata
//     }
//   },
//   created() {
//     // Does not receive event
//     Event.listen('test', function(e) {
//       console.log('received test');
//       console.log(e);
//     })
//   }
// })