var saveSettingsToViewModel = function(viewModel, elements) {
    var nameAttr, value, i;
    for ( i = 0; i < elements.length; i++ ) {
	nameAttr = $(elements[i]).attr('name');
	value = $(elements[i]).val();
	viewModel[nameAttr](value);
    }
};
var showDialog = function() {
    $("#"+this).dialog({
	modal: true,
	width: 500,
	height: 350,
	buttons: {
	    "Close": function() { $(this).dialog("close"); }
	}
    });
};