import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { DeliveryPackage } from '../types';
import { useApp } from '../store/appStore';
import { X, Printer, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { AshokaChakraSvg } from './ChakraLogo';

interface QrStickerModalProps {
  delivery: DeliveryPackage | null;
  onClose: () => void;
  onScanAdvance: (deliveryId: string) => void;
}

export const QrStickerModal: React.FC<QrStickerModalProps> = ({
  delivery,
  onClose,
  onScanAdvance
}) => {
  const { language, t } = useApp();

  if (!delivery) return null;

  const qrPayload = JSON.stringify({
    tokenId: delivery.nftTokenId,
    dish: delivery.dishName,
    qty: delivery.quantityPlates,
    donor: delivery.donorName,
    recipient: delivery.recipientName,
    minted: new Date(delivery.mintTimestamp).toISOString(),
    protocol: 'SIH26234-PROOF-OF-REDISTRIBUTION'
  });

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border-2 border-amber-300 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-2 rounded-full hover:bg-slate-100 text-slate-400"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#FF9933] flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#000080]">
              {language === 'hi' ? 'NFT डिजिटल पैकेज स्टीकर' : 'NFT Package Seal'}
            </h3>
            <p className="text-[11px] text-slate-500">
              Token ID: <span className="font-mono font-bold text-slate-800">{delivery.nftTokenId}</span>
            </p>
          </div>
        </div>

        {/* Printable Physical Sticker Canvas */}
        <div className="bg-amber-50/70 border-2 border-dashed border-amber-400 rounded-2xl p-4 my-2 text-center relative overflow-hidden">
          {/* Subtle watermark chakra */}
          <div className="absolute -right-6 -bottom-6 text-amber-200/40 pointer-events-none">
            <AshokaChakraSvg size={110} />
          </div>

          <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#000080] mb-2 flex items-center justify-center gap-1">
            <span>Govt. of India · Smart India Hackathon 2026</span>
          </div>

          <div className="bg-white p-3 rounded-xl shadow-xs inline-block border border-amber-200 mx-auto">
            <QRCodeSVG
              value={qrPayload}
              size={135}
              level="H"
              fgColor="#000080"
              bgColor="#FFFFFF"
            />
          </div>

          <div className="mt-2.5 font-bold text-slate-900 text-sm">
            {language === 'hi' ? delivery.dishNameHi : delivery.dishName}
          </div>
          <div className="text-xs text-slate-600 font-medium">
            {delivery.quantityPlates} {t.plates} · {delivery.donorName}
          </div>

          <div className="mt-2 pt-2 border-t border-amber-200/80 flex items-center justify-between text-[11px] text-slate-600 px-1">
            <span>To: <strong className="text-slate-800">{delivery.recipientName.split(' ')[0]}</strong></span>
            <span className="font-mono text-emerald-700 font-bold">VERIFIED #NFT</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={() => {
              onScanAdvance(delivery.id);
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-[#138808] hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.scanSticker}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="w-full py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>{language === 'hi' ? 'स्टीकर प्रिंट करें (PDF)' : 'Print Physical Sticker'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
