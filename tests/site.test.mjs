import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFile(join(root, path), 'utf8');

function assertContainsAll(text, values) {
  for (const value of values) {
    assert.ok(text.includes(value), `Brak wymaganej treści: ${value}`);
  }
}

test('strona główna ma polską, semantyczną strukturę sprzedażową', async () => {
  const html = await read('index.html');
  assert.match(html, /<html[^>]+lang="pl"/);
  assertContainsAll(html, [
    '<header', '<main', '<footer',
    '100 kwalifikowanych zapytań',
    '90 dni',
    'Proces Kwalifikowanych Zapyń'.replace('Zapyń', 'Zapytań'),
    'Umów bezpłatną analizę',
    'Brak przewidywalnych zleceń',
    'Paweł Martwicki',
    '800 000 zł',
    'Daniel', 'Filip', 'Joanna', 'David'
  ]);
  assert.doesNotMatch(html, /lorem ipsum|placeholder|todo|wstaw tutaj/i);
});

test('gwarancja ma jawne i niesprzeczne zastrzeżenie', async () => {
  const html = await read('index.html');
  assertContainsAll(html, [
    'zwrot wynagrodzenia za usługę',
    'od dnia podpisania umowy',
    'Budżet reklamowy nie podlega zwrotowi',
    'warunków określonych w umowie'
  ]);
});

test('CTA prowadzą do dostarczonego kalendarza i kontaktu', async () => {
  const html = await read('index.html');
  const calendarUrl = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ06pa6q3qrRWTMAwqIxKaE4Zzucs8VsoL4tg_XKJxSDckN2vfUBwTrdgNH7Ic36QKshQFIQ7Ygd';
  assert.ok(html.includes(calendarUrl));
  assert.ok(html.includes('mailto:pawel@animadconsulting.com'));
  assert.match(html, /id="calendar-frame"[^>]+data-src=/);
  assert.match(html, /id="load-calendar"/);
});

test('dane prawne i polityka prywatności są dostępne', async () => {
  const home = await read('index.html');
  const privacy = await read('polityka-prywatnosci.html');
  assertContainsAll(home, [
    'Paweł Martwicki Copywriting',
    'NIP 8883168913',
    '87-880 Brześć Kujawski',
    'Ciborowskiego 17',
    'polityka-prywatnosci.html'
  ]);
  assertContainsAll(privacy, [
    'Administrator danych',
    'Paweł Martwicki Copywriting',
    'pawel@animadconsulting.com',
    'Google Calendar',
    'NIP 8883168913'
  ]);
});

test('lokalne zasoby produkcyjne istnieją', async () => {
  const required = [
    'styles.css', 'script.js',
    'assets/logo-animad.svg',
    'assets/daniel.webp',
    'assets/david-testimonial.mp4',
    'assets/david-poster.webp',
    'assets/daniel-testimonial.mp4',
    'assets/daniel-testimonial-poster.webp',
    'assets/pawel-portrait.webp',
    'assets/og-image.webp'
  ];
  for (const path of required) {
    await access(join(root, path));
  }
});

test('strona zawiera podstawowe SEO i dostępność', async () => {
  const html = await read('index.html');
  assert.match(html, /<title>[^<]+Animad Consulting[^<]*<\/title>/);
  assert.match(html, /name="description" content="[^"]{80,}"/);
  assertContainsAll(html, [
    'property="og:title"',
    'property="og:description"',
    'property="og:image"',
    'class="skip-link"',
    'aria-label="Główna nawigacja"',
    'playsinline',
    'poster="assets/david-poster.webp"'
  ]);
});

test('kalendarz respektuje zgodę użytkownika i komunikuje stan', async () => {
  const html = await read('index.html');
  const script = await read('script.js');
  const styles = await read('styles.css');
  assert.match(html, /id="load-calendar"[^>]+aria-controls="calendar-frame"[^>]+aria-expanded="false"/);
  assert.match(html, /id="calendar-frame"[^>]+data-src="[^"]+"[^>]+hidden/);
  assertContainsAll(script, [
    'calendarFrame.hidden = false',
    "calendarFrame.classList.add('is-loaded')",
    "loadCalendar.setAttribute('aria-expanded', 'true')"
  ]);
  assert.match(styles, /#calendar-frame\{[^}]*display:none/);
  assert.match(styles, /#calendar-frame\.is-loaded\{display:block\}/);
});

test('mobilne menu jest zamykane dostępnie i nie pozostaje fokusowalne', async () => {
  const script = await read('script.js');
  const styles = await read('styles.css');
  assertContainsAll(script, [
    'const closeNav =',
    "label.textContent = 'Otwórz menu'",
    "event.key === 'Escape'",
    'closeNav({ restoreFocus: true })'
  ]);
  assert.match(styles, /\.main-nav\{[^}]*visibility:hidden[^}]*pointer-events:none/);
  assert.match(styles, /\.main-nav\.open\{[^}]*visibility:visible[^}]*pointer-events:auto/);
});

test('zdjęcie wyniku zachowuje proporcję 4:5 na małych ekranach', async () => {
  const styles = await read('styles.css');
  assert.match(styles, /\.case-photo\{[^}]*aspect-ratio:4\/5/);
  assert.match(styles, /\.case-photo img\{[^}]*position:absolute[^}]*height:100%[^}]*object-fit:cover/);
});

test('referencje rozróżniają Davida i Dawida jako dwie osoby', async () => {
  const html = await read('index.html');
  assertContainsAll(html, [
    'Referencja wideo od Davida, YouTubera',
    '<strong>David</strong><span>YouTuber</span>',
    '— Dawid, właściciel sklepu'
  ]);
});

test('strona pokazuje Pawła i testimonial Daniela w lokalnych mediach', async () => {
  const html = await read('index.html');
  assertContainsAll(html, [
    'Referencja wideo od Daniela Kondraciuka',
    '<strong>Daniel Kondraciuk</strong><span>Branża infoproduktów</span>',
    'assets/daniel-testimonial.mp4',
    'assets/daniel-testimonial-poster.webp',
    'aria-label="Portret Pawła Martwickiego"',
    'src="assets/pawel-portrait.webp"',
    'alt="Paweł Martwicki"'
  ]);
  assert.doesNotMatch(html, /assets\/pawel-paris-/);
});
