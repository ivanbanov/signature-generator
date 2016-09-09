;(function(win) {
    'use strict';

    function escapeCharx(text) {
        var hex = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'],
            found = true,
            char = text.charCodeAt(0);

        switch(char) {
            case 38: return '&amp;';
            case 198: return '&AElig;';
            case 193: return '&Aacute;';
            case 194: return '&Acirc;';
            case 192: return '&Agrave;';
            case 197: return '&Aring;';
            case 195: return '&Atilde;';
            case 196: return '&Auml;';
            case 199: return '&Ccedil;';
            case 208: return '&ETH;';
            case 201: return '&Eacute;';
            case 202: return '&Ecirc;';
            case 200: return '&Egrave;';
            case 203: return '&Euml;';
            case 205: return '&Iacute;';
            case 206: return '&Icirc;';
            case 204: return '&Igrave;';
            case 207: return '&Iuml;';
            case 209: return '&Ntilde;';
            case 211: return '&Oacute;';
            case 212: return '&Ocirc;';
            case 210: return '&Ograve;';
            case 216: return '&Oslash;';
            case 213: return '&Otilde;';
            case 214: return '&Ouml;';
            case 222: return '&THORN;';
            case 218: return '&Uacute;';
            case 219: return '&Ucirc;';
            case 217: return '&Ugrave;';
            case 220: return '&Uuml;';
            case 221: return '&Yacute;';
            case 225: return '&aacute;';
            case 226: return '&acirc;';
            case 230: return '&aelig;';
            case 224: return '&agrave;';
            case 229: return '&aring;';
            case 227: return '&atilde;';
            case 228: return '&auml;';
            case 231: return '&ccedil;';
            case 233: return '&eacute;';
            case 234: return '&ecirc;';
            case 232: return '&egrave;';
            case 240: return '&eth;';
            case 235: return '&euml;';
            case 237: return '&iacute;';
            case 238: return '&icirc;';
            case 236: return '&igrave;';
            case 239: return '&iuml;';
            case 241: return '&ntilde;';
            case 243: return '&oacute;';
            case 244: return '&ocirc;';
            case 242: return '&ograve;';
            case 248: return '&oslash;';
            case 245: return '&otilde;';
            case 246: return '&ouml;';
            case 223: return '&szlig;';
            case 254: return '&thorn;';
            case 250: return '&uacute;';
            case 251: return '&ucirc;';
            case 249: return '&ugrave;';
            case 252: return '&uuml;';
            case 253: return '&yacute;';
            case 255: return '&yuml;';
            case 162: return '&cent;';
            default: found=false;
        }

        if(!found && char > 127) {
            var arr = new Array(4),
                a;

            for (a in arr) {
                arr[a] = char % 16;
                char = Math.floor(char / 16);
            }

            return '&#x' + hex[arr[3]] + hex[arr[2]] + hex[arr[1]] + hex[arr[0]] + ';';
        } else {
            return text;
        }
    }

    function escapeHTML(text) {
        var preescape = '' + text,
            escaped = '',
            i = 0,
            p;

        for(; i < preescape.length; i++) {
            p = preescape.charAt(i);
            p = '' + escapeCharx(p);
            escaped = escaped + p;
        }

        return escaped;
    }

    /*
     * GLOBAL
     */
    win.escapeHTML = escapeHTML;
}(window));