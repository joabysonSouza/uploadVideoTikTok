import path, { parse } from "path";
import fs from "fs";
import { chromium } from "playwright";


const UploadVideoTikTok = async () => {

  const context = await chromium.launchPersistentContext("./meu-perfil-antigo", {
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

  const videosPostados = path.resolve("videos_postados.json");

  const lerVideosPostado = (): string[] => {
    if (!fs.existsSync(videosPostados)) {
      fs.writeFileSync(videosPostados, "[]");
    }
    const data = fs.readFileSync(videosPostados, "utf-8");

    return JSON.parse(data);
  };

  const SalvarvideoPostado = (lista: string[]) => {
    fs.writeFileSync(videosPostados, JSON.stringify(lista, null, 2));
  };

  const page = await context.newPage();

  await page.goto("https://www.tiktok.com/");
  await page.waitForTimeout(60000);
  await page.goto("https://www.tiktok.com/tiktokstudio/upload");

  await page.waitForLoadState("domcontentloaded");

  const fileInput = await page.waitForSelector('input[type="file"]', {
    state: "attached",
  });

  const pastaVideos = path.resolve("/home/joabyson/Vídeos/VideosTikTok");
  const videos = fs
    .readdirSync(pastaVideos)
    .filter((file) => file.endsWith(".mp4"));

  if (videos.length === 0) {
    console.log("Nenhum vídeo encontrado.");
    return;
  }

  const postados = lerVideosPostado();

  const VideosDisponiveis = videos.filter((video) => !postados.includes(video));

  if (VideosDisponiveis.length == 0) {
    console.log("Todos os Videos já Foram Postados");
    return;
  }

  const videoAleatorio =
    VideosDisponiveis[Math.floor(Math.random() * VideosDisponiveis.length)];
  const videoPath = path.join(pastaVideos, videoAleatorio);

  await page.click("text=Selecionar vídeo"); // Chamar video

  await page.waitForTimeout(30000);
  await fileInput.setInputFiles(videoPath);
  console.log(` Enviado: ${videoAleatorio}`);

  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(2000);

  await page.waitForSelector(
    ".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr",
    {
      timeout: 30000,
    }
  );

  await page.click(
    ".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr"
  );
  await page.keyboard.type(`
#EducaçãoFinanceira

#FinançasPessoais

#ComoEconomizar

#RendaExtra

#Investimentos

#LiberdadeFinanceira

#DicasFinanceiras

#MentalidadeFinanceira

#IndependênciaFinanceira

#DinheiroConsciente`);

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
    const atualizados = [...postados, videoAleatorio];
    SalvarvideoPostado(atualizados);
    console.log("Vídeo postado com sucesso!");
  } else {
    console.log("Botão 'Publicar' não encontrado.");
  }

  await page.close();
};

UploadVideoTikTok();

