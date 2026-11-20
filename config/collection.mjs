const framework = './libs/ccm/ccm-29.0.0.min.js';
const collection = './libs/app_collection/ccm.app_collection.mjs';
// App Collection resolves the tool and its configuration when the tile first opens.
function tool(name, extension = 'js') {
  return ['ccm.start', `./libs/${name}/ccm.${name}.${extension}`, ['ccm.load', './config/apps.mjs#' + name]];
}

const icons = './assets/icons/';
const theme = ['ccm.load', './styles/collection.css'];
const labels = {
  back: 'Zurück', home: 'Schreibtisch', retry: 'Erneut versuchen', loading: 'Wird geladen …',
  error: 'Dieses Werkzeug konnte nicht geladen werden.', folder: 'Werkzeuge', empty: 'Hier sind noch keine Einträge vorhanden.',
};
const tile = (id, title, description, icon, app) => ({ id, title, description, icon: icons + icon + '.svg', app });

// An empty App Collection displays each planned feature using only existing CCM configuration.
function preview(id, title, description, icon, detail) {
  return tile(id, title, description, icon, ['ccm.start', collection, {
    ccm: framework, css: ['ccm.load', './styles/preview.css'], title: 'In Planung',
    description: detail, ignore: [], labels: { ...labels, empty: 'Dieser Bereich ist im Prototyp als Platzhalter vorgesehen.' },
  }]);
}
// App Collection clears its own element before each start and calls extensions after rendering.
function showBranding({ app, type }) {
  if (type !== 'start') return;
  app.element.querySelector('.app-collection').setAttribute('role', 'main');
  app.element.insertAdjacentHTML('afterbegin', app.branding.header);
  app.element.insertAdjacentHTML('beforeend', app.branding.footer);
}

export const desk = {
  extensions: [showBranding],
  branding: {
    header: `<header class="masthead"><img src="./assets/h-brs.jpg" alt="Hochschule Bonn-Rhein-Sieg, University of Applied Sciences"><span>Selbstmanagement im Studium</span></header>`,
    footer: `<footer><div>Forschungskooperation mit der Universität Siegen<img src="./assets/siegen.png" alt="Universität Siegen"></div><p>Lokaler Prototyp · Eingaben bleiben in diesem Browserprofil.</p></footer>`,
  },
  ccm: framework, css: theme, title: 'Mein Schreibtisch', columns: 4,
  description: 'Plane deine Woche, behalte Aufgaben im Blick und übe für die nächste Prüfung.',
  labels, ignore: { sections: [
    { id: 'alltag', title: 'Mein Studienalltag', items: [
      tile('stundenplan', 'Stundenplan', 'Veranstaltungen, Kurslinks und persönliche Notizen.', 'CalendarDays', tool('timetable')),
      tile('checklisten', 'Checklisten', 'Prüfungen und Fristen Schritt für Schritt abhaken.', 'ListChecks', tool('checklist')),
      tile('aufgaben', 'Meine Aufgaben', 'Aufgaben planen und den eigenen Fortschritt verfolgen.', 'ListTodo', tool('todo', 'mjs')),
      tile('karteikarten', 'Karteikarten', 'Eigene Kartensätze anlegen und Wissen wiederholen.', 'Layers', tool('flash_cards')),
    ] },
    { id: 'gemeinsam', title: 'Lernen und Austausch', items: [
      tile('pruefung', 'Prüfungsvorbereitung', 'Selbsttest zur Lernplanung mit direkter Rückmeldung.', 'BookOpenCheck', tool('quiz', 'mjs')),
      tile('gruppen', 'Lerngruppen', 'Einer Gruppe im lokalen Beispiel beitreten.', 'Users', tool('teambuild')),
      tile('chat', 'Lernaustausch', 'Den Kurschat auf diesem Gerät ausprobieren.', 'MessagesSquare', tool('chat')),
      tile('feedback', 'Rückmeldungen', 'Eine Abstimmung zum Lerntempo ausprobieren.', 'ChartNoAxesColumn', tool('live_poll')),
    ] },
    { id: 'ausblick', title: 'In Planung', description: 'Diese Bereiche zeigen, was als Nächstes hinzukommen kann.', items: [
      preview('statistiken', 'Statistiken', 'Lernzeit, Meilensteine und Semesterfortschritt.', 'ChartLine',
        'Hier sollst du später Lernzeiten und erreichte Meilensteine über mehrere Veranstaltungen hinweg vergleichen können.'),
      preview('fokus', 'Umgang mit Ablenkungen', 'Fokuszeiten und persönliche Pausenrituale.', 'Focus',
        'Geplant sind ein Fokusmodus für Lernphasen, Konzentrationsübungen und Vorschläge für die nächste Pause.'),
      preview('gesundheit', 'Gesundheit & Wohlbefinden', 'Pausen, Bewegung und der Umgang mit Stress.', 'Heart',
        'Hier sind Übungen für Lernpausen, individuell einstellbare Erinnerungen und Verweise auf Beratungsangebote vorgesehen.'),
      preview('beratung', 'Hilfe im Studium', 'Ansprechpersonen und Orientierung am Campus.', 'Compass',
        'Hier sollen Studiengänge ihre Anlaufstellen, Campuspläne und Links zu LEA und SIS hinterlegen können.'),
      preview('lehrende', 'Zugriff für Lehrende', 'Themen, Vorbereitung und Workload je Kurs.', 'Presentation',
        'Lehrende sollen später Lernziele, Vorbereitung und Selbsttests für ihre Veranstaltungen zusammenstellen können.'),
    ] },
  ] },
};
