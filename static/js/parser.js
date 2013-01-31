var parseConfig = function(configXml) {
    var config = $($.parseXML(configXml, 'text/xml')),
    rootNode = config.children(':first'),
    options = {},
    actionsMap;

    options.name = rootNode.attr('Name');
    options.icon = rootNode.attr('Icon');
    options.author = rootNode.attr('Author');
    options.description = rootNode.attr('Description');
    instantiateRemoteModel(true); // reinitialize the remote model
    rm.init(true, options);
    actionsMap = parseActions($('Actions', config)),
    parseLayout($('Layout', config), actionsMap);
    ko.applyBindings( rm );
};
var parseLayout = function(layout, actionsMap) {
    var rowNodes = $('Row', layout), controllerAttrMap, crntWidgetRow, crntWidget, crntController, action, nodeName, nodeValue, attrs, i, j;
    for ( i = 0; i < rowNodes.length; i++ ) {
	crntWidgetRow = rm.createWidgetRow(true);
	controlNodes = $('Control', rowNodes[i]);
	for ( j = 0; j < controlNodes.length; j++ ) {
	    controllerAttrMap = {}
	    attrs = controlNodes[j].attributes;
	    for ( k = 0; k < attrs.length; k++ ) {
		nodeName = attrs.item(k).nodeName.toLowerCase();
		nodeValue = attrs.item(k).nodeValue;
		if (nodeName.substring(0,2) === 'on') {
		    // this is an event, it needs to be linked to the action with the same name as nodeValue
		    action = actionsMap[nodeValue];
		}
		controllerAttrMap[nodeName] = nodeValue;
	    }
	    crntController = new ControllerModel(controllerAttrMap.type, controllerAttrMap);
	    rm.createWidget(new WidgetModel(action, null, crntController));
	}
    }
};
var parseActions = function(actions) {
    var actionNodes = $('Action', actions), actionsMap = {}, crntAction, crntActionRef, actionRefs, extrasArr, extras, extra, attrs, nodeName, nodeValue, i, j, k;
    for ( i = 0; i < actionNodes.length; i++ ) {
	crntAction = new ActionModel($(actionNodes[i]).attr('Name'), true);
	rm.createAction(crntAction);
	actionsMap[crntAction.name()] = crntAction;
	actionRefs = $('ActionRef', actionNodes[i]);
	for ( j = 0; j < actionRefs.length; j++ ) {
	    crntActionRef = new ActionRefModel();
	    attrs = actionRefs[j].attributes;
	    extrasArr = []
	    for ( k = 0; k < attrs.length; k++ ) {
		nodeName = attrs.item(k).nodeName.toLowerCase();
		nodeValue = attrs.item(k).nodeValue;
		if (nodeName === "extra") {
		    extrasArr.push({value: nodeValue});
		} else {
		    crntActionRef[nodeName](nodeValue);
		}
	    }
	    extras = $('Extra', actionRefs[j]);
	    if ( extras.length > 0 ) {
		for ( k = 0; k < extras.length; k++ ) {
		    extra = $(extras[k]);
		    if (extra.attr('Name')) {
			extrasArr.push({name: extra.attr('Name'), value: extra.text()});
		    } else {
			extrasArr.push({value: extra.text()});
		    }
		}
	    }
	    crntActionRef.extras(extrasArr);
	    crntAction.addActionRef(crntActionRef);
	}
    }
    return actionsMap;
};