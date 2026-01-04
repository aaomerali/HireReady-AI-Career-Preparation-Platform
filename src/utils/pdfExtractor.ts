import * as pdfjs from 'pdfjs-dist';

// 1. Import the worker specifically from the 'pdfjs-dist' build folder
// Using ?url tells Vite to treat this as a static asset path
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// 2. Set the worker source before any extraction logic
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    
    // Use the specific version of getDocument for pdfjs v4+
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += pageText + "\n";
    }
    
    return fullText;
};