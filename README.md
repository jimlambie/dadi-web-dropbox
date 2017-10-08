# DADI Web Dropbox Provider

Uses the Dropbox API method `"files/list_folder"`. See https://dropbox.github.io/dropbox-api-v2-explorer/.

## Authentication


## Datasource Configuration

* **source.type:** `"dadi-web-dropbox"`
* **source.path:** the path 
* **fields:** an array of fields to add to the page context, for example ["name", "size"]. See the Datasource Results section below for examples.

```json
{
  "datasource": {
    "key": "dropbox",
    "name": "Blog posts from Dropbox",
    "source": {
      "type": "dadi-web-dropbox",
      "path": ""
    },
    "sort": {},
    "fields": []
  }
}
```

## Datasource Results

The response from Dropbox is added to the page's JSON context, using the key specified
in the datasource configuration.

```json
"dropbox": [
  {
    ".tag": "folder",
    "name": "test-folder",
    "path_lower": "/test-folder",
    "path_display": "/test-folder",
    "id": "id:ZnOjmcypYcAAAAAAAAAACA"
  },
  {
    ".tag": "file",
    "name": "testing.md",
    "path_lower": "/testing.md",
    "path_display": "/testing.md",
    "id": "id:ZnOjmcypYcAAAAAAAAAABg",
    "client_modified": "2017-10-08T11:43:20Z",
    "server_modified": "2017-10-08T11:43:20Z",
    "rev": "15d5935d2",
    "size": 3197,
    "content_hash": "7fb219dd99c3af92d38e6fd47f888b60c5e05836a061fa691aa4dbf337f6d61b"
  }
],
```