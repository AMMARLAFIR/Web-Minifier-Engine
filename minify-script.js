const fs = require('fs');
const path = require('path');
const HtmlMinifier = require('html-minifier').minify;
const CleanCSS = require('clean-css');
const { minify: minifyJS } = require('terser');

// 1. Define Source and Output root paths
const SOURCE_DIR = process.cwd();
const OUTPUT_DIR = path.join(SOURCE_DIR, 'dist'); 

const htmlOptions = {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    removeComments: true,
    minifyJS: true,
    minifyCSS: true
};

const cssMinifier = new CleanCSS({});

// Recursive structural scanning engine
async function processDirectory(currentDir) {
    const files = fs.readdirSync(currentDir);

    for (const file of files) {
        const sourcePath = path.join(currentDir, file);
        const stat = fs.statSync(sourcePath);

        // Skip the distribution folder and dependency modules to prevent infinite loops
        if (file === 'node_modules' || file === 'dist' || file.startsWith('.')) {
            continue;
        }

        // Calculate the target path inside the 'dist' directory
        const relativePath = path.relative(SOURCE_DIR, sourcePath);
        const targetPath = path.join(OUTPUT_DIR, relativePath);

        if (stat.isDirectory()) {
            // Recreate the identical folder structure in 'dist' if it doesn't exist
            if (!fs.existsSync(targetPath)) {
                fs.mkdirSync(targetPath, { recursive: true });
            }
            await processDirectory(sourcePath);
        } else {
            // Ensure the target parent directory exists before creating files
            const targetParentDir = path.dirname(targetPath);
            if (!fs.existsSync(targetParentDir)) {
                fs.mkdirSync(targetParentDir, { recursive: true });
            }
            await processFile(sourcePath, targetPath);
        }
    }
}

// Processing engine: reads source -> processes -> writes to target path
async function processFile(sourcePath, targetPath) {
    const ext = path.extname(sourcePath).toLowerCase();
    
    // Skip system/script configuration files in the root folder copy
    if (path.basename(sourcePath) === 'minify-script.js' || path.basename(sourcePath) === 'run-minifier.bat' || path.basename(sourcePath) === 'package.json' || path.basename(sourcePath) === 'package-lock.json') {
        return;
    }

    const originalCode = fs.readFileSync(sourcePath, 'utf8');

    try {
        if (ext === '.html' || ext === '.htm') {
            const minified = HtmlMinifier(originalCode, htmlOptions);
            fs.writeFileSync(targetPath, minified, 'utf8');
            echoSuccess(targetPath, 'HTML');
        } 
        else if (ext === '.css') {
            const output = cssMinifier.minify(originalCode);
            if (output.styles) {
                fs.writeFileSync(targetPath, output.styles, 'utf8');
                echoSuccess(targetPath, 'CSS');
            }
        } 
        else if (ext === '.js') {
            const output = await minifyJS(originalCode);
            if (output.code) {
                fs.writeFileSync(targetPath, output.code, 'utf8');
                echoSuccess(targetPath, 'JS');
            }
        } 
        else {
            // Non-web files (images, fonts, assets) are copied over unchanged to preserve functionality
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`\x1b[34m[COPIED]\x1b[0m   ${path.relative(OUTPUT_DIR, targetPath)}`);
        }
    } catch (err) {
        console.error(`\x1b[31m[FAILED]\x1b[0m Error processing ${path.basename(sourcePath)}:`, err.message);
        // Fallback: copy original if minification breaks to avoid losing assets in dist
        fs.copyFileSync(sourcePath, targetPath);
    }
}

function echoSuccess(targetPath, type) {
    console.log(`\x1b[32m[MINIFIED ${type}]\x1b[0m ${path.relative(OUTPUT_DIR, targetPath)}`);
}

// Initialize workspace
console.log(`Source Workspace: ${SOURCE_DIR}`);
console.log(`Output Production Workspace: ${OUTPUT_DIR}\n`);

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

processDirectory(SOURCE_DIR).catch(console.error);
