// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.brayam.quiz',
  appName: 'QuienQuiereSerIngenieroDeRedes',
  webDir: 'dist'
  // 👆 sin "server", así Android sirve /dist localmente (http://localhost)
};

export default config;
