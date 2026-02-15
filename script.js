import { GoogleGenerativeAI } from "@google/genai";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

async function extractTextFromFile(file) {
    const reader = new FileReader();
    
    // Handle Text Files (.txt)
    if (file.type === "text/plain") {
        return file.text();
    } 
    
    // Handle Word Docs (.docx)
    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    }
    
    // Handle PDFs (.pdf)
    if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            fullText += content.items.map(item => item.str).join(" ") + "\n";
        }
        return fullText;
    }
}

// Updated Button Click Logic
btn.addEventListener('click', async () => {
    const fileInput = document.getElementById('filePicker');
    let workText = document.getElementById('workInput').value;
    const promptText = document.getElementById('promptInput').value;
    const userKey = document.getElementById('apiKeyInput').value;

    if (fileInput.files.length > 0) {
        output.innerHTML = "Reading file...";
        workText = await extractTextFromFile(fileInput.files[0]);
    }

    if (!workText || !promptText) {
        alert("Please provide both the prompt and your work (pasted or uploaded)!");
        return;
    }

    // ... (Your existing genAI code here using workText)
});
