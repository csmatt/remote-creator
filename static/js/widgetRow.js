var WidgetRowModel = function ( widgets ) {
    var self = this;
    self.widgets = ko.observableArray( widgets );
    self.height = ko.observable( WIDGET_HEIGHT );
    self.margin = ko.observable(0);
    self.padding = ko.observable(0);
    self.addWidget = function ( newWidget ) {
        self.widgets.push( newWidget );
        self.updateWidgetWidths();
	self._updateHeightHelper();
    };
    /** fixes width so the widgets don't overflow. kind of hacky **/
    self.updateWidgetWidths = function () {
        var numWidgets = self.widgets().length,
        newWidgetsWidth = (MAX_WIDGET_WIDTH / numWidgets),
        i;
	if (numWidgets > 1 && numWidgets < 8) {
	    newWidgetsWidth -= 1.5;
	} else if (numWidgets === 8) {
	    newWidgetsWidth -= 1;
	}
        for ( i = 0; i < numWidgets; i++ ) {
            self.widgets()[i].cm().width( newWidgetsWidth );
        }
    };
    self.updateHeight = function ( widget, event, ui ) {
        widget.updateHeight( ui );
	self._updateHeightHelper();
    };
    /** Updates the row height based on the longest widget **/
    self._updateHeightHelper = function() {
        var numWidgets = self.widgets().length,
        highestLength = MIN_WIDGET_HEIGHT,
        crntWidgetLength = 0,
        i;
        for ( i = 0; i < numWidgets; i++ ) {
            crntWidgetLength = self.widgets()[i].cm().height();
            if ( crntWidgetLength > highestLength ) {
                highestLength = crntWidgetLength;
            }
        }
        self.height( highestLength );
    };
};
