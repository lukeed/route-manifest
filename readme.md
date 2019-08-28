# route-manifest [![codecov](https://badgen.now.sh/codecov/c/github/lukeed/route-manifest)](https://codecov.io/gh/lukeed/route-manifest)

> A tiny (412B) runtime to retrieve the correct entry from a Route Manifest file.

This is the runtime/client-side component for [`webpack-route-manifest](https://github.com/lukeed/webpack-route-manifest).<br>
It is **required** that your manifest's routes be [sorted by specificity](https://github.com/lukeed/route-sort#specificity), which _is_ the webpack plugin's default setting.

> **Important:** This `route-manifest` _does not_ fetch files or apply headers on your behalf!

The module is available in three formats:

* **ES Module**: `dist/rmanifest.mjs`
* **CommonJS**: `dist/rmanifest.js`
* **UMD**: `dist/rmanifest.min.js`


## Install

```
$ npm install --save route-manifest
```


## Usage

```js
import { preload } from 'quicklink';
import rmanifest from 'route-manifest';

// Manually fetch Manifest file contents
fetch('/manifest.json').then(r => r.json()).then(data => {
  /*
    Assume Manifest (`data`) is:
    {
      [pattern]: {
        files: { href: string, type: string }
        headers: [...skip...]
      }
    }
  */

  const files = new Set();

  // We want to preload these pages' assets
  ['/blog', '/about', '/features'].forEach(str => {
    let entry = rmanifest(data, str);
    entry.files.forEach(x => files.add(x.href));
  });

  // Note:
  //   The `quicklink` module will do the actual prefetching!
  //   We just have have to give it a file path, or an array
  //   of file paths in this case~!
  return preload([...files]);
});
```


## API

### rmanifest(contents, uri, withCommons)
Returns: `{ files: Array, headers: Array }`

Returns an object containing `files` and `headers` keys, both of which will contain items that match your Manifest file's contents.


#### contents
Type: `Object`

The Manifest file's contents.<br>
Any format returned by [`webpack-route-manifest](https://github.com/lukeed/webpack-route-manifest) is valid.

> **Important:** The route pattern keys [must be sorted](https://github.com/lukeed/webpack-route-manifest#optionssort) for matching correctness.

#### uri
Type: `String`

The URL for which you want to find files or headers.

> **Note:** This should _only_ be the `pathname` segment of a URL, unless your patterns are explicitly looking for other segments.

#### withCommons
Type: `Boolean`<br>
Default: `false`

Whether or not the base/root-wildcard entry should be included.

When `true` and when a `"*"` pattern is defined, this will include the wildcard's entry _in addition to_ the route's own specific entry too, if any. The result is still a single object of `{ files, headers }` shape – the difference is just that the two entries have their keys' items concatenated into a single array.

When `false`, this module will _only_ return the entry _specific to_ the requested `uri` pathname.


## Related

* [webpack-route-manifest](https://github.com/lukeed/webpack-route-manifest) – generate a Route Manifest file for your webpack build
* [route-sort](https://github.com/lukeed/route-sort) – the route pattern sorter required for safe sequential matching
* [quicklink](https://github.com/GoogleChromeLabs/quicklink) – preloading utility that reacts to connection speed and browser support


## License

MIT © [Luke Edwards](https://lukeed.com)
