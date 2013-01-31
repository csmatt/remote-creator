ko.bindingHandlers.classes = {
    // ex:  classes: {static: 'hasMenu', observable: ['shape'], css: {selectedWidget: $data == $root.selectedWidget()}}
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, context) {
	var value = ko.utils.unwrapObservable(valueAccessor()),
	observableClasses = [],
	cssClasses = {},
	staticClasses = '',
	classesString = '',
	newValueAccessor,
	i;
	$(element).removeClass(); // remove all classes
	if ( value ) {
	    observableClasses = value.observable || [];
	    cssClasses = value.css || {};
	    staticClasses = value['static'] ? value['static'] : '';
	}
	$(element).addClass(staticClasses);
	for( i = 0; i < observableClasses.length; i++ ) {
	    $(element).addClass(viewModel[observableClasses[i]]());
	}
	newValueAccessor = function() { return cssClasses };
	ko.bindingHandlers['css'].update(element, newValueAccessor, allBindingsAccessor, viewModel, context);
    }
};
ko.bindingHandlers.ifEnabled = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, context){
	ko.utils.domData.set(element, '__ko_withIfBindingData', {});
	return { 'controlsDescendantBindings': true };
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, context) {
	//ex: ifEnabled: 'text'
	//ex: ifEnabled: {option: 'text', widget: $root.selectedWidget()}
	var option, widget, newValueAccessor;	
	if (typeof valueAccessor() === 'string') {
	    option = valueAccessor();
	    widget = rm.selectedWidget();
	} else {
	    option = valueAccessor().option,
	    widget = valueAccessor().widget;
	}
	newValueAccessor = function() { 
	    if (!widget) {
		return false;
	    }
	    return widget.cm().isEnabled(option) 
	};
	ko.bindingHandlers['if'].update(element, newValueAccessor, allBindingsAccessor, viewModel, context);
    }
};
ko.virtualElements.allowedBindings['ifEnabled'] = true;