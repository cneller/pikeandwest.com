# Visual Parity Techniques

Detailed techniques for extracting CSS, comparing layouts, and achieving visual parity.

## CSS Extraction Methods

### Browser DevTools Computed Tab

The Computed tab shows resolved CSS values after cascade resolution:

1. Right-click element, select "Inspect"
2. Switch to **Computed** tab (not Styles)
3. See actual applied values, not overridden declarations
4. Click arrow icon to jump to the CSS rule responsible

Key insight: Styles tab shows all rules including overridden ones. Computed tab shows only what's actually applied.

### JavaScript API: `getComputedStyle()`

Extract computed styles programmatically:

```javascript
const element = document.querySelector('.navbar1_component');
const styles = window.getComputedStyle(element);

// Get specific properties
console.log({
  background: styles.backgroundColor,
  height: styles.height,
  padding: styles.padding,
  font: styles.fontFamily
});
```

Use this in browser console to quickly extract values.

### ExtractCSS Tool

[ExtractCSS](https://www.extractcss.dev/) captures HTML structure and all relevant CSS:

- Complex selectors
- Pseudo-classes/elements
- Deep inheritance
- Pixel-perfect replicas

### CSS Scan Browser Extension

[CSS Scan](https://getcssscan.com) runs as browser extension:

- Works on any website
- Navigate DOM with arrow keys
- Inspect parent/sibling/child elements
- Copy exact CSS with one click

## CSS Comparison Methods

### CSS Diff Tools

Compare Webflow exported CSS against Hugo output:

| Tool                                                                | Best For                                   |
|---------------------------------------------------------------------|--------------------------------------------|
| [SemanticDiff](https://semanticdiff.com/online-diff/css/)           | Ignores whitespace, shows property changes |
| [Project Wallace CSS Diff](https://www.projectwallace.com/css-diff) | Line-by-line, formats before comparing     |
| [cssdiff](https://inlife.github.io/cssdiff/)                        | Shows added/removed/modified blocks        |

### CSS-Diff Chrome Extension

[GitHub: kdzwinel/CSS-Diff](https://github.com/kdzwinel/CSS-Diff)

Compare CSS of two HTML elements directly in DevTools:

1. Open DevTools (F12)
2. Go to "CSS Diff" tab in Elements panel
3. Click "Compare" and select two elements
4. See all CSS differences

## Visual Comparison Methods

### BackstopJS Workflow

Already configured in project. Workflow:

```bash
# Create reference screenshots from live Webflow site
npx backstop reference --config=backstop.json

# Run comparison against Hugo (localhost:1313)
npx backstop test

# Open HTML report
npx backstop openReport

# After fixing, update references
npx backstop approve
```

BackstopJS config supports:

- Multiple viewports (mobile, tablet, desktop)
- Selectors for specific sections
- Hide/remove selectors for dynamic content
- Scenario-based testing

### Screenshot Overlay Technique

For quick manual comparison without BackstopJS:

1. Take screenshot of Webflow section
2. Take screenshot of Hugo section at same viewport
3. Use image editor with layer opacity to overlay
4. Differences become visible as "ghosting"

### Playwright for Targeted Screenshots

```javascript
// Take screenshot of specific element
await page.locator('.hero-header-section').screenshot({
  path: 'hero-webflow.png'
});
```

## Element-by-Element Matching

Systematic approach for each mismatched element:

### 1. Structure Verification

Check HTML hierarchy matches:

- Same nesting levels
- Same element types (div, section, etc.)
- Same class structure

### 2. Box Model Properties

Compare in order:

1. `width`, `height`
2. `padding` (all sides)
3. `margin` (all sides)
4. `border` (width, style, color)
5. `box-sizing` (usually `border-box`)

### 3. Typography

Critical properties:

- `font-family` (exact stack)
- `font-size` (px or rem)
- `font-weight` (numeric value)
- `line-height` (unitless or px)
- `letter-spacing` (em or px)
- `text-transform` (uppercase, etc.)
- `color`

### 4. Layout Properties

Flex container:

- `display: flex`
- `flex-direction`
- `justify-content`
- `align-items`
- `gap`

Flex items:

- `flex-grow`, `flex-shrink`, `flex-basis`
- `order`

Grid (if used):

- `grid-template-columns`
- `grid-template-rows`
- `grid-gap`

### 5. Positioning

- `position` (static, relative, absolute, fixed)
- `top`, `right`, `bottom`, `left`
- `z-index`
- `transform`

### 6. Visual Effects

- `background` (color, image, gradient)
- `box-shadow`
- `border-radius`
- `opacity`
- `transition`

## Common Webflow-to-Hugo Gotchas

### 1. Webflow's Default Styles

Webflow includes normalize.css and base styles. Ensure Hugo has equivalent resets.

### 2. Viewport Units

Webflow uses `vh` and `vw` extensively. These may behave differently with mobile browser chrome.

### 3. Font Loading

Webflow hosts fonts on their CDN. Hugo needs fonts in `static/fonts/` or from Google Fonts CDN.

### 4. Image Processing

Webflow optimizes images automatically. Hugo needs explicit `Resize` and WebP conversion.

### 5. Hover States

Don't forget to compare `:hover`, `:focus`, and `:active` states.

### 6. Animation/Transitions

Webflow has built-in animations. May need to extract timing functions and keyframes.

## Debugging Tips

### 1. Isolate the Problem

When section doesn't match:

1. Remove all children, compare container only
2. Add children back one by one
3. Find which child causes the difference

### 2. Check Specificity

Webflow sometimes uses high-specificity selectors. Hugo's simpler selectors may be overridden.

### 3. Computed vs Authored

What you write in SCSS isn't always what browser uses. Always check Computed tab.

### 4. Inherited Properties

Typography and color often inherit from parent. Check parent elements for source.

### 5. Browser Defaults

Some differences come from browser defaults on elements like `ul`, `p`, `h1`. Ensure resets match.
