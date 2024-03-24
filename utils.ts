import { exec, ExecException } from 'child_process';

export async function getRunOutput(
    command: string,
    folder: string,
    shell?: string,
    hideErrors?: boolean,
    ignoreErrors?: boolean,
): Promise<string> {
    return new Promise((resolve, reject) => {
        let out = '';
        exec(command, undefined, (error: ExecException, stdout: string, stdError: string) => {
            if (stdout) {
                out += stdout;
            }
            if (!error) {
                if (out == '' && stdError) {
                    out += stdError;
                }
                resolve(out);
            } else {
                if (stdError) {
                    if (!hideErrors) {
                    } else {
                        console.error(stdError);
                    }
                    if (ignoreErrors) {
                        resolve(out);
                    } else {
                        reject(stdError);
                    }
                } else {
                    // This is to fix a bug in npm outdated where it returns an exit code when it succeeds
                    resolve(out);
                }
            }
        });
    });
}