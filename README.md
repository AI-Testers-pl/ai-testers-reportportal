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

Do każdego launcha doklejane są atrybuty: `framework=playwright`, `suite=checkout`, `profile=<TEST_PROFILE>`, `environment=<TEST_ENV|ci|local>`, `browser=chromium`.

## Uruchamianie testów

```bash
npm test                # smoke (domyślnie)
npm run test:smoke
npm run test:all
npm run test:headed
npm run test:ui
npm run test:debug
npm run report          # podgląd raportu HTML Playwright
```

Uruchomienie pojedynczego scenariusza po fragmencie nazwy lub tagu:

```bash
npm run test:scenario -- "add product"
```

## Co zobaczysz w ReportPortal

Test `add-product.spec.ts` używa `test.step(...)` aby raportować poszczególne kroki, a także `test.info().attach(...)` do dołączania zrzutów ekranu. W ReportPortal pojawi się launch z testem, krokami, logami z `console.log` oraz załączonymi screenshotami.

## Struktura katalogów

```
src/
  flows/        # logika scenariuszy (PurchaseFlow)
  models/       # typy domenowe (CheckoutScenario, ShippingInfo)
  pages/        # Page Objects (Shop, Cart, Checkout)
  utils/        # helpery
tests/
  fixtures/     # wspólny fixture `app`
  reportportal_example/
                # przykładowy test integrujący się z ReportPortal
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
