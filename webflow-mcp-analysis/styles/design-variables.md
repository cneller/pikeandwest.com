# Pike & West Design Variables

Extracted via Webflow MCP Designer API on 2026-01-20.

## Variable Collection

**Collection:** Base collection
**Collection ID:** `collection-5b57c6b5-0ea9-51af-768e-e8422979cbe9`

## Color Variables

| Variable | Value     | CSS Custom Property |
|----------|-----------|---------------------|
| White    | `white`   | --white             |
| Black    | `black`   | --black             |
| PW Black | `#434345` | --pw-black          |
| PW Gold  | `#aa6e0b` | --pw-gold           |
| PW Cream | `#fff7e1` | --pw-cream          |

## Variable IDs Reference

| Variable | ID                                              |
|----------|-------------------------------------------------|
| White    | `variable-f6e76106`                             |
| Black    | `variable-c9fc6c52`                             |
| PW Black | `variable-e395d210-d4a2-35f6-1fef-7113184c7004` |
| PW Gold  | `variable-cb5f04d1-a461-a353-7dbb-f2bdabea4014` |
| PW Cream | `variable-14b1c4d7-6691-6641-704c-499cf93cab3b` |

## Comparison with CLAUDE.md

**IMPORTANT: CLAUDE.md has INCORRECT values!**

| Color | CLAUDE.md (Wrong) | Webflow (Correct)               |
|-------|-------------------|---------------------------------|
| Black | `#000000`         | `#434345` (dark gray)           |
| Gold  | `#C9A227`         | `#aa6e0b` (darker, warmer gold) |
| Cream | `#FFFDD0`         | `#fff7e1` (warmer cream)        |

## Hugo SCSS Update Required

Update `assets/scss/_variables.scss` to use correct values:

```scss
// Colors - verified against Webflow MCP extraction 2026-01-20
:root {
  --white: white;
  --black: black;
  --pw-black: #434345;
  --pw-gold: #aa6e0b;
  --pw-cream: #fff7e1;
}

// SCSS variables for convenience
$color-white: var(--white);
$color-black: var(--black);
$color-pw-black: var(--pw-black);
$color-pw-gold: var(--pw-gold);
$color-pw-cream: var(--pw-cream);
```
