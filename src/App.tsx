import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { MEGACITY_ASSETS } from './data/assets';
import {
  extractTransparentSprite,
  exportImageAsPng,
  triggerDataDownload,
} from './utils/pixelKeying';
import { TitleScreenSimulator } from './components/TitleScreenSimulator';
import { Aviation3DStudio } from './components/Aviation3DStudio';
import { AssetGallery } from './components/AssetGallery';
import { PaletteAndGodotGuide } from './components/PaletteAndGodotGuide';

export default function App() {
  const [tolerance, setTolerance] = useState<number>(42);
  const [extracting, setExtracting] = useState<boolean>(true);
  const [exportingAll, setExportingAll] = useState<boolean>(false);

  const [transparentLogoUrl, setTransparentLogoUrl] = useState<string | null>(null);
  const [logoDimensions, setLogoDimensions] = useState<{ width: number; height: number } | null>(
    null,
  );

  const [transparentEmblemUrl, setTransparentEmblemUrl] = useState<string | null>(null);
  const [emblemDimensions, setEmblemDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setExtracting(true);

    const timer = setTimeout(async () => {
      try {
        const [logoRes, emblemRes] = await Promise.all([
          extractTransparentSprite(MEGACITY_ASSETS.logoPrimary.src, tolerance),
          extractTransparentSprite(MEGACITY_ASSETS.emblemIcon.src, tolerance),
        ]);
        if (cancelled) return;
        setTransparentLogoUrl(logoRes.dataUrl);
        setLogoDimensions({ width: logoRes.width, height: logoRes.height });
        setTransparentEmblemUrl(emblemRes.dataUrl);
        setEmblemDimensions({ width: emblemRes.width, height: emblemRes.height });
      } catch (err) {
        console.error('Falha ao extrair transparência dos sprites:', err);
      } finally {
        if (!cancelled) setExtracting(false);
      }
    }, 60);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [tolerance]);

  const handleDownloadKit = async () => {
    if (exportingAll) return;
    setExportingAll(true);
    try {
      if (transparentLogoUrl) {
        triggerDataDownload(transparentLogoUrl, MEGACITY_ASSETS.logoPrimary.filename);
      }
      if (transparentEmblemUrl) {
        await new Promise((r) => setTimeout(r, 220));
        triggerDataDownload(transparentEmblemUrl, MEGACITY_ASSETS.emblemIcon.filename);
      }
      const dayPng = await exportImageAsPng(MEGACITY_ASSETS.bgDay.src, 1920, 1080);
      await new Promise((r) => setTimeout(r, 220));
      triggerDataDownload(dayPng, MEGACITY_ASSETS.bgDay.filename);

      const sunsetPng = await exportImageAsPng(MEGACITY_ASSETS.bgSunset.src, 1920, 1080);
      await new Promise((r) => setTimeout(r, 220));
      triggerDataDownload(sunsetPng, MEGACITY_ASSETS.bgSunset.filename);
    } finally {
      setExportingAll(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FA] text-[#0B1E33]">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="#simulador"
            className="font-display text-lg font-extrabold tracking-tight text-[#0B1E33] whitespace-nowrap shrink-0"
          >
            MegaCity Art Kit
          </a>

          <nav
            aria-label="Navegação principal"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#simulador"
              className="hover:text-[#0B1E33] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Simulador
            </a>
            <a
              href="#modelos3d"
              className="hover:text-[#0B1E33] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Modelos 3D
            </a>
            <a
              href="#assets"
              className="hover:text-[#0B1E33] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Assets PNG
            </a>
            <a
              href="#paleta"
              className="hover:text-[#0B1E33] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Paleta
            </a>
            <a
              href="#godot"
              className="hover:text-[#0B1E33] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Godot 4
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              disabled={exportingAll || extracting}
              onClick={handleDownloadKit}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0B7A8F] hover:bg-[#096475] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              {exportingAll ? 'Exportando PNGs...' : 'Baixar Kit Completo'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <TitleScreenSimulator
          transparentLogoUrl={transparentLogoUrl}
          transparentEmblemUrl={transparentEmblemUrl}
          logoExtracting={extracting}
        />

        <Aviation3DStudio />

        <AssetGallery
          transparentLogoUrl={transparentLogoUrl}
          logoDimensions={logoDimensions}
          transparentEmblemUrl={transparentEmblemUrl}
          emblemDimensions={emblemDimensions}
          tolerance={tolerance}
          onToleranceChange={setTolerance}
          extracting={extracting}
        />

        <PaletteAndGodotGuide />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>MegaCity · Direção de Arte Pixel Art e Logotipo para Godot 4</p>
          <p>Fundos 16:9 · Logo e Emblema com recorte PNG transparente</p>
        </div>
      </footer>
    </div>
  );
}
