import typescript from "rollup-plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "iife",
    },
    plugins: [typescript({ target: "ESNext" })],
  },
  {
    input: "src/server.ts",
    output: {
      file: "dist/server.js",
      format: "cjs",
    },
    plugins: [
      typescript({ target: "ESNext" }),
      nodeResolve({ preferBuiltins: true }),
    ],
  },
];
