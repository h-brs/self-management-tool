# Selbstmanagement im Studium

Ein lokaler Prototyp für die Kooperation von Andreas Ley und André Kless auf Grundlage der Anforderungsübersicht zur digitalen Lehre der H-BRS und der Universität Siegen. Der „Schreibtisch“ ist eine konfigurierte Instanz der CCM App Collection 1.1.0. Alle Werkzeuge öffnen sich innerhalb dieser Collection.

## Lokal starten

Im Repository `python3 -m http.server 8817 --bind 127.0.0.1` ausführen und [den Schreibtisch öffnen](http://127.0.0.1:8817/). Ein moderner Browser mit aktiviertem JavaScript und IndexedDB genügt. Alle Laufzeitressourcen liegen im Repository. Die Seite funktioniert auch unter einem Unterpfad auf einem statischen Webserver.

**Zum Ausprobieren:** Im Stundenplan „Kurs aus Curriculum hinzufügen“ öffnen, unter „Beispielcurriculum“ die Lernwerkstatt auswählen und zur Stundenplanansicht wechseln. Dort lassen sich Notizen und Links bei der Veranstaltung hinterlegen. Unter „Prüfungsvorbereitung“ enthält der Selbsttest zwei Fragen mit Hinweisen zu den Antworten.

## Umfang des Prototyps

| Bereich aus der Anforderungsübersicht | Heute nutzbar | Für spätere Ausbaustufen |
| --- | --- | --- |
| Stundenplan und Schreibtisch | Wochenplan mit eigenen Veranstaltungen, Kursfarben, Notizen und Links. Beispielcurriculum zum Auswählen. | Import von Hochschuldaten, Erinnerungen, frei anpassbarer Schreibtisch |
| Checklisten | Listen mit Unterpunkten, Fristen, Notizen und Fortschritt | Fachspezifische Vorlagen und automatische Bescheinigungen |
| Selbstmanagement | Aufgaben anlegen, erledigen und Fortschritt mit dem Zeitplan vergleichen | Projektplan mit Puffer, Eisenhower-Matrix und Tagebuch |
| Karteikarten | Veranstaltungen und Stapel erstellen, Karten üben, Stapel importieren und exportieren | Kursübergreifende Auswertung |
| Lern- und Prüfungsunterstützung | Selbsttest zur Lernplanung mit Rückmeldung je Antwort | Weitere Tutorials, Reflexion nach der Prüfung |
| Lernaustausch | Lokaler Kurschat und Lerngruppen mit Beitritt und Austritt | Gemeinsamer Kursraum, Materialtausch und Lernortkarte |
| Rückmeldungen | Eine Abstimmung zum Lerntempo starten, abstimmen und die Runde beenden | Kursweite Auswertung und Mitteilungen von Lehrenden |
| Statistiken | Vorschau; aufgabenbezogener Fortschritt steht unter „Meine Aufgaben“ bereit | Semesterübersicht und Soll-Ist-Vergleich |
| Umgang mit Ablenkungen | Vorschau | Fokusmodus, Konzentrationsübungen und Pausenrituale |
| Gesundheit und Wohlbefinden | Vorschau | Übungen, optionale Erinnerungen und Beratungsangebote |
| Hilfe bei Fragen zum Studium | Vorschau | Konfigurierbare Anlaufstellen, Campuspläne und Links zu Hochschuldiensten |
| Zugriff durch Lehrende | Vorschau | Kursziele, Materialien und Selbsttests bereitstellen |

Der lokale Gast verwendet dasselbe Browserprofil für alle Sitzungen auf derselben Webadresse. Stundenplan, Aufgaben, Listen, Karten und die lokalen Kursdemos speichern in IndexedDB. Der Quizdurchlauf bleibt flüchtig. Für eine Lehrveranstaltung mit mehreren Teilnehmenden sind getrennte Konten, ein gemeinsamer Datastore und entsprechende Zugriffsrechte erforderlich. Die Demo enthält keine Verbindung zu einem Hochschulserver.

## Konfiguration und Gestaltung

- [config/collection.mjs](config/collection.mjs) konfiguriert die komplette Ansicht einschließlich Kopf- und Fußzeile, Theme, Kacheln und Platzhaltern. Auch die Vorschauen sind konfigurierte App Collections.
- [config/apps.mjs](config/apps.mjs) enthält die Konfigurationen der Werkzeuge, den Gastzugang und die Speichereinstellungen, den Beispielkurs und die Quizfragen.
- [index.html](index.html) bindet [ccmjs](libs/ccm/) ein und startet die App Collection mit der Konfiguration `desk`. Die Startseite lädt ausschließlich CCM 29.0.0. Die Collection und die Kacheln beziehen ihre Konfigurationen über `ccm.load`. Beim ersten Öffnen einer klassischen Komponente lädt CCM anhand ihres konfigurierten `ccm`-Pfads die lokale Version 27.5.0 nach. Deren `beforeCreation`-Hook bereitet die lokalen Datastores einmal nacheinander vor. To-do, Quiz und Vorschauen verwenden ausschließlich CCM 29. To-do verwendet eine getrennte IndexedDB-Datenbank.
- [styles/](styles/) enthält die Gestaltung für diesen Prototyp. Die Stylesheets importieren die mitgelieferten Originalstile. Ausgangspunkt für die Startseite ist das H-BRS-Theme der App Collection. Hochschullogo und Campusmotiv stammen aus der bereitgestellten Präsentation. Informationen zum Erscheinungsbild stellt das [Brandportal der H-BRS](https://www.h-brs.de/de/kum/corporate-design-und-brandportal-der-h-brs) bereit.
- Unter [libs/](libs/) liegen die Framework-Versionen, Komponenten und ihre Ressourcen. Die Vorlagen unter `libs/user/resources/` entsprechen dem vom klassischen User-Modul erwarteten relativen Pfad.

## Quellen der Komponenten

| Bestandteil | Verwendeter Stand |
| --- | --- |
| App Collection | [ccmjs/app_collection · 329a407](https://github.com/ccmjs/app_collection/tree/329a407094312083c5f42b1a0904af30ccdc4dd8) |
| To-do | [ccmjs/todo · 55de2c5](https://github.com/ccmjs/todo/tree/55de2c5da6d66bc28989fe712d86f47c0930e83c) |
| Quiz und ccm-ui | [ccmjs/quiz · 801a9a2](https://github.com/ccmjs/quiz/tree/801a9a226dd80ddbff6b9959cb4221ba6a7f855d) |
| CCM 29.0.0 | [ccmjs/framework · b5fe4a5](https://github.com/ccmjs/framework/blob/b5fe4a5ceb8cda35783deb8312a3d25f9c8465a9/ccm.js) |
| CCM 27.5.0 | [ccmjs/ccm · 18bfd12](https://github.com/ccmjs/ccm/tree/18bfd12c90de1d6f2d04d5d5cd2d56df9539cdd9) |
| Stundenplan und Checkliste | [Tobias Niederprüm · 88b382f](https://github.com/Polykarp-bit/ccm-components/tree/88b382fded08802474a130b1dcca796fb6d603d0) |
| Karteikarten | [Wiete Lück · Flash Cards](https://wlueck.github.io/ccm-components/flash_cards/ccm.flash_cards.js), SHA-256 der eingebundenen Komponente: `411cd6da1f2f75f8bc7812704440551b56ed58e1efea03fef58f241fdf4194a5` |
| Klassisches Teambuild, Chat, Live Poll, Helfermodule und Moment.js | [ccmjs/akless-components · 2ec3e04](https://github.com/ccmjs/akless-components/tree/2ec3e045162f03a0d9fbebe75e604face3e6b034) |
| Lokale Gastanmeldung | [h-brs/we · f3220e1](https://github.com/h-brs/we/tree/f3220e1/libs/user) |
| Werkzeugpiktogramme | [Lucide](https://lucide.dev), Lizenz unter [assets/icons/LICENSE](assets/icons/LICENSE) |
