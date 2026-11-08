import {Config} from '@remotion/cli/config';
Config.setVideoImageFormat('jpeg');
// Container cloud ini tanpa GPU -> pakai WebGL software (SwiftShader via ANGLE).
// Di laptop dengan GPU, ganti ke 'angle' supaya render jauh lebih cepat.
Config.setChromiumOpenGlRenderer('swangle');
Config.setBrowserExecutable('/opt/pw-browsers/chromium');
