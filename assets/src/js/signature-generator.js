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
     * PRIVATE
     */
    function _refreshElFields() {
        _.els.dataFields = _.els.fields.find('[data-field]');
    }

    function _getElements() {
       var $main;
       _.els = {};
       _.els.main = $main = $('main');
       _.els.fields = $main.find('.fields');
       _.els.preview = $main.find('.preview');
       _.els.code = $main.find('.code');
       _refreshElFields();
    }

    function _bindEvents() {
        $(doc).on('input', _.els.dataFields.selector, function() {
            var $target = $('[data-val="' + $(this).data('field') + '"]');
            $target.html(this.value);
            _.update();
        });
    }

    function _setDefaults() {
        var $this;
        $('[data-default]').each(function() {
            $this = $(this);
            $('[data-val="' + $this.data('field') + '"]').html($this.data('default'));
        });
        _.update();
    }

    /*
     * PUBLIC
     */
    SG.prototype = {
        init: function() {
            $('body').append('<div class="preview-img"></div>');

            _getElements();
            _bindEvents();

            _.setTemplate();
        },

        setTemplate: function(templateName) {
            var fieldsData = $.Deferred(),
                templateData = $.Deferred();

            // templateName = templateName || 'default';
            templateName = templateName || 'bankfacil';

            // fields
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
                    $label,
                    $field,
                    html = [];

                for (field in data.fields) {
                    tmp = data.fields[field].el.split(':');
                    el = tmp[0];
                    type = tmp[1];
                    $el = $('<' + el + ' class="field-item" />');
                    $label = $('<label class="field-label">' + data.fields[field].label + '</label>');

                    $el
                    .attr('data-field', field)
                    .attr('data-default', data.fields[field].default)
                    .attr(data.fields[field].attr || {});

                    if (type) {
                        $el.attr('type', type);
                    }

                    $field = $('<div class="field" />');

                    $field
                    .append($label)
                    .append($el);

                    html[html.length] = $field;
                }

                fieldsData.resolve(html);
            });

            // template
            $.ajax({
                url: '/templates/' + templateName + '/template.html',
                dataType: 'html'
            })
            .done(function(data) {
                templateData.resolve(data);
            });

            $.when(fieldsData, templateData).done(function (fields, template) {
                _.els.fields.find('fieldset').append(fields);
                _refreshElFields();
                _.els.preview.html(template);
                _setDefaults();
            });
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
      * GLOBAL
      */

    win.SG = SG;
}(window, document));