# `bluecubecraft`

1. Install [`bun`](https://bun.sh/) (consider [using Homebrew](https://github.com/oven-sh/homebrew-bun#install)).
2. Install [`chalk`](https://github.com/chalk/chalk)
3. Run:

```shell
git clone https://github.com/lgarron/bluecubecraft && cd bluecubecraft

make dev
```
Note that you'll probably have to grant scripting access in System Settings to whichever app you run this from.

Move Configuration: pressdown (true = hold key toggle, false = single press), color: Colour shown in console, Applescript KeyCod

## Key Configuration
`keyConfig` is used to configure the behavior of the keys
### Pressdown
- `true`: The key will be held down until another move is registered, then it will be released. Useful for the left/right click held function
- `false`: The key will be pressed and then immediately released.
By default, all but U move, is false.
### Color
Color logged as per move, using [`chalk`](https://github.com/chalk/chalk)
### keyCode
Corresponding ['applescript keycode](https://eastmanreference.com/complete-list-of-applescript-key-codes).

# Key Mapping in Minecraft
- For left and right click
    - Map `break block` to `O`
    - Map `use block` to `P`
