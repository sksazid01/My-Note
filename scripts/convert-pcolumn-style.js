#!/usr/bin/env node

/**
 * convert-pcolumn-style.js (v3 - interactive)
 *
 * Run with no arguments:
 *   node convert-pcolumn-style.js
 *
 * It will then prompt you for a relative path, which can be either:
 *   1. A single .html file
 *   2. A directory (all .html files inside, recursively, will be processed)
 *
 * For every <p-column> tag found, it:
 *   1. Converts a static style="..." attribute into [style]="{...}"
 *   2. Migrates known alignment utility classes (text-left/right/center,
 *      vertical-align-top/middle/bottom) from class="..." into that same
 *      [style] object.
 *   3. Leaves any other (non-alignment) classes in place as class="...".
 *   4. Skips any tag that already uses [style]="..." (assumed already fixed).
 *
 * FLAGS (optional, can be typed along with the path when prompted, e.g.
 * "src/app/account --dry"):
 *   --dry             Show what would change without writing any files
 *   --no-backup       Don't create .bak backup files before overwriting
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const EXTENSION = '.html'; // default and only extension scanned in directory mode

// ---------- KNOWN UTILITY CLASS -> CSS DECLARATION MAP ----------

const CLASS_ALIGNMENT_MAP = {
    'text-left':             { prop: 'text-align', value: 'left' },
    'text-right':            { prop: 'text-align', value: 'right' },
    'text-center':           { prop: 'text-align', value: 'center' },
    'text-justify':          { prop: 'text-align', value: 'justify' },
    'vertical-align-top':    { prop: 'vertical-align', value: 'top' },
    'vertical-align-middle': { prop: 'vertical-align', value: 'middle' },
    'vertical-align-bottom': { prop: 'vertical-align', value: 'bottom' },
};

// ---------- FILE WALKER ----------

function walk(dir, fileList = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (['node_modules', '.git', 'dist', '.angular'].includes(entry.name)) continue;
            walk(fullPath, fileList);
        } else if (entry.name.endsWith(EXTENSION)) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

function resolveFileList(targetPath) {
    const stat = fs.statSync(targetPath);
    if (stat.isFile()) return [targetPath];
    if (stat.isDirectory()) return walk(targetPath);
    return [];
}

// ---------- HELPERS ----------

function parseCssStringToPairs(cssStr) {
    return cssStr
        .split(';')
        .map(rule => rule.trim())
        .filter(Boolean)
        .map(decl => {
            const colonIndex = decl.indexOf(':');
            if (colonIndex === -1) return null;
            const prop = decl.slice(0, colonIndex).trim();
            const value = decl.slice(colonIndex + 1).trim();
            if (!prop || !value) return null;
            return [prop, value];
        })
        .filter(Boolean);
}

function objectToLiteral(obj) {
    const pairs = Object.entries(obj).map(([k, v]) => {
        const safeValue = String(v).replace(/'/g, "\\'");
        return `'${k}': '${safeValue}'`;
    });
    return `{${pairs.join(', ')}}`;
}

// ---------- CORE TRANSFORM ----------

function transformContent(content) {
    let changesCount = 0;
    const tagRegex = /<p-column\b[^>]*>/g;

    const newContent = content.replace(tagRegex, (tagMatch) => {
        if (/\[style\]\s*=/.test(tagMatch)) return tagMatch;

        let workingTag = tagMatch;

        const styleAttrRegex = /(^|\s)style\s*=\s*"([^"]*)"/;
        const styleMatch = workingTag.match(styleAttrRegex);
        const styleProps = {};
        if (styleMatch) {
            parseCssStringToPairs(styleMatch[2]).forEach(([k, v]) => { styleProps[k] = v; });
        }

        const classAttrRegex = /(^|\s)class\s*=\s*"([^"]*)"/;
        const classMatch = workingTag.match(classAttrRegex);
        const classDerivedProps = {};
        const leftoverClasses = [];
        if (classMatch) {
            classMatch[2].split(/\s+/).filter(Boolean).forEach(token => {
                const mapped = CLASS_ALIGNMENT_MAP[token];
                if (mapped) {
                    classDerivedProps[mapped.prop] = mapped.value;
                } else {
                    leftoverClasses.push(token);
                }
            });
        }

        if (!styleMatch && Object.keys(classDerivedProps).length === 0) {
            return tagMatch;
        }

        const mergedProps = { ...classDerivedProps, ...styleProps };
        const objectLiteral = objectToLiteral(mergedProps);

        if (styleMatch) workingTag = workingTag.replace(styleMatch[0], '');
        if (classMatch) workingTag = workingTag.replace(classMatch[0], '');

        const appended = leftoverClasses.length > 0
            ? `[style]="${objectLiteral}" class="${leftoverClasses.join(' ')}"`
            : `[style]="${objectLiteral}"`;

        if (/\/\s*>$/.test(workingTag)) {
            // self-closing tag: <p-column ... />
            workingTag = workingTag.replace(/\s*\/\s*>$/, ` ${appended} />`);
        } else {
            // normal tag: <p-column ...>
            workingTag = workingTag.replace(/\s*>$/, ` ${appended}>`);
        }

        workingTag = workingTag.replace(/[ \t]{2,}/g, ' ');
        workingTag = workingTag.replace(/\n\s*\n/g, '\n');
        workingTag = workingTag.replace(/\s*\n\s*>/g, '>');
        workingTag = workingTag.replace(/[ \t]+\n/g, '\n');

        changesCount++;
        return workingTag;
    });

    return { newContent, changesCount };
}

// ---------- RUN ----------

function run(targetPath, isDryRun) {
    if (!fs.existsSync(targetPath)) {
        console.error(`Path not found: ${targetPath}`);
        process.exit(1);
    }

    const files = resolveFileList(targetPath);
    let totalChanges = 0;
    let filesChanged = 0;

    console.log(`\nScanning ${files.length} file(s) under "${targetPath}"...\n`);

    for (const filePath of files) {
        const original = fs.readFileSync(filePath, 'utf8');
        const { newContent, changesCount } = transformContent(original);

        if (changesCount > 0) {
            filesChanged++;
            totalChanges += changesCount;
            console.log(`✔ ${filePath} — ${changesCount} <p-column> tag(s) updated`);

            if (isDryRun) continue;

            fs.writeFileSync(filePath, newContent, 'utf8');
        }
    }

    console.log('\n---');
    if (isDryRun) {
        console.log(`DRY RUN complete. ${totalChanges} change(s) found across ${filesChanged} file(s). No files were modified.`);
    } else {
        console.log(`Done. ${totalChanges} change(s) applied across ${filesChanged} file(s).`);
    }
}

// ---------- INTERACTIVE PROMPT ----------

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log('convert-pcolumn-style — scans .html files by default.');
console.log('Enter a relative path to a single .html file OR a directory (all .html files inside will be processed).');
console.log('Add --dry to preview changes without writing, e.g.:  src/app/account --dry\n');

rl.question('Path: ', (answer) => {
    rl.close();

    const parts = answer.trim().split(/\s+/).filter(Boolean);
    const targetPath = parts.find(p => !p.startsWith('--'));
    const isDryRun = parts.includes('--dry');

    if (!targetPath) {
        console.error('No path provided. Exiting.');
        process.exit(1);
    }

    run(targetPath, isDryRun);
});
