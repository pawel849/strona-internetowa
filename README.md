# Animad Consulting — strona internetowa

Statyczna, responsywna strona sprzedażowa dla Animad Consulting, przygotowana do wdrożenia na Vercel.

## Uruchomienie lokalne

```bash
npx serve .
```

Następnie otwórz adres podany przez `serve`.

## Testy

```bash
npm test
```

Testy sprawdzają kluczową treść, dane prawne, SEO, integrację kalendarza i obecność zasobów.

## Wdrożenie na Vercel

1. Zaimportuj repozytorium GitHub w panelu Vercel.
2. Framework Preset: `Other`.
3. Build Command pozostaw pusty.
4. Output Directory: `.`.
5. Po wdrożeniu podepnij domenę `animadconsulting.com` w ustawieniach projektu.

## Prywatność

Kalendarz Google ładuje się dopiero po świadomym kliknięciu użytkownika. Pierwsza wersja nie używa Google Analytics ani pikseli marketingowych. Przed dodaniem narzędzi śledzących należy uzupełnić politykę prywatności i mechanizm zgody.

## Zawartość

- `index.html` — strona główna
- `polityka-prywatnosci.html` — polityka prywatności
- `styles.css` — identyfikacja i responsywność
- `script.js` — menu, animacje i prywatnościowe ładowanie kalendarza
- `assets/` — lokalne fonty, grafiki i zoptymalizowane wideo
- `tests/` — testy statyczne
