# Specification of `app.yml`

Every app must contain a file called `app.yml`. This files describes the metadata of an app.

```yaml
uuid: '15d3d6c0-da16-4715-991e-026981c559dc'
name:
    en: 'File Browser'
    de: 'File Browser'
description:
    en: 'File Browser provides a file managing interface within a specified directory and it can be used to upload, delete, preview, rename and edit your files. It allows the creation of multiple users and each user can have its own directory. It can be used as a standalone app.'
    de: 'File Browser bietet eine Dateiverwaltungsoberfläche innerhalb eines angegebenen Verzeichnisses und kann zum Hochladen, Löschen, Vorschauen, Umbenennen und Bearbeiten Ihrer Dateien verwendet werden. Es ermöglicht die Erstellung mehrerer Benutzer und jeder Benutzer kann sein eigenes Verzeichnis haben. Es kann als eigenständige App verwendet werden.'
icon: 'icon.svg'
links:
    repository: 'https://github.com/filebrowser/filebrowser'
publishedAt: '2021-01-01T00:00:00Z'
developer: 'filebrowser'
category: 'productivity'
license: 'Apache-2.0'
http:
    - port: 8080
      description:
          en: 'Web ui'
          de: 'Web-UI'
      subdomain: 'filebrowser'
```
Full Example:
```yaml
uuid: '15d3d6c0-da16-4715-991e-026981c559dc'
name:
    en: 'File Browser'
    de: 'File Browser'
description:
    en: 'File Browser provides a file managing interface within a specified directory and it can be used to upload, delete, preview, rename and edit your files. It allows the creation of multiple users and each user can have its own directory. It can be used as a standalone app.'
    de: 'File Browser bietet eine Dateiverwaltungsoberfläche innerhalb eines angegebenen Verzeichnisses und kann zum Hochladen, Löschen, Vorschauen, Umbenennen und Bearbeiten Ihrer Dateien verwendet werden. Es ermöglicht die Erstellung mehrerer Benutzer und jeder Benutzer kann sein eigenes Verzeichnis haben. Es kann als eigenständige App verwendet werden.'
icon: 'icon.svg'
banner: 'banner.png' # optional
screenshots: # optional
  - screenshot-1.png
  - screenshot-2.png
  - screenshot-3.png
  - screenshot-4.png
  - screenshot-5.png
  - screenshot-6.png
links:
    repository: 'https://github.com/filebrowser/filebrowser'
    website: 'https://filebrowser.org/' # optional
    custom:
        - name:
              en: 'Demo'
              de: 'Demo'
          url: 'https://demo.filebrowser.org/login?redirect=%2Ffiles%2F'
publishedAt: '2021-01-01T00:00:00Z'
developer: 'filebrowser'
category: 'productivity'
license: 'Apache-2.0'
config: # User facing config during setup, optional
    - id: 'api-key'
      name:
          en: 'API key'
          de: 'API-Key'
      description:
          en: 'You need an api key to use this service'
          de: 'Du benötigst einen API-Key um diesen Dienst zu nutzen'
      type: 'string' # Other types: Boolean, Number, Select, Range, Color, Date, Datetime, Email, month, password, tel, time, url, week
      environmentVariable: 'API_KEY'
      required: false
      default: 'sadf' # Optional if required = true
      selectOptions: # Required if type = select
          - "first option"
          - "second option"
      rangeOptions:
          min: 0
          max: 100
          step: 1
      validation: '[0-9a-bA-Z]+' # optional
      validationScript: 'myscript.js' # optional
http: # optional, one of http, tcp or udp is required (ports of tcp and udp needs to be globally unique)
    - port: 80
      description:
          en: 'Web ui'
          de: 'Web-UI'
      subdomain: 'filebrowser' # globally unique
messages:
    postInstall:
        en: 'The default username is admin and the default password is admin. You can change them in the settings.'
        de: 'Der Standardbenutzername ist admin und das Standardpasswort ist admin. Sie können diese in den Einstellungen ändern.'
```
