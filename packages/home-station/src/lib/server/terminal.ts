import * as pty from '@homebridge/node-pty-prebuilt-multiarch';
import os from 'node:os';

const isWindows = os.platform() === 'win32';

export async function exec(
    file: string,
    args: string | string[],
    cwd?: string,
    dataCallback?: (data: string) => void
): Promise<number> {
    if (isWindows && !file.endsWith('.exe')) {
        file += '.exe';
    }
    return new Promise((resolve) => {
        const ptyProcess = pty.spawn(file, args, {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd
        });

        ptyProcess.onData((data) => dataCallback && dataCallback(data));

        ptyProcess.onExit((code) => {
            resolve(code.exitCode);
            ptyProcess.kill();
        });
    });
}
