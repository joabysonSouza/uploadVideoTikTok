import path from "path";
import fs from "fs";
import { chromium } from "playwright";

const UploadVideoTikTok = async () => {
  const context = await chromium.launchPersistentContext("./meu-perfil", {
    executablePath: "/usr/bin/google-chrome",
    headless: false,
    args: [
      "--lang=pt-BR",
      "--start-maximized",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  await context.setExtraHTTPHeaders({
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();

  await page.goto("https://www.tiktok.com/upload", {});

  const fileInput = await page.waitForSelector('input[type="file"]', {
    state: "attached",
  });

  const pastaVideos = path.resolve("/home/joabyson/Downloads");
  const videos = fs
    .readdirSync(pastaVideos)
    .filter((file) => file.endsWith(".mp4"));

  if (videos.length === 0) {
    console.log("Nenhum vídeo encontrado.");
    return;
  }

  const videoAleatorio = videos[Math.floor(Math.random() * videos.length)];
  const videoPath = path.join(pastaVideos, videoAleatorio);

  await page.click("text=Selecionar vídeo"); // Chamar video

  await page.waitForTimeout(20000);
  await fileInput.setInputFiles(videoPath);
  console.log(` Enviado: ${videoAleatorio}`);

  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(2000);

  await page.waitForSelector(
    ".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr",
    {
      timeout: 10000,
    }
  );

  await page.click(
    ".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr"
  );
  await page.keyboard.type(`
#AltaPerformance

#FocoENegocio

#MentalidadeDeSucesso

#Produtividade

#CrescimentoPessoal

#Disciplina

#MindsetEmpreendedor`);

  console.log("⏳ Aguardando miniatura...");
  await page.waitForSelector("img.cover-image", {
    timeout: 120000,
  });

  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(3000);

  // 🚀 Clica em "Postar"
  const botaoPostar = await page.$('button:has-text("Publicar")');
  if (botaoPostar) {
    await botaoPostar.click();
    console.log("Vídeo postado com sucesso!");
  } else {
    console.log("Botão 'Publicar' não encontrado.");
  }

  await page.close()
};

UploadVideoTikTok();
