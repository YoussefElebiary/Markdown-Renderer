marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).value;
            } catch (err) {}
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true
});

const input = document.getElementById('input');
const output = document.getElementById('content');
const dropZone = document.querySelector('.entryCont');

function render() {
    try {
        const markdownText = input.value.trim();
        output.innerHTML = markdownText ? marked.parse(markdownText) : '';
    } catch (error) {
        console.error("Error rendering markdown:", error);
        output.innerHTML = '';
    }
}

function loadFile(event) {
    const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(md|markdown|txt)$/i)) {
        alert("Please select a valid Markdown or text file");
        return;
    }

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            input.value = e.target.result;
            render();
        };
        reader.readAsText(file);
    }
}

function clearInput() {
    input.value = '';
    render();
}

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.border = "2px dashed #4a6fa5";
    dropZone.style.backgroundColor = "rgba(74, 111, 165, 0.1)";
});

['dragleave', 'dragend'].forEach(type => {
    dropZone.addEventListener(type, (e) => {
        e.preventDefault();
        resetDropZoneStyles();
    });
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    resetDropZoneStyles();
    fileBtn.files = e.dataTransfer.files;
    loadFile(e);
});

function resetDropZoneStyles() {
    dropZone.style.border = "";
    dropZone.style.backgroundColor = "white";
}

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        render();
    }
});

clearInput();