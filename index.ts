import {chromium} from "playwright"
import path from "path"



 async function uploadVideos(){
    const browser = await chromium.launch({
        headless: false
    })

    const context = await browser.newContext()
    const page = await browser.newPage()

      await page.goto("https://www.tiktok.com/upload");

        
}

uploadVideos()
