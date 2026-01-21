# Pike & West

[![Hugo](https://img.shields.io/badge/Hugo-0.154+-FF4088?logo=hugo&logoColor=white)](https://gohugo.io/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Lighthouse](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/cneller/pikeandwest.com/main/.github/badges/lighthouse.json)](https://github.com/cneller/pikeandwest.com/actions/workflows/perf.yml)
[![CI](https://github.com/cneller/pikeandwest.com/actions/workflows/ci.yml/badge.svg)](https://github.com/cneller/pikeandwest.com/actions/workflows/ci.yml)
[![Deploy](https://github.com/cneller/pikeandwest.com/actions/workflows/deploy.yml/badge.svg)](https://github.com/cneller/pikeandwest.com/actions/workflows/deploy.yml)

Art gallery and event venue website for Pike & West in Germantown, TN. Built with Hugo, deployed on Cloudflare Pages.

**[pikeandwest.com](https://pikeandwest.com)**

## Quick Start

### Prerequisites

- [Hugo Extended](https://gohugo.io/installation/) v0.146.0+
- [Node.js](https://nodejs.org/) 20+ (for visual regression testing)

### Development

```bash
git clone https://github.com/cneller/pikeandwest.com.git
cd pikeandwest.com
npm install
hugo server -D
```

Site available at `http://localhost:1313`.

### Build

```bash
hugo --gc --minify
```

## Tech Stack

- **Static Site Generator**: Hugo (Extended)
- **Styling**: SCSS with Hugo Pipes
- **Deployment**: Cloudflare Pages
- **CI/CD**: GitHub Actions
- **Performance**: Lighthouse CI
- **Visual Testing**: BackstopJS

## Deployment

Automatic via GitHub Actions:

- **Production**: Push to `main` deploys to [pikeandwest.com](https://pikeandwest.com)
- **Preview**: Pull requests get preview URLs at `*.pikeandwest.pages.dev`

## Contributing

1. Create a feature branch from `main`
2. Make changes following patterns in [CLAUDE.md](CLAUDE.md)
3. Run `hugo --gc --minify` to verify build
4. Submit a pull request

Pull requests automatically receive preview deployments and Lighthouse reports.

## Documentation

For detailed development guidelines, design system specifications, and architecture decisions, see [CLAUDE.md](CLAUDE.md).

| Document                                                     | Description                              |
|--------------------------------------------------------------|------------------------------------------|
| [CLAUDE.md](CLAUDE.md)                                       | Development guidelines and design system |
| [docs/next-steps.md](docs/next-steps.md)                     | Current status and roadmap               |
| [docs/architecture/decisions/](docs/architecture/decisions/) | Architecture Decision Records            |

## License

Private repository. All rights reserved.

---

_"Art and Life. Life and Art. Life as Art."_
