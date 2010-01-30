jQuery(function ($) {
    $.fn.extend({
        /**
         * Triggers a custom event on an element and returns the event result
         * this is used to get around not being able to ensure callbacks are placed
         * at the end of the chain.
         *
         * TODO: deprecate with jQuery 1.4.2 release, in favor of subscribing to our
         *       own events and placing ourselves at the end of the chain.
         */
        triggerAndReturn: function (name, data) {
            var event = new jQuery.Event(name);
            this.trigger(event, data);

            return event.result !== false;
        },

        /**
         * Handles execution of remote calls firing overridable events along the way
         *
         */
        callRemote: function () {
            var el      = $(this),
                data    = [],
                method  = el.attr('method') || el.attr('data-method') || 'GET',
                url     = el.attr('action') || el.attr('href') || el.attr('data-url');

            if (el.context.tagName.toUpperCase() === 'FORM') {
                data = el.serializeArray();
            }

            // TODO: should let the developer know no url was found
            if (url !== undefined) {
                if (el.triggerAndReturn('ajax:before')) {
                    $.ajax({
                        url: url,
                        data: data,
                        type: method.toUpperCase(),
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Accept", "text/javascript");
                            el.trigger('ajax:loading', xhr);
                        },
                        success: function (data, status, xhr) {
                            el.trigger('ajax:success', [data, status, xhr]);
                        },
                        complete: function (xhr) {
                            el.trigger('ajax:complete', xhr);
                        },
                        error: function (xhr, status, error) {
                            el.trigger('ajax:failure', [xhr, status, error]);
                        }
                    });
                }

                el.trigger('ajax:after');
            }
        }
    });

    /**
     *  confirmation handler
     */
    $('a[data-confirm],input[data-confirm]').live('click', function () {
        var el = $(this);
        if (el.triggerAndReturn('confirm')) {
            if (!confirm(el.attr('data-confirm'))) {
                return false;
            }
        }
    });

    /**
     * remote handlers
     */
    $('form[data-remote="true"]').live('submit', function () {
        $(this).callRemote();        
        return false;
    });

    $('a[data-remote="true"],input[data-remote="true"]').live('click', function () {
        $(this).callRemote();        
        return false;
    });

    /**
     * disable_with handlers
     */ 
    $('input[data-disable-with], form[data-remote="true"]').live('ajax:before', function () {
        var el = $(this);

        // on form submit disable submit button
        if (el.context.tagName.toUpperCase() === 'FORM') {
            el.children('input[data-disable-with]').each(function (i, el) {
                var input = $(el);
                input.data('enable_with', input.val())
                     .attr('value', input.attr('data-disable-with'))
                     .attr('disabled', 'disabled');
            });
        } else {
            el.data('enable_with', el.val())
              .attr('value', el.attr('data-disable-with'))
              .attr('disabled', 'disabled');
        }
    });

    $('input[data-disable-with], form[data-remote="true"]').live('ajax:after', function () {
        var el = $(this);

        if (el.context.tagName.toUpperCase() === 'FORM') {
            el.children('input[data-disable-with]').each(function (i, el) {
                var input = $(el);
                input.removeAttr('disabled')
                     .val(input.data('enable_with'));
            });
        } else {
            el.removeAttr('disabled')
              .val(el.data('enable_with'));
        }
    });
});
