# Home Station

## Developing

To be able to run Home Station, you need to have the following prerequisites installed:

-   [Node.js](https://nodejs.org/en/download/current)
-   [Docker](https://docs.docker.com/engine/install/)

Once you've installed those prerequisites go ahead and install the dependencies and start a development server:

```bash
npm install
npm run dev
```

You can access Home Station now at [localhost:5173](http://localhost:5173) and traefik at [localhost:8080/dashboard/](http://localhost:8080/dashboard/)

> [!NOTE]
> The trailing `/` int the traefik url is mandatory

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
