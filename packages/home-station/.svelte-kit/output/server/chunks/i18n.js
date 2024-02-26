import def from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { w as writable } from "./index2.js";
import "cronstrue/locales/en.js";
import "cronstrue/locales/de.js";
import { g as get_store_value } from "./utils2.js";
const tasks$1 = {
  "update-marketplace-apps": "Abrufen von Apps aus Marktplätzen",
  "delete-expired-sessions": "Löschen von abgelaufenen Login-Sitzungen",
  test: "[DEV] Testaufgabe"
};
const sidebar$1 = {
  "my-apps": "Meine Apps",
  discover: "Erkunden",
  settings: {
    settings: "Einstellungen",
    general: "Allgemein",
    users: "Benutzer",
    "container-engines": "Container-Engines",
    "domains-and-hostnames": "Domains und Hostnamen",
    system: "System",
    tasks: "Aufgaben",
    logs: "Logs"
  },
  "toast-missing-mount": 'Der Pfad "{{- path}}" wurde nicht richtig gemounted. Wenn der Container gestoppt oder neu gestartet wird, gehen alle Daten verloren.',
  search: "Suche nach Apps und Einstellungen",
  account: "Konto",
  "sign-out": "Abmelden"
};
const brand$1 = {
  title: "Home Station"
};
const account$1 = {
  general: {
    general: "Allgemein",
    language: "Sprache",
    save: "Speichern"
  },
  password: {
    password: "Passwort",
    "new": "Neues Passwort",
    requirements: "Das Passwort muss mindestens 8 Zeichen lang sein",
    confirm: "Passwort bestätigen",
    save: "Speichern"
  },
  theme: {
    theme: "Erscheinungsbild",
    active: "Aktiv",
    apply: "Anwenden"
  }
};
const discover$1 = {
  marketplaces: "Marktplätze",
  "add-marketplace": "Marktplatz hinzufügen",
  "add-default-marketplace": "Standard-Marktplatz hinzufügen",
  links: {
    website: "Webseite",
    repository: "Repository"
  },
  install: "Installieren",
  "popup-no-container-engines": {
    "no-container-engine-available": "Keine Container-Engine verfügbar"
  },
  installing: "Installieren...",
  "app-info-modal": {
    "additional-information": "Zusätzliche Informationen",
    id: "ID",
    "published-at": "Veröffentlicht am",
    marketplace: "Marktplatz"
  },
  "container-engines-modal": {
    "select-engine": "Container-Engine auswählen",
    "select-engine-description": "Sie haben mehrere Container-Engines installiert. Wählen Sie die Container-Engine, auf der Sie die App installieren möchten."
  }
};
const settings$1 = {
  "container-engines": {
    "container-engines": "Container-Engines",
    local: "lokal",
    remote: "ferngesteuert",
    "n-a": "N/A",
    "number-of-stacks_one": "{{count}} Stack",
    "number-of-stacks_other": "{{count}} Stacks",
    "number-of-containers_one": "{{count}} Container",
    "number-of-containers_other": "{{count}} Containers",
    "number-of-volumes_one": "{{count}} Volume",
    "number-of-volumes_other": "{{count}} Volumes",
    "number-of-images_one": "{{count}} Image",
    "number-of-images_other": "{{count}} Images",
    "number-of-Cpus_one": "{{count}} CPU",
    "number-of-Cpus_other": "{{count}} CPUs",
    "total-memory": "{{value}} GB RAM"
  },
  tasks: {
    "scheduled-tasks": "Geplante Aufgaben",
    name: "Name",
    interval: "Intervall",
    "last-execution": "Letzte Ausführung",
    "last-duration": "Letzte Dauer",
    "next-execution": "Nächste Ausführung",
    milliseconds: "Millisekunden"
  },
  users: {
    users: "Benutzer",
    username: "Benutzername",
    language: "Sprache"
  }
};
const login$1 = {
  "login-to-continue": "Anmelden um fortzufahren",
  username: "Benutzername",
  password: "Passwort",
  "incorrect-username-or-password": "Falscher Benutzername oder falsches Passwort",
  login: "Anmelden"
};
const setup$1 = {
  "missing-mount": 'Der Pfad "{{- path}}" wurde nicht richtig gemounted. Wenn der Container gestoppt oder neu gestartet wird, gehen alle Daten verloren.',
  step: "Schritt",
  back: "← Zurück",
  next: "Weiter →",
  complete: "Fertigstellen",
  welcome: "Willkommen bei Home Station",
  "get-started-account": "Um loszulegen, erstellen Sie ein Konto",
  username: "Benutzername",
  "username-requirements": "Der Benutzername muss mindestens 4 Zeichen lang sein und darf nur Buchstaben, Zahlen und Unterstriche enthalten",
  password: "Passwort",
  "password-requirements": "Das Passwort muss mindestens 8 Zeichen lang sein",
  "repeat-password": "Passwort wiederholen",
  "connect-container-engine": "Verbinden Sie Ihre Container-Engine",
  "container-engine-explanation": "Docker und Podman werden unterstützt. Sie können entweder eine lokale oder eine ferngesteuerte Container-Engine verwenden.",
  "local-container-engine": "Lokale Container-Engine (Socket)",
  "container-engine-name": "Name",
  "container-engine-name-placeholder": "z.B. docker-prod01",
  "more-settings": "Weitere Einstellungen",
  "override-socket": "Standard-Socketpfad überschreiben",
  "override-socket-placeholder": "z.B. /var/run/docker.sock (für Linux) oder //./pipe/docker_engine (für Windows)",
  "test-connection": "Verbindung prüfen",
  connecting: "Verbinde...",
  "successfully-connected": "Verbindung erfolgreich hergestellt 🎉",
  note: "Hinweis",
  "note-mounted-docker-socket": "Wurde der Container-Engine Socket gemounted (-v /var/run/docker.sock:/var/run/docker.sock)? Ist die Container Engine gestartet?",
  "remote-container-engine": "Ferngesteuerte Container-Engine (API)",
  "container-engine-api-url": "Container-Engine API-URL",
  "container-engine-api-url-placeholder": "z.B. 10.0.0.10:2375 oder meindocker.meinedomain.de:2375",
  "tls-ca-certificate": "TLS CA Zertifikat",
  "tls-certificate": "TLS Zertifikat",
  "tls-key": "TLS Schlüssel (key)",
  tip: "Tipp",
  "additional-container-engines": "Sie können in den Einstellungen weitere Container-Engines hinzufügen",
  "add-domains-and-hostnames": "Fügen Sie Ihre Domains hinzu",
  "auto-detected": "Automatisch erkannt",
  "add-domain-or-hostname": "Domain oder Hostname hinzufügen",
  "domain-hostname-placeholder": "z.B. meinedomain.de oder meinhostname",
  "additional-domains-or-hostnames": "Sie können in den Einstellungen weitere Domains und Hostnamen hinzufügen"
};
const de = {
  tasks: tasks$1,
  sidebar: sidebar$1,
  brand: brand$1,
  account: account$1,
  discover: discover$1,
  settings: settings$1,
  login: login$1,
  setup: setup$1
};
const tasks = {
  "update-marketplace-apps": "Fetch apps from marketplaces",
  "delete-expired-sessions": "Delete expired login-sessions",
  test: "[DEV] Test task"
};
const sidebar = {
  "my-apps": "My apps",
  discover: "Discover",
  settings: {
    settings: "Settings",
    general: "General",
    users: "Users",
    "container-engines": "Container engines",
    "domains-and-hostnames": "Domains and hostnames",
    system: "System",
    tasks: "Tasks",
    logs: "Logs"
  },
  "toast-missing-mount": 'The path "{{- path}}" was not mounted properly. All data will be lost when the container is stopped or restarted.',
  search: "Search for apps and settings",
  account: "Account",
  "sign-out": "Sign out"
};
const brand = {
  title: "Home Station"
};
const account = {
  general: {
    general: "General",
    language: "Language",
    save: "Save"
  },
  password: {
    password: "Password",
    "new": "New password",
    requirements: "The password must be at least 8 characters long",
    confirm: "Confirm new password",
    save: "Save"
  },
  theme: {
    theme: "Theme",
    active: "Active",
    apply: "Apply"
  }
};
const discover = {
  marketplaces: "Marketplace",
  "add-marketplace": "Add marketplace",
  "add-default-marketplace": "Add default marketplace",
  links: {
    website: "Website",
    repository: "Repository"
  },
  install: "Install",
  "popup-no-container-engines": {
    "no-container-engine-available": "No container engine available"
  },
  installing: "Installing...",
  "app-info-modal": {
    "additional-information": "Additional information",
    id: "ID",
    "published-at": "Published at",
    marketplace: "Marketplace"
  },
  "container-engines-modal": {
    "select-engine": "Select container engine",
    "select-engine-description": "You have multiple container engines installed. Please select the container engine you want to use to install the app."
  }
};
const settings = {
  "container-engines": {
    "container-engines": "Container engines",
    local: "local",
    remote: "remote",
    "n-a": "N/A",
    "number-of-stacks_one": "{{count}} stack",
    "number-of-stacks_other": "{{count}} stacks",
    "number-of-containers_one": "{{count}} container",
    "number-of-containers_other": "{{count}} containers",
    "number-of-volumes_one": "{{count}} volume",
    "number-of-volumes_other": "{{count}} volumes",
    "number-of-images_one": "{{count}} image",
    "number-of-images_other": "{{count}} images",
    "number-of-Cpus_one": "{{count}} CPU",
    "number-of-Cpus_other": "{{count}} CPUs",
    "total-memory": "{{value}} GM RAM"
  },
  tasks: {
    "scheduled-tasks": "Scheduled tasks",
    name: "Name",
    interval: "Interval",
    "last-execution": "Last execution",
    "last-duration": "Last duration",
    "next-execution": "Next execution",
    milliseconds: "milliseconds"
  },
  users: {
    users: "Users",
    username: "Username",
    language: "Language"
  }
};
const login = {
  "login-to-continue": "Login to continue",
  username: "Username",
  password: "Password",
  "incorrect-username-or-password": "Incorrect username or password",
  login: "Login"
};
const setup = {
  "missing-mount": 'The path "{{- path}}" was not mounted properly. All data will be lost when the container is stopped or restarted.',
  step: "Step",
  back: "← Back",
  next: "Next →",
  complete: "Complete",
  welcome: "Welcome to Home Station",
  "get-started-account": "Get started by creating an account",
  username: "Username",
  "username-requirements": "The username must be at least 4 characters long and can only contain letters, numbers, and underscores",
  password: "Password",
  "password-requirements": "The password must be at least 8 characters long",
  "repeat-password": "Repeat password",
  "connect-container-engine": "Connect your container engine",
  "container-engine-explanation": "Docker and Podman are supported. You can either add an local or remote container engine.",
  "local-container-engine": "Local container engine (socket)",
  "container-engine-name": "Name",
  "container-engine-name-placeholder": "e.g. docker-prod01",
  "more-settings": "More settings",
  "override-socket": "Override default socket path",
  "override-socket-placeholder": "e.g. /var/run/docker.sock (on Linux) or //./pipe/docker_engine (on Windows)",
  "test-connection": "Test connection",
  connecting: "Connecting...",
  "successfully-connected": "Successfully connected 🎉",
  note: "Note",
  "note-mounted-docker-socket": "Has the container engine socket been mounted (-v /var/run/docker.sock:/var/run/docker.sock)? Has the container engine been started?",
  "remote-container-engine": "Remote container engine (API)",
  "container-engine-api-url": "Container engine API URL",
  "container-engine-api-url-placeholder": "e.g. 10.0.0.10:2375 or mydocker.mydomain.com:2375",
  "tls-ca-certificate": "TLS CA certificate",
  "tls-certificate": "TLS certificate",
  "tls-key": "TLS key",
  tip: "Tip",
  "additional-container-engines": "You can add additional container engines in the settings",
  "add-domains-and-hostnames": "Add your domains",
  "auto-detected": "auto-detected",
  "add-domain-or-hostname": "Add domain or hostname",
  "domain-hostname-placeholder": "e.g. mydomain.com or myhostname",
  "additional-domains-or-hostnames": "You can add additional domains and hostnames in the settings"
};
const en = {
  tasks,
  sidebar,
  brand,
  account,
  discover,
  settings,
  login,
  setup
};
const i18n = writable();
function init(languageFromDb) {
  def.on("loaded", () => {
    i18n.set(def);
  });
  def.on("added", () => {
    i18n.set(def);
  });
  def.on("languageChanged", (lng) => {
    i18n.set(def);
  });
  const languageDetector = new LanguageDetector();
  languageDetector.addDetector({
    name: "db",
    lookup: () => languageFromDb
  });
  def.use(languageDetector).init({
    resources: {
      en: { translation: en },
      de: { translation: de }
    },
    fallbackLng: ["en"],
    supportedLngs: ["en", "de"],
    detection: {
      order: ["db", "navigator"]
    },
    interpolation: {
      skipOnVariables: false
    }
  });
  i18n.set(def);
}
function ls(localizedString) {
  const language = get_store_value(i18n).language;
  if (language in localizedString && localizedString[language]) {
    return localizedString[language];
  } else {
    return localizedString.en;
  }
}
export {
  i18n as a,
  init as i,
  ls as l
};
