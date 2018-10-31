# d1lookup

Add-on for [d1](https://github.com/vvvkor/d1).  
Autocomplete lookups with data from XHTTP request.
[Demo & docs](http://vadimkor.ru/projects/d1#lookup)

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
* Add ``data-label`` attribute with default label.
* Add ``data-url`` attribute to add link to selected resource. URL should have ``{id}`` substring that will be replaced with identifier of selected resource.

## Example

```
<input type="text" name="id" data-lookup="?table=users&q={q}" data-label="User One" data-url="/users/{id}" value="1">
```

## Options

### attrLookup

Input attribute, containing data source URL with ``{q}`` substring.  
Default: ``"data-lookup"``

### attrLabel

Default label (label of initial input value).  
Default: ``"data-label"``

### attrUrl

Link to selected resource with ``{id}`` substring.  
Default: ``"data-url"``

### listId

``Id`` of popup list element containing found autocomplete options.
Default: ``"lookup-list"``

### wait

Timeout before actual request after search string input, ms.  
Default: ``300``

### icon

Icon to show after input as a link to selected resource.  
Presented as array of 2 elements:
 1. ``id`` of SVG ``symbol`` to use as the icon, or empty string
 2. alternative text to show instead of icon if icon symbol is not set or is not found on page

Default: ``['edit','&rarr;']``

## Browser Support

* IE 10+
* Latest Stable: Chrome, Firefox, Opera, Safari

## License

[MIT](./LICENSE)
