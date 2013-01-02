var generateConfig = function () {
    var configString = $( "#xmlConfig" ).html();
    configString = configString.replace( / data-bind=\".*?\"/g, "" ); // remove data-bind attribute
    configString = configString.replace( /TextLabel/g, "Label" ); // due to bootstrap label class conflict
    configString = configString.replace( /<!--.*?-->/g, "" ); // remove comments
    configString = configString.replace( /\s+\n/g, "\n" ); 
    configString = correctCase( configString );
    configString = '<?xml version="1.0" encoding="utf-8" ?>\n<ur:Remote xmlns:ur="http://unifiedremote.com/schemas/remote.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://unifiedremote.com/schemas/remote.xsd http://unifiedremote.com/schemas/remote.xsd"' + ' Name="'+rm.name() + '" Icon="'+ rm.icon() + '" Author="'+ rm.author() + '" Description="'+ rm.description() +'">' + configString;
    return configString;
};
var correctAttrCase = function ( match, ignore, attrName, firstChar, endAttrName, endAttr, index, str ) {
    var camelAttrList = ['TextAlign', 'OnClick', 'OnLaunch', 'OnVolumeUp', 'OnVolumeDown', 'OnPause', 'OnResume', 'OnActivated', 'OnDeactivated', 'OnMenu', 'DefaultRowSpacing', 'DefaultRowMargin', 'OnUpdate', 'UpdateInterval', 'ID', 'OnChange', 'OnProgress', 'ProgressMax', 'OnUp', 'OnDown', 'OnItem', 'OnLong', 'OnStart', 'OnStop', 'OnDone'], // TODO: move to global
        camelAttrListLower = camelAttrList.join( "," ).toLowerCase().split( "," ), // TODO: move to global
        indexOfCamelAttr = camelAttrListLower.indexOf( attrName ),
        convertedAttrName = "";
    if ( indexOfCamelAttr >= 0 ) {
        // correct attr case (camel)
        convertedAttrName = camelAttrList[indexOfCamelAttr];
    } else {
        convertedAttrName = firstChar.toUpperCase() + endAttrName;
    }
    return " " + convertedAttrName + endAttr;
};
var correctTagCase = function ( match, tagName, firstChar, tagNameEnd, tagEnd, innerHtml, index, str ) {
    var camelTagList = ['ActionRef'], // TODO: move to global
        camelTagListLower = camelTagList.join( "," ).toLowerCase().split( "," ), // TODO: move to global
        indexOfCamelTag, convertedTagName;

    if ( innerHtml ) {
        innerHtml = correctCase( innerHtml );
    }
    if ( tagEnd ) {
        tagEnd = tagEnd.replace( /( (([a-z])([a-z]*))(="\S*"))/g, correctAttrCase );
    }
    indexOfCamelTag = camelTagListLower.indexOf( tagName );
    if ( indexOfCamelTag >= 0 ) {
        // correct tag case (camel)
        convertedTagName = camelTagList[indexOfCamelTag];
    } else {
        convertedTagName = firstChar.toUpperCase() + tagNameEnd;
    }

    return "<" + convertedTagName + tagEnd + innerHtml + "</" + convertedTagName + ">";
};
/**
 * The browser will lowercase all of the tag names and attributes and Unified Remote configs are case-sensitive.
 * This method uppercases the first letter of the tag names and attributes to comply.
 * @param xml
 * @param camelTagList - a list of camel-cased tag names
 * @param camelAttrList - a list of camel-cased attribute names
 * @return {*} - returns case-corrected XML
 */
var correctCase = function ( xml ) {
    var pattern = /<(([a-z])([a-z]*)\b)([^>]*>)([\s\S]*?)<\/\1>/g;
    return xml.replace( pattern, correctTagCase );
};