#!/usr/bin/env node

import clipboard from "clipboardy";
import { Command } from "commander";
import os from "os";
import * as fs from "fs/promises";
import { fileURLToPath } from "url";

const program = new Command();
const __dirname = fileURLToPath(new URL(".", import.meta.url));

program
    .version("1.1.0")
    .description("Simple random secure password generator")
    .option("-l, --length <values>", "length of passwords (single value, comma-separated, or range like 5-9)", "8")
    .option("-s, --save", "save the password(s) to passwords.txt")
    .option("-nn, --no-numbers", "passwords will not include numbers")
    .option("-ns, --no-symbols", "passwords will not include symbols")
    .option("-c, --count <number>", "how many passwords to generate per length", "1")
    .parse(process.argv);

const { length, save, numbers, symbols, count } = program.opts();

const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const integers = "0123456789";
const exCharacters = "_";

// Function to parse length input (single values, comma-separated list, or range)
const parseLength = (input) => {
    if (input.includes("-")) {
        let [min, max] = input.split("-").map(Number);
        if (isNaN(min) || isNaN(max) || min > max) {
            console.error("Invalid length range format. Use format like 5-9.");
            process.exit(1);
        }
        return Array.from({ length: max - min + 1 }, (_, i) => min + i);
    }
    return input.split(",").map(Number).filter(n => !isNaN(n) && n > 0);
};

// Function to generate a password
const createPassword = (length, hasNumbers, hasSymbols) => {
    let chars = alpha;
    if (hasNumbers) chars += integers;
    if (hasSymbols) chars += exCharacters;
    
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
};

// Function to save passwords to files
const savePasswords = async (passwordsByLength) => {
    try {
        await fs.mkdir("output", { recursive: true });
        for (const [length, passwords] of Object.entries(passwordsByLength)) {
            const filePath = `output/${length}.txt`;
            await fs.appendFile(filePath, passwords.join(os.EOL) + os.EOL, "utf-8");
            // console.log(`Saved ${passwords.length} password(s) to ${filePath}`);
        }
    } catch (e) {
        console.error(`Failed to save passwords: ${e}`);
    }
};

// Generate passwords based on specified lengths
const passwordLengths = parseLength(length);
const passwordCount = parseInt(count, 10);
const allPasswords = {};

for (const len of passwordLengths) {
    allPasswords[len] = Array.from({ length: passwordCount }, () => createPassword(len, numbers, symbols));
}

// Print generated passwords to console
// for (const [len, passwords] of Object.entries(allPasswords)) {
//     console.log(`Generated passwords (length ${len}):`);
//     console.log(passwords.join("\n"));
// }

// Save passwords to file if required
if (save) {
    savePasswords(allPasswords);
}


// node index.js -s -c 5000 -l 3-64