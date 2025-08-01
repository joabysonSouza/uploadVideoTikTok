import path from "path";
import fs from "fs"
import { chromium } from "playwright";

const UploadVideoTikTok = async()=>{
   const context = await chromium.launchPersistentContext("./meu-perfil", {
  headless: false,
  args: ['--start-maximized', '--disable-blink-features=AutomationControlled'],
});
const page = await context.newPage();
await page.goto("https://www.tiktok.com/tiktokstudio/upload?from=webapp");

  const fileInput = await page.waitForSelector('input[type="file"]');
  const arquivoVideo = path.resolve("Documentos/videos/videosTeste")
  const filterVideo = fs.readdirSync(arquivoVideo).filter(video => video.endsWith(".mp4"))

  if(filterVideo.length === 0 ){
    console.log("Nenhum video Mp4 encontrado");
    
  }
  const videoEnviarAleatorio =[Math.floor(Math.random() * filterVideo.length)]


}

UploadVideoTikTok()
  



 