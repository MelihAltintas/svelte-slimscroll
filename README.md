# svelte-slimscroll
svelte-slimscroll is a action for Svelte.js, which can transforms any div into a scrollable area with a nice scrollbar.

The original jQuery version is here[https://github.com/rochal/jQuery-slimScroll](https://github.com/rochal/jQuery-slimScroll).

## Install
- Install it by using npm.

```
npm i svelte-slimscroll
```

- Import it at `svelte` project.

``` js
import {slimscroll} from "svelte-slimscroll"
```

## Usage

Using the `slimscroll` action
``` html
    <div use:slimscroll>
        ...
    </div>
```

Using action with options

``` html
    <div use:slimscroll={options}>
    ...
    </div>
<script>
   import {slimscroll} from "svelte-slimscroll"
</script>
```
> The `options` is same as jQuery version. See their [documentation](http://rocha.la/jQuery-slimScroll)

## License
[MIT](http://opensource.org/licenses/MIT)
