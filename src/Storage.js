/**
 * @class Ext.ux.webstorage.Storage
 * @extend Ext.util.Observable
 * This class is a wrapper for localStorage and sessionStorage providing methods to manipulate data such as JSON, array, boolean, number and string.
 // localStorage
 var localStorage = Ext.create('Ext.ux.webstorage.Storage', {
     storage: localStorage
 }); 
 
 // sessionStorage
 var sessionStorage = Ext.create('Ext.ux.webstorage.Storage', {
     storage: localStorage
 }); 
 */
Ext.define('Ext.ux.webstorage.Storage', {
    
    extend: 'Ext.util.Observable',
    
    requires: [
        'Ext.ux.webstorage.TextCompactor'
    ],
    
    /**
     * @private
     * @cfg {Storage} storage The storage area to be used to store the data (localStorage or sessionStorage) 
     */
    
    /**
     * @private
     * @cfg {Storage} _storage The storage area to be used to store the data (localStorage or sessionStorage). This is the value of the {@link storage} config
     */
    _storage: null,
    
    /**
     * @cfg {String} arrayDelimiter A string used to separate array values when using {@link setValue} or {@link getValue} 
     */
    arrayDelimiter: '|&|',
    
    /**
     * @cfg {String} namespace The namespace to be concatenated with '_' and  the property name to {@link set} or {@link get} a value 
     */
    namespace: '',
    
    /**
     * @cfg {Object} textCompactor An object with two functions used to compress the values if necessary. See {@link Ext.ux.webstorage.TextCompactor} for more information.
     * @cfg {Function} textCompactor.compress A function to compress the text. This function is called by {@link set}
     * @cfg {Function} textCompactor.decompress A function to decompress the compressed text. This function is called by {@link get}
     */
    textCompactor: {
        compress: function(text){return text;},
        decompress: function(text){return text;}
    },
    
    constructor: function(config)
    {
        var me = this;
        if (!config.storage)
        {
            throw new Error('[Ext.ux.webstorage.Storage] Constructor\'s config must have a storage property');
        }
            
        me._storage = config.storage;
        me.namespace = config.namespace;
        
        if (config.textCompactor === true)
        {
            me.textCompactor = Ext.ux.webstorage.TextCompactor;
        }
        else if (config.textCompactor)
        {
            me.textCompactor = config.textCompactor;
        }
        
        me.initEvents();
        me.callParent();
    },
    
    initEvents: function()
    {
        var me = this;
        this.addEvents(
            /**
             * @event beforestorage
             * This event is fired before setting a value. If the return value is false, the isn't stored.
             * @param {String} key The key to be set
             * @param {Mixed} value The value to be stored
             * @param {Ext.ux.webstorage.Storage} this The storage object
             * @param {StorageArea} storage The HTML5 storage area  
             */
            'beforestorage',
            
            /**
             * @event afterstorage
             * This event is fired after a value has been set.
             * @param {String} key The key to be set
             * @param {Mixed} value The value to be stored
             * @param {Ext.ux.webstorage.Storage} this The storage object
             * @param {StorageArea} storage The HTML5 storage area 
             */
            'afterstorage',
            
            /**
             * @event storage
             * This event is the window's storage event.
             * @param {StorageEvent} storageEvent The event fired by the window.
             * @param {Ext.ux.webstorage.Storage} this The storage object 
             */
            'storage'
        );
        
        window.addEventListener('storage', function(storageEvent)
        {
            me.fireEvent('storage', storageEvent, me);
        });   
    },
    
    /**
     * @method set
     * This method sets the value to the storage area defined by {@link storage}
     * @param {String} key The key used to store the value.
     * @param {String} value The value to be stored
     localStorage.set('key', 'some value'); // localStorage.setItem('key', 'some value');
     
     // using a namespace
     var localStorage = Ext.create('Ext.ux.webstorage.Storage', {
         storage: localStorage,
         namespace: 'myapp'
     }); 
     localStorage.set('key', 'some value'); // localStorage.setItem('myapp_key', 'some value');
     */
    set: function(key, value)
    {
        var me = this,
            storage = me._storage;
        key = me.getKey(key);
        value = me.textCompactor.compress(value + '');
        if(me.fireEvent('beforestorage', key, value, me, storage))
        {
            storage[key] = value;
            me.fireEvent('afterstorage', key, value, me, storage);    
        }
    },     
    
    /**
     * @method get
     * This method gets the value to the storage area defined by {@link storage}
     * @param {String} key The key used to store the value.
     * @param {Function} fn A custom function to be used to return the value. This function will be invoked with the key's value as a string. 
     sessionStorage.set('key', 'the value');
     sessionStorage.get('key'); // the value
     
     // using a custom function
     var sessionStorage = Ext.create('Ext.ux.webstorage.Storage', {
         storage: sessionStorage,
         namespace: 'myapp'
     }); 
     sessionStorage.set('key', 'a custom function');
     sessionStorage.get('key', function(value){ return value + ' value'; } ); // a custom function value 
     */
    get: function(key, fn)
    {
        var value;
        key = this.getKey(key);
        value = this.textCompactor.decompress(this._storage[key]);
        return fn ? fn.call(this, value) : value;
    },
    
    /**
     * @method setJson
     * This method calls the native JSON.stringify method to save the data in JSON format
     * @param {String} key
     * @param {Object} value
     localStorage.setJson('jsonValue', {
        number: 5    
     }); // localStorage.setItem('jsonValue', '{"number": 5}');
     */
    setJson: function(key, value)
    {
        this.set(key, JSON.stringify(value));
    },
    
    /**
     * @method getJson
     * A method to return the storage data in JSON format. This method uses the native JSON.parse method. 
     * @param {String} key
     localStorage.get('jsonValue'); // {number: 5}
     */
    getJson: function(key)
    {
        return this.get(key, JSON.parse);
    },
    
    /**
     * @method getNumber
     * A method to return a number value from the storage.
     * @param {String} key
     sessionStorage.set('number', 5); // 5
     sessionStorage.get('number'); // "5"
     sessionStorage.getNumber('number'); // 5
     */
    getNumber: function(key)
    {
        return +this.get(key);    
    },
    
    /**
     * @method getBoolean
     * A method to return a boolean value from the storage
     * @param {String} key
     sessionStorage.set('bool', true); // true
     sessionStorage.get('bool'); // "true"
     sessionStorage.getBoolean('bool'); // true
     */
    getBoolean: function(key)
    {
        return this.get(key, this._getBoolean);
    },
    
    /**
     * @private
     * @method _getBoolean
     * A helper method to return a boolean value 
     * @param {String} value
     */
    _getBoolean: function(value)
    {
        return value.toLowerCase() === 'true';     
    },
    
    /**
     * @method setArray
     * A method to save an array value to the storage. This method uses the {@link arrayDelimiter} config to separate the items.
     * @param {String} key
     * @param {Array} value
     localStorage.setArray('array', ['a', 'b', 'c', 'd']); // localStorage.setItem('array', 'a|&|b|&|c|&|d');
     */
    setArray: function(key, value)
    {
        this.set(key, value.join(this.arrayDelimiter));
    },
    
    /**
     * @method getArray
     * This method returns an array value for the key. This method uses the {@link arrayDelimiter} config to split the values. 
     * @param {String} key
     localStorage.getArray('array'); // ['a', 'b', 'c', 'd']
     */
    getArray: function(key)
    {
        return this.get(key, this._getArray);
    },
    
    /**
     * @private
     * @method _getArray
     * A helper method to return an array value
     * @param {String} value
     */
    _getArray: function(value)
    {
        return value.split(this.arrayDelimiter);    
    },
    
    /**
     * @method getKey
     * A helper method to return a key concatenated with the storage namespace if it exists. 
     * @param {String} key
     var localStorage = Ext.create('Ext.ux.webstorage.Storage', {
         storage: localStorage,
         namespace: 'app'
     });
     localStorage.getKey('form'); // "app_form"
     */
    getKey: function(key)
    {
        return this.namespace ? this.namespace + '_' + key : key;
    }
});
