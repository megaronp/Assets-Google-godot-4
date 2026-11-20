import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { MEGACITY_PALETTE, GODOT4_GDSCRIPT_SNIPPET } from '../data/assets';

export function PaletteAndGodotGuide() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1600);
    } catch {
      setCopiedHex(hex);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(GODOT4_GDSCRIPT_SNIPPET);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1800);
    } catch {
      setCopiedCode(true);
    }
  };

  return (
    <>
      {/* Palette Section */}
      <section id="paleta" className="py-12 border-t border-slate-200 bg-[#F6F8FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1E33] [text-wrap:balance]">
              Paleta Oficial de MegaCity
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Cores coordenadas entre o cenário da ilha, a logo presidencial e os futuros painéis de
              economia, construção e eleição no Godot 4. Clique para copiar o código hexadecimal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MEGACITY_PALETTE.map((swatch) => {
              const isCopied = copiedHex === swatch.hex;
              return (
                <button
                  key={swatch.hex}
                  type="button"
                  onClick={() => handleCopyHex(swatch.hex)}
                  className="text-left bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 flex items-center gap-4 transition-colors cursor-pointer"
                >
                  <div
                    className="w-14 h-14 rounded-lg border border-black/10 shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: swatch.hex }}
                  >
                    {isCopied ? (
                      <Check
                        className={`w-5 h-5 ${swatch.textLight ? 'text-white' : 'text-[#0B1E33]'}`}
                        aria-hidden="true"
                      />
                    ) : (
                      <Copy
                        className={`w-4 h-4 opacity-70 ${
                          swatch.textLight ? 'text-white' : 'text-[#0B1E33]'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#0B1E33] truncate">
                        {swatch.name}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        {isCopied ? 'Copiado' : swatch.hex}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{swatch.role}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Godot 4 Integration Guide */}
      <section id="godot" className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1E33] [text-wrap:balance]">
              Configuração Recomendada no Godot 4
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Ajustes essenciais para preservar a nitidez dos pixels em telas Full HD e alternar o
              fundo entre dias tranquilos e véspera de eleição.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left column: 3 crisp checklists */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-[#F6F8FA] border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-[#0B1E33] mb-1.5">
                  01. Filtro de Textura sem Borrão
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Em <span className="font-mono text-xs text-[#0B1E33]">Project Settings &gt; Rendering &gt; Textures</span>,
                  defina <span className="font-mono text-xs text-[#0B1E33]">Default Texture Filter = Nearest</span>.
                  Isso impede que a logo e os telhados pixel art fiquem embaçados ao escalar.
                </p>
              </div>

              <div className="bg-[#F6F8FA] border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-[#0B1E33] mb-1.5">
                  02. Resolução e Escala Responsiva
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Configure <span className="font-mono text-xs text-[#0B1E33]">Display &gt; Window &gt; Stretch</span> para
                  <span className="font-mono text-xs text-[#0B1E33]"> Mode: canvas_items</span> e
                  <span className="font-mono text-xs text-[#0B1E33]"> Aspect: expand</span>. Use{' '}
                  <span className="font-mono text-xs text-[#0B1E33]">Stretch Mode: Keep Aspect Covered</span>{' '}
                  no nó <span className="font-mono text-xs text-[#0B1E33]">TextureRect</span> do fundo.
                </p>
              </div>

              <div className="bg-[#F6F8FA] border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-[#0B1E33] mb-1.5">
                  03. Ícone e Selo do Projeto
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Substitua o <span className="font-mono text-xs text-[#0B1E33]">res://icon.png</span> padrão pelo
                  Emblema Presidencial transparente em <span className="font-mono text-xs text-[#0B1E33]">Application &gt; Config &gt; Icon</span>.
                </p>
              </div>
            </div>

            {/* Right column: GDScript snippet */}
            <div className="lg:col-span-7 bg-[#0B1E33] text-slate-100 rounded-xl border border-slate-800 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <span className="text-xs font-mono text-slate-300">
                  MainMenu.gd · Transição Dia / Noite de Eleição
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors cursor-pointer whitespace-nowrap"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#F8B824]" aria-hidden="true" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      Copiar GDScript
                    </>
                  )}
                </button>
              </div>
              <pre className="p-5 text-xs sm:text-[13px] leading-relaxed font-mono overflow-x-auto text-slate-100 flex-1">
                <code>{GODOT4_GDSCRIPT_SNIPPET}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
