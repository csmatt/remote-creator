var parseConfig = function(configXml) {
    var config = $(configXml),
    actionsMap = parseActions($('Actions', config));
    parseLayout($('Layout', config), actionsMap);
};
var parseLayout = function(layout, actionsMap) {
    var rowNodes = $('Row', layout), crntWidgetRow, crntWidget, crntController, action, nodeName, nodeValue, attrs, i, j;
    for ( i = 0; i < rowNodes.length; i++ ) {
	crntWidgetRow = rm.createWidgetRow(true);
	attrs = rowNodes[i].attributes;
	controlNodes = $('Control', rowNodes[i]);
	for ( j = 0; j < controlNodes.length; j++ ) {
	    crntController = new ControllerModel();
	    for ( k = 0; k < attrs.length; k++ ) {
		nodeName = attrs.item(j).nodeName;
		nodeValue = attrs.item(j).nodeValue;
		if (nodeName.substring(0,2) === 'on') {
		    // this is an event, it needs to be linked to the action with the same name as nodeValue
		    action = actionsMap[nodeValue];
		} else {
		    crntController[nodeName](nodeValue);
		}
	    }
	}
	rm.createWidget(new WidgetModel(action, null, crntController));
    }
};
var parseActions = function(actions) {
    var actionsMap = {}, crntAction, crntActionRef, actionRefs, extras, extrasArr, attrs, nodeName, nodeValue, i, j, k;
    for ( i = 0; i < actions.length; i++ ) {
	crntAction = rm.createAction({name:$(actions[i]).attr('name')});
	actionRefs = $('ActionRef', actions[i]);
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
	    crntAction().addActionRef(crntActionRef);
	}
	rm.createAction(crntAction);
	actionsMap[crntAction().name()] = crntAction;
    }
    return actionsMap;
};