# MultiBank Web UI Automation

A TypeScript-based **Playwright** test automation project for validating key user journeys on the MultiBank public website.

The suite covers navigation, Spot market content, homepage and Company page content, negative scenarios, responsive layouts, and visual regression. It uses the **Page Object Model (POM)**, reusable test data, and GitHub Actions for CI execution.

| Project detail | Value |
|---|---|
| Target website | [https://mb.io/en](https://mb.io/en) |
| Spot market page | `https://mb.io/en/explore` |
| Framework | Playwright Test |
| Language | TypeScript |
| Browser projects | Chromium (Chrome) and Firefox |
| Reporting | Playwright HTML report |

---

## Contents

- [Implemented coverage](#implemented-coverage)
- [Browser and viewport coverage](#browser-and-viewport-coverage)
- [Framework architecture](#framework-architecture)
- [Repository structure](#repository-structure)
- [Prerequisites and installation](#prerequisites-and-installation)
- [Running the tests](#running-the-tests)
- [Visual regression testing](#visual-regression-testing)
- [Test reports and sample results](#test-reports-and-sample-results)
- [GitHub Actions](#github-actions)
- [Known limitations and assumptions](#known-limitations-and-assumptions)
- [Responsible testing](#responsible-testing)

---

## Implemented coverage

The following table maps the assignment areas to the implemented tests and describes their current scope.

| Area | Coverage | Test file / status |
|---|---|---|
| Navigation and layout | Validates expected navigation labels and URL patterns, Sign in / Sign up destinations, header visibility, and desktop horizontal overflow. | `navigation.spec.ts` |
| Spot market | Validates the Spot market heading and table, presence of market rows, Hot / Gainers / Losers controls, and visible asset, price, and percentage-change fields. | `trading.spec.ts` |
| Homepage and Company content | Checks homepage hero content, Company page headings and section text, and selected images. | `content-links.spec.ts` |
| App Store / Google Play links | Skipped because neither store link was found in the inspected homepage DOM. These checks are not counted as passing tests. | Explicitly skipped |
| Negative and edge scenarios | Checks invalid-route handling and horizontal overflow at a 375px mobile-width viewport. | `edge-cases.spec.ts` |
| Visual regression | Captures a full-page homepage screenshot at 1440 × 900 and compares it with a committed baseline. | `bonus.spec.ts` |
| API response validation | No API contract tests are currently included. | Not implemented |
| Parameterized test data | Navigation labels and expected URL patterns are data-driven; viewport settings are maintained separately. | Partially implemented |
| CI execution | GitHub Actions workflow configuration is included for Playwright execution and artifact upload. | See [GitHub Actions](#github-actions) |

### Framework highlights

- **Playwright Test + TypeScript** for browser automation and maintainable test code.
- **Page Object Model** to separate page interactions and locators from test specifications.
- **Reusable test data** stored separately from test logic.
- **Chromium and Firefox** projects for cross-browser execution.
- **Multiple viewport configurations** to exercise desktop, mobile-width, and visual-regression scenarios.
- Playwright web-first assertions and locator APIs.
- Screenshot-on-failure, video-on-failure, and trace-on-first-retry configuration.
- HTML test reporting and GitHub Actions integration.

---

## Browser and viewport coverage

The configured browser projects run the relevant test suite against:

- **Chromium (Chrome)**
- **Firefox**
- **Webkit**

The suite also checks the site at different viewport sizes:

| Scenario | Viewport | Purpose |
|---|---:|---|
| Desktop layout | 1366 × 768 | Navigation, header, and horizontal-overflow checks |
| Mobile-width layout | 375px wide | Responsive layout and horizontal-overflow checks |
| Visual regression | 1440 × 900 | Full-page homepage screenshot comparison |

This combination helps identify browser-specific rendering or interaction issues and responsive-layout problems.

**Scope clarification:** These are desktop browser projects with viewport variations. They do not represent native iOS or Android testing, and WebKit/Safari coverage is not currently claimed.

---

## Framework architecture

The project separates test intent, page interactions, and expected test data:

- **Test specifications** describe the behaviour being validated.
- **Page objects** encapsulate page locators and interactions.
- **Test data** stores expected labels, URL patterns, and content.
- **Playwright configuration** defines browser projects, execution settings, and reporting.

```mermaid
flowchart TD
    A["Playwright Test Runner"] --> B["Test specifications"]
    B --> C["Page Object layer"]
    B --> D["Test data"]
    C --> E["MultiBank public website"]
    D --> B
    A --> F["Playwright configuration"]
    F --> G["Chromium and Firefox projects"]
    A --> H["Assertions and test hooks"]
    H --> I["HTML report"]
    H --> J["Screenshots, videos and traces"]
    K["GitHub Actions"] --> A
```

### Design choices

- **Page Object Model:** Page-level locators and actions are maintained in `tests/pages/`. This keeps test cases readable and reduces duplicated selectors.
- **Data separation:** Navigation, trading, and content expectations are maintained in `tests/data/`.
- **Playwright Test:** Provides browser fixtures, test isolation, web-first assertions, retries, tracing, and HTML reporting.
- **TypeScript:** Provides type checking and supports maintainability as the suite grows.
- **Read-only scope:** Tests validate publicly accessible pages and do not submit financial transactions or personal information.

---

## Repository structure

```text
playwright-api-ui-automation-main/
├── .github/
│   ├── agents/
│   │   ├── playwright-test-generator.agent.md
│   │   ├── playwright-test-healer.agent.md
│   │   └── playwright-test-planner.agent.md
│   └── workflows/
│       ├── playwright.yml
│       └── playwright-tests.yml
├── .vscode/
│   ├── settings.json
│   └── mcp.json
├── tests/
│   ├── data/
│   │   └── multibank/
│   │       ├── content.ts
│   │       ├── navigation.ts
│   │       └── tradingPairs.ts
│   ├── pages/
│   │   └── multibank/
│   │       ├── HomePage.ts
│   │       ├── Navigation.ts
│   │       ├── SpotTradingSection.ts
│   │       ├── TradingPage.ts
│   │       └── WhyMultiBankPage.ts
│   ├── multibank/
│   │   ├── bonus.spec.ts
│   │   ├── content-links.spec.ts
│   │   ├── edge-cases.spec.ts
│   │   ├── navigation.spec.ts
│   │   ├── trading.spec.ts
│   │   └── bonus.spec.ts-snapshots/
│   │       └── homepage-chromium-darwin.png
│   └── seed.spec.ts
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── README.md
├── sample test results/
├── playwright-report/          # Generated HTML report
└── test-results/               # Generated test output
```

`node_modules/` is installed locally and is intentionally excluded from the source tree. It should not be committed to Git.

### Main test specifications

| File | Responsibility |
|---|---|
| `tests/multibank/navigation.spec.ts` | Navigation visibility, destination patterns, header actions, and desktop layout |
| `tests/multibank/trading.spec.ts` | Spot market section, market rows, category controls, and market-data fields |
| `tests/multibank/content-links.spec.ts` | Homepage hero, Company page content and images, and skipped app-store link checks |
| `tests/multibank/edge-cases.spec.ts` | Invalid route and mobile-width horizontal-overflow checks |
| `tests/multibank/bonus.spec.ts` | Homepage visual snapshot comparison |

### Page objects

| Page object | Responsibility |
|---|---|
| `Navigation.ts` | Header navigation and link access |
| `TradingPage.ts` | Spot market navigation, categories, rows, and market-data assertions |
| `SpotTradingSection.ts` | Reusable locators for the Spot trading region, tabs, and table |
| `HomePage.ts` | Homepage hero section and hero copy |
| `WhyMultiBankPage.ts` | Company page headings, imagery, and key section text |

### Test data

| File | Contents |
|---|---|
| `navigation.ts` | Expected navigation labels, URL patterns, header actions, and desktop viewport values |
| `tradingPairs.ts` | Expected trading field labels and trading viewport configuration |
| `content.ts` | Base URL, Company page URL, homepage hero heading, and Company page content expectations |

---

## Prerequisites and installation

### Prerequisites

- Node.js 20 LTS (recommended for local and CI consistency)
- npm
- Git

### 1. Clone the repository

```bash
git clone <repository-url>
cd playwright-api-ui-automation-main
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Install Playwright browsers

```bash
npx playwright install chromium firefox
```

On a fresh Linux machine or CI runner, install the required browser system dependencies as well:

```bash
npx playwright install --with-deps chromium firefox
```

---

## Running the tests

### Run the complete test suite

```bash
npm test
```

The configured `npm test` script is the single-command entry point for the full suite across the configured browser projects.

### Run an individual test area

```bash
npx playwright test tests/multibank/navigation.spec.ts
npx playwright test tests/multibank/trading.spec.ts
npx playwright test tests/multibank/content-links.spec.ts
npx playwright test tests/multibank/edge-cases.spec.ts
npx playwright test tests/multibank/bonus.spec.ts
```

### Run tests in a visible browser

```bash
npx playwright test --headed
```

### Run tests sequentially (useful for debugging)

```bash
npx playwright test --workers=1
```

### Open the HTML report

```bash
npx playwright show-report
```

---

## Visual regression testing

The visual regression test is implemented in:

```text
tests/multibank/bonus.spec.ts
```

It captures a full-page screenshot of the homepage at **1440 × 900** and compares it with the committed baseline:

```text
tests/multibank/bonus.spec.ts-snapshots/homepage-chromium-darwin.png
```

### Run the visual test

```bash
npx playwright test tests/multibank/bonus.spec.ts
```

### Update the baseline

Only update a baseline after reviewing the expected image, actual image, and visual diff:

```bash
npx playwright test tests/multibank/bonus.spec.ts --update-snapshots
```

The test uses a `maxDiffPixelRatio` of `0.02` (2%). Keep this threshold intentional; increasing it can hide genuine visual regressions.

**Note:** Playwright snapshots can be platform- and browser-specific. Generate and review baselines in the same browser and operating-system environment used for comparison.

---

## Test reports and sample results

The repository includes representative test execution output in:

```text
sample test results/
```

This folder is intended as a reference for the format and appearance of test run results.

After a local execution:

- `playwright-report/` contains the generated HTML report.
- `test-results/` contains generated test output and, where configured, failure artifacts such as screenshots, videos, and traces.

Open the latest HTML report with:

```bash
npx playwright show-report
```

**Important:** The files in `sample test results/` are representative samples. Refer to the newly generated local report or CI artifacts for the result of the latest execution and code revision.

---

## GitHub Actions

GitHub Actions workflow definitions are included under:

```text
.github/workflows/
```

The `playwright.yml` workflow is documented as installing Node.js 20 and Chromium, running the Playwright suite, and uploading test artifacts.

Review the workflow files in this directory to confirm which workflow is active and whether its browser installation steps match the configured Chromium and Firefox projects. The local browser setup documented above installs both browsers.

---
### Successful GitHub Actions Execution

A successful GitHub Actions workflow execution is available here with results captured as artifacts:

[View Successful GitHub Actions Run](https://github.com/vinayakkaladhar/multibank-group-qa-challenge/actions/runs/41800809096)

This execution demonstrates the successful workflow run and provides access to its recorded test results.

---

## Known limitations and assumptions

1. **Spot market terminology:** The inspected Spot market page displays individual crypto assets with price and percentage-change information. The current tests validate those observed fields; they do not claim to validate conventional currency pairs such as BTC/USD or ETH/USD.
2. **App Store and Google Play links:** Neither store link was found in the inspected homepage DOM. The corresponding checks are skipped because there was no matching link element to validate. This is not a passing test and does not establish that the store listings are unavailable.
3. **Category filtering:** The category test checks that Hot, Gainers, and Losers controls are present and that the market table remains populated after selection. It can be strengthened to verify that the displayed dataset changes appropriately for each selected category.
4. **Invalid route behaviour:** The invalid-route test accepts either an HTTP 4xx response or a visible, user-friendly error message. A redirect or HTTP 200 fallback without an error message will fail the test.
5. **Visual baseline differences:** Font rendering, browser versions, dynamic page content, and operating-system differences can affect screenshot comparisons.

These limitations are called out so that the README describes the implemented coverage accurately without overstating test results.

---

## Responsible testing

This project targets the public-facing MultiBank website and performs read-only UI validation. The automated checks do not create accounts, submit personal information, deposit funds, place trades, or initiate withdrawals.
