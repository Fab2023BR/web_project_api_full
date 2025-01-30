import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: process.cwd(),
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("airbnb-base"), {
    rules: {
        "no-underscore-dangle": ["error", {
            allow: ["_id"],
        }],

        "no-console": ["warn", {
            allow: ["log", "warn", "error"],
        }],

        "linebreak-style": "off",
    },
}];