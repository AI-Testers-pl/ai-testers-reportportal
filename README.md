# AI Testers – ReportPortal

Przykładowy projekt **Playwright + TypeScript** pokazujący integrację z [ReportPortal](https://reportportal.io/) na bazie sklepu [playwrightworkshops.com](https://playwrightworkshops.com). Rozszerzenie tematów znajdziesz w programie **[AI_Testers](https://aitesters.pl)**.

## Co zawiera

- Page Object Model (`src/pages`)
- Warstwa flow z dependency injection (`src/flows/purchase.flow.ts`)
- Wspólny fixture `app` (`tests/fixtures/checkout.fixtures.ts`) udostępniający `app.pages` i `app.flows`
- Przykładowy test integrujący się z ReportPortal (`tests/reportportal_example/add-product.spec.ts`)
- Konfiguracja reportera ReportPortal w `playwright.config.ts` (włącza się automatycznie, gdy ustawione są zmienne środowiskowe)

## Instalacja projektu

### Kroki instalacji

1. Sklonuj repozytorium:

```bash
git clone https://github.com/AI-Testers-pl/ai-testers-reportportal.git
cd ai-testers-reportportal
```

2. Zainstaluj zależności:

```bash
npm install
npx playwright install
```

## Konfiguracja ReportPortal

1. Utwórz plik `.env` w katalogu głównym projektu.
2. Ustaw zmienne:
   - `REPORT_PORTAL_ENDPOINT` – adres instancji ReportPortal (np. `https://reportportal.example.com/api/v1`)
   - `REPORT_PORTAL_API_KEY` – token API użytkownika
   - `REPORT_PORTAL_PROJECT` – nazwa projektu w ReportPortal
   - `REPORT_PORTAL_LAUNCH` – opcjonalny prefix nazwy launcha (domyślnie `playwright-workshops-checkout`)

Jeśli wszystkie wymagane zmienne są ustawione, reporter `@reportportal/agent-js-playwright` jest doklejany automatycznie obok reporterów `list` i `html`.

Nazwa launcha jest budowana jako:

```
<REPORT_PORTAL_LAUNCH>-<TEST_PROFILE>-<YYYY-MM-DD>
```

Do każdego launcha doklejane są atrybuty: `framework=playwright`, `suite=checkout`, `profile=<TEST_PROFILE>`, `environment=<TEST_ENV|ci|local>`, `browser=chromium`, `node=<process.version>`, `os=<process.platform>`, `ci=<true|false>`.

### Atrybuty per‑test (dashboard‑friendly)

Każdy test wywołuje `applyRpAttributes({...})` z [src/utils/reporting.ts](src/utils/reporting.ts), co dokleja do test‑itemu w ReportPortal komplet atrybutów filtrowalnych:

| Atrybut | Wartości |
|---|---|
| `feature` | `cart` \| `checkout` \| `contact` \| `review` |
| `type` | `positive` \| `negative` |
| `priority` | `P0` \| `P1` \| `P2` |
| `risk` | `high` \| `medium` \| `low` |
| `area` | `ecommerce` \| `support` \| `social-proof` |
| `owner` | domyślnie `qa-core` |

Dodatkowo helper ustawia `ReportingApi.setTestCaseId(...)` (stabilna historia w RP) oraz `setDescription(...)` (krótkie AC w widoku testu).

W RP UI łatwo zbudować widgety: pass‑rate per `feature`, lista negatywnych (`type:negative`), priorytetowe failure (`priority:P0`), itd.

## Uruchamianie testów

Tryb domyślny w [playwright.config.ts](playwright.config.ts) to **headed** (`headless: false`) — przeglądarka jest widoczna, żeby łatwiej zobaczyć co się dzieje na ekranie. Headless włącza się przez zmienną `HEADLESS=true`. Profil `smoke` filtruje po tagu `@smoke` ([playwright.config.ts:10](playwright.config.ts#L10)).

### Skrypty npm

| Komenda | Co robi |
|---|---|
| `npm test` | Smoke (`@smoke`), headed, 3 worker'y lokalnie. Domyślna komenda. |
| `npm run test:smoke` | To samo co `npm test`. |
| `npm run test:all` | Pełny zestaw bez filtra `@smoke`. |
| `npm run test:headed` | Wymusza headed mode (flaga `--headed`). |
| `npm run test:headless` | Headless mode (`HEADLESS=true`) — szybciej, bez okna. |
| `npm run test:ui` | **Playwright UI Mode** — interaktywny runner z time‑travel, watch mode, podglądem DOM/network/console (zalecane do dev). |
| `npm run test:debug` | Debug mode — Playwright Inspector, breakpointy, krokowanie. |
| `npm run test:trace-on` | Wymusza `--trace=on` dla wszystkich testów (każdy ma trace.zip). |
| `npm run test:video-on` | Wymusza `--video=on` dla wszystkich testów. |
| `npm run test:scenario -- "<grep>"` | Pojedynczy scenariusz po fragmencie nazwy lub tagu. |
| `npm run codegen` | Otwiera Playwright Codegen — nagrywanie testów na sklepie. |
| `npm run report` | Otwiera ostatni raport HTML (`playwright-report/`). |
| `npm run trace <plik>` | Otwiera Trace Viewer dla wskazanego `trace.zip`. |

Bezpośrednie wywołania (poza skryptami):

```bash
# konkretny plik
npx playwright test tests/reportportal_example/add-product.spec.ts

# konkretny test po nazwie
npx playwright test --grep "add product to cart"

# filtr po tagu (np. tylko negatywne — testy w nazwach mają @smoke; tag negatywny dodajesz wedle uznania)
npx playwright test --grep "@smoke"

# wybrana liczba worker'ów
npx playwright test --workers=1

# konkretna przeglądarka (na razie tylko chromium w configu)
npx playwright test --project=chromium

# retry przy fail
npx playwright test --retries=2

# nagłówkowe + slow motion (świetne do prezentacji)
npx playwright test --headed --slow-mo=500
```

### UI Mode (interaktywny runner — polecane)

```bash
npm run test:ui
```

Co dostajesz:
- lista testów w lewym panelu + przyciski Run/Run all/Watch,
- **time‑travel debugging** — klikasz krok i widzisz snapshot DOM dokładnie z tej chwili,
- inspector z lokatorami, network, console, source,
- watch mode — zapis pliku = automatyczny re‑run,
- pick locator — wskazujesz element w podglądzie i dostajesz gotowy selektor.

### Headed vs headless

```bash
npm run test:headed     # widzisz przeglądarkę (domyślne w configu)
npm run test:headless   # bez okna — szybciej, do CI

# albo bezpośrednio:
HEADLESS=true npx playwright test
npx playwright test --headed
```

Headed dodatkowo zwalnia z `--slow-mo=<ms>` jeśli chcesz pokazać kroki podczas demo.

### Debug — Playwright Inspector

```bash
npm run test:debug                                # otwiera Inspector dla całej suite
PWDEBUG=1 npx playwright test --grep "add product"  # albo selektywnie
```

W Inspectorze: step over, resume, pick locator, copy locator, browser DevTools — wszystko w jednym oknie.

### Codegen — nagrywanie nowych testów

```bash
npm run codegen
# albo z konkretnej strony:
npx playwright codegen https://playwrightworkshops.com/contact/
```

Klikasz po stronie, Codegen pisze TypeScript w czasie rzeczywistym. Najlepsze do odkrywania selektorów dla nowych stron (właśnie tak były pisane nowe Page Objecty tu).

### Trace Viewer

Trace to pełny zapis tego, co Playwright widział: każdy snapshot DOM, network, console, source — można "przewijać" test jak film.

Kiedy projekt zapisuje trace:
- `trace: "on-first-retry"` (domyślne w configu) — tylko gdy retry, czyli zwykle przy CI.
- `trace: "on"` w teście `add-product.spec.ts` i `product-review.spec.ts` — zawsze.
- `npm run test:trace-on` — wymusza trace dla każdego testu w danym uruchomieniu.

Otwarcie:

```bash
# 1) przez skrypt
npm run trace -- test-results/<scenariusz>/trace.zip

# 2) bezpośrednio
npx playwright show-trace test-results/<scenariusz>/trace.zip

# 3) drag‑and‑drop pliku trace.zip na https://trace.playwright.dev
```

Trace pokazuje: timeline akcji, screenshoty przed/po, snapshoty DOM (czas rzeczywisty), zakładki Network/Console/Source/Errors. W ReportPortal trace ląduje automatycznie jako załącznik dla testów, które go zapisały — opcja `uploadTrace: true` w agencie (domyślna).

### Video

Konfiguracja: `video: "retain-on-failure"` w [playwright.config.ts](playwright.config.ts#L72) — tylko dla fail. `product-review.spec.ts` ma `video: "on"` na poziomie pliku. Aby globalnie:

```bash
npm run test:video-on
# lub:
npx playwright test --video=on
```

Video (webm) zapisuje się w `test-results/<scenariusz>/video.webm` i w ReportPortal trafia jako załącznik (opcja `uploadVideo: true`, domyślna).

### Raport HTML

Po każdym uruchomieniu generowany jest raport w `playwright-report/`:

```bash
npm run report
```

Raport zawiera: drzewo testów, kroki (`test.step`), logi, screenshoty, video, trace — wszystko klikalne.

### Filtrowanie testów (grep i tagi)

```bash
# fragment nazwy
npx playwright test --grep "checkout"

# negacja
npx playwright test --grep-invert "review"

# tag (testy w tym repo mają @smoke)
npx playwright test --grep "@smoke"

# kombinacja
npx playwright test --grep "checkout" --grep-invert "negative"

# poprzez skrypt
npm run test:scenario -- "add product"
```

### Zmienne środowiskowe

| Zmienna | Działanie |
|---|---|
| `TEST_PROFILE` | `smoke` (domyślnie) — filtruje po `@smoke`; `all` — pełny zestaw. |
| `TEST_ENV` | nazwa środowiska doklejana do launch‑level attribute (domyślnie `local`, `ci` przy `CI=true`). |
| `HEADLESS` | `true`/`1` — wymusza headless; pusta = headed. |
| `CI` | gdy ustawione: 2 worker'y, `forbidOnly`, `retries=1/2`, `maxFailures=2` dla smoke. |
| `REPORT_PORTAL_ENDPOINT` / `_API_KEY` / `_PROJECT` / `_LAUNCH` | konfiguracja RP (sekcja powyżej). |

## Co zobaczysz w ReportPortal

Testy używają `test.step(...)` aby raportować poszczególne kroki, oraz `test.info().attach(...)` do dołączania zrzutów ekranu. W ReportPortal pojawi się launch z testami, krokami, logami z `console.log` i załączonymi screenshotami.

### Zestaw testów (6 testów: 3 positive + 3 negative)

| # | Plik | Typ | Funkcja | Trace | Video |
|---|---|---|---|---|---|
| P1 | [add-product.spec.ts](tests/reportportal_example/add-product.spec.ts) | positive | cart | ✅ | ‑ |
| P2 | [contact-form.spec.ts](tests/reportportal_example/contact-form.spec.ts) | positive | contact | ‑ | ‑ |
| P3 | [product-review.spec.ts](tests/reportportal_example/product-review.spec.ts) | positive | review | ✅ | ✅ |
| N1 | [checkout-validation.spec.ts](tests/reportportal_example/checkout-validation.spec.ts) | negative | checkout | ‑ | ‑ |
| N2 | [contact-form.spec.ts](tests/reportportal_example/contact-form.spec.ts) | negative | contact | ‑ | ‑ |
| N3 | [product-review.spec.ts](tests/reportportal_example/product-review.spec.ts) | negative | review | ✅ | ✅ |

P3 ma włączone `video: 'on'` na poziomie pliku — w ReportPortal pojawi się załącznik `video.webm` oprócz `trace.zip` (oba auto‑uploadowane przez `@reportportal/agent-js-playwright`).

## Struktura katalogów

```
src/
  components/   # Component Objects (ProductReviewsSection)
  flows/        # logika scenariuszy (PurchaseFlow, ContactFlow, ReviewFlow)
  models/       # typy domenowe (ShippingInfo, ContactInquiry, ProductReview)
  pages/        # Page Objects (Shop, Cart, Checkout, Contact, Product)
  utils/        # helpery (text, reporting)
tests/
  fixtures/     # wspólny fixture `app`
  reportportal_example/
                # 4 pliki .spec.ts, łącznie 6 testów (3 positive + 3 negative)
```

## Linki

- 📊 ReportPortal: https://reportportal.io
- 🎭 Playwright: https://playwright.dev
- 💻 VS Code: https://code.visualstudio.com

---

# 📚 Zasoby edukacyjne

Zebraliśmy kolekcję zasobów, które pomogą Ci nauczyć się i opanować Playwright, zarówno w języku polskim, jak i angielskim. Niezależnie od tego, czy jesteś początkującym, czy zaawansowanym użytkownikiem, te zasoby pomogą Ci ulepszyć swoje umiejętności i wiedzę.

## 🇵🇱 Polskie zasoby

- [JavaScript i TypeScript dla testerów](https://jaktestowac.pl/js-ts/) - Kompleksowy (13h+) kurs JavaScript i TypeScript dla testerów, z praktycznymi przykładami i ćwiczeniami
- [Profesjonalna automatyzacja testów z Playwright](https://jaktestowac.pl/playwright/) - Kompleksowy (100h+) kurs Playwright, automatyzacji testów, CI/CD i architektury testów
- [Automatyzacja testów backend](https://jaktestowac.pl/api/) - Kompleksowy (45h+) kurs automatyzacji testów backend z Postman, Mocha, Chai i Supertest
- [Darmowe zasoby Playwright](https://jaktestowac.pl/darmowy-playwright/) - Kompleksowe i darmowe materiały edukacyjne w języku polskim
- [Podstawy Playwright](https://www.youtube.com/playlist?list=PLfKhn9AcZ-cD2TCB__K7NP5XARaCzZYn7) - Seria na YouTube (po polsku)
- [Elementy Playwright](https://www.youtube.com/playlist?list=PLfKhn9AcZ-cAcpd-XN4pKeo-l4YK35FDA) - Zaawansowane koncepcje (po polsku)
- [Playwright MCP](https://www.youtube.com/playlist?list=PLfKhn9AcZ-cCqD34AG5YRejujaBqCBgl4) - Kurs MCP (po polsku)
- [Społeczność Discord](https://discord.gg/mUAqQ7FUaZ) - Pierwsza polska społeczność Playwright!
- [Playwright Info](https://playwright.info/) - pierwszy i jedyny polski blog o Playwright

## 🇬🇧 Zasoby angielskie

- [Rozszerzenia VS Code](https://marketplace.visualstudio.com/publishers/jaktestowac-pl) - Nasze darmowe wtyczki Playwright

### AI_Testers

Zdobądź przewagę łącząc wiedzę AI z najpopularniejszymi narzędziami na rynku IT.
Pokażemy Ci jak przyspieszyć z AI i zbudować profesjonalny framework do automatyzacji testów 😉

- [AI_Testers](https://aitesters.pl) - Strona o Programie AI_Testers
- [AI_Testers LinkedIn](https://www.linkedin.com/company/aitesters) - Nasz profil na LinkedIn

---

**Miłej zabawy w testowaniu i automatyzacji!** 🚀

**Zespół jaktestowac.pl** ❤️💚

_PS. Aby uzyskać więcej zasobów i aktualizacji, śledź nas na naszej [stronie internetowej](https://jaktestowac.pl) i [GitHub](https://github.com/jaktestowac)._

---

_Zbudowane z ❤️💚 dla społeczności Playwright i automatyzacji testów_
