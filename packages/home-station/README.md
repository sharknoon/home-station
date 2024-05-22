# Home Station

## Developing

To be able to run Home Station, you need to have the following prerequisites installed:

-   [Node.js](https://nodejs.org/en/download/current)
-   [Docker](https://docs.docker.com/engine/install/)
-   [Traefik](https://doc.traefik.io/traefik/getting-started/install-traefik/) (port 8080, api enabled)

Once you've installed those prerequisites go ahead and install the dependencies and start a development server:

```bash
sudo sh dev.sh
npm install
npm run dev
```

You can access Home Station now at [localhost:5173](http://localhost:5173) and traefik at [localhost:8080/dashboard/](http://localhost:8080/dashboard/)

> [!NOTE]
> The trailing `/` in the traefik url is mandatory

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## All-in-one Docker image

To build an all-in-one docker image, that contains traefik, run `npm run image:build` from the root project.

> [!NOTE]
> The Dockerfile is in the root directory because it needs to bind the package-lock.json file, which is only available at root.
