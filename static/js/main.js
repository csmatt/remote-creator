var rm = null;
$( function () {
    var RemoteModel = function (leaveEmpty) {
        var self = this;
	self.name = ko.observable("");
	self.icon = ko.observable("");
	self.author = ko.observable("");
	self.description = ko.observable("");
        self.widgetRows = ko.observableArray( [] );
        self.widgets = ko.observableArray( [] );
	self.actions = ko.observableArray( [] );
        self.selectedWidgetRow = ko.observable();
        self.selectedWidget = ko.observable();
        self.createWidget = function (newWidget) {
            if ( self.selectedWidgetRow().widgets().length < 8 ) {
		var name = 'action'+self.widgets().length;
		newWidget = newWidget || new WidgetModel( self.createAction(), "Button" );
		self.setSelectedWidget( newWidget );
		self.widgets.push( newWidget );
		self.selectedWidgetRow().addWidget( newWidget );
	    } else {
                console.warn( "Too many widgets for this row!" );
            }
        };
        self.createWidgetRow = function (leaveEmpty) {
            var newWidgetRow = new WidgetRowModel( [] );
            self.selectedWidgetRow( newWidgetRow );
            self.widgetRows.push( newWidgetRow );
	    if (!leaveEmpty) {
		self.createWidget();
	    }
	    return newWidgetRow;
        };
	self._onCreateWidget = function() { self.createWidget(); };
	self._onCreateWidgetRow = function() { self.createWidgetRow(); };
	self.deleteWidget = function() {
            if ( self.selectedWidgetRow().widgets().length > 1 ) {
                var indexOfSelectedWidget = self.selectedWidgetRow().widgets.indexOf( self.selectedWidget() ),
		removedWidget = self.widgets.remove( self.selectedWidget() ), i;
                self.selectedWidgetRow().widgets.splice( indexOfSelectedWidget, 1 );
                self.selectedWidget( self.selectedWidgetRow().widgets()[0] );
                self.selectedWidgetRow().updateWidgetWidths();
                self.selectedWidgetRow()._updateHeightHelper();
            }
        };
        self.deleteRow = function () {
            if ( self.widgetRows().length > 1 ) {
                var indexOfSelectedRow = self.widgetRows.indexOf( self.selectedWidgetRow() ),
		removedWidgets = self.selectedWidgetRow().widgets.removeAll();
		self.widgets.removeAll( removedWidgets );
                self.widgetRows.splice( indexOfSelectedRow, 1 );
                self.selectedWidgetRow( self.widgetRows()[0] );
		self.selectedWidget( self.selectedWidgetRow().widgets()[0] );
            }
        };
        self.setSelectedWidget = function ( widget, event ) {
            self.selectedWidget( widget );
        };
        self.setSelectedWidgetRow = function ( row, event ) {
            self.selectedWidgetRow( row );
        };
	/** Handles the click event on an available icon by setting the icon of the selected widget **/
        self.setIcon = function ( availIcon, event ) {
            self.selectedWidget().cm().icon( availIcon );
        };
	/** Shows edit remote dialog to edit the global settings of the remote **/
	self.editRemote = function() {
	    var remoteSettings = $("input", remoteDialogElem),
	    nameAttr, i;
	    for ( i = 0; i < remoteSettings.length; i++ ) {
		nameAttr = $(remoteSettings[i]).attr('name');
		$(remoteSettings[i]).val(self[nameAttr]());
	    }
	    remoteDialogElem.dialog( "open" );
	};
	/** Iterates through the inputs of the remote settings form and persists their values to the view model **/
	self.saveRemoteSettings = function() {
	    var remoteSettings = $("input", remoteDialogElem);
	    saveSettingsToViewModel(self, remoteSettings);
	    remoteDialogElem.dialog( "close" );
	};
	/** Applies the bindings of action to the dialog and then opens the dialog **/
	self.manageAction = function(action) {
	    var editActionDialogElem = $("#editActionDialog");
	    self.selectedWidget().action(action);
	    editActionDialogElem.dialog({
		modal: true,
		width: 670,
		buttons: {
		    "Add Reference": function() { action.addActionRef(); },
		    "Close": function() { $(this).dialog("close"); }
		}
	    });
	};
	/** Creates a new action and adds it to the list of actions **/
	self.createAction = function(newAction) {
	    newAction = newAction || new ActionModel('action'+actionCounter);
	    actionCounter++;
	    self.actions.push(newAction);
	    return newAction;
	};
	/** Creates an action and opens it for editing via manageAction **/
	self.createAndManageAction = function() {
	    self.manageAction(self.createAction());
	};
	/** Deletes an action as long as there's at least one action **/
	self.deleteAction = function(action, event) {
	    if (self.actions().length > 1) {
		self.actions.remove(action);
	    }
	};
	self.showGeneratedConfigDialog = function() {
	    var generatedConfigDialog = $("#generatedConfigDialog"),
	    config = generateConfig();
	    //parseConfig(config);
	    generatedConfigDialog.dialog({
		modal: true,
		width: 750,
		height: 550,
		buttons: {
		    "Done": function() { $(this).dialog("close"); }
		}
	    });
	    $('textarea', generatedConfigDialog).val(config);
	};
	self.showImportConfigDialog = function() {
	    var importConfigDialog = $("#importConfigDialog");
	    importConfigDialog.dialog({
		modal: true,
		width: 750,
		height: 550,
		buttons: {
			"Import": function() { parseConfig($("#importConfigTextBox").val());  },
		    "Close": function() { $(this).dialog("close"); }
		}
	    });
	};
        self.init = function (leaveEmpty, options) {
	    self.name = ko.observable(options.name || "");
	    self.icon = ko.observable(options.icon || "");
	    self.author = ko.observable(options.author || "");
	    self.description = ko.observable(options.description || "");
	    self.actions.removeAll();
	    self.widgets.removeAll();
	    self.widgetRows.removeAll();
	    self.selectedWidgetRow = ko.observable();
	    self.selectedWidget = ko.observable();

	    if(!leaveEmpty) {
		self.createWidgetRow();
	    }
        };
        self.init(leaveEmpty, {});
    };

    instantiateRemoteModel = function(leaveEmpty) {
	if (rm) {
	    ko.cleanNode($("html")[0]);
	} else {
	    rm = new RemoteModel(leaveEmpty);
	}
    };
    instantiateRemoteModel(false);
    rm.init(false, {});
    ko.applyBindings( rm );
    // Dialogs
    var remoteDialogElem = $("#RemoteDialog");
    remoteDialogElem.dialog({
	autoOpen: false,
	modal: true,
	width: 500,
	buttons: {
	    "Save": rm.saveRemoteSettings,
	    "Cancel": function() { $( this ).dialog( "close" ); }
	}
    });
});
var instantiateRemoteModel,
availableIcons = ICONS,
PHONE_WIDTH = 235,
PHONE_HEIGHT = 350,
actionCounter = 0;

//http://www.unifiedremote.com/guide/custom-getting-started
//http://unifiedremote.com/schemas/remote.xsd
//http://unifiedremote.com/Downloads/v2/custom/actions.htm
//http://unifiedremote.com/Downloads/v2/custom/keys.htm
//http://forum.unifiedremote.com/viewtopic.php?f=50&t=1766
//http://wiki.unifiedremote.com/wiki/Documentation#Custom_Remotes