;(function(win, doc) {
    'use strict';

    var _; // local this

    /*
     * CONSTRUCTOR
     */
    function SG() {
        // singleton wrapper
        if (!SG._instance) {
            // set the instance of the App
            if (!(this instanceof SG)) {
                return new SG();
            }

            // set instance
            SG._instance = _ = this;
            this.init();
        }

        // return the instance
        return SG._instance;
    }

    /*
     * PUBLIC
     */
    SG.prototype = {
        init: function() {
            $('body').append('<div class="preview-img"></div>');

            _getElements();
            _bindEvents();
            _setDefault();
            _updateCode();
        },

        liveCode: function(code) {
            var _code = escapeHTML(code),
                $previewImg = $('.preview-img'),
                signature = _.els.preview.find('>:first')[0];

            if (!signature) {
                return;
            }

            // img preview
            html2canvas(_.els.preview.find('>:first')[0], {
                onrendered: function(canvas) {
                    $previewImg.html(canvas);

                    // download links
                    _.els.code
                    .find('.lnk-download-image')
                    .attr('href', $previewImg.find('canvas')[0].toDataURL());
                }
            });

            // code preview
            _.els.code
            .find('.code-string')
            .text(_code);

            // download links
            _.els.code
            .find('.lnk-download-html')
            .attr('href', 'data:image/html;charset=utf-8,' + encodeURIComponent(_code));
        }
    };

    /*
     * PRIVATE
     */
    function _getElements() {
       var $m;
       _.els = {};
       _.els.main = $m = $('main');
       _.els.fields = $m.find('[data-field]');
       _.els.preview = $m.find('.preview');
       _.els.code = $m.find('.code');
    }

    function _bindEvents() {
        $(doc).on('keyup blur change', _.els.fields.selector, function() {
            var $target = $('[data-val="' + $(this).data('field') + '"]');
            $target
            .html(this.value)
            .closest('tr')[$target.is(':empty') ? 'hide' : 'show']();
            _updateCode();
        });
    }

    function _setDefault() {
        var $this;
        $('[data-default]').each(function() {
            $this = $(this);
            $('[data-val="' + $this.data('field') + '"]').html($this.data('default'));
        });
    }

    function _updateCode() {
        _.liveCode(_.els.preview.html());
    }

     /*
      * GLOBAL
      */
    win.SG = SG;
}(window, document));