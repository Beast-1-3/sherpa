// src/components/LiveTranscriptCard.tsx
import { MoreHorizontal } from 'lucide-react';
import type { TranscriptMessage } from '../engine/sessionEngine';

interface Props {
  messages: TranscriptMessage[];
  isLive: boolean;
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function LiveTranscriptCard({ messages, isLive }: Props) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900">Live Transcript</h2>
        <MoreHorizontal size={18} className="text-gray-300" />
      </div>

      {messages.length === 0 ? (
        <p className="text-sm text-gray-400 leading-relaxed py-2">
          Your live transcript will appear once the conversation starts.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {messages.map((msg) => {
            const isSystem = msg.speaker === 'System';
            if (isSystem) return null; // Don't show system message in transcript
            const isSM = msg.speaker === 'SM';

            return (
              <div
                key={msg.eventId}
                className={`rounded-xl p-3 ${isSM ? 'bg-[#F0EFFE]' : 'bg-gray-50'} ${msg.causedFieldUpdate ? 'ring-1 ring-[#5B5BD6]/30' : ''}`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[11px] text-gray-400">{formatTime(msg.timeMs)}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isSM ? 'bg-[#5B5BD6]/15 text-[#5B5BD6]' : 'bg-amber-100 text-amber-700'}`}>
                    {isSM ? 'Sales Manager' : 'Borrower'}
                  </span>
                  {msg.causedFieldUpdate && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 ml-auto">
                      Fields Updated
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">{msg.text}</p>
              </div>
            );
          })}

          {isLive && (
            <div className="flex items-center gap-1.5 pt-1">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#5B5BD6]"
                    style={{
                      animation: `wave 1s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">Listening...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
