# d1lookup

Add-on for [d1](https://github.com/vvvkor/d1).  
Autocomplete lookups with data from XHTTP request.  
[Demo & docs](https://vvvkor.github.io/d1#lookup)

## Install

```
npm install d1lookup
```

## Usage

On page load call:
```
d1lookup.init(options);
```

In your markup:
* Add ``data-lookup`` attribute with value that is data source URL to load autocomplete data. URL should have ``{q}`` substring that will be replaced with search string.
* Add ``data-label`` attribute with label for initial value.
* Add ``data-url`` attribute to add link to selected resource. URL should have ``{id}`` substring that will be replaced with identifier of selected resource.

## Example

```
<input type="text" name="id" value="1"
	data-lookup="?table=users&q={q}"
	data-label="User One"
	data-url="/users/{id}">
```

## Options

### attrLabel

Label for initial input value.  
Default: ``"data-label"``

### attrLookup

Input attribute, containing data source URL with ``{q}`` substring.  
Default: ``"data-lookup"``

### attrUrl

Link to selected resource with ``{id}`` substring.  
Default: ``"data-url"``

### icon

Icon to show after input as a link to selected resource.  
Default: ``"edit"``

### listId

``Id`` of popup list element containing found autocomplete options.  
Default: ``"lookup-list"``

### max

Maximum options to show.  
Default: ``10``

### wait

Timeout before actual request after search string input, ms.  
Default: ``300``

## Browser Support

* IE 10+
* Latest Stable: Chrome, Firefox, Opera, Safari

## License

[MIT](./LICENSE)
