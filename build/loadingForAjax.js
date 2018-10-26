(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.loadingForAjax = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  // import Vue from 'vue'

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }

  function safeGet(obj, path, defa) {
    if (!obj) return defa;
    path = path.split('.');
    let prop = path.shift();
    while (prop) {
      obj = obj[prop];
      if (obj === null) return defa;
      prop = path.shift();
    }
    return obj;
  }

  function isStr(str) {
    return Object.prototype.toString.call(str) === '[object String]';
  }

  let state = exports.state = {
    loadingInfo: []
  };
  const loadingData = exports.loadingData = {
    state,
    startAjax(payload) {
      const _config = _extends({}, payload, { __id: uuidv4() });
      state.loadingInfo.push(_config);
      return _config;
    },
    stopAjax(payload) {
      state.loadingInfo = state.loadingInfo.filter(e => e && payload && e.__id !== payload.__id);
      return payload;
    }
  };
  const startAjax = exports.startAjax = loadingData.startAjax;
  const stopAjax = exports.stopAjax = loadingData.stopAjax;

  const install = (Vue, option) => {
    loadingData._vm = new Vue({
      data: {
        $$state: state
      }
    });
    Vue.mixin({
      beforeCreate: function () {
        this.$loadingForAjax = loadingData;
      }
    });
    Vue.prototype.isLoadingForUrl = function (url, options = option) {
      const _justify = (_self, url) => {
        return safeGet(_self, '$loadingForAjax.state.loadingInfo', []).some(e => url.some(e1 => safeGet(e, safeGet(options, 'propName', 'url')).includes(e1)));
      };
      if (!url) {
        return !!safeGet(this, '$loadingForAjax.state.loadingInfo.length', 0);
      }
      return _justify(this, Array.isArray(url) ? url : isStr(url) ? url.includes(',') ? url.split(',') : [url] : []);
      return false;
    };
  };
  try {
    if (axios) {
      axios.interceptors.request.use(config => {
        return loadingData.startAjax(config);
      });
      axios.interceptors.response.use(response => {
        loadingData.stopAjax(response.config);
        return response;
      });
    }
  } catch (e) {}

  // Vue.use({install})

  exports.default = {
    install,
    loadingData,
    state,
    startAjax: loadingData.startAjax,
    stopAjax: loadingData.stopAjax
  };
});