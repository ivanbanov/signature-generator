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
            _setDefaults();

            _.setTemplate();
            _.update();
        },

        setTemplate: function(templateName) {
            templateName = templateName || 'default';

            // fields
            $.ajax({
                url: '/templates/' + templateName + '/template.html',
                dataType: 'html'
            })
            .done(function(data) {
                _.els.preview.html(data);
            });

            // template
            $.ajax({
                url: '/templates/' + templateName + '/data.json',
                dataType: 'json'
            })
            .done(function(data) {
                var tmp,
                    field,
                    type,
                    el,
                    $el,
                    html;

                for (field in data.fields) {
                    tmp = data.fields[field].el.split(':');
                    el = tmp[0];
                    type = tmp[1];
                    $el = $('<' + el + ' />');

                    $el.attr(data.fields[field].attr);


                    if (type) {
                        $el.attr('type', type);
                    }

                    html[html.length] = $el;
                }

                //_.fields.append(html);
            });

            /*

            .fail(function() {
                // fail
            })
            .always(function() {
                // remove loader
            });*/
        },

        liveCode: function(code) {
            var _code = escapeHTML(code),
                $previewImg = $('.preview-img'),
                signature = _.els.preview.find('>:first')[0];

            if (!signature) {
                return;
            }

            // img preview
            html2canvas(signature, {
                onrendered: function(canvas) {
                    $previewImg.html(canvas);

                    // download image
                    _.els.code
                    .find('.lnk-download-image')
                    .attr('href', $previewImg.find('canvas')[0].toDataURL());
                }
            });

            // update code
            _.els.code
            .find('.code-string')
            .text(_code);

            // download html
            _.els.code
            .find('.lnk-download-html')
            .attr('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(_code));
        },

        update: function() {
            _.liveCode(_.els.preview.html());
        }
    };

    /*
     * PRIVATE
     */
    function _getElements() {
       var $main;
       _.els = {};
       _.els.main = $main = $('main');
       _.els.fields = $main.find('.fields');
       _.els.preview = $main.find('.preview');
       _.els.code = $main.find('.code');
       _refreshElFields();
    }

    function _refreshElFields() {
        _.els.dataFields = _.els.fields.find('[data-field]');
    }

    function _bindEvents() {
        $(doc).on('keyup blur change', _.els.dataFields.selector, function() {
            var $target = $('[data-val="' + $(this).data('field') + '"]');
            $target
            .html(this.value)
            .closest('tr')[$target.is(':empty') ? 'hide' : 'show']();
            _.update();
        });
    }

    function _setDefaults() {
        var $this;
        $('[data-default]').each(function() {
            $this = $(this);
            $('[data-val="' + $this.data('field') + '"]').html($this.data('default'));
        });
    }

     /*
      * GLOBAL
      */
    win.SG = SG;
}(window, document));