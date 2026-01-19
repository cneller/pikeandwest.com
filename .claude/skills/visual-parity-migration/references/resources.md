# External Resources

Curated articles, tools, and documentation for visual parity migration.

## Visual Regression Testing

### BackstopJS

- [BackstopJS GitHub](https://github.com/garris/BackstopJS) - Official repository
- [BackstopJS Alternatives](https://medium.com/@sarah.thoma.456/backstopjs-alternatives-for-visual-testing-e26291c04cdb) - Comparison with Percy, Chromatic
- [Visual Regression Testing Comparison](https://sparkbox.com/foundry/visual_regression_testing_with_backstopjs_applitools_webdriverio_wraith_percy_chromatic) - SaaS vs DIY tools

### Alternative Tools

- [Visual Regression Tracker (VRT)](https://github.com/Visual-Regression-Tracker/Visual-Regression-Tracker) - Self-hosted, Docker-based
- [Loki](https://loki.js.org/) - For Storybook component testing
- [Reg-suit](https://reg-viz.github.io/reg-suit/) - Extensible, CLI-based
- [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot) - Jest plugin
- [Resemble.js](https://github.com/rsmbl/Resemble.js) - JavaScript image comparison library
- [Pixelmatch](https://github.com/mapbox/pixelmatch) - Lightweight pixel-level diffing

### Commercial Options

- [Percy by BrowserStack](https://percy.io/) - AI-powered, 5,000 free screenshots/month
- [Applitools](https://applitools.com/) - AI visual testing
- [Chromatic](https://www.chromatic.com/) - For Storybook, by maintainers

## CSS Extraction Tools

### Browser Extensions

- [ExtractCSS](https://www.extractcss.dev/) - Extract complete CSS from any element
- [CSS Scan](https://getcssscan.com) - Copy CSS with one click
- [CSS-Diff Chrome Extension](https://github.com/kdzwinel/CSS-Diff) - Compare two elements

### CSS Comparison

- [SemanticDiff CSS](https://semanticdiff.com/online-diff/css/) - Semantic CSS diff
- [Project Wallace CSS Diff](https://www.projectwallace.com/css-diff) - Line-by-line comparison
- [cssdiff](https://inlife.github.io/cssdiff/) - Calculate semantic difference
- [Online Text Compare CSS](https://onlinetextcompare.com/css) - Two-way comparison

### CSS Auditing

- [CSS-Tricks: Tools for Auditing CSS](https://css-tricks.com/tools-for-auditing-css/) - Comprehensive overview
- [Superposition](https://superposition.design/) - Desktop app, style analysis

## Webflow Documentation

### Export & CSS

- [Webflow Code Export Help](https://help.webflow.com/hc/en-us/articles/33961386739347-How-do-I-export-my-Webflow-site-code)
- [Webflow Classes Documentation](https://help.webflow.com/hc/en-us/articles/33961311094419-Classes)
- [Client-First CSS System](https://finsweet.com/client-first/docs/classes-strategy-1) - Popular naming convention
- [BEM in Webflow](https://webflow.com/blog/class-naming-101-bem) - Block Element Modifier

### Naming Conventions

- [2024 Guide to Webflow Naming Conventions](https://www.nikolaibain.com/blog/webflow-naming-conventions)
- [Refokus Styleguide](https://www.webflow-tools.refokus.com/styleguide) - Best practices

## Hugo Resources

### Documentation

- [Hugo Official Docs](https://gohugo.io/documentation/)
- [Hugo Pipes (SCSS)](https://gohugo.io/hugo-pipes/scss-sass/)
- [Hugo Image Processing](https://gohugo.io/content-management/image-processing/)
- [Hugo Migrate Tools](https://gohugo.io/tools/migrations/)

### Theme Development

- [Hugo Theme Best Practices](https://discourse.gohugo.io/t/best-practices-for-theme-development-hugo-modules/30568)
- [Building Hugo Themes](https://dasroot.net/posts/2025/12/building-hugo-themes-with-go-templates/)

## AI-Assisted Development

### Screenshot-to-Code

- [screenshot-to-code GitHub](https://github.com/abi/screenshot-to-code) - Open source, supports Claude
- [Evaluating Claude for Screenshot-to-Code](https://github.com/abi/screenshot-to-code/blob/main/blog/evaluating-claude.md) - Claude vs GPT-4 Vision
- [Claude for Product Design](https://uxplanet.org/claude-for-code-how-to-use-claude-to-streamline-product-design-process-97d4e4c43ca4) - UI workflow

### Workflow

Claude iterative screenshot-to-code workflow:

1. Give Claude a screenshot of target UI
2. Have it generate HTML + CSS
3. Take screenshot of generated output
4. Compare to original
5. Iterate until pixel-perfect

## Browser DevTools

### Chrome DevTools

- [Chrome DevTools CSS Reference](https://developer.chrome.com/docs/devtools/css/reference)
- [View and Change CSS](https://developer.chrome.com/docs/devtools/css)
- [CSS Features Reference](https://developer.chrome.com/docs/devtools/css/reference)

### Computed Styles

- [CSS-Tricks: Computed Values](https://css-tricks.com/computed-values-more-than-meets-the-eye/)
- [MDN: getComputedStyle()](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle)

## Migration Case Studies

- [From HTML to Hugo Migration](https://www.digitaldias.com/blog/2025-11-19-from-html-to-hugo-migration/) - Migration story with lessons
- [Pixel-Perfect Comparisons](https://dev.to/sidmohanty11/how-to-ensure-pixel-perfect-comparisons-between-websites-26h6) - SSDiff technique

## CSS Methodologies

- [CSS Methodologies Guide](https://www.webfx.com/blog/web-design/css-methodologies/) - OOCSS, BEM, SMACSS
- [Systematic CSS](https://www.creativebloq.com/features/a-web-designers-guide-to-css-methodologies) - Four-phase approach
- [Understanding CSS Methodologies](https://medium.com/@hossein.khoshnevis77/understanding-and-implementing-css-methodologies-a-guide-for-web-developers-572983f0e9fe)
