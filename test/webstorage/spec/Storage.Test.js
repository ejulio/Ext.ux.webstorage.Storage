describe('Storage Test', function()
{
    var storage,
        useLocalStorage = true;
    function createStorage(storageArea)
    {
        storage = Ext.create('Ext.ux.webstorage.Storage', {
            storage: storageArea
        });    
    }
    
    beforeEach(function()
    {
        createStorage(useLocalStorage ? localStorage : sessionStorage); 
        useLocalStorage = !useLocalStorage;   
    });
    
    afterEach(function()
    {
        sessionStorage.clear();
        localStorage.clear();    
    });
    
    it('Save using localStorage', function()
    {
        createStorage(window.localStorage);    
        
        storage.set('test', 'some value');
        
        expect(localStorage['test']).toEqual('some value');
    });    
    
    it('Save using sessionStorage', function()
    {
        createStorage(window.sessionStorage);
        storage.set('sessionTest', 'some value');
        
        expect(sessionStorage['sessionTest']).toEqual('some value');                        
    });
    
    it('Throw an exception if there\'s no storage', function() {
        expect(function()
        {
            createStorage();    
        }).toThrow('[Ext.ux.webstorage.Storage] Constructor\'s config must have a storage property');
    });
    
    it('Save an object', function()
    {
        var json = {
            someKey: 'some value'    
        };
        storage.setJson('jsonValue', json);
        
        json = JSON.stringify(json);
        
        expect(storage.get('jsonValue')).toEqual(json);        
    });
    
    it('Retrieve an object', function()
    {
        var json = {
            anotherKey: 'value',
            theLastKey: 'the last value'
        },
        storageJson;
        
        storage.setJson('retrieveJson', json);
        storageJson = storage.getJson('retrieveJson');
        
        expect(storageJson).toEqual(json);    
    });
    
    it('Retrieve some raw value', function()
    {
        var value;
        
        storage.set('rawKey', 'raw value');
        value = storage.get('rawKey');
        
        expect(value).toEqual('raw value');    
    });
    
    it('Get some value using a custom function', function()
    {
        var value;
        storage.set('customFn', 'lower');
        value = storage.get('customFn', function(value)
        {
            return value.toUpperCase();    
        }); 
        
        expect(value).toEqual('LOWER');
    });
    
    it('Get a number value', function()
    {
        var value;
        storage.set('numberValue', 123);
        value = storage.getNumber('numberValue');
        
        expect(value).toEqual(123);    
    });
    
    it('Get a boolean value', function()
    {
        var value;
        storage.set('booleanValue', true);
        value = storage.getBoolean('booleanValue');
        
        expect(value).toEqual(true);    
    });
    
    it('Save an array', function()
    {
        var value = ['a', 'b', 'c'];
        storage.setArray('arrayValue', value);
        value = storage.get('arrayValue');
        
        expect(value).toEqual('a|&|b|&|c');    
    });
    
    it('Save an array using a custom delimiter', function()
    {
        var value = ['a', 'b', 'c'];
        storage.arrayDelimiter = ';';
        storage.setArray('arrayDelimiterValue', value);
        value = storage.get('arrayDelimiterValue');
        
        expect(value).toEqual('a;b;c');   
    });
    
    it('Get an array value', function()
    {
        var value = ['a', 'b', 'c'],
            returnValue;
        storage.setArray('arrayDelimiterValue', value);
        returnValue = storage.getArray('arrayDelimiterValue');
        
        expect(returnValue).toEqual(value);   
    });
    
    it('Save using namespaces', function()
    {
        storage = Ext.create('Ext.ux.webstorage.Storage', {
            storage: sessionStorage,
            namespace: 'storagetest'    
        });    
        
        storage.set('namespace', 'namespace value');
        
        expect(sessionStorage['storagetest_namespace']).toEqual('namespace value');
    });
    
    it('Get using namespaces', function()
    {
        var value;
        storage = Ext.create('Ext.ux.webstorage.Storage', {
            storage: localStorage,
            namespace: 'storagetest'    
        });    
        
        storage.set('namespace', 'namespace value');
        value = storage.get('namespace');
        expect(value).toEqual('namespace value');
    });
    
    it('Listen to beforestorage event', function()
    {
        var handler = jasmine.createSpyObj('handler', ['callback']);
        
        storage.on('beforestorage', handler.callback);    
        storage.set('beforestorage', 'event');
        
        expect(handler.callback).toHaveBeenCalled();
    });
    
    it('Listen to afterstorage event', function()
    {
        var handler = jasmine.createSpyObj('handler', ['callback']);
        
        storage.on('afterstorage', handler.callback);    
        storage.set('afterstorage', 'new value');
        
        expect(handler.callback).toHaveBeenCalled();
    });
    
    it('Cancel the storage when beforestorage return false', function()
    {
        storage.on('beforestorage', function()
        {
            return false;    
        });        
        
        storage.set('tocancel', 'nothing');
        
        expect(storage.get('tocancel')).toBeUndefined();
    });
    
    it('Listen to browser\'s storage event using localStorage', function()
    {
        var win,
            handler = jasmine.createSpyObj('handler', ['callback', 'load']);
        
        createStorage(localStorage);
        storage.on('storage', handler.callback);
        
        win = window.open(location.href.replace('Storage.html', 'emptyLocalStorage.html'));
        win.addEventListener('load', handler.load);
        
        waitsFor(function()
        {
            return handler.load.wasCalled;
        }, 'Load wasn\'t called', 5000);
        
        runs(function()
        {
            expect(handler.callback).toHaveBeenCalled();  
        });
    });
    
    it('Listen to browser\'s storage event using sessionStorage', function()
    {
        var iframe,
            handler = jasmine.createSpyObj('handler', ['callback', 'load']);
        
        createStorage(sessionStorage);
        storage.on('storage', handler.callback);
        
        iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        iframe.src = location.href.replace('Storage.html', 'emptySessionStorage.html');
        iframe.addEventListener('load', handler.load);
        
        waitsFor(function()
        {
            return handler.load.wasCalled;
        }, 'Load wasn\'t called', 5000);
        
        runs(function()
        {
            expect(handler.callback).toHaveBeenCalled();  
        });
    });
    
    it('Save a compressed string', function()
    {
        storage = Ext.create('Ext.ux.webstorage.Storage', {
            storage: localStorage,
            textCompactor: true
        });
        
        storage.set('compressedText', 'value to be compressed');
        
        expect(localStorage['compressedText']).not.toEqual('value to be compressed');
    });
    
    it('Get a compressed string', function()
    {
        storage = Ext.create('Ext.ux.webstorage.Storage', {
            storage: localStorage,
            textCompactor: true
        });
        
        storage.set('compressedText', 'value to be compressed');
        
        expect(storage.get('compressedText')).toEqual('value to be compressed');       
    });
    
    it('Use a custom text compactor', function()
    {
        storage = Ext.create('Ext.ux.webstorage.Storage', {
            storage: sessionStorage,
            textCompactor: {
                compress: function(text){return text + '--';},
                decompress: function(text){return text.substring(1);}
            }
        });
        
        storage.set('compressedText', 'value to be compressed');
        
        expect(storage.get('compressedText')).toEqual('alue to be compressed--');         
    });
});
