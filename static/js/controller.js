var MAX_WIDGET_WIDTH = 230,
MIN_WIDGET_HEIGHT = 30,
WIDGET_HEIGHT = 50;

var ControllerModel = function ( type, options ) {
    var self = this;
    //all
    self.type = ko.observable(type);
    self.width = ko.observable(options.width || MAX_WIDGET_WIDTH);
    self.height = ko.observable(options.height || WIDGET_HEIGHT);
    //special
    self.isEnabled = function(optionName) {
	return WIDGET_DEFS[self.type()].enabledOptions.indexOf(optionName) >= 0;
    };
    self.size = ko.observable();
    self.icon = ko.observable();
    self.text = ko.observable();
    self.textAlign = ko.observable('center');
    self.textAlignSelection = ko.computed({
	read: function() {
	    if (self.text()) {
		if (!self.textAlign()) {
		    self.textAlign('center');
		}
	    } else {
		self.textAlign(undefined);
	    }
	    return self.textAlign();
	},
	write: function(value) {
	    self.textAlign(value);
	},
	owner: self
    });
    self.item = ko.observable("");
    self._checked = ko.observable(true);
    self.checked = ko.computed(function() {
	if (self.isEnabled('checked')) {
	    return self._checked().toString();
	}
    });
    self.items = ko.computed(function() {
	var itemLinesElemVal = self.item(),
	itemLines = "";
	if (itemLinesElemVal) {
	    itemLines = itemLinesElemVal.split('\n');
	    if (itemLines.length === 1 && itemLines[0] === "") {
		return null;
	    }
	}
	return itemLines;
    });
    self.init = function() {
	if(self.isEnabled('text')) {
	    self.textAlign('center');
	}
    };
    self.init();
};

var ActionRefModel = function(name) {
    var self = this;
    self.name = ko.observable(ACTION_LIBS[0]);
    self.target = ko.observable(ACTIONS[ACTION_LIBS[0]]);
    self.extra = ko.observable("");
    self.extrasForConfig = [];
    self.extras = ko.computed(function() {
	// split extras by commas. 
	// if there's only one extra, but it's an empty string, return null
	// if there's only one extra and it's not an empty string, set self.extra to it and return null
	// if there's more than one extra, set self.extra to undefined and return the list of extras
	var extraLinesElemVal = self.extra(), extraLines = "", extras = [], nameAndExtra;
	self.extrasForConfig = [];
	if (extraLinesElemVal) {
	    extraLines = extraLinesElemVal.split(',');
	    for( i = 0; i < extraLines.length; i++ ) {
		nameAndExtra = extraLines[i].split('=');
		extras.push({name: nameAndExtra[0], value: nameAndExtra[1]});
	    }
	    if (extraLines.length === 1) {
		if (extraLines[0] !== "") {
		    self.extra(extras[extras.length-1]);
		}
		return null;
	    } else {
		self.extra(undefined);
		self.extrasForConfig = extras;
	    }
	} else if (extraLinesElemVal === "") {
	    self.extra(undefined);
	}
	return extraLines;
    });
    self.actionsForSelectedLib = ko.observableArray([]);
    self.target.subscribe( function(newValue) {
	var actionLib = newValue,
	    name, i;
	retVal = [];
	for( i = 0; i < ACTIONS[actionLib].length; i++) {
	    name = ACTIONS[actionLib][i].name;
	    retVal.push(name);
	}
	self.actionsForSelectedLib(retVal);
    });
};
var ActionModel = function(name) {
    var self = this;
    self.name = ko.observable(name);
    self.actionRefs = ko.observableArray([new ActionRefModel()]);
    self.addActionRef = function() {
	self.actionRefs.push(new ActionRefModel());
    };
    self.removeActionRef = function(actionRef) {
	self.actionRefs.remove(actionRef);
    };
    self.showEditActionsDialog = function() {
	$("#editActionsDialog").dialog({
	    modal: true,
	    width: 700,
	    buttons: {
		"Add": rm.selectedWidget().am().addActionRef,
		"Close": function() { $( this ).dialog( "close" ); }
	    }
	});
    };
};
