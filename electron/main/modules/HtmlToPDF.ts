import { launch } from 'puppeteer';
import * as fs from 'fs'
import { dialog, ipcMain } from 'electron';
import { string } from 'yargs';
import { tmpdir } from 'os';
import { printError, printINFO, printLog, printOK } from './OutputModule';
import { mainWindow } from './WindowsManagement';
import { getPathVault } from './VaultManagementModule';
import { getName } from 'pathmanage';


export function setupEvents() {
    ipcMain.on('savePDF', async (event, html: string, css: string) => {
        const path = await dialog.showSaveDialog({
            title: 'Export note as PDF',
            defaultPath: getPathVault(),
            filters: [{name: 'PDF', extensions: ['pdf']}],
            buttonLabel: 'Export PDF',
            showsTagField: true
        })
        if(path.canceled) return
        let filePathPDF = path.filePath.endsWith('.pdf') ? path.filePath : path.filePath.concat('.pdf')
        printINFO('Save PDF is asked, at path : '+ filePathPDF)
        const templateHTML = `<!DOCTYPE html>
                            <html>
                            <head>
                                <title>HTML content</title>
                                <style>
                                    body{
                                        height: auto;
                                        width: 100%;
                                        margin: 0;
                                        padding: 0;
                                        position: relative;
                                    }
                                    .editor_general{
                                        resize: none;
                                        position: relative;
                                        tab-size: 1;
                                        outline: 0;
                                        padding: 15px 10px;
                                    }
                                </style>
                                ${css}
                            </head>
                            <body>
                                ${html}
                            </body>
                            
                            </html>
    `
        fs.writeFileSync(tmpdir().concat('/file.html'), templateHTML, 'utf-8');
        (async () => {

            // Create a browser instance
            const browser = await launch();

            // Create a new page
            const page = await browser.newPage();

            //Get HTML content from HTML file
            const html = fs.readFileSync(tmpdir().concat('/file.html'), 'utf-8');
            await page.setContent(html, { waitUntil: 'domcontentloaded' });


            //To reflect CSS used for screens instead of print
            await page.emulateMediaType('screen');

            const height = await page.evaluate(() => {
                return document.body.scrollHeight
            })

            const width = await page.evaluate(() => {
                return document.body.scrollWidth
            })

            console.log('Height is ' + height)
            await page.setViewport({
                width: width,
                height: height+1
            })

            // Downlaod the PDF
            page.pdf({
                path: filePathPDF,
                height: height+1,
                width: width,
                printBackground: true,
                displayHeaderFooter: false,
            }).then(() => {
                printOK('Pdf is saved in ' + filePathPDF)
                mainWindow.webContents.send('pdf_save_responses', true, getName(filePathPDF))
            }).catch((e) => {
                printError('The pdf is not saved ! An error occured : ' + e)
                mainWindow.webContents.send('pdf_save_responses', false, getName(filePathPDF))
            }).finally(() => {
                browser.close();
            })
        })();
    })
}

