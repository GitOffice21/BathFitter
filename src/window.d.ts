// src/window.d.ts
interface VoiceflowChat {
    chat?: {
      load: (config: { verify: { projectID: string }; url: string; versionID: string }) => void;
      open: () => void;
      interact: (interaction: { type: string; payload: Record<string, unknown> }) => void;
    };
  }
  
  interface Window {
    voiceflow?: VoiceflowChat;
  }
  