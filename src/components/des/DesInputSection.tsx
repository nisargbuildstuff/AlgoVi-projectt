import React, { useState } from 'react';
import { validateHex16, hex_to_binary, format_bits_spaced } from '../../algorithms/cryptography/desUtils';
import { Shield, Key, FileText, Lock, Sparkles, AlertCircle, RefreshCw, Dice5, Clock, HardDrive, Type, Binary } from 'lucide-react';

export const NIST_PLAINTEXT = '0123456789ABCDEF';
export const NIST_KEY = '133457799BBCDFF1';
export const NIST_CIPHERTEXT = '85E813540F0AB405';

export const DES_PRESETS = [
  {
    name: 'NIST Vector',
    plaintext: NIST_PLAINTEXT,
    key: NIST_KEY,
    desc: 'Official NIST FIPS 46-3 verification standard vector'
  },
  {
    name: 'ASCII "Security"',
    plaintext: '5365637572697479', // 'Security'
    key: '50617373776F7264',       // 'Password'
    desc: 'Text: "Security" encrypted with key: "Password"'
  },
  {
    name: 'All Zeros',
    plaintext: '0000000000000000',
    key: '0000000000000000',
    desc: 'Zero-entropy corner test case'
  },
  {
    name: 'Alternating Bits',
    plaintext: 'AAAAAAAAAAAAAAAA',
    key: 'FFFFFFFFFFFFFFFF',
    desc: 'High bit-flip parity contrast test'
  }
];

// Helper to convert ASCII string up to 8 chars to 16-hex characters
function asciiToHex16(str: string): string {
  let hex = '';
  for (let i = 0; i < 8; i++) {
    if (i < str.length) {
      hex += str.charCodeAt(i).toString(16).padStart(2, '0');
    } else {
      hex += '20'; // Space padding
    }
  }
  return hex.toUpperCase();
}

// Generate random 16-char hex string
function generateRandomHex16(): string {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

interface DesInputSectionProps {
  plaintext: string;
  cipherKey: string;
  ciphertext: string;
  onEncrypt: (plaintext: string, cipherKey: string) => void;
  onLoadNistVector: () => void;
}

export const DesInputSection: React.FC<DesInputSectionProps> = ({
  plaintext,
  cipherKey,
  ciphertext,
  onEncrypt,
  onLoadNistVector
}) => {
  const [ptInput, setPtInput] = useState(plaintext);
  const [keyInput, setKeyInput] = useState(cipherKey);
  const [inputMode, setInputMode] = useState<'hex' | 'ascii'>('hex');
  const [asciiPt, setAsciiPt] = useState('Security');
  const [asciiKey, setAsciiKey] = useState('Password');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleApplyPreset = (pt: string, k: string) => {
    setPtInput(pt);
    setKeyInput(k);
    setValidationError(null);
    onEncrypt(pt, k);
  };

  const handleRandomPreset = () => {
    const randomPt = generateRandomHex16();
    const randomKey = generateRandomHex16();
    setPtInput(randomPt);
    setKeyInput(randomKey);
    setValidationError(null);
    onEncrypt(randomPt, randomKey);
  };

  const handleAsciiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hexPt = asciiToHex16(asciiPt);
    const hexKey = asciiToHex16(asciiKey);
    setPtInput(hexPt);
    setKeyInput(hexKey);
    setValidationError(null);
    onEncrypt(hexPt, hexKey);
  };

  const handleHexSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPt = ptInput.trim().toUpperCase();
    const cleanKey = keyInput.trim().toUpperCase();

    if (!validateHex16(cleanPt)) {
      setValidationError('Plaintext must contain exactly 16 hexadecimal characters (64 bits).');
      return;
    }
    if (!validateHex16(cleanKey)) {
      setValidationError('Cipher key must contain exactly 16 hexadecimal characters (64 bits, 56 effective).');
      return;
    }

    setValidationError(null);
    onEncrypt(cleanPt, cleanKey);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 Columns: Input & Presets Controls (BubbleSort style) */}
      <div className="lg:col-span-2 algovi-card bg-slate-900 border border-slate-800 p-4 space-y-4">
        {/* Presets Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Plaintext & Key Configuration
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 mr-1">Presets:</span>
            {DES_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset.plaintext, preset.key)}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                {preset.name}
              </button>
            ))}
            <button
              type="button"
              onClick={handleRandomPreset}
              className="px-2.5 py-1 text-xs rounded bg-purple-950/80 text-purple-300 border border-purple-800 hover:bg-purple-900 transition flex items-center gap-1 font-semibold"
            >
              <Dice5 className="w-3 h-3" />
              <span>Random</span>
            </button>
          </div>
        </div>

        {/* Input Format Switcher */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Input Mode:</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setInputMode('hex')}
              className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                inputMode === 'hex'
                  ? 'bg-purple-600 text-[var(--text-on-accent)] font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Binary className="w-3 h-3" />
              <span>Hexadecimal (16 Hex Digits)</span>
            </button>
            <button
              type="button"
              onClick={() => setInputMode('ascii')}
              className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                inputMode === 'ascii'
                  ? 'bg-purple-600 text-[var(--text-on-accent)] font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Type className="w-3 h-3" />
              <span>ASCII Text (8 Chars)</span>
            </button>
          </div>
        </div>

        {/* Forms based on inputMode */}
        {inputMode === 'hex' ? (
          <form onSubmit={handleHexSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Plaintext Field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-sky-400" />
                    <span>64-Bit Plaintext (16 Hex)</span>
                  </label>
                  <span className="font-mono text-[10px] text-slate-400">
                    {ptInput.length}/16
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={16}
                  value={ptInput}
                  onChange={(e) => setPtInput(e.target.value.toUpperCase())}
                  placeholder="e.g. 0123456789ABCDEF"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-sm text-sky-300 tracking-wider focus:outline-none focus:border-purple-500 uppercase transition"
                />
              </div>

              {/* Key Field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>64-Bit Key (56 Effective + 8 Parity)</span>
                  </label>
                  <span className="font-mono text-[10px] text-slate-400">
                    {keyInput.length}/16
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={16}
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value.toUpperCase())}
                  placeholder="e.g. 133457799BBCDFF1"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-sm text-amber-300 tracking-wider focus:outline-none focus:border-purple-500 uppercase transition"
                />
              </div>
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Actions & Result Output */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-400">Ciphertext:</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30 tracking-wider text-xs shadow">
                  {ciphertext || '—'}
                </span>
                {ciphertext === NIST_CIPHERTEXT && (
                  <span className="text-[10px] font-sans font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    NIST FIPS 46-3 ✓
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-[var(--text-on-accent)] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 active:scale-95 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Encrypt & Generate</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAsciiSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* ASCII Plaintext Field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-sky-400" />
                    <span>ASCII Plaintext (Up to 8 Characters)</span>
                  </label>
                  <span className="font-mono text-[10px] text-slate-400">
                    {asciiPt.length}/8
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={8}
                  value={asciiPt}
                  onChange={(e) => setAsciiPt(e.target.value)}
                  placeholder="e.g. Security"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 font-sans text-sm text-sky-300 focus:outline-none focus:border-purple-500 transition"
                />
                <span className="text-[10px] text-slate-500 font-mono block">
                  Hex: {asciiToHex16(asciiPt)}
                </span>
              </div>

              {/* ASCII Key Field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>ASCII Key (Up to 8 Characters)</span>
                  </label>
                  <span className="font-mono text-[10px] text-slate-400">
                    {asciiKey.length}/8
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={8}
                  value={asciiKey}
                  onChange={(e) => setAsciiKey(e.target.value)}
                  placeholder="e.g. Password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 font-sans text-sm text-amber-300 focus:outline-none focus:border-purple-500 transition"
                />
                <span className="text-[10px] text-slate-500 font-mono block">
                  Hex: {asciiToHex16(asciiKey)}
                </span>
              </div>
            </div>

            {/* Actions & Result Output */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-400">Ciphertext:</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30 tracking-wider text-xs shadow">
                  {ciphertext || '—'}
                </span>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-[var(--text-on-accent)] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 active:scale-95 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Convert & Encrypt</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Right Column: Complexity & Properties Card (matching Bubble Sort's right card) */}
      <div className="algovi-card bg-slate-900 border border-slate-800 p-4 space-y-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Complexity & Properties
        </span>
        <p className="text-[11px] text-slate-400">
          DES encrypts data in 64-bit blocks using a shared secret key.
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded bg-slate-950/70 border border-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Rounds</p>
              <p className="font-mono font-bold text-amber-300">16 Rounds</p>
            </div>
          </div>
          <div className="p-2 rounded bg-slate-950/70 border border-slate-800 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Block Size</p>
              <p className="font-mono font-bold text-emerald-300">64 Bits</p>
            </div>
          </div>
        </div>

        <div className="p-2 rounded bg-slate-950/70 border border-slate-800 flex items-center gap-2 text-xs">
          <Shield className="w-4 h-4 text-sky-400" />
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold">Effective Key</p>
            <p className="font-mono font-bold text-sky-300">56 Bits (8 Parity Discarded)</p>
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          Symmetric block cipher based on the <strong>Feistel Network</strong>. Invertible using identical steps.
        </p>
      </div>
    </div>
  );
};
