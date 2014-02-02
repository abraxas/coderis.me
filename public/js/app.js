'use strict';



require(['config',
'/components/epiceditor/epiceditor/js/epiceditor.js',
'/components/marked/lib/marked.js'
 /*, Dependencies */], function (config,epiceditor,marked) {

    var app = {
        initialize: function () {
            // Your code here
            
            var editor = new EpicEditor({
                basePath: '/components/epiceditor/epiceditor',
                textarea: 'content',
                theme: {
                  base: '/themes/base/epiceditor.css',
                  editor: '/themes/editor/epic-light.css'
                },
                clientSideStorage: false,
                parser: marked
            }).load();

        }
    };

    app.initialize();

});


