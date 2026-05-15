export const editorEvents = {
  applyCorrection: (text: string) => {
    window.dispatchEvent(new CustomEvent('apply-correction', { detail: text }));
  },
  listenForCorrection: (callback: (text: string) => void) => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent;
      callback(customEvent.detail);
    };
    window.addEventListener('apply-correction', handler);
    return () => window.removeEventListener('apply-correction', handler);
  }
};