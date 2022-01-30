"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAsPhp = void 0;
const prettier_1 = require("prettier");
// @ts-ignore
const standalone_1 = __importDefault(require("@prettier/plugin-php/standalone"));
const formatAsPhp = (source) => {
    let manipulated = source;
    if (!source.startsWith("<?php")) {
        manipulated = "<?php " + manipulated;
    }
    if (!manipulated.endsWith(";")) {
        manipulated += ";";
    }
    try {
        manipulated = (0, prettier_1.format)(source, { parser: "php", plugins: [standalone_1.default] })
            .replace("<?php ", "")
            .trim();
    }
    catch (e) {
        // Fallback to original source if php formatter fails
        return source.trim();
    }
    if (source.trim().endsWith(";")) {
        return manipulated;
    }
    // The PHP plugin for Prettier will add a semi-colon by default. We don't always want that.
    if (manipulated.endsWith(";")) {
        manipulated.substring(0, manipulated.length - 1);
    }
    return manipulated;
};
exports.formatAsPhp = formatAsPhp;