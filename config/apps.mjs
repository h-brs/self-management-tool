// All paths resolve against the hosting HTML page, also on a project subpath.
const framework = './libs/ccm/ccm-29.0.0.min.js';
const legacy = './libs/ccm/ccm-27.5.0.min.js';
const libs = './libs/';
const load = url => ['ccm.load', url];
const helper = version => load(libs + 'helpers/helper-' + version + '.mjs');
const localStore = name => ['ccm.store', { name: 'smt_' + name }];

async function syncLegacyDatabaseVersion() {
  // CCM 27 calculates schema upgrades from localStorage. Repair stale metadata
  // from the database catalogue without opening or creating any database.
  if (!indexedDB.databases) return;
  const database = (await indexedDB.databases()).find(db => db.name === 'ccm');
  const version = String(database?.version ?? 1);
  if (localStorage.getItem('ccm') !== version) localStorage.setItem('ccm', version);
}

const guest = ['ccm.instance', './libs/user/ccm.user.js', {
  ccm: '27.5.0', realm: 'guest', guest: 'Lerngast', logged_in: true, norender: true, picture: libs + 'user/resources/icon.svg',
  css: [], helper: helper('7.4.0'),
}];

function classic(options) {
  return { ccm: legacy, shadow: 'open', user: guest, beforeCreation: syncLegacyDatabaseVersion, ...options };
}

export const timetable = classic({
  async beforeCreation(config) {
    await syncLegacyDatabaseVersion();
    // CCM 27 resolves sibling dependencies in parallel. Resolve the first of
    // the two named stores here so their initial schema upgrades run in order.
    config.studentCourseStore = await window.ccm['27.5.0'].helper.solveDependency(config.studentCourseStore);
  },
  css: load('./styles/timetable.css'), helper: helper('8.4.2'),
  courseStore: ['ccm.store', { local: {
    lernwerkstatt: { key: 'lernwerkstatt', value: {
      course: 'Lernwerkstatt (Beispiel)', course_of_study: [{ courseOfStudy: 'Beispielcurriculum', semester: '1' }],
      events: [{ key: 'montag', type: 'Übung', day: 'Montag', from: '10:00', until: '11:30',
        room: 'Lernraum', period_from: '01.10.2026', period_until: '31.03.2027' }],
    } },
  } }], studentCourseStore: localStore('courses'), studentStore: localStore('schedule'),
});
export const checklist = classic({
  css: load('./styles/checklist.css'), helper: helper('7.2.0'), store: localStore('checklists'),
});
const cards = './libs/flash_cards/';
export const flash_cards = classic({
  css: load('./styles/cards.css'), editor: null, helper: helper('7.2.0'), html: load(cards + 'templates.html'),
  languages: { de: cards + 'resources.js#de', en: cards + 'resources.js#en' },
  text: ['ccm.load', { url: cards + 'resources.js#de', type: 'module' }],
  store: localStore('cards'), onchange: null,
});

export const teambuild = classic({
  css: load('./styles/teams.css'), helper: helper('7.4.0'), html: load(libs + 'teambuild/resources/templates.html'),
  data: { store: localStore('teams'), key: 'lerngruppen' }, max_members: 5,
  names: ['Montagsrunde', 'Prüfungsvorbereitung'], text: { team: 'Lerngruppe', join: 'Beitreten', leave: 'Verlassen', free: 'Platz frei' },
});
export const chat = classic({
  css: load('./styles/chat.css'), helper: helper('7.4.0'), html: load(libs + 'chat/resources/templates_v3.html'),
  data: { store: localStore('chat'), key: 'lernaustausch', permissions: null },
  moment: load(libs + 'moment/moment.min.js'), editor: null, hide_login: true,
  button: 'Senden', picture: libs + 'user/resources/icon.svg', time_format: 'DD.MM.YYYY, HH:mm',
});
export const live_poll = classic({
  css: load('./styles/poll.css'), helper: helper('7.4.0'), html: load(libs + 'live_poll/resources/templates.html'),
  converter: null, chart: null, data: { store: localStore('poll'), key: 'tempo' },
  question: 'Wie kommst du mit dem Tempo der Veranstaltung zurecht?',
  answers: ['Ich wünsche mir mehr Zeit.', 'Das Tempo passt für mich.', 'Ich bin bereit für den nächsten Schritt.'],
  editable: false, no_members_section: true,
  placeholder: { start: 'Abstimmung starten', finish: 'Abstimmung beenden', reset: 'Neue Runde', locked: 'Gesperrt', unlocked: 'Offen' },
});

export const todo = {
  ccm: framework, css: load('./styles/todo.css'), views: load('./libs/todo/resources/views.mjs'),
  title: 'Meine Aufgaben', points: false, competition: true, data: { store: ['ccm.store', {name: 'aufgaben', dbName: 'smt_aufgaben'}], key: 'aufgaben' },
};
export const quiz = {
  feedback: true,
  ccm: framework, css: load('./styles/quiz.css'), views: load('./libs/quiz/resources/views.mjs'),
  ui: load('./libs/ccm-ui/ccm-ui-1.0.0.min.mjs'),
  labels: { submit: 'Antwort prüfen', next: 'Weiter', finish: 'Noch einmal üben' },
  extensions: [load('./libs/quiz/resources/extensions.mjs#restart')],
  questions: [
    { text: 'Welches Lernziel kannst du am Ende des Tages selbst überprüfen?', type: 'radio', answers: [
      { text: 'Ich verstehe das Kapitel besser.', comment: 'Woran würdest du merken, dass du es verstanden hast?' },
      { text: 'Ich löse drei Übungsaufgaben ohne Unterlagen.', correct: true, comment: 'Die Anzahl und die Arbeitsweise machen deinen Fortschritt sichtbar.' },
      { text: 'Ich lerne so viel wie möglich.', comment: 'Lege fest, welches Ergebnis du heute erreichen möchtest.' },
    ] },
    { text: 'Eine Aufgabe dauert länger als geplant. Wie passt du deinen Wochenplan an?', type: 'radio', answers: [
      { text: 'Ich prüfe die Fristen und verschiebe einen weniger dringenden Schritt.', correct: true, comment: 'So bleibt Platz für die Aufgabe mit der nächsten Frist.' },
      { text: 'Ich lasse alle weiteren Aufgaben wie geplant stehen.', comment: 'Überlege, welche Aufgaben noch in die verbleibende Zeit passen.' },
    ] },
  ],
};
