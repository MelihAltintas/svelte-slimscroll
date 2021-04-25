# svelte-slimscroll
svelte-slimscroll is a action for Svelte.js, which can transforms any div into a scrollable area with a nice scrollbar.

**Demo**: https://svelte.dev/repl/e8dcf07c3f3c4573a62ec289b1958005?version=3.29.4.


[![Stargazers repo roster for @MelihAltintas/svelte-slimscroll](https://reporoster.com/stars/MelihAltintas/svelte-slimscroll)](https://github.com/MelihAltintas/svelte-slimscroll/stargazers)
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

Options
-------
* **width** - width in pixels of the visible scroll area Default: auto
* **height** - Height in pixels of the visible scroll area.  Default: 250px
* **size** - Width in pixels of the scrollbar. Default: 7px
* **color** - Color in hex of the scrollbar. Default: #000
* **position** - left or right. Sets the position of the scrollbar. Default: right
* **distance** - distance in pixels between the side edge and the scrollbar It is used together with position property. Default:1px
* **start** - default scroll position on load - top / bottom / $('selector'). Default: top.
* **opacity** - sets scrollbar opacity. Default: 0.4.
* **alwaysVisible** - Disables scrollbar hide. Default: false
* **disableFadeOut** - Disables scrollbar auto fade. When set to true scrollbar doesn't disappear after some time when mouse is over the slimscroll div.Default: false
* **railVisible** - Enables scrollbar rail. Default: false
* **railColor** - Sets scrollbar rail color, Default: #333
* **railOpacity** - Sets scrollbar rail opacity. Default: 0.2
* **railClass** - defautlt CSS class of the slimscroll rail. Default: 'slimScrollRail'
* **barClass** - defautlt CSS class of the slimscroll bar. Default: 'slimScrollBar'
* **wrapperClass** - defautlt CSS class of the slimscroll wrapper. Default: 'slimScrollDiv'
* **allowPageScroll** - Checks if mouse wheel should scroll page when bar reaches top or bottom of the container. When set to true is scrolls the page.Default: false
* **wheelStep** - Integer value for mouse wheel delta. Default: 20
* **touchScrollStep** - Allows to set different sensitivity for touch scroll events. Negative number inverts scroll direction.Default: 200
* **borderRadius** - sets border radius.Default: 7px
* **railBorderRadius** - sets border radius of the rail.Default: 7px

## License
[MIT](http://opensource.org/licenses/MIT)
