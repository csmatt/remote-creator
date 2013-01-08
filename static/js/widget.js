var WidgetModel = function(action, type, newController) {
    var self = this;
    self.cm = ko.observable(newController || new ControllerModel(type, {}));
    self.action = ko.observable(action);

    self.shape = ko.computed(function(){ 
	return self.cm().type().toString();
    });
    self.imageUrl = ko.computed(function() {
	if ( self.cm().icon() !== "" && iconNameToImageUrlMap.hasOwnProperty( self.cm().icon() ) ) {
	    return iconNameToImageUrlMap[self.cm().icon()];
	}
	return '';
    });
    self.uiStyle = ko.computed(function() {
	var retVal = "";
	if (self.cm().isEnabled('icon')) {
	    retVal += "background-repeat: no-repeat; background-position: center;";
	    retVal += "background-image:url('";
	    retVal += self.imageUrl();
	    retVal += "');";
	}
	return retVal;
    });
    self.updateHeight = function(ui){
	self.cm().height(ui.size.height);
    };
};

var WIDGET_TYPES = ["Button","Orb","TextLabel","Toggle","Slider","TextBox"];//,"List"];
var WIDGET_DEFS = {
    Button: {
	enabledOptions: ['icon', 'text', 'textAlign']
    },
    Orb: {
	enabledOptions: ['icon', 'text', 'textAlign']
    },
    TextLabel: {
	enabledOptions: ['text', 'textAlign']
    },
    Toggle: {
	enabledOptions: ['icon', 'text', 'textAlign', 'checked']
    },
    Slider: {
	enabledOptions: []
    },
    TextBox: {
	enabledOptions: []
    }/*,
    List: {
	enabledOptions: ['items']
    }*/
};

/*var baseImageUrl = 'images/',
    iconNameToImageUrlMap = {
    LEFT: baseImageUrl + 'Ic_prev.png',
    RIGHT: baseImageUrl + 'Ic_next.png',
    UP: baseImageUrl + 'Ic_up.png',
    DOWN: baseImageUrl + 'Ic_down.png',
    PLAY: baseImageUrl + 'Ic_playback_play.png',
    PAUSE: baseImageUrl + 'Ic_playback_pause.png',
    STOP: baseImageUrl + 'Ic_playback_stop.png',
    NEXT: baseImageUrl + 'Ic_playback_next.png',
    PREVIOUS: baseImageUrl + 'Ic_playback_prev.png',
    FF: baseImageUrl + 'Ic_playback_ff.png',
    RWD: baseImageUrl + 'Ic_playback_rew.png',
    RECORD: baseImageUrl + 'Ic_playback_reload.png',
    VUP: baseImageUrl + 'Ic_sound_high.png',
    VDOWN: baseImageUrl + 'Ic_sound_low.png',
    VMUTE: baseImageUrl + 'Ic_sound_mute.png',
    BACK1: baseImageUrl + 'Ic_back1.png',
    BACK2: baseImageUrl + 'Ic_back2.png',
    FULLSCREEN: baseImageUrl + 'Ic_top_right_expand.png',
    HOME: baseImageUrl + 'Ic_home.png',
    PRINTSCREEN: baseImageUrl + 'Ic_photo.png',
    PLAYLIST: baseImageUrl + 'Ic_list_num.png',
    SELECT: baseImageUrl + 'Ic_select.png',
    TOP: baseImageUrl + 'Ic_arrow_top.png',
    GOTO: baseImageUrl + 'Ic_folder_open.png',
    REFRESH: baseImageUrl + 'Ic_playback_reload.png',
    MISSING: baseImageUrl + 'Ic_no_icon.png',
    FILE: baseImageUrl + 'Ic_document.png',
    FOLDER: baseImageUrl + 'Ic_folder.png',
    COMPUTER: baseImageUrl + 'Ic_net_comp.png',
    FAVORITE: baseImageUrl + 'Ic_star_fav.png',
    PLAY_PAUSE: baseImageUrl + 'Ic_playback_play_pause.png',
    ROTATE_LEFT: baseImageUrl + 'Ic_rotateleft.png',
    ROTATE_RIGHT: baseImageUrl + 'Ic_rotateright.png',
    ZOOM_IN: baseImageUrl + 'Ic_zoomin.png',
    ZOOM_OUT: baseImageUrl + 'Ic_zoomout.png',
    PRINT: baseImageUrl + 'Ic_print.png',
    TAB_CLOSE: baseImageUrl + 'Ic_tab_close.png',
    TAB_LEFT: baseImageUrl + 'Ic_tab_left.png',
    TAB_RIGHT: baseImageUrl + 'Ic_tab_right.png',
    ZOOM_NORMAL: baseImageUrl + 'Ic_zoom_normal.png',
    WINDOW: baseImageUrl + 'Ic_app_window.png',
    TAB_NEW: baseImageUrl + 'Ic_tab_new.png',
    TAB_SWITCH: baseImageUrl + 'Ic_tab_switch.png',
    ZOOM: baseImageUrl + 'Ic_zoom.png',
    WWW: baseImageUrl + 'Ic_www.png',
    WINDOWS: baseImageUrl + 'Ic_windows.png',
    THUMBS_UP: baseImageUrl + 'Ic_thumbs_up.png',
    THUMBS_DOWN: baseImageUrl + 'Ic_thumbs_down.png'
};*/
var baseImageUrl = 'http://wiki.unifiedremote.com/w/images/',
iconNameToImageUrlMap = {
    LEFT: baseImageUrl+'e/ee/Ic_prev.png',
    RIGHT: baseImageUrl+'2/21/Ic_next.png',
    UP: baseImageUrl+'2/22/Ic_up.png',
    DOWN: baseImageUrl+'9/95/Ic_down.png',
    PLAY: baseImageUrl+'8/81/Ic_playback_play.png',
    PAUSE: baseImageUrl+'5/5e/Ic_playback_pause.png',
    STOP: baseImageUrl+'0/07/Ic_playback_stop.png',
    NEXT: baseImageUrl+'5/5f/Ic_playback_next.png',
    PREVIOUS: baseImageUrl+'6/69/Ic_playback_prev.png',
    FF: baseImageUrl+'5/52/Ic_playback_ff.png',
    RWD: baseImageUrl+'6/60/Ic_playback_rew.png',
    RECORD: baseImageUrl+'b/b1/Ic_playback_reload.png',
    VUP: baseImageUrl+'0/0a/Ic_sound_high.png',
    VDOWN: baseImageUrl+'3/36/Ic_sound_low.png',
    VMUTE: baseImageUrl+'f/f7/Ic_sound_mute.png',
    BACK1: baseImageUrl+'c/ce/Ic_back1.png',
    BACK2: baseImageUrl+'8/87/Ic_back2.png',
    FULLSCREEN: baseImageUrl+'9/9a/Ic_top_right_expand.png',
    HOME: baseImageUrl+'3/33/Ic_home.png',
    PRINTSCREEN: baseImageUrl+'4/4a/Ic_photo.png',
    PLAYLIST: baseImageUrl+'7/7e/Ic_list_num.png',
    SELECT: baseImageUrl+'4/4e/Ic_select.png',
    TOP: baseImageUrl+'1/12/Ic_arrow_top.png',
    GOTO: baseImageUrl+'4/46/Ic_folder_open.png',
    REFRESH: baseImageUrl+'b/b1/Ic_playback_reload.png',
    MISSING: baseImageUrl+'1/1b/Ic_no_icon.png',
    FILE: baseImageUrl+'3/3a/Ic_document.png',
    FOLDER: baseImageUrl+'0/0f/Ic_folder.png',
    COMPUTER: baseImageUrl+'7/73/Ic_net_comp.png',
    FAVORITE: baseImageUrl+'b/be/Ic_star_fav.png',
    PLAY_PAUSE: baseImageUrl+'5/5b/Ic_playback_play_pause.png',
    ROTATE_LEFT: baseImageUrl+'2/21/Ic_rotateleft.png',
    ROTATE_RIGHT: baseImageUrl+'8/82/Ic_rotateright.png',
    ZOOM_IN: baseImageUrl+'f/f0/Ic_zoomin.png',
    ZOOM_OUT: baseImageUrl+'c/cc/Ic_zoomout.png',
    PRINT: baseImageUrl+'9/93/Ic_print.png',
    TAB_CLOSE: baseImageUrl+'2/20/Ic_tab_close.png',
    TAB_LEFT: baseImageUrl+'0/0c/Ic_tab_left.png',
    TAB_RIGHT: baseImageUrl+'0/07/Ic_tab_right.png',
    ZOOM_NORMAL: baseImageUrl+'3/38/Ic_zoom_normal.png',
    WINDOW: baseImageUrl+'1/1d/Ic_app_window.png',
    TAB_NEW: baseImageUrl+'9/97/Ic_tab_new.png',
    TAB_SWITCH: baseImageUrl+'7/7b/Ic_tab_switch.png',
    ZOOM: baseImageUrl+'f/f2/Ic_zoom.png',
    WWW: baseImageUrl+'1/1a/Ic_www.png',
    WINDOWS: baseImageUrl+'8/86/Ic_windows.png',
    THUMBS_UP: baseImageUrl+'8/86/Ic_thumbs_up.png',
    THUMBS_DOWN: baseImageUrl+'f/f8/Ic_thumbs_down.png'
};
var ICONS = [''];
for ( var iconName in iconNameToImageUrlMap ) {
    if ( iconNameToImageUrlMap.hasOwnProperty(iconName) ) {
	ICONS.push( iconName );
    }
}
