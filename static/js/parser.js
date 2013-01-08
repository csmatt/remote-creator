var parseConfig = function(configXml) {
    var config = $(configXml),
    rootNode = $('ur', config),
    options = {},
    actionsMap;

    options.name = rootNode.attr('Name');
    options.icon = rootNode.attr('Icon');
    options.author = rootNode.attr('Author');
    options.description = rootNode.attr('Description');
    rm.init(true, options); // reinitialize the remote model
    actionsMap = parseActions($('Actions', config)),
    parseLayout($('Layout', config), actionsMap);
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
		nodeName = attrs.item(k).nodeName;
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
    var actionNodes = $('Action', actions), actionsMap = {}, crntAction, crntActionRef, actionRefs, extras, extrasArr, attrs, nodeName, nodeValue, i, j, k;
    for ( i = 0; i < actionNodes.length; i++ ) {
	crntAction = new ActionModel($(actionNodes[i]).attr('name'), true);
	rm.createAction(crntAction);
	actionsMap[crntAction.name()] = crntAction;
	actionRefs = $('ActionRef', actionNodes[i]);
	for ( j = 0; j < actionRefs.length; j++ ) {
	    crntActionRef = new ActionRefModel();
	    attrs = actionRefs[j].attributes;
	    for ( k = 0; k < attrs.length; k++ ) {
		nodeName = attrs.item(k).nodeName;
		nodeValue = attrs.item(k).nodeValue;
		crntActionRef[nodeName](nodeValue);
	    }
	    extras = $('Extra', actionRefs[j]);
	    if ( extras.length > 0 ) {
		extrasArr = [];
		for ( k = 0; k < extras.length; k++ ) {
		    extrasArr.push($(extras[k]).attr('name')+'='+$(extras[k]).attr('value'));
		}
		crntActionRef().extra(extrasArr.join(','));
	    }
	    crntAction.addActionRef(crntActionRef);
	}
    }
    return actionsMap;
};