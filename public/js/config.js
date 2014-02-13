'use strict';


requirejs.config({
    baseUrl: "/components",
    paths: {
      'epiceditor': 'epiceditor/src/editor',
      'marked': 'marked/lib/marked',
      'jquery': 'jquery/jquery.min',
      'datatables-bootstrap3': 'datatables-bootstrap3/BS3/assets/js/datatables',
      'datatables': 'datatables/media/js/jquery.dataTables'
    },
    shim: {
      'epiceditor': {
        exports: 'EpicEditor',
      },
      'marked': {
        exports: 'marked'
      },
      'datatables-bootstrap3': {
        deps: ['datatables']
      }
    }
});
