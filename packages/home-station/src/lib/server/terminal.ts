import * as pty from '@homebridge/node-pty-prebuilt-multiarch';

export async function exec(file: string, args: string | string[], cwd?: string): Promise<number> {
    return new Promise((resolve) => {
        const ptyProcess = pty.spawn(file, args, {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd
        });

        ptyProcess.onData((data) => {
            process.stdout.write(data);
        });

        ptyProcess.onExit((code) => {
            resolve(code.exitCode);
            ptyProcess.kill();
        });
    });
}
