---
name: remotion-fitur
description: Aturan Remotion + three.js dan fitur peningkat kualitas (transisi, light leak, color correction, motion blur, audio-reaktif) di proyek `remotion-3d/` repo RAKA. Pakai saat membuat sisipan 3D/efek dengan Remotion atau saat user minta video lebih halus/"mahal".
---

# Remotion: aturan & fitur siap pakai

> **Catatan RAKA:** video stickman utama dirender engine GrowKaz di `studio/` (bukan Remotion); skill ini hanya berlaku untuk proyek `remotion-3d/` (sisipan 3D, efek, eksperimen). Gaya tetap STYLE RAKA (`brand/dna-video.md`), jangan meniru gaya editorial Channel-Penjelasan.

Paket sudah terpasang di `remotion-3d/package.json` (versi harus sama dengan `remotion`, saat ini 4.0.541):
`@remotion/three`, `@remotion/transitions`, `@remotion/motion-blur`, `@remotion/effects`, `@remotion/media-utils`, `@remotion/captions`.
Bila plugin resmi **Remotion** aktif di sesi, skill `remotion-markup` (3d, transitions, light-leaks, color-correction, motion-blur, audio-visualization) adalah rujukan detail. Sumber: github.com/remotion-dev/skills, remotion.dev/docs.

## Aturan wajib 3D (kalau dilanggar → flicker saat render)
- Semua 3D di dalam `<ThreeCanvas width height>` dari `@remotion/three`, dengan lampu.
- Semua gerak dihitung dari `useCurrentFrame()`. **Dilarang `useFrame()`** r3f, animasi bawaan model/shader yang jalan sendiri, `Math.random()` tanpa seed, `Date.now()`.
- `<Sequence>` di dalam `<ThreeCanvas>` wajib `layout="none"`.

## Fitur peningkat (belum dipakai, coba bertahap)
Selalu uji dengan still/contact sheet dulu; render penuh di container ini lambat (swangle, tanpa GPU).

1. **Light leak di titik potong beat** — `lightLeak({seed, hueShift, progress})` dari `@remotion/effects/light-leak` pada `<Solid>`. Pasang sebagai overlay pendek (±15–20 frame) di atas pergantian adegan; `progress` 0→1 dari `useCurrentFrame()`. Cocok untuk payoff/twist. Jangan menutupi pita CC (y ≈ 1300–1390) dan zona aman TikTok.
2. **Transisi** — `@remotion/transitions` (`fade`, `slide`, `wipe`, `clockWipe`). PENTING: `<TransitionSeries.Transition>` **memendekkan timeline** (dua adegan tumpang tindih), padahal animasi dikunci ke detik VO. Pakai `<TransitionSeries.Overlay>` (tidak memendekkan) atau crossfade manual dengan `interpolate` di dalam `<Sequence>`.
3. **Color correction / grading** — `colorCorrection({exposure, temperature, contrast, saturation, vibrance, ...})` dari `@remotion/effects/color-correction` lewat prop `effects` pada komponen yang mendukung (`<Solid>`, `<Video>` @remotion/media, dll.). Satu "look" konsisten sesuai palet `brand/brand-kit.md`.
4. **Efek lain di `@remotion/effects`** — `vignette`, `glow`, `film-burn`, `paper`, `halftone`, `chromatic-aberration`, `zoom-blur`, `shine`, dll. Pakai hemat; gaya tetap STYLE RAKA.
5. **Motion blur** — `<CameraMotionBlur samples shutterAngle>` merender anak **N kali per frame** → waktu render ×N. Hanya untuk potongan pendek bergerak cepat (mis. kamera menukik, objek jatuh), samples 4–6. `<HtmlInCanvasMotionBlur>` butuh dukungan HTML-in-canvas Chromium; uji still dulu dengan Chromium `/opt/pw-browsers/chromium`, kalau gagal pakai `CameraMotionBlur`.
6. **Gerak mengikuti suara VO** — `useWindowedAudioData()` + `visualizeAudio()` dari `@remotion/media-utils` (pakai `.wav`). Contoh: objek/label "berdenyut" mengikuti volume narator.

## Setelah memakai fitur baru
- Catat bug yang muncul di `brand/cek-bug.md`.
- Bila user suka, jadikan baku di template video berikutnya dan catat di `brand/eksperimen.md` / `STATUS.md`.
