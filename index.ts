import path from "path";
import fs from "fs"
import { chromium } from "playwright";

const UploadVideoTikTok = async()=>{
   const context = await chromium.launchPersistentContext("./meu-perfil", {
  headless: false,
  args: ['--start-maximized', '--disable-blink-features=AutomationControlled'
     
  ],
});

await context.setExtraHTTPHeaders({
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
});

const page = await context.newPage();
await page.goto("https://www.tiktok.com/tiktokstudio/upload?from=webapp");




await page.click('text=Selecionar vídeo')

  const fileInput = await page.waitForSelector('input[type="file"]',{
    state : "attached"
  });
  const arquivoVideo = path.resolve("/home/joabyson/Downloads")
  const filterVideo = fs.readdirSync(arquivoVideo).filter(video => video.endsWith(".mp4"))

  if(filterVideo.length === 0 ){
    console.log("Nenhum video Mp4 encontrado");
    
  }
  const videoEnviarAleatorio =Math.floor(Math.random() * filterVideo.length)
  const videoSelecionado = filterVideo[videoEnviarAleatorio]

  const videoPath = path.join("/home/joabyson/Downloads", videoSelecionado)

    await fileInput.setInputFiles(videoPath);


    console.log("✅ Upload finalizado (manual ou automático).");




}

UploadVideoTikTok()
  



 