'use strict';


requirejs.config({
    baseUrl: "/components",
    paths: {
      'epiceditor': 'epiceditor/src/editor',
      'marked': 'marked/lib/marked',
      'jquery': 'jquery/jquery.min'
    },
    shim: {
      'epiceditor': {
        exports: 'EpicEditor',
      },
      'marked': {
        exports: 'marked'
      }
    }
});
