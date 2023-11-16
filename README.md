# `bluecubecraft`

1. Install [`bun`](https://bun.sh/) (consider [using Homebrew](https://github.com/oven-sh/homebrew-bun#install)).
2. Run:

```shell
git clone https://github.com/lgarron/bluecubecraft && cd bluecubecraft

make dev
```
Note that you'll probably have to grant scripting access in System Settings to whichever app you run this from.

## Key Configuration
`keyConfig` is used to configure the behavior of the keys
- `true`: The key will be held down until another move is registered, then it will be released. Useful for the left/right click function
- `false`: The key will be pressed and then immediately released.
By default, all but U move, is false.

## Move to Key Mapping
`moveMapping` to map to moves from the cube to the keys.

In Minecraft, map left click to O key.