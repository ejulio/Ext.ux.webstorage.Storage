/**
 * @class Ext.ux.webstorage.TextCompactor
 * @singleton 
 * A class to save UTF-8 text as UTF-16 text allowing to use two chars in place of one. You can read more at http://labs.ft.com/2012/06/text-re-encoding-for-optimising-storage-capacity-in-the-browser/
 var compressed = Ext.ux.webstorage.compress('mytext'),
    decompressed = Ext.ux.webstorage.decompress(compressed);
    
 console.log(compressed);
 console.log(decompressed);
 
 */
Ext.define('Ext.ux.webstorage.TextCompactor', {
	singleton: true,
	
	/**
	 * @method compress
	 * This method compress' the given UTF-8 text as UTF-16 text. 
     * @param {String} text The text to be compressed
     * @return {String} The compressed text
	 */
	compress: function(text)
	{
        var chr1, chr2,
            str = '';
        for (var i = 0; i < text.length; i += 2)
        {
            chr1 = text.charCodeAt(i);
            chr2 = text.charCodeAt(i + 1);
            chr1 = (chr1 << 8) | chr2;
            str += String.fromCharCode(chr1);
        }
        return str;
	},
	
	/**
     * @method compress
     * This method decompress' the given UTF-16 text as UTF-8 text. 
     * @param {String} text The text to be decompressed
     * @return {String} The decompressed text
     */
	decompress: function(text)
	{
        var chr1, chr2,
            str = '';
        for (var i = 0; i < text.length; i++)
        {
            chr2 = text.charCodeAt(i);
            chr1 = chr2 >> 8; 
            chr2 = chr2 & 255;  
            str += String.fromCharCode(chr1);
            if (chr2 > 0)
            {
                str += String.fromCharCode(chr2);
            }
        }
        return str;
	}
	
});