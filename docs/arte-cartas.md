# Arte de las cartas

Se genera en el ComfyUI local con el estilo tarot anime de las cartas aprobadas.

## Dirección de arte

1. Solo fantasía vintage / dark fantasy; nada de la baraja española.
2. Cuerpos y rostros siempre adultos: `(mature female:1.3)` para mujeres, adultos o ancianos para hombres. Nunca `boy`, `girl`, `young` ni `child`.
3. Aspecto de tarot clásico: figura de cuerpo entero, centrada y simétrica, columnas o trono, marco ornamental y símbolos.
4. Se permiten ropa y cuerpos reveladores; la desnudez explícita queda fuera.
5. Una figura por carta (`solo`) y sin texto.

## Configuración

- Checkpoint `anything-v4.5-pruned.safetensors` + VAE `anything-v4.0.vae.safetensors`.
- LoRA `Tarotv0.2` a 0.9.
- Prompt: `tarot card, ornate card border, symbolic, full body, ` + personaje + `, adult, tall, mature face, elegant proportions`.
- Negativo: `(embedding:bad_prompt_version2-neg:0.8), (embedding:easynegative:0.8), (worst quality:1.4), (low quality:1.4), (child, loli, shota, chibi, teenager, petite, childlike face, baby face:1.4), text, letters, words, watermark, nsfw, nude, shirtless, topless, multiple girls, multiple boys, (extra arms, extra legs, extra limbs, fused limbs:1.3)`.
- 512×768, Euler normal, 40 pasos, CFG 7. Hires: RealESRGAN_x4plus → 1024×1536 → KSampler denoise 0.4, 40 pasos.
- Script: `Documents\MesaVelas\comfy\gen_wf4.py <cartas.json> <tag>`.

## Facciones

| Facción | Tema                     | Motivos                                                      |
| ------- | ------------------------ | ------------------------------------------------------------ |
| Carnero | señores de la guerra     | cuernos de carnero, armadura oscura, pieles, tronos de hueso |
| Cayado  | brujas del bosque muerto | astas, báculos retorcidos, lobos, árboles muertos            |
| Velo    | clan de la sangre        | vampiros, velos rojos, cálices, velas, gótico                |
| Lirio   | culto del sol negro      | sol negro, halos dorados, lirios blancos, templos            |

Legendaria = soberano en trono; Perico/Perica = héroes destacados (la Perica sobre una bestia).

## Integración

Las cartas aprobadas están en `Documents\MesaVelas\cartas_aprobadas\` (con `aprobadas.json`). Para el juego se exportan como `art/c_<id>.jpg` a 512×768; el `id` es el de `DECK` en `index.html`.
