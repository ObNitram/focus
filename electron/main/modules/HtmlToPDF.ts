import { launch } from 'puppeteer';
import * as fs from 'fs'
import { dialog, ipcMain } from 'electron';
import { tmpdir } from 'os';
import { printError, printINFO, printOK } from './OutputModule';
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
                                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
                                    }
                                    .editor_general{
                                        resize: none;
                                        position: relative;
                                        tab-size: 1;
                                        outline: 0;
                                        padding: 15px 10px;
                                    }
                                    .editor_code{
                                        opacity: 1;
                                        font-family: Menlo, Consolas, Monaco, monospace;
                                        display: block;
                                        padding: 8px 8px 8px 52px;
                                        line-height: 1.53;
                                        tab-size: 2;
                                        /* white-space: pre; */
                                        overflow-x: auto;
                                        position: relative;
                                        border-radius: 10px;
                                        color: #fff;
                                    }
                                    .editor_code::before {
                                        content: attr(data-gutter);
                                        position: absolute;
                                        background-color: #3c3c3c;
                                        left: 0;
                                        top: 0;
                                        border-right: 1px solid #ddd;
                                        padding: 8px;
                                        color: #fff;
                                        white-space: pre-wrap;
                                        text-align: right;
                                        min-width: 25px;
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

