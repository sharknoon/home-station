TODO ICON OR FANCY HEADER LOGO

# Home Station

A fancy, easy-to-use, docker compose based app manager for your self-hosted home server.

![GitHub Repo stars](https://img.shields.io/github/stars/home-station-org/home-station)
![GitHub Release](https://img.shields.io/github/v/release/home-station-org/home-station)
![GitHub last commit](https://img.shields.io/github/last-commit/home-station-org/home-station)

TODO SCREENSHOT

## Live Demo

Try it!

[https://demo.home-station.org/](https://demo.home-station.org/)

It is a read-only live demo, you can't make any permanent changes.

## ⭐️ Features

- 🖱️ Install your favorite open-source apps with one click
- 🏬 App marketplace with over 1 free apps
- 🔐 Integrated reverse proxy, so you don't have to worry about ports and certificates
- ⬆️ Automatic updates for your apps (can be turned off)
- 🖥️ Fancy, easy-to-use and multi-language UI (with themes 🎨)
- 👤 Multi user capable (share your home server with your family & friends)

## 🔧 How to install

### 🐳 Docker

```bash
docker run -d --restart=always -p 80:80 -v home-station:/app/data -v /var/run/docker.sock:/var/run/docker.sock --name home-station ghcr.io/home-station-org/home-station
```

Home Station is now running at [https://home-station.localhost](https://home-station.localhost)

> [!NOTE]
> If your ports *80* and *443* are already occupied, feel free to test Home Station with other ports:  
> `-p 8080:80 -p 8433:443`

### 💪🏻 Non-Docker

TODO

## 🚧 Roadmap

- 🛟 Automatic Backups to popular cloud providers like Google Drive, Onedrive etc... as well as your own hardware
- 🛡️ Single sign-on for all your apps
- 🔗 Multi host support (allows multiple machines to be managed by one Home Station)

## Screenshots

TODO

## Motivation

I have been using [Portainer](https://www.portainer.io) for all my docker compose stacks and [traefik](https://traefik.io/traefik/) as my reverse proxy. Installing a new open-source
app incorporated at least the following steps:

1. Copying the `docker-compose.yml` (or creating one from a given `docker run` command)
2. Applying proxy settings in the form of labels to it
3. Adding it to the reverse proxy network
4. Creating volumes to persist data

One day I had enough, because I already had installed ~100 compose stacks this way. I wanted to create an opiniated approach
to installing apps, that just requires one click and is the same for everybody.

If you love this project, please consider giving it a ⭐.
