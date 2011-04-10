Unobtrusive scripting adapter for jQuery
========================================

See the [original docs][orig_docs] for basic features, requirements, and installation.

Changes described here build on existing unobtrusive footwork to dry and empower dynamic functionality.

Widgets
-------

The data- attributes are used to give default functionality to an element.  That functionality is described in a jQuery plugin, and connected to the element through naming convention.  This is useful in connecting code and functionality to otherwise static code.

    $.fn.samplewidget = function(value){
    	console.log('widget is called on dom ready and dom modify')
    	console.log('the value is:', value); // value will be '123';
    }
    
    $("#feature").append($('<div />', {
    	'data-sampleWidget': '123'
    }));

Callbacks
---------

Ajax calls have already been made easy and unobtrusive (see original docs).  These changes make ajax callbacks easily so.

    $("#feature").append($('<a />', { //this is the link
    	'data-remote': true,
    	'data-action': 'refresh'
    }));
    
    $(document).appoint('refresh', function(){	//this is the handler
    	console.log('ajax successful');
    	$('#section').html(this.xhr.responseText);
    });

The appoint function applies to all matching actions within the scope.

Several things are contained by the callback object:
- the typical e, data, status, and xhr
- the closest data-feature as $feature
- the closest data-widget as $widget

Framework
---------

It is realized that CRUD ajax links and links which modify nearby content are comon.  Given that, the structure is assumed to be of features with actions:

    <div data-feature="todos">
    	<div data-feature="todo">
    		<a data-action='delete'>Delete</a>
    	</div>
    	<form data-action='create' data-remote="true" ...>
    		<input type="text" name="title"/>
    		<input type="submit"/>
    	</form>
    </div>
    
    $(document).appoint('delete', function(){	
    	this.$feature.remove();
    });
    
    $(document).appoint('create', function(){
    	this.find('textarea, input:text, input:file').val("");
        this.find('.errors').empty();
    
    	$(this.xhr.responseText).prependTo(this.$feature);	
    });

Create, Update, and Delete are handled by default, and can be removed with: 
dismiss(action, [ajaxEvent], [fn]);

Selectors
---------

Custom selectors are added: 
- $(':action') and $(':action(update)') match data-action=* and data-action=update
- $(':feature') and $(':feature(todos)') match data-feature=* and data-feature=todos
- $(':widget') and $(':widget(cycle)') match data-\*=\* (excepting jquery-ujs reserved *data-* keywords) and data-cycle=*

Details
-------

There is a fair amount of customizability.

The idea of an object with a series of states is fairly simple, and included by default.  External plugins with the same name need simply to be included after this file.
    
    $.fn.cycle = function(selected) {
    	console.log('now showing the link with this action:', selected );
        this.children().hide().filter(':action(' + selected + ')').show();
    };

    <div data-cycle='finish'>
    	<a data-action='finish'>Mark Complete</a>
    	<a data-action='unfinish'>Mark Incomplete</a>
    </div>


Widgets are actuated on page load (or dom modify), showing the finish link by default.  It is a pleasant approach, as it allows complicated links to be generated all together by rails methods.
<br/>**$.fn.actuate = function([args]);**

Any arguments will be passed to the widget call, overriding the default value specified in the tag.
Widget names are determined from the tag.
<br/>**$.fn.appoint = function(action, [ajaxEvent], [handlerOrWidgetArgs])**

action: the data-actions to search for
ajaxEvent: One of: beforeSend, success, error, complete. [Their wiki][ajax_events] has details on them.
handlerOrWidgetArgs: A callback function, or arguments for the nearest (ancestral) widget.

Handling can be appointed to either a callback you provide, or by the associated widget.  With this feature, this code is reduced:

    // wordy
    $(':feature(todos)').appoint('finish', function(){
	  //this widget shows either a checked box or an unchecked one
      this.$widget.actuate('unfinish'); 
    });
    
    // handy alternative:
    $(':feature(todos)').appoint('finish', 'unfinish');


By default, the target with be the element with data-action specified.  However, if the element has the target attribute set, that instead will be used as the context for the callback.  The method searches for a feature of the same name, and if none found, one with matching id.  It falls back to itself without matching id. 
<br/>**$.fn.dismiss = function(action, [ajaxEvent], [fn]) {**

As usual, the default ajax event is success.  
If no function is given, the default capability is removed.
To remove a custom handler, pass in your function.  Note that passing your function to other jquery unbinding methods would not work, as there's an appointee wrapper method.


Test code exists for jQuery extensions, appointments, and wigets.


Bugs & Areas of Activity
------------------------
Links generated with the rails button-to cannot be actuated with jquery-ujs.  This is because data-remote and data-action must be on the form, but can only be added to the button.  This cold be accomodated for here or from rails core.

Targets could be used to silently implement ajax history.  Only links with differing targets -- like the framesets of yore -- would change history.

Data-remote may be now optional or obsolete.  Any example with data-action must be remote, so is could be made unnesessary.

Widget names with capital letters are not currently possible.  This is because attibute names downcase.  Updates here are just a matter of finding the best approach.

Current default handlers could be given some more capability.  Specifically, json datatype as well as raw html.  The proper behavior of create is not obvious -- should new content be added on top or bottom? Or decided on a call-by-call basis, or set somewhere?


- - -


Contact: Peter Ehrlich &mdash; [@ehrlicp][@ehrlicp]
Further Reading: http://blog.pehrlich.com/the-missing-handlers-of-rails-jquery-ujs


[orig_docs]: http://github.com/rails/jquery-ujs
[ajax_events]: https://github.com/rails/jquery-ujs/wiki/ajax
[@ehrlicp]: http://www.twitter.com/#!/ehrlicp