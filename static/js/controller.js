var MAX_WIDGET_WIDTH = 230,
MIN_WIDGET_HEIGHT = 30,
WIDGET_HEIGHT = 50;

var ControllerModel = function ( type, options ) {
    var self = this;
    options = options || {};
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
    self.init = function(options) {
	if(self.isEnabled('text')) {
	    self.textAlign('center');
	}
	if(options) {
	    for(var option in options) {
		if (options.hasOwnProperty(option) && self.hasOwnProperty(option)) {
		    self[option](options[option]);
		}
	    }
	}
    };
    self.init(options);
};

var ActionRefModel = function() {
    var self = this;
    self.name = ko.observable(ACTION_LIBS[0]);
    self.target = ko.observable(ACTIONS[ACTION_LIBS[0]]);
    self.extras = ko.observableArray([]);
    self.extrasAsString = ko.computed({
	read: function() {
	    var outputString="",extra,i;
	    for( i = 0; i < self.extras().length; i++ ) {
		extra = self.extras()[i];
		if (!extra.name) {
		    outputString += "," + extra.value;
		} else {
		    outputString += "," + extra.name + "=" + extra.value;
		}
	    }
	    return outputString.substr(1); //removes leading comma
	},
	write: function(extrasAsString) {
	    var extrasStrings, nameAndValue, i;
	    self.extras.removeAll();
	    extrasStrings = extrasAsString.split(',');
	    for (i = 0; i < extrasStrings.length; i++ ) {
		nameAndValue = extrasStrings[i].split('=');
		if (nameAndValue.length === 2) {
		    self.extras.push({name: nameAndValue[0], value: nameAndValue[1]});
		} else {
		    self.extras.push({value: nameAndValue[0]});
		}
	    }
	}	
    });
    self.actionsForSelectedLib = ko.observableArray([]);
    self.target.subscribe( function(actionLib) {
	self.actionsForSelectedLib(ACTIONS[actionLib]);
    });
};
var ActionModel = function(name, leaveEmpty) {
    var self = this;
    self.name = ko.observable(name);
    self.actionRefs = ko.observableArray(leaveEmpty ? [] : [new ActionRefModel()]);
    self.addActionRef = function(newActionRef) {
	self.actionRefs.push(newActionRef || new ActionRefModel());
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
