try {
    await fetch('http://localhost:2019/config');
} catch (error) {
    console.error(
        '----------------------------------------------------------------------------------'
    );
    console.error(
        '| \x1b[31mCaddy server is not running. Please start caddy first by running "caddy start"\x1b[0m |'
    );
    console.error(
        '----------------------------------------------------------------------------------'
    );
    console.error('');
    process.exit(1);
}

await fetch('http://localhost:2019/load', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        apps: {
            http: {
                servers: {
                    home_station: {
                        '@id': 'home_station',
                        listen: [':80', ':443'],
                        routes: [
                            // Redirect localhost to home-station.localhost
                            {
                                match: [{ host: ['localhost'] }],
                                handle: [
                                    {
                                        handler: 'static_response',
                                        status_code: 301,
                                        headers: {
                                            Location: ['http://home-station.localhost/']
                                        }
                                    }
                                ]
                            },
                            // Home station itself
                            {
                                match: [{ host: ['home-station.localhost'] }],
                                handle: [
                                    {
                                        handler: 'reverse_proxy',
                                        upstreams: [{ dial: 'localhost:5173' }]
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        }
    })
});
