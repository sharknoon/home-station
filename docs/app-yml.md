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
