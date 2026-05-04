/*
entirely superfluous file just for 
*/import { pdf } from "pdf-to-img"
import { pipeline } from "@huggingface/transformers"
import { env } from '@huggingface/transformers';
import { createWorker } from 'tesseract.js';
import { promises as fs } from "node:fs";

  const worker = await createWorker('eng');
const messages = [
    {
        "role": "user",
        "content": [
            { "type": "image", "url": "https://baidu-qianfan-ocr-demo.hf.space/gradio_api/file=/tmp/gradio/cb9857bb295edc8c55051ce7e994e8380e2721096695980be38a8ec0ebe9a50d/text_block.png" },
            { "type": "text", "text": "Extract the text from the image" }
        ]
    },
]
async function pdfToText(pdfFile: File | Buffer | ArrayBuffer | Uint8Array): Promise<string> {
    // Load PDF

    const pdfData = pdfFile instanceof File
        ? await pdfFile.arrayBuffer()
        : pdfFile;
    const data = new Uint8Array(pdfData)
    const document = await pdf(data, { scale: 3 })

    let fullText = ""

    for (let page = 1; page <= document.length; page++) {
        // Run OCR
        const picture = await document.getPage(page)

        const array = new Uint8Array(picture);
        const blob = new Blob([array], { type: "image/png" })
        const output = await worker.recognize(picture);
   
        fullText += `--- Page ${page} ---\n${output.data.text}\n\n`;
        page++

        await fs.writeFile(`page${page}.png`, picture);
        console.log(fullText)
    }
    return fullText;
}

if (import.meta.main) {
    const res = await pdfToText(await Bun.file("test.pdf").bytes())
    console.log(res)
}


// Or copy the worker file to your project and serve it statically if needed.