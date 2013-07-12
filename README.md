Ext.ux.webstorage.Storage
=========================

An ExtJS ux to work with localStorage and sessionStorage. It's not a polyfill, it's just a wrapper for some common tasks such as converting objects to a JSON string, parsing strings to an object.
This extension supports *sessionStorage* and *localStorage*

```javascript
// sessionStorage
var sessionStorage = Ext.create('Ext.ux.webstorage.Storage', {
  storage: window.sessionStorage
});

// localStorage
var localStorage = Ext.create('Ext.ux.webstorage.Storage', {
  storage: window.localStorage
});
```

### Using namespaces
It's possible to specify a namespace for the storage area avoiding colisions among keys.
```javascript
// sessionStorage
var sessionStorage = Ext.create('Ext.ux.webstorage.Storage', {
  storage: window.sessionStorage
  namespace: 'app'
});

sessionStorage.set('userId', 10); 
// is the same as
window.sessionStorage['app_userId'] = 10;
```

### Working with arrays and JSON
You can also save arrays and objects (JSON).
```javascript
// localStorage
var localStorage = Ext.create('Ext.ux.webstorage.Storage', {
  storage: window.localStorage
  arrayDelimtier: '|' // default value is |&|
});

localStorage.setArray('userProducts', ['A', 'BB', 'CCC']);
// is the same as
window.localStorage['userProducts'] = ['A', 'BB', 'CCC'].join('|');

// getting the array value
var products = localStorage.getArray('userProducts');
// is the same as
var products = window.localStorage['userProducts'].split('|');

localStorage.setJson('userProfile', {
  name: 'Zack',
  country: 'Brazil'
});
// is the same as
window.localStorage['userProfile'] = JSON.stringify({
  name: 'Zack',
  country: 'Brazil'
});

// getting the JSON value
var profile = localStorage.getJson('userProfile');
// is the same as
var profile = JSON.parse(window.localStorage['userProfile']);
```

### Compressing text
It's possible to compress the texts decreasing the space required to store them. This idea is based on [Adrew Betts' post](http://labs.ft.com/2012/06/text-re-encoding-for-optimising-storage-capacity-in-the-browser/) about localStorage and space.
```javascript
// sessionStorage
var sessionStorage = Ext.create('Ext.ux.webstorage.Storage', {
  storage: window.sessionStorage,
  textCompactor: true // it's possible to specify a custom compactor too
});

sessionStorage.set('text', 'some giant text');
```
