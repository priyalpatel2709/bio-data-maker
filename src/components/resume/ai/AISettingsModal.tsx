import React, { useState, useEffect } from 'react';
import {
  getAISettings,
  saveAISettings,
  testAIConnection,
  AI_PROVIDERS,
  AIProvider,
  AISettings,
} from '../../../services/aiService';
import {
  X,
  Sparkles,
  Key,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Globe,
  Cpu,
  Layers,
} from 'lucide-react';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigured?: () => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigured,
}) => {
  const [settings, setSettings] = useState<AISettings>(getAISettings());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    modelUsed?: string;
  } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getAISettings());
      setTestResult(null);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentProviderMeta = AI_PROVIDERS[settings.provider] || AI_PROVIDERS.nara;

  const handleSelectProvider = (provId: AIProvider) => {
    const meta = AI_PROVIDERS[provId];
    setSettings((prev) => ({
      ...prev,
      provider: provId,
      baseUrl: meta.defaultBaseUrl,
      model: meta.models[0].id,
      // Retain key if already entered, or clear if user switches
    }));
    setTestResult(null);
  };

  const handleTest = async () => {
    if (!settings.apiKey.trim()) {
      setTestResult({
        success: false,
        message: `Please enter your ${currentProviderMeta.name} API key first.`,
      });
      return;
    }

    setTesting(true);
    setTestResult(null);
    try {
      const res = await testAIConnection(
        settings.provider,
        settings.apiKey,
        settings.baseUrl,
        settings.model
      );
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    saveAISettings(settings);
    setSavedSuccess(true);
    onConfigured?.();
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">AI Assistant Router Settings</h3>
              <p className="text-xs text-teal-200">
                Choose between Nara Router, OpenRouter, or AgentRouter
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700 overflow-y-auto max-h-[75vh]">
          {/* Provider Selection Tabs */}
          <div>
            <label className="font-bold text-slate-900 block mb-2 text-xs flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-700" />
              Select AI Gateway / Router Provider:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(AI_PROVIDERS) as AIProvider[]).map((pId) => {
                const p = AI_PROVIDERS[pId];
                const isSelected = settings.provider === pId;
                return (
                  <button
                    key={pId}
                    type="button"
                    onClick={() => handleSelectProvider(pId)}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-600/20 text-teal-950 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <Cpu className={`w-4 h-4 ${isSelected ? 'text-teal-700' : 'text-slate-400'}`} />
                    <span className="text-xs">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Provider Tagline Banner */}
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 flex items-start gap-2.5">
            <Globe className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">{currentProviderMeta.name}</span>: {currentProviderMeta.tagline}. Key is stored securely in your browser's local storage and routed via local dev proxy to bypass CORS.
            </div>
          </div>

          {/* API Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Key className="w-3.5 h-3.5 text-teal-700" />
                {currentProviderMeta.name} API Key:
              </label>
              <a
                href={currentProviderMeta.getKeyUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 underline"
              >
                Get API Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              placeholder={currentProviderMeta.keyPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600 focus:outline-hidden font-mono"
            />
          </div>

          {/* Model Selection */}
          <div>
            <label className="font-bold text-slate-900 block mb-1.5 text-xs">
              AI Model:
            </label>
            <select
              value={settings.model}
              onChange={(e) => setSettings({ ...settings, model: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600 focus:outline-hidden bg-white"
            >
              {currentProviderMeta.models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Base URL (Advanced) */}
          <div>
            <label className="font-medium text-slate-600 block mb-1 text-[11px]">
              Base URL (Default: {currentProviderMeta.defaultBaseUrl}):
            </label>
            <input
              type="text"
              value={settings.baseUrl}
              onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
              placeholder={currentProviderMeta.defaultBaseUrl}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono text-slate-600 focus:ring-1 focus:ring-teal-600 focus:outline-hidden bg-slate-50"
            />
          </div>

          {/* Test Connection Button & Result */}
          <div className="pt-2">
            <button
              type="button"
              disabled={testing || !settings.apiKey.trim()}
              onClick={handleTest}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
                  Testing {currentProviderMeta.name} Connection...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-700" />
                  Test {currentProviderMeta.name} Connection
                </>
              )}
            </button>

            {testResult && (
              <div
                className={`mt-3 p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="leading-relaxed">
                  <div className="font-bold">
                    {testResult.success ? 'Connected!' : 'Error'}
                  </div>
                  <div>{testResult.message}</div>
                  {testResult.modelUsed && (
                    <div className="mt-1 text-[11px] font-mono opacity-80">
                      Model Verified: {testResult.modelUsed}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-semibold transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!settings.apiKey.trim()}
            className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {savedSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                Saved!
              </>
            ) : (
              `Save & Use ${currentProviderMeta.name}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
