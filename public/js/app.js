'use strict';



require(['config',
 /*, Dependencies */], function (config) {

    var app = {
        initialize: function () {
            // Your code here
            require(['marked','epiceditor','jquery','datatables-bootstrap3'],function(marked,EpicEditor,$,dt) {
              console.log("INSIDE");

              var dtab = $('.data-table').dataTable(
              {
                "sDom": "<'row'<'span8'l><'span8'f>r>t<'row'<'span8'i><'span8'p>>",
                "sPaginationType": "bs_normal"                
              }
              );
              $("tfoot input").keyup( function () {
                /* Filter on the column (the index) of this element */
                dtab.fnFilter( this.value, $("tfoot input").index(this) );
                } );



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

          });
        }
    };

    app.initialize();

});


