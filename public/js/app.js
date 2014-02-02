'use strict';



require(['config',
'/components/epiceditor/epiceditor/js/epiceditor.js',
'/components/marked/lib/marked.js',
'/components/jquery/jquery.min.js'
 /*, Dependencies */], function (config,epiceditor,marked,jquery) {

    var app = {
        initialize: function () {
            // Your code here
            
            if($('#epiceditor').length) {
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

            var $obscure = $('.obscure');
              console.log("OBSCURE?");            
            $obscure.each(function(i,o) {
              $(o).data('val',$(o).val());
              $(o).data('obscured',1);
              console.log("OBSCURE!");
              $(o).val('Click to view!');
              $(o).focus(function() {
                  if($(o).data('obscured')) {
                    $(o).val($(o).data('val'));
                    $(o).data('obscured',null);
                  }
              });
            });
            $obscure.show();

          
        }
    };

    app.initialize();

});


