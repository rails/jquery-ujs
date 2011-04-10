/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.4.3 or later.
 * https://github.com/rails/jquery-ujs
 */

(function($) {
	// Make sure that every Ajax request sends the CSRF token
	function CSRFProtection(xhr) {
		var token = $('meta[name="csrf-token"]').attr('content');
		if (token) xhr.setRequestHeader('X-CSRF-Token', token);
	}
	if ('ajaxPrefilter' in $) $.ajaxPrefilter(function(options, originalOptions, xhr){ CSRFProtection(xhr) });
	else $(document).ajaxSend(function(e, xhr){ CSRFProtection(xhr) });

	// Triggers an event on an element and returns the event result
	function fire(obj, name, data) {
		var event = $.Event(name);
		obj.trigger(event, data);
		return event.result !== false;
	}

	// Submits "remote" forms and links with ajax
	function handleRemote(element) {
		var method, url, data,
			dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

	if (fire(element, 'ajax:before')) {
		if (element.is('form')) {
			method = element.attr('method');
			url = element.attr('action');
			data = element.serializeArray();
			// memoized value from clicked submit button
			var button = element.data('ujs:submit-button');
			if (button) {
				data.push(button);
				element.data('ujs:submit-button', null);
			}
		} else {
			method = element.data('method');
			url = element.attr('href');
			data = null;
		}
			$.ajax({
				url: url, type: method || 'GET', data: data, dataType: dataType,
				// stopping the "ajax:beforeSend" event will cancel the ajax request
				beforeSend: function(xhr, settings) {
					if (settings.dataType === undefined) {
						xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
					}
					return fire(element, 'ajax:beforeSend', [xhr, settings]);
				},
				success: function(data, status, xhr) {
					element.trigger('ajax:success', [data, status, xhr]);
				},
				complete: function(xhr, status) {
					element.trigger('ajax:complete', [xhr, status]);
				},
				error: function(xhr, status, error) {
					element.trigger('ajax:error', [xhr, status, error]);
				}
			});
		}
	}

	// Handles "data-method" on links such as:
	// <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
	function handleMethod(link) {
		var href = link.attr('href'),
			method = link.data('method'),
			csrf_token = $('meta[name=csrf-token]').attr('content'),
			csrf_param = $('meta[name=csrf-param]').attr('content'),
			form = $('<form method="post" action="' + href + '"></form>'),
			metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

		if (csrf_param !== undefined && csrf_token !== undefined) {
			metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
		}

		form.hide().append(metadata_input).appendTo('body');
		form.submit();
	}

	function disableFormElements(form) {
		form.find('input[data-disable-with], button[data-disable-with]').each(function() {
			var element = $(this), method = element.is('button') ? 'html' : 'val';
			element.data('ujs:enable-with', element[method]());
			element[method](element.data('disable-with'));
			element.attr('disabled', 'disabled');
		});
	}

	function enableFormElements(form) {
		form.find('input[data-disable-with]:disabled, button[data-disable-with]:disabled').each(function() {
			var element = $(this), method = element.is('button') ? 'html' : 'val';
			if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
			element.removeAttr('disabled');
		});
	}

	function allowAction(element) {
		var message = element.data('confirm');
		return !message || (fire(element, 'confirm') && confirm(message));
	}

	function requiredValuesMissing(form) {
		var missing = false;
		form.find('input[name][required]').each(function() {
			if (!$(this).val()) missing = true;
		});
		return missing;
	}

	$('a[data-confirm], a[data-method], a[data-remote]').live('click.rails', function(e) {
		var link = $(this);
		if (!allowAction(link)) return false;

		if (link.data('remote') != undefined) {
			handleRemote(link);
			return false;
		} else if (link.data('method')) {
			handleMethod(link);
			return false;
		}
	});

	$('form').live('submit.rails', function(e) {
		var form = $(this), remote = form.data('remote') != undefined;
		if (!allowAction(form)) return false;

		// skip other logic when required values are missing
		if (requiredValuesMissing(form)) return !remote;

		if (remote) {
			handleRemote(form);
			return false;
		} else {
			// slight timeout so that the submit button gets properly serialized
			setTimeout(function(){ disableFormElements(form) }, 13);
		}
	});

	$('form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])').live('click.rails', function() {
		var button = $(this);
		if (!allowAction(button)) return false;
		// register the pressed submit button
		var name = button.attr('name'), data = name ? {name:name, value:button.val()} : null;
		button.closest('form').data('ujs:submit-button', data);
	});

	$('form').live('ajax:beforeSend.rails', function(event) {
		if (this == event.target) disableFormElements($(this));
	});

	$('form').live('ajax:complete.rails', function(event) {
		if (this == event.target) enableFormElements($(this));
	});
	
	
	//=======================================================================================
	// begin pehrlich modifications
	//=======================================================================================
	
	// jQuery extensions:	
	
    $.expr[':'].action = function(obj, index, meta, stack) {
        if (meta[3] == undefined) {
            return ($(obj).attr('data-action') != undefined); //allow any value
        } else {
            return ($(obj).attr('data-action') == meta[3]); //match exact
        }
    };
    $.expr[':'].feature = function(obj, index, meta, stack) {
        if (meta[3] != undefined) {
            return ($(obj).attr('data-feature') == meta[3]); //match exact
        } else {
            return ($(obj).attr('data-feature') != undefined); //allow any value
        }
    };
    $.expr[':'].widget = function(obj, index, meta, stack) {
        if (meta[3] == undefined) { // any widget name
			//this returns false if there's no widget attribute!
			// could be complications with prototype, where o.hasOwnProperty would be needed. 
			// http://www.webdeveloper.com/forum/showthread.php?t=193474
			for (widgetName in getWidgetData(obj)){
				return true;
			}
			return false;
        } else { // argument as widget name
            return ( $(obj).attr('data-' + meta[3]) != undefined );
        }
    };

	var getWidgetData = function(htmlElement){
		// this could be refactored in to jq extension, if the complication could be justified
		// todo: this should allow comma separated arguments to be passed back.  
		//       for now it just returns an array of one, for use with apply by the actuate funtion.
	    var widgetAttribute = new RegExp(/^data-(.*)/i),
	    	reservedKeywords = ['feature', 'action', 'method', 'confirm', 'with', 'method', 'remote', 'type', 'disable-with', 'actuate'],
			widgetData = {};

		jQuery.each(htmlElement.attributes, function(index, attribute) {
			var widgetName = attribute.name.match(widgetAttribute);
			if (widgetName != null && reservedKeywords.indexOf(widgetName[1]) == -1) {
				widgetData[widgetName[1]] = [attribute.value]; 
			}
		});
		return widgetData;
	};	
	
	var default_actions = {
		// todo: handle different data types
		delete: function(){
	        this.$feature.remove();
	    },
		update: function(){
			this.$feature.html(this.xhr.responseText);
		},
		create:  function(){
			// todo: blanking select menus
			this.$feature.find('textarea,input:text,input:file').val("");
            this.$feature.find('.errors').empty();

            $(this.xhr.responseText).insertBefore(this); //could also use insertAfter as a default.
            // Neither is clearly better.  It could be automatically decided based on the index of the form
            // among its siblings, except for that difficulty arises when there are no siblings		},
		},
		create_error: function(){
             // http://www.alfajango.com/blog/rails-3-remote-links-and-forms-data-type-with-jquery/
             this.$feature.find('.errors').html(this.xhr.responseText);
		}
	}
	
	// looks for all decendant data-action elements and adds a handler to them
	// if passed a callback function, it is used as an ajax handler
	// if passed a string, it activates the widget, with string as the args
	// todo: upgrade to use deferred objects? http://api.jquery.com/category/deferred-object/
	// note: could the e variable name cause ie trouble?
	// todo: allow this to be called on upn the data-action itself, not just the wrapper, to avoid confusions. 
    $.fn.appoint = function(action, ajaxEvent, handlerOrWidgetArgs) {
		if (arguments.length < 2){ // in this case, add default actions
            ajaxEvent = 'success';
			if (action){
				handlerOrWidgetArgs = default_actions[action];
			}else{
				$(this).appoint('create').appoint('create', 'ajax:error', default_actions.create_error).appoint('update').appoint('delete');
				return this;
			}

		}else if (arguments.length < 3) { 
            handlerOrWidgetArgs = arguments[1];
            ajaxEvent = 'success';
        }

		var appointee = function(e, data, status, xhr) {
			var target = $(this).attr('target');
			if (target){
				target = $(':feature('+target+')') || $('#'+target) || this;
			}else{
				target = this;
			}
			
			// hmm.  one is tempted to use the Delegate data attachment here
			// but as the function allows a different target to be specified from the element, this way must be used
			
			//todo: handle different data from https://github.com/rails/jquery-ujs/wiki/ajax
			
            target.$feature = $(this).closest(':feature');
            target.$widget = $(this).closest(':widget');
            target.e = e;
            target.data = data;
            target.status = status;
            target.xhr = xhr;
						
            if (handlerOrWidgetArgs.prototype != undefined) { //is function?
                handlerOrWidgetArgs.call(target);
            } else { //is argument to pass to widget
				// console.log(handlerOrWidgetArgs);
				// target.$widget.actuate.apply(target.$widget, handlerOrWidgetArgs);
                target.$widget.actuate(handlerOrWidgetArgs);
            }			
        };

        $(this).delegate(':action(' + action + ')', 'ajax:' + ajaxEvent, appointee);

		// set public pointer to callback so that it can be used later by anyone to undelegate.
		handlerOrWidgetArgs.callbackAppointee = appointee;
        return this;
    };

	$(document).appoint(); // set up the default behaviors

    // removes current ujs behavior, including default values.
    // individual handlers can be removed, through tracking of ujs-made handlers via the ujsCallbackWrapper variable.
	// this is possibly borderline good practice?
    $.fn.dismiss = function(action, ajaxEvent, fn) {	
        if (!ajaxEvent) {
            ajaxEvent = 'success';
        }else if (typeof ajaxEvent != "string"){
			fn = ajaxEvent;
			ajaxEvent = 'success';
		}
		
		if(fn){
			$(this).undelegate(':action(' + action + ')', 'ajax:' + ajaxEvent, fn.callbackAppointee);
		}else{  
			$(this).dismiss(action, ajaxEvent, default_actions[action])
		}
    }


	// ========== end appointments ============================================
	// ========== begin widgets ===============================================

	$(function() {
	    // add handlers to DOM insertion methods: appendChild insertBefore
	    // add on DOM ready -- no need for them sooner
	    // (, or could this bring to light an edge-case bug, if someone modifies the dom while loading?)

	    var orig_insertBefore = Element.prototype.insertBefore;
	    Element.prototype.insertBefore = function(new_node, existing_node) {
	        var r = orig_insertBefore.call(this, new_node, existing_node); //run the old method
	        $(new_node).trigger('domModify');
	        return r;
	    };

	    var orig_appendChild = Element.prototype.appendChild;
	    Element.prototype.appendChild = function(child) {
	        var r = orig_appendChild.call(this, child);
	        $(child).trigger('domModify');
	        return r;
	    };

		//todo: note: could also respond to an attr_changed event, or such behavior may be unnecessary.
		 $('*').actuate();
	     $(document).delegate('*', 'domModify', function() { 
	         $(this).find('*').add(this).actuate();
	         return false; // this stops the propagation of live event to ancestors that match '*', ie, all of them.
	     });

	});


	// takes arguments to immediately pass on to next $.fn as specified by data- attr. doesn't take a selector as argument for itself.
	$.fn.actuate = function() {
	    var widgetArgs = arguments;	
		
		//iterate selected jQuery elements:
	    jQuery.each(this, function(index, htmlElement) {
				
			var widgetData = getWidgetData(htmlElement);
				
			for (widgetName in widgetData){
				try {
					// NOTE: TODO: Attribute keys are all lower case, and function names are case sensitive.  This is a problem!!
					//       either find a way to downcase-map the function names, or an alternate way of pilfering capitalization data
					// note: todo: block catches exceptions from inside of widget, which is not desired
					var args = (widgetArgs.length > 0) ? widgetArgs : widgetData[widgetName];					
					$(htmlElement)[ widgetName ].apply( $(htmlElement), args); // can this be dryed?
		        }catch(e) {
	                if (e instanceof TypeError) {  //todo: check cross browser compatibilities
	                    if (console && console.log)
	                    // if you see this error, this script is looking for $.fn.actionName to execute with the context of the object.
	                        console.log('jquery-ujs error, unfound jquery extend method: "' + widgetName + '"; or possible TypeError from within widget');
	                } else {
	                    throw(e);
	                }
	            }
			}
		
		});
	    return this;
	};	
	
    $.fn.cycle = function(selected) {
        this.children().hide().filter(':action(' + selected + ')').show();
    };
	
})( jQuery );
