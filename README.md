# Web-Minifier-Engine
A simple wrapper of available tools. For Reduce your load time(latency) of web content and server bandwidth usage . created with the help of AI.

**Automated Web Assets Minifier Engine**

A zero-setup, recursive build utility for Windows that optimizes HTML, CSS, and JavaScript files automatically while keeping your original source code safe and untouched.

---

## 🚀 Features

* **Zero Setup Required:** Checks, installs, and configures Node.js automatically if it's missing from the Windows host environment.
* **Production Mirroring:** Safely replicates your exact structural directory and subdirectory tree into a separate production-ready `dist/` workspace.
* **Multi-Format Processing:** 
  * **HTML:** Compresses layout structures, drops redundant markup tags, and strips system comments.
  * **CSS:** Compresses style rules and handles embedded `<style>` blocks.
  * **JavaScript:** Manglers variable tokens, optimizes runtime logic scopes, and compresses `<script>` blocks.
* **Asset Resilience:** Automatically copies non-web files (images, audio, fonts) unchanged to the correct mirror location.

---

## 🛠️ How to Use

1. Drop both **`run-minifier.bat`** and **`minify-script.js`** directly into the root folder of your workspace.(widows 11 will block you so copy the code and past it to notepad and save as .bat and .js )
2. Double-click **`run-minifier.bat`**.
3. Let the script run. It will download dependencies silently if needed, scan your folder structure, and generate your optimized files.
4. Your clean, minified production assets will be instantly available inside the newly generated **`dist/`** folder.

---

## 📂 Expected Output Structure

The tool leaves your original development environment pristine and mirrors your project cleanly:

```text
YourProjectFolder/
│   run-minifier.bat
│   minify-script.js
│   index.html            <-- Untouched Source File
│
├───css/
│       style.css         <-- Untouched Source File
│
└───dist/                 <-- AUTOMATICALLY GENERATED PRODUCTION BUILD
    │   index.html        <-- Minified HTML
    │
    └───css/
            style.css     <-- Minified CSS

---

## 📜 License

This project is open-source software licensed under the **MIT License**. 

You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of this software, provided that the original copyright notice and this permission notice are included in all copies or substantial portions of the software.

---

## 🏅 Acknowledgements & Core Engines

This automated script is a wrapper bootstrapper built on top of world-class, open-source minification engines created by the community. Special thanks to the creators and maintainers of these excellent tools:

* **[html-minifier](https://github.com/kangax/html-minifier)** – Created by **Juriy Zaytsev (@kangax)** and **Alex Lam S.L. (@alexlamsl)**. A highly configurable, JavaScript-based HTML compressor.
* **[clean-css](https://github.com/clean-css/clean-css)** – Created and maintained by **Jakub Pawlowicz**. A fast, efficient, and deeply optimized Node.js engine for CSS minification.
* **[Terser](https://github.com/terser/terser)** – Maintained by the **Terser community**. The industry-standard tool for modern JavaScript parsing, mangling, and compression.

