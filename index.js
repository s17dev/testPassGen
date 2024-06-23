#!/usr/bin/env node

import clipboard from "clipboardy";
import { Command } from "commander";
import os from "os";
import * as fs from "fs/promises";
import { fileURLToPath } from "url";

const program = new Command();
const __dirname = fileURLToPath(new URL(".", import.meta.url));

program
    .version("1.0.0")
    .description("simple random secure password generator")
    .option("-l , --length <number>", "length of password", "8")
    .option("-s , --save", "save the password to passwords.txt")
    .option("-nn , --no-numbers", "password to not include numbers")
    .option("-ns , --no-symbols", "password to not include symbols")
    .parse(process.argv);

const { length, save, numbers, symbols } = program.opts();

const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const integers = "0123456789";
const exCharacters = "!@#$%^&*_-=+";

const createPassword = (length, hasNumbers, hasSymbols) => {
    let chars = alpha;

    if (hasNumbers) {
        chars += integers;
    }

    if (hasSymbols) {
        chars += exCharacters;
    }

    return generatePassword(length, chars);
};

const generatePassword = (length, chars) => {
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

const savePassword = async (password) => {
    try {
        await fs.appendFile(`output/${password.length}.txt`, `${password}${os.EOL}`, "utf-8");
        console.log("Password saved!!");
    } catch (e) {
        console.error(`Failed to save password: ${e}`);
    }
};

const generatedPassword = createPassword(length, numbers, symbols);

if (save) {
    savePassword(generatedPassword);
}

