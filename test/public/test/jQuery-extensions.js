(function(){
	var jQEqual= function(actual, expected, message){
		expected.each(function(index, element){
			strictEqual(actual.get(index), element, message);
		});
		strictEqual(actual.length, expected.length, '..and length matches')
	}

	module('jQuery-extensions', {
		setup: function(){
			$.fn.moped = function(){};
			$('#qunit-fixture')
		      .append($('<a />', {
				id: 'link1',
				class: 'action feature widget',
				'data-action': 'create',
				'data-feature': 'todo_list',
				'data-moped': 'handlebars',
		        text: 'my address1'
		      }));
			$('#qunit-fixture')
		      .append($('<a />', {
				id: 'link2',
				class: 'action feature widget',
				'data-action': 'update',
				'data-feature': 'todo_item',
				'data-cycle': 'refridgerator',
		        text: 'my address2'
		      }));
			$.fn.moped = undefined;
		}
	});

	test("':action' filter", function(){
		jQEqual($("#link1"), $(":action(create)"), ':action selector should pull particular element');	
		jQEqual($(".action"), $(":action"), ':action selector should pull all actionable elements');
	});

	test("':feature' filter", function(){
		jQEqual($(":feature(todo_list)"), $("#link1"), ':feature selector should pull particular element');	
		jQEqual($(":feature"), $(".feature"), ':feature selector should pull all feature elements');
	});

	test("':widget' filter", function(){
		jQEqual($(":widget(cycle)"), $("#link2"), ':widget selector should pull particular element');	
		jQEqual($(":widget"), $(".widget"), ':widget selector should pull all feature elements');
	});
		
})();