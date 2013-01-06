var parseConfig = function(configXml) {
    var config = $(configXml),
    actions = $('Actions', config),
    layout = $('Layout', config), crntAction, crntActionRef, actionRefs, attrs, nodeName, nodeValue, i, j, k;
    for ( i = 0; i < actions.length; i++ ) {
	crntAction = rm.createAction({name:$(actions[i]).attr('name')});
	actionRefs = $('ActionRef', actions[i]);
	for ( j = 0; j < actionRefs.length; j++ ) {
	    crntActionRef = new ActionRefModel();
	    attrs = actionRefs[i].attributes;
	    for ( k = 0; k < attrs.length; k++ ) {
		nodeName = attrs.item(k).nodeName;
		nodeValue = attrs.item(k).nodeValue;
		crntActionRef[nodeName](nodeValue);
	    }
	    crntAction.addActionRef(crntActionRef);
	}
    }
};