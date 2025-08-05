class DocManager {
    constructor() {
        this.data = null;
        this.codeCache = new Map();
    }

    async init() {
        try {
            const response = await fetch("./data.json");
            this.data = await response.json();
            return this.data;
        } catch (error) {
            console.error("Failed to load documentation data:", error);
            return null;
        }
    }

    async loadCodeFile(filename) {
        if (this.codeCache.has(filename)) {
            return this.codeCache.get(filename);
        }

        try {
            const response = await fetch(`./code/${filename}`);
            const code = await response.text();
            this.codeCache.set(filename, code);
            return code;
        } catch (error) {
            console.error(`Failed to load code file ${filename}:`, error);
            return `// Error loading ${filename}`;
        }
    }

    async renderQuickStart(containerId) {
        if (!this.data?.quickStart) return;

        const container =
            document.getElementById(containerId) ||
            document.querySelector(".quick-start-content");
        if (!container) return;

        let html = "";
        for (let i = 0; i < this.data.quickStart.steps.length; i++) {
            const step = this.data.quickStart.steps[i];
            const code = await this.loadCodeFile(step.codeFile);

            html += `
                <div class="step">
                    <h3>${i + 1}. ${step.title}</h3>
                    <div class="code-block">
                        <pre><code class="language-typescript">${this.escapeHtml(
                            code
                        )}</code></pre>
                        <button class="copy-btn" onclick="copyToClipboard(\`${this.escapeForJs(
                            code
                        )}\`)">Copy</button>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    async renderExamplesPage() {
        if (!this.data?.sections) return;

        const container = document.querySelector(".examples-content");
        if (!container) return;

        // Create navigation
        let navHtml = "";
        this.data.sections.forEach((section) => {
            navHtml += `<a href="#${section.id}" class="example-nav-link">${section.title}</a>`;
        });

        const navContainer = document.querySelector(".examples-nav");
        if (navContainer) {
            navContainer.innerHTML = navHtml;
        }

        // Create sections
        let sectionsHtml = "";
        for (const section of this.data.sections) {
            sectionsHtml += `
                <section id="${section.id}" class="example-section">
                    <h2>${section.title}</h2>
                    <p>${section.description}</p>
            `;

            for (const example of section.examples) {
                const code = await this.loadCodeFile(example.codeFile);
                sectionsHtml += `
                    <div class="example">
                        <h3>${example.title}</h3>
                        <p class="example-description">${
                            example.description
                        }</p>
                        <div class="code-block">
                            <pre><code class="language-typescript">${this.escapeHtml(
                                code
                            )}</code></pre>
                            <button class="copy-btn" onclick="copyToClipboard(\`${this.escapeForJs(
                                code
                            )}\`)">Copy</button>
                        </div>
                    </div>
                `;
            }

            sectionsHtml += "</section>";
        }

        container.innerHTML = sectionsHtml;
    }

    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    escapeForJs(text) {
        return text.replace(/`/g, "\\`").replace(/\$/g, "\\$");
    }

    // Simple syntax highlighting without token classes
    highlightCode() {
        document.querySelectorAll("pre code").forEach((block) => {
            let html = block.innerHTML;

            // Simple highlighting without problematic token classes
            html = html.replace(
                /\b(class|function|const|let|var|if|else|for|while|return|import|export|interface|type|extends|implements|public|private|protected|static|readonly|async|await|new|this|super)\b/g,
                '<span style="color: #c792ea; font-weight: bold;">$1</span>'
            );

            html = html.replace(
                /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
                '<span style="color: #c3e88d;">$1$2$1</span>'
            );

            html = html.replace(
                /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
                '<span style="color: #546e7a; font-style: italic;">$1</span>'
            );

            html = html.replace(
                /\b(\d+(\.\d+)?)\b/g,
                '<span style="color: #f78c6c;">$1</span>'
            );

            block.innerHTML = html;
        });
    }
}

// Global instance
window.docManager = new DocManager();
