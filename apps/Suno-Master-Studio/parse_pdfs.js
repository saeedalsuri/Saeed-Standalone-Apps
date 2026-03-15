import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

// Get current directory
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.resolve(__dirname, '..'); 
const outputPath = path.join(__dirname, 'manuals_content.txt');

async function parsePdfs() {
    try {
        console.log(`Scanning directory: ${directoryPath}`);
        const files = fs.readdirSync(directoryPath);
        const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');
        
        console.log(`Found ${pdfFiles.length} PDF files.`);
        
        let fullContent = '';

        for (const file of pdfFiles) {
            console.log(`Processing: ${file}`);
            const filePath = path.join(directoryPath, file);
            const dataBuffer = fs.readFileSync(filePath);
            
            try {
                // Initialize parser with data buffer
                const parser = new PDFParse({ data: dataBuffer });
                
                // Get text
                const result = await parser.getText();
                
                fullContent += `\n\n========================================\n`;
                fullContent += `DOCUMENT: ${file}\n`;
                fullContent += `========================================\n\n`;
                fullContent += result.text;
                fullContent += `\n\n----------------------------------------\n\n`;
                
                // Clean up if necessary (parser.destroy() is used in CLI but maybe not strictly required for simple script)
                if (parser.destroy) await parser.destroy();
                
            } catch (err) {
                console.error(`Error parsing ${file}:`, err.message);
                fullContent += `\n\nError parsing ${file}: ${err.message}\n\n`;
            }
        }

        fs.writeFileSync(outputPath, fullContent);
        console.log(`Successfully wrote content to ${outputPath}`);
    } catch (err) {
        console.error('Error in main execution:', err);
    }
}

parsePdfs();
