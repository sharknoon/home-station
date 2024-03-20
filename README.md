TODO ICON OR FANCY HEADER LOGO

# Home Station

A fancy, easy-to-use, docker compose based app manager for your self-hosted home server. 

![GitHub Repo stars](https://img.shields.io/github/stars/home-station-org/home-station)
![GitHub Release](https://img.shields.io/github/v/release/home-station-org/home-station)
![GitHub last commit](https://img.shields.io/github/last-commit/home-station-org/home-station)

TODO SCREENSHOT

## ⭐️ Features:
- 🖱️ Install your favorite open-source apps with one click
- 🏬 App marketplace with over 1 free apps
- 🔐 Integrated reverse proxy, so you don't have to worry about ports and certificates
- ⬆️ Automatic updates for your apps (can be turned off)
- 🖥️ Fancy, easy-to-use and multi-language UI (with themes 🎨)
- 👤 Multi user capable (share your home server with your family & friends)

## 🔧 How to install
Requirements:

- [Docker](https://docs.docker.com/engine/install/) 20+ / [Podman](https://podman.io/docs/installation)
- (Podman only) podman-docker (Debian: `apt install podman-docker`)
- OS:
  - Major Linux distros that can run Docker/Podman such as:  
    ✅ Ubuntu  
    ✅ Debian (Bullseye or newer)  
    ✅ Raspbian (Bullseye or newer)  
    ✅ CentOS  
    ✅ Fedora  
    ✅ ArchLinux  
    ❌ Debian/Raspbian Buster or lower is not supported  
    ❌ Windows (Will be supported later)  
    Arch: armv7, arm64, amd64 (a.k.a x86_64)

```bash
docker run -v /var/run/docker.sock:/var/run/docker.sock \
    -p 80:80 -p 443:443 \
    ghcr.io/home-station-org/home-station
```

> Note: If you don't feel comfortable giving up your ports 80 and 443 yet, feel free to test Home Station with other ports:  
> `-p 8080:80 -p 8433:443`

## 🚧 Roadmap
- 🛟 Automatic Backups to popular cloud providers like Google Drive, Onedrive etc... as well as your own hardware
- 🛡️ Single sign-on for all your apps
