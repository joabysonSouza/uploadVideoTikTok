import path from "path";
import fs from "fs";
import { chromium } from "playwright";

const UploadVideoTikTok = async () => {

  const context = await chromium.launchPersistentContext("./meu-perfil", {
    headless: false,
    viewport: null,
    args: [
    "--start-maximized",
    "--lang=pt-BR",
    "--disable-blink-features=AutomationControlled",
    "--disable-dev-shm-usage",
    "--no-sandbox",
    "--use-gl=desktop",
    "--enable-gpu",
    "--ignore-gpu-blocklist",
    "--disable-software-rasterizer",
    "--enable-features=VaapiVideoDecoder",
    ],
  });

  const page = await context.newPage();

  console.log("➡ Indo para o upload...");
  await page.goto("https://www.tiktok.com/upload", {
    timeout: 90000,
    waitUntil: "networkidle"
  });

  // pausa para carregamento completo da página
  await page.waitForTimeout(9000);

await page.click('button[aria-label="Selecionar vídeo"]',{
     timeout: 90000
})

  const fileInput = page.locator('input[type="file"]');
  const pastaVideos = "/home/joabyson/Vídeos/VideosTikTok";
  const files = fs.readdirSync(pastaVideos)
    .filter(f => f.toLowerCase().endsWith(".mp4"));

  if (files.length === 0) {
    console.log("❌ Nenhum vídeo encontrado.");
    return;
  }

  const video = files[Math.floor(Math.random() * files.length)];
  const videoPath = path.join(pastaVideos, video);

  console.log("🎬 Enviando:", video);
  await fileInput.setInputFiles(videoPath);

  // aguarde o TikTok processar o vídeo
  console.log("⏳ Aguardando processamento...");
  await page.waitForTimeout(15000);

  // descrição
  const descSelector =
    ".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr";

  await page.waitForSelector(descSelector);
  await page.click(descSelector);

  await page.keyboard.type(
    "Segue a gente !! #AltaPerformance #FocoENegocio #Produtividade #Sucesso"
   
  );

  await page.waitForTimeout(2000);

  console.log("⏳ Esperando miniatura...");


  let miniaturaCarregou = false;

  try {
    await page.waitForSelector("img.cover-image", { timeout: 120000 });
    miniaturaCarregou = true

     console.log("📸 Miniatura carregada!");
  } catch (error) {
    miniaturaCarregou = false;
    console.log("⚠ Miniatura NÃO carregou  seguindo o fluxo...")
    
  }

  if(miniaturaCarregou){
     console.log("➡ Miniatura OK, continuando normalmente...");
  }else{


  // rolar para o botão
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(2000);

  const publicar = page.locator('button[data-e2e="post_video_button"]');

  if (await publicar.count() > 0) {
    await page.waitForFunction(() => {
  const btn = document.querySelector('button[data-e2e="post_video_button"]');
  return btn && btn.getAttribute("aria-disabled") === "false";

});

  await page.click('button[data-e2e="post_video_button"]');
    console.log("🎉 Publicado com sucesso!");
  } else {
    console.log("❌ Botão Publicar não encontrado.");
  }

  console.log("✔ Concluído. Mantendo o navegador aberto.");

}

page.close()
};

UploadVideoTikTok();
