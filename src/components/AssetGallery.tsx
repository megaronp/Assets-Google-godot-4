import { useState, useEffect } from 'react';
import { Download, Maximize2, X, SlidersHorizontal } from 'lucide-react';
import { MEGACITY_ASSETS } from '../data/assets';
import { exportImageAsPng, triggerDataDownload } from '../utils/pixelKeying';

type BackdropStyle = 'checker' | 'sky' | 'navy';

interface AssetGalleryProps {
  transparentLogoUrl: string | null;
  logoDimensions: { width: number; height: number } | null;
  transparentEmblemUrl: string | null;
  emblemDimensions: { width: number; height: number } | null;
  tolerance: number;
  onToleranceChange: (val: number) => void;
  extracting: boolean;
}

export function AssetGallery({
  transparentLogoUrl,
  logoDimensions,
  transparentEmblemUrl,
  emblemDimensions,
  tolerance,
  onToleranceChange,
  extracting,
}: AssetGalleryProps) {
  const [logoBackdrop, setLogoBackdrop] = useState<BackdropStyle>('checker');
  const [emblemBackdrop, setEmblemBackdrop] = useState<BackdropStyle>('checker');
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightbox]);

  const handleDownloadBgPng = async (
    id: string,
    src: string,
    filename: string,
    fullHd = false,
  ) => {
    try {
      setDownloadingId(id);
      const dataUrl = fullHd
        ? await exportImageAsPng(src, 1920, 1080)
        : await exportImageAsPng(src);
      triggerDataDownload(dataUrl, filename);
    } finally {
      setDownloadingId(null);
    }
  };

  const backdropClass = (style: BackdropStyle) => {
    if (style === 'sky') return 'bg-gradient-to-b from-[#38BDF8] to-[#0EA5E9]';
    if (style === 'navy') return 'bg-[#0B1E33]';
    return 'checkerboard-bg';
  };

  return (
    <section id="assets" className="py-12 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1E33] [text-wrap:balance]">
              Assets Prontos para Download e Importação
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Baixe os dois fundos em PNG 1920×1080 e a logo + emblema já com o fundo sólido
              removido automaticamente por recorte de borda.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#F6F8FA] border border-slate-200 rounded-lg px-3.5 py-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
            <label htmlFor="chroma-tolerance" className="text-xs font-semibold text-slate-700 whitespace-nowrap">
              Recorte Alfa
            </label>
            <input
              id="chroma-tolerance"
              type="range"
              min={18}
              max={68}
              value={tolerance}
              onChange={(e) => onToleranceChange(Number(e.target.value))}
              className="w-24 accent-[#0B7A8F] cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-600 tabular-nums w-6 text-right">
              {tolerance}
            </span>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Day Background */}
          <article className="bg-[#F6F8FA] border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0B1E33]">
                    {MEGACITY_ASSETS.bgDay.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{MEGACITY_ASSETS.bgDay.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({
                      src: MEGACITY_ASSETS.bgDay.src,
                      title: MEGACITY_ASSETS.bgDay.title,
                    })
                  }
                  aria-label="Ampliar Fundo Dia Tropical"
                  className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-[#0B1E33] transition-colors shrink-0 cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-900 mb-4">
                <img
                  src={MEGACITY_ASSETS.bgDay.src}
                  alt={MEGACITY_ASSETS.bgDay.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover pixelated"
                />
              </div>

              <p className="text-sm text-slate-600 mb-4">{MEGACITY_ASSETS.bgDay.usage}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <span className="text-xs font-mono text-slate-500 truncate max-w-[220px]">
                {MEGACITY_ASSETS.bgDay.godotPath}
              </span>
              <button
                type="button"
                disabled={downloadingId === 'bg-day'}
                onClick={() =>
                  handleDownloadBgPng(
                    'bg-day',
                    MEGACITY_ASSETS.bgDay.src,
                    MEGACITY_ASSETS.bgDay.filename,
                    true,
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B7A8F] hover:bg-[#096475] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                {downloadingId === 'bg-day' ? 'Exportando...' : 'Baixar PNG 1920×1080'}
              </button>
            </div>
          </article>

          {/* Card 2: Sunset Election Background */}
          <article className="bg-[#F6F8FA] border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0B1E33]">
                    {MEGACITY_ASSETS.bgSunset.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {MEGACITY_ASSETS.bgSunset.subtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({
                      src: MEGACITY_ASSETS.bgSunset.src,
                      title: MEGACITY_ASSETS.bgSunset.title,
                    })
                  }
                  aria-label="Ampliar Fundo Noite de Eleição"
                  className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-[#0B1E33] transition-colors shrink-0 cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-900 mb-4">
                <img
                  src={MEGACITY_ASSETS.bgSunset.src}
                  alt={MEGACITY_ASSETS.bgSunset.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover pixelated"
                />
              </div>

              <p className="text-sm text-slate-600 mb-4">{MEGACITY_ASSETS.bgSunset.usage}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <span className="text-xs font-mono text-slate-500 truncate max-w-[220px]">
                {MEGACITY_ASSETS.bgSunset.godotPath}
              </span>
              <button
                type="button"
                disabled={downloadingId === 'bg-sunset'}
                onClick={() =>
                  handleDownloadBgPng(
                    'bg-sunset',
                    MEGACITY_ASSETS.bgSunset.src,
                    MEGACITY_ASSETS.bgSunset.filename,
                    true,
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B7A8F] hover:bg-[#096475] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                {downloadingId === 'bg-sunset' ? 'Exportando...' : 'Baixar PNG 1920×1080'}
              </button>
            </div>
          </article>

          {/* Card 3: Transparent MegaCity Logo */}
          <article className="bg-[#F6F8FA] border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0B1E33]">
                    {MEGACITY_ASSETS.logoPrimary.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {MEGACITY_ASSETS.logoPrimary.subtitle}
                    {logoDimensions ? ` · ${logoDimensions.width}×${logoDimensions.height}px` : ''}
                  </p>
                </div>

                <div
                  role="group"
                  aria-label="Fundo de teste da logo"
                  className="inline-flex p-0.5 bg-white border border-slate-200 rounded-md"
                >
                  {(['checker', 'sky', 'navy'] as BackdropStyle[]).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setLogoBackdrop(style)}
                      className={`px-2 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                        logoBackdrop === style
                          ? 'bg-[#0B1E33] text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {style === 'checker' ? 'Alfa' : style === 'sky' ? 'Céu' : 'Marinho'}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`aspect-video w-full rounded-lg border border-slate-200 p-6 flex items-center justify-center mb-4 ${backdropClass(
                  logoBackdrop,
                )}`}
              >
                {transparentLogoUrl ? (
                  <img
                    src={transparentLogoUrl}
                    alt="Logo MegaCity com fundo transparente"
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain pixelated drop-shadow-md"
                  />
                ) : (
                  <p className="text-xs text-slate-500">
                    {extracting ? 'Processando recorte transparente...' : 'Carregando logo...'}
                  </p>
                )}
              </div>

              <p className="text-sm text-slate-600 mb-4">{MEGACITY_ASSETS.logoPrimary.usage}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <span className="text-xs font-mono text-slate-500 truncate max-w-[220px]">
                {MEGACITY_ASSETS.logoPrimary.godotPath}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!transparentLogoUrl}
                  onClick={() =>
                    transparentLogoUrl &&
                    triggerDataDownload(transparentLogoUrl, MEGACITY_ASSETS.logoPrimary.filename)
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B7A8F] hover:bg-[#096475] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  Baixar PNG Transparente
                </button>
              </div>
            </div>
          </article>

          {/* Card 4: Presidential Emblem / Godot Icon */}
          <article className="bg-[#F6F8FA] border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0B1E33]">
                    {MEGACITY_ASSETS.emblemIcon.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {MEGACITY_ASSETS.emblemIcon.subtitle}
                    {emblemDimensions
                      ? ` · ${emblemDimensions.width}×${emblemDimensions.height}px`
                      : ''}
                  </p>
                </div>

                <div
                  role="group"
                  aria-label="Fundo de teste do emblema"
                  className="inline-flex p-0.5 bg-white border border-slate-200 rounded-md"
                >
                  {(['checker', 'sky', 'navy'] as BackdropStyle[]).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setEmblemBackdrop(style)}
                      className={`px-2 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                        emblemBackdrop === style
                          ? 'bg-[#0B1E33] text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {style === 'checker' ? 'Alfa' : style === 'sky' ? 'Céu' : 'Marinho'}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`aspect-video w-full rounded-lg border border-slate-200 p-5 flex items-center justify-center gap-6 sm:gap-8 mb-4 ${backdropClass(
                  emblemBackdrop,
                )}`}
              >
                {transparentEmblemUrl ? (
                  <>
                    <div className="flex flex-col items-center gap-1.5">
                      <img
                        src={transparentEmblemUrl}
                        alt="Emblema MegaCity em tamanho completo"
                        referrerPolicy="no-referrer"
                        className="w-28 h-28 sm:w-32 sm:h-32 object-contain pixelated"
                      />
                      <span className="text-[11px] font-mono text-slate-600 bg-white/85 px-1.5 py-0.5 rounded">
                        128px
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <img
                        src={transparentEmblemUrl}
                        alt="Emblema MegaCity em 64px"
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-contain pixelated"
                      />
                      <span className="text-[11px] font-mono text-slate-600 bg-white/85 px-1.5 py-0.5 rounded">
                        64px
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <img
                        src={transparentEmblemUrl}
                        alt="Emblema MegaCity em 32px"
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 object-contain pixelated"
                      />
                      <span className="text-[11px] font-mono text-slate-600 bg-white/85 px-1.5 py-0.5 rounded">
                        32px
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-slate-500">
                    {extracting ? 'Processando recorte transparente...' : 'Carregando emblema...'}
                  </p>
                )}
              </div>

              <p className="text-sm text-slate-600 mb-4">{MEGACITY_ASSETS.emblemIcon.usage}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <span className="text-xs font-mono text-slate-500 truncate max-w-[220px]">
                {MEGACITY_ASSETS.emblemIcon.godotPath}
              </span>
              <button
                type="button"
                disabled={!transparentEmblemUrl}
                onClick={() =>
                  transparentEmblemUrl &&
                  triggerDataDownload(transparentEmblemUrl, MEGACITY_ASSETS.emblemIcon.filename)
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B7A8F] hover:bg-[#096475] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                Baixar Ícone Transparente
              </button>
            </div>
          </article>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 bg-[#07131E]/90 backdrop-blur-sm p-4 sm:p-8 flex flex-col items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl bg-[#0B1E33] border border-white/15 rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 text-white">
              <p className="text-sm font-semibold">{lightbox.title}</p>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                aria-label="Fechar prévia ampliada"
                className="p-1.5 text-slate-300 hover:text-white rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <img
              src={lightbox.src}
              alt={lightbox.title}
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[82vh] object-contain pixelated"
            />
          </div>
        </div>
      )}
    </section>
  );
}
