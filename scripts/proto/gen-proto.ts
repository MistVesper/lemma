import { execFileSync } from "node:child_process";
import path from "node:path";

import { ROOT_DIR } from "../shared/repository.ts";

const PROTO_DIR = path.join(ROOT_DIR, "proto");
const OUT_DIR = path.join(ROOT_DIR, "web/src/gen");
const NODE_BIN_DIR = path.join(ROOT_DIR, "node_modules/.bin");

const TEMPLATE = {
    version: "v2",
    clean: true,
    plugins: [
        {
            local: "protoc-gen-es",
            out: path.relative(PROTO_DIR, OUT_DIR).replaceAll("\\", "/"),
            opt: ["target=ts"],
        },
    ],
};

function withNodeBinOnPath(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
    const key =
        Object.keys(env).find((name) => name.toUpperCase() === "PATH") ??
        "PATH";
    const current = env[key];
    return {
        ...env,
        [key]:
            current === undefined || current === ""
                ? NODE_BIN_DIR
                : `${NODE_BIN_DIR}${path.delimiter}${current}`,
    };
}

function main(): void {
    execFileSync("buf", ["generate", "--template", JSON.stringify(TEMPLATE)], {
        cwd: PROTO_DIR,
        env: withNodeBinOnPath(process.env),
        stdio: "inherit",
    });
}

main();
