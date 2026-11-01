# Sistema visual del HUD

El HUD sigue el diseño de las cartas, no el de sus ilustraciones: papel, tinta, sellos y patrones japoneses.

## Base

| Token                    | Valor     | Uso                                |
| ------------------------ | --------- | ---------------------------------- |
| `--washi`                | `#F2E8D5` | fondo de tarjetas, tiras y avisos  |
| `--washi2`               | `#F7F0E1` | etiquetas y botones secundarios    |
| `--ink`                  | `#1E1A16` | texto, filetes, botón principal    |
| `--red`                  | `#8E2A2A` | peligro, perder, tiempo agotándose |
| `--green`                | `#4E6B2E` | ganar, «tu turno»                  |
| oro del sello legendario | `#B08A3E` | victoria                           |

- Letra: Shippori Mincho 800, mayúsculas con espaciado 0,2–0,3em.
- Marco: rectángulo papel con un filete de tinta de 1,5 px a 6–10 px del borde (como las cartas, que lo tienen a 14 px).
- Sello (`.hanko`): cuadrado redondeado, girado −4°, con filete interior color papel. Lleva números (vida, valor de la apuesta, segundos).
- Etiqueta (`.wtag` / `.ptag`): caja papel con doble filete, como la tira vertical del nombre en las cartas.

## Patrones (generados en JS como variables CSS)

- `--sg-dark`: olas seigaiha sobre `#141210`.
- `--sg-ink` y `--sg-green`: olas sobre papel, como el pie de las cartas.
- `--asa-red`: asanoha sobre `#7A2618`. Se usa para el rival y el Desafío.

## Reversos

- **Cartas de juego** («Tapete dorado»): negro `#120E0A`, banda de puntos dorados `#C9A35A`, panel interior con brillo radial, esquinas, varillas con rombos y un medallón de 12 ramas con estrella dorada `#D9B66B`.
- **Cartas de efecto** («Llama ritual»): la misma banda y panel sobre `#0E0B08`, rombo dorado y gran llama dorada con brillo de brasa. Los efectos boca abajo del rival (`.effect-back`) repiten la llama.
- Se pintan en canvas (`textures/card-backs.ts`) desde los trazados SVG del diseño de 400×600: los marcos van a todo el ancho y los motivos centrales con escala uniforme.

## Piezas

- **Pantalla de título** («Abanico de cartas»): sello de vela, «MESA DE LAS VELAS» y botón de pantalla completa. «ELIGE UNA CARTA» sobre un abanico de 4 cartas (JUGAR, REGLAS, MAZO, AJUSTES) que entra repartido; al pasar o enfocar una carta, su descripción aparece debajo. Solo JUGAR funciona: va alzada, con filete dorado y aura; las demás dicen «PRÓXIMAMENTE». El abanico se escala para caber en pantalla.
- **Música**: botón de icono «Música» (`aria-pressed`, nota / nota tachada) con el mismo estilo que el de pantalla completa. En el título va a su izquierda, en la cabecera; durante la partida, en la esquina superior izquierda (`TableControls`), porque arriba a la derecha está la pista. Activada por defecto; la elección se guarda en `localStorage`.
- **Efectos de sonido**: botón de icono «Efectos de sonido» (`aria-pressed`, altavoz / altavoz tachado), igual al de música y justo a su derecha, en la cabecera del título y en `TableControls`. Es independiente de la música: activado por defecto y con su propia clave en `localStorage`.
- **Carga** («Mazo barajado»): una carta grande inclinada que baraja 16 personajes (nombre y ataque del roster) sobre su propio arte difuminado, contador gigante 000–100 y barra fina con brasa. El porcentaje sale de los pasos reales de carga y solo llega a 100 con la mesa lista; luego se desvanece.

- **Cantar**: sello grande (66 px; 56 px en móvil). Punto rojo = Procesión lista. Al abrirse muestra tiras para Procesión, Llama y Desafío o Contra, y el sello cambia a una X roja. Encima lleva etiquetas «LLAMA · n» y «RONDA · VALE n».
- **Me voy**: círculo pequeño aparte, para no tocarlo sin querer. Su nombre accesible y la confirmación dicen lo que cuesta irse: 1 de vida, o lo que vale la ronda si hay un Desafío aceptado.
- **Tiras** (`Banner`): tira de papel con patrón en los extremos y sello estampado opcional. `win` = verde, `lose` = rojo. En pantalla alta van en la franja de arriba, nunca sobre la mano del rival. No se tocan (`pointer-events: none`). Las de resultado (fin de ronda, retirarse, «Me voy») duran 1,4 s y llevan el daño en un sello «−n».
- **Tiras de turno** (`TurnStrip`): «TU TURNO» entra por la izquierda (olas verdes) y «TURNO DEL RIVAL» por la derecha (asanoha roja). En pantalla alta, también en la franja de arriba; en escritorio, en la columna de la voz, y se desliza 60 px. Una pregunta (C) manda: al abrirse quita la tira, y mientras se ve no entra ninguna.
- **Señal de turno**: etiqueta «TU TURNO», varilla de incienso que se quema y sello con los segundos. En los últimos 5 s todo se pone rojo y el borde de la pantalla se enciende. «SU TURNO» aparece junto a la vida del rival. Solo una pregunta para el reloj (los avisos no): la barra baja al 60 %, la etiqueta dice «EN PAUSA» y en móvil aparece un icono de pausa junto a los segundos. En pantalla estrecha la barra se corre a la izquierda lo justo para no pisar «RONDA · VALE n».
- **Revelar efecto** (`RevealCard`): la carta sube con un rebote (animación original; no cambiarla), 1,7 s y 0,3 s de salida. Los efectos propios entran desde abajo con su descripción; los del rival, desde arriba, con «RIVAL» y su frase de `RIVAL_EFFECT_COPY`. Si un Sello lo anula, la misma carta recibe un sello rojo «ANULADO» y la frase pasa a «Tu Sello lo anula.» o «El Sello del rival lo anula.». Es la única pieza que va al centro de la pantalla.
- **Etiquetas «LLAMA · n» y «RONDA · VALE n»**: laten una vez cuando aparecen o cambian de valor.
- **Fin de partida**: tarjeta con sello dorado y estrella (victoria) o sello rojo (derrota).

## Dónde aparecen los avisos

Pantalla alta = la misma regla que la mesa 3D (`aspect-ratio < 0.8`, variante `tall:` de Tailwind).

| Pieza                       | Pantalla alta (móvil)                                 | Pantalla ancha (escritorio)        |
| --------------------------- | ----------------------------------------------------- | ---------------------------------- |
| Pregunta y hoja de la Llama | `top: 72px; left/right: 14px`, bajo la vida del rival | columna de la voz, 424 px de ancho |
| Tira                        | centrada a 126 px                                     | centrada al 40 % de alto, 620 px   |
| Tira de turno               | centrada a 114 px                                     | columna de la voz, 424 px × 98 px  |
| Marca                       | centrada a 128 px                                     | columna de la voz, hasta 424 px    |

En 390×844 todo termina antes de y = 245 (la hoja de la Llama, la más alta, hacia 205): la mano del rival empieza hacia y = 255. La carta que revela un efecto es la excepción y va al centro. Una tira que llega con la hoja de la Llama a la vista se pone encima (`z-7`) y la hoja reaparece al irse; en escritorio la marca también va encima de la hoja (`z-7`).

**Columna de la voz** (escritorio): todo lo que habla con el jugador sale a la derecha y justo encima de su mano, cerca de la pregunta que acaba de contestar. Ancla común (`VOICE_ANCHOR` en `organisms/hud-slots.ts`): `right: max(20px, env(safe-area-inset-right))` y `bottom: calc(50% + 40px)`. La mano empieza hacia el 53 % del alto (y ≈ 425 en 1280×800), pero la carta bajo el ratón sube ≈ 5 % del alto (hasta y ≈ 384) y en 4:3 la columna pasa por encima de la segunda y la tercera carta: con 40 px una carta alzada, o el sello de una carta con sello, queda libre en 1024×768 y 1280×800. Cada pieza crece hacia arriba desde el ancla y nunca tapa las manos ni las cartas jugadas. Si una pregunta no cabe encima (ventanas bajas o un móvil apaisado), baja lo justo para quedar a 12 px del borde de arriba.

## Llamadas del rival y preguntas (C · «voz del rival»)

`PromptCard`: tarjeta washi **sin fondo ni modal**, con banda de rayas de 7 px, `role="dialog"` no modal, nombre del sello y descripción del mensaje.

- **Desafío**: borde rojo y brillo rojo, sello «DESAFÍO», «TE RETIRAS EN N S» y tres botones de dos líneas (52 px).
- **Contra-desafío**: doble filete rojo y dorado, brillo de brasa, el valor viejo tachado.
- **Llama / Avivar / Apuesta**: sello, mensaje entre «», reloj y botones en una línea (44 px). SUBIR ▸ cambia la fila por el escalón (− n +, A MUERTE con el máximo debajo en dos líneas, SUBIR A n), el mensaje dice «Subes a N de daño.» y aparece VOLVER. Con 4 respuestas (AVIVAR disponible) los botones pasan a dos líneas; la Procesión («PROCESIÓN · LA ANULA») va en el hueco de la derecha del mensaje.
- **Neutras** (`foldConfirm`, `discardEffect`, encender tu Llama): mismo sitio, borde y banda de tinta, sin flecha ni sello de vela. Encender tu Llama lleva CANCELAR en el hueco de la derecha y APOSTAR ▸ abre el escalón.
- En móvil una flecha roja apunta a la vida del rival; en escritorio, un sello de vela de 32 px sobre la banda.
- Escritorio: atajos 1–9 en la esquina de cada botón (los números no llegan a la mano), y el foco va al primer botón (al campo del escalón al subir).

## Avisos sin espera (J)

Solo bloquean las preguntas (C) y el fin de partida. Todo lo demás es un aviso que no se toca y no hace esperar al juego.

- `notify` se resuelve cuando el aviso **aparece**, no cuando se va. La vida y las monedas (`commit`) se mueven en ese momento, junto con su tira o marca.
- Cola de avisos (`ui/hud/notice-queue.ts`): tiras, marcas, tiras de turno, la carta que revela un efecto y la hoja de la Llama pasan de uno en uno para no pisarse. Cada uno se ve al menos 1,2 s (`NOTICE_MIN_MS`) antes de que lo reemplace el siguiente; si hay otro esperando, el actual se acorta a esos 1,2 s. Las tiras de turno ceden el sitio en el acto.
- Cuando llega una pregunta (C), la cola se vacía (lo que esperaba se descarta) y se quitan la tira, la marca y la hoja: las preguntas nunca esperan.
- Ninguno se toca (`pointer-events: none`), así un toque siempre llega a la mano, a la mesa o a la bandeja. La única excepción es la hoja de la Llama.
- La región `aria-live` lee el aviso y, si en el mismo instante cambia la vida, la añade detrás («GANAS LA RONDA. EL RIVAL PIERDE 2. Vida del rival: 18.»).
- Tras cada duelo hay un compás fijo de 0,9 s (`DUEL_BEAT_MS`, que el reduced motion recorta a 250 ms como las demás esperas) y luego el turno siguiente. Tras un efecto del rival, 1,4 s (`RIVAL_EFFECT_PAUSE_MS`) para que su carta no caiga bajo la que revela el efecto.

**Hoja de la Llama** (`Headline`, solo `pactRevealed`): hoja washi con sello «−n», «LLAMA GANADA / PERDIDA», los dos valores y quién pierde cuánto. Aparece con el golpe de vida, sigue a la vista mientras se recoge la mesa y se reparte, y se cierra cuando llega la tira «RONDA n», una pregunta o el fin de partida. Un toque la cierra antes (nombre accesible «… Toca para cerrar.»), pero nunca hace falta. Sin barra de lectura ni «TOCA PARA SEGUIR».

## El duelo en la mesa 3D

`markDuel({ duel, result, attacks })` llega al resolverse cada duelo, también en los empates. El aspecto de las cartas y los efectos duran hasta `clearTable`, sin hacer esperar al juego; al limpiar la mesa los efectos se desvanecen en 1,4 s (`FX_FADE_OUT`). La carta no se eleva, no se escala, no lleva marco y la ganadora no se ilumina: no encaja con el juego.

- **Ganadora** («La mesa la abraza»): conserva su luz natural. Las enredaderas doradas del tapete brotan por debajo de la carta y se enroscan a los dos lados con hojas pequeñas: crecen en ≈ 1,2 s, las hojas se abren justo después y un brillo `#fff4d2` recorre los hilos a los 1,8 s y luego cada 5 s. Hilo `#dcb76a` sobre núcleo `#7a5a27` con sombra suave; hojas con degradado `#f2d995` → `#cfa75a` → `#9c7432`. Cada duelo espeja el dibujo para que no se repita y, en los extremos, el lado largo apunta hacia afuera.
- **Perdedora**: apagada, brillo 0,34 y 80 % gris. Cinco hilos de humo (gris cálido junto a la carta, más frío y pálido arriba) se rizan, se ensanchan y siguen saliendo mientras la carta esté en la mesa: la columna crece en 0,6 s y, al limpiar, se despega y se desvanece.
- **Empate**: las dos a brillo 0,7 y algo grises, sin humo ni enredaderas.
- Con reduced motion no hay humo y las enredaderas aparecen ya crecidas, sin brillo.
- El aspecto de la carta se aplica sobre el color final en sRGB, como los filtros CSS del lienzo: `three/cards/card-tint.ts` parchea `colorspace_fragment` con brillo y gris. Los valores por estado viven en `three/cards/duel-look.ts`; los aplica `three/table/duel-marking.ts` cada fotograma sin crear objetos.
- Humo y enredaderas viven en `three/fx/`: qué efecto toca a cada carta y sus tiempos (`fx-plan.ts`), el humo (`smoke-wisps.ts`, `smoke-shader.ts`, `smoke-strands.ts`: un plano que mira a la cámara y dibuja los cinco hilos en un `ShaderMaterial`) y las enredaderas (`vine-*.ts`: una calcomanía sobre el tapete, bajo la carta, con una textura pintada una vez al montar —tono, orden de crecimiento, fase del brillo y cobertura en RGBA— y una versión de hilo más grueso para pantallas altas). Se crean al montar la mesa y se compilan con un render de calentamiento (`warm-duel-fx.ts`). Comparten un único uniforme de tiempo, que solo avanza mientras hay un efecto vivo; cada efecto activo es una llamada de dibujo y los ocultos no cuestan nada.
- Ataque efectivo: si el ataque usado no es el impreso (Maldición −4), la carta lleva un sello rojo con el número usado junto a su sello de ataque (`three/cards/duel-badges.ts`). La marca violeta «−4» de la maldición se queda.

## Ver de cerca una carta de la mesa (I)

`CloseUp`: tocar o hacer clic en una carta ya jugada, de cualquier lado, abre el duelo de cerca (velo oscuro, `role="dialog"` «Duelo n de cerca»). Las cartas de la mano se siguen jugando con un toque; en escritorio el puntero es una mano sobre las cartas de la mesa.

- Móvil: una carta de 252×372 con nombre, facción y ataque; pestañas «RIVAL · n» / «TÚ · n» (empieza la tocada; sin pestañas si solo hay una carta del duelo) y, sobre ellas, el sello «GANAS», «PIERDES» o «EMPATE» si el duelo ya se resolvió. Con sello: «CON SELLO · Si ganas el duelo con esta carta, tomas un efecto.». Pie «TOCA FUERA PARA CERRAR».
- Escritorio: las dos cartas a 270 px con «VS», la tocada encendida y, si el duelo ya se resolvió, sello «GANAS», «PIERDES» o «EMPATE». Pie «CLIC FUERA O ESC PARA CERRAR»; el foco va al diálogo.
- No para el reloj del turno. Se cierra al tocar fuera, con Esc, al recoger la mesa o cuando llega una pregunta, y no se abre mientras hay una. Las tiras y la hoja de la Llama se ven encima.
- La mesa 3D avisa por `TableListener` (`cardInspected`, `sealHovered`, `tableCleared`); el estado vive en `ui/hud/table-watch.ts`.

## Cartas con sello en tu mano

- Las cartas de tu mano con sello (`hasSeal(card, vira)`: legendarias siempre; Velador y Veladora solo despiertos, con la vela de su facción) llevan filete dorado `#C9A35A` con brillo cálido, un sello de lacre que sobresale de la esquina superior izquierda (≈36 px en móvil, ≈48 en escritorio, girado 8°) y una cinta «CON SELLO» en el borde de abajo. Es una malla encima de la carta (`three/cards/seal-marks.ts`), pintada en canvas con los valores del lienzo para cada layout. En la mesa la carta conserva solo la estrella pequeña de la cara; la mano del rival no lleva nada.
- Escritorio: al pasar el ratón (no en táctil) aparece a su izquierda `SealTooltip`, papel con filete dorado, estrella, «CON SELLO» y la regla, colocado con el rectángulo proyectado de la carta.

## Bandeja de efectos

`EffectsTray`, abajo a la izquierda. Las cartas se pueden mirar siempre, también en el turno del rival; si no se pueden usar van apagadas con `aria-disabled` (nunca `disabled`) y solo se bloquea el uso.

- Ficha (`EffectTip`): papel washi con filete dorado `#C9A35A`, como `SealTooltip`, encima de la bandeja y con la flecha hacia la carta. Nombre, descripción y, si no se puede usar, el motivo en rojo. Los motivos salen de `effectBlock` del dominio: «Úsala en tu turno, antes de jugar tu carta.» (`turn`), «Ya usaste un efecto este turno.» (`used`) y «El rival no tiene cartas en la mano.» (`noPlunderTarget`, Saqueo).
- Táctil (`pointerType === 'touch'`, igual que el sello de la mano): el primer toque alza la carta y abre la ficha con USAR (44 px). USAR o un segundo toque la usan; tocar fuera la cierra y tocar otra carta cambia la ficha.
- Ratón y teclado: la ficha aparece a los 150 ms de pasar o enfocar, sin USAR. Clic o Intro usan el efecto de una vez; si no se puede, muestran el motivo.
- No para el reloj del turno. Se cierra al usar el efecto, cuando cambia la bandeja, cuando llega una pregunta (C) y con Esc. En 360 px cabe entera.

## Qué es cada aviso

| Evento                                  | Ahora                                                                                                                             |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `roundStarted`                          | tira «RONDA n» (cierra la hoja de la Llama)                                                                                       |
| `turnStarted`                           | tira de turno + barra de turno                                                                                                    |
| `ritualSung`                            | tira «PROCESIÓN»; si anula una Llama, en la misma tira: «EL RIVAL SACA LA PROCESIÓN Y ANULA TU LLAMA · RECIBES 3»                 |
| `ritualLost`, `effectEarned`            | marca («PROCESIÓN PERDIDA», «SELLO»)                                                                                              |
| `duelResolved` ganado / perdido         | sin texto: la mesa marca el duelo y las pepitas se llenan; la frase entera va a la región `aria-live`                             |
| `duelResolved` empate                   | la mesa marca el empate + marca «EMPATE» · «Bárbara y Leonor se anulan (14).»                                                     |
| `effectGained`                          | nada (la carta vuela a la bandeja)                                                                                                |
| `challengeCalled` (propio)              | marca en espera «DESAFÍO» / «CONTRA-DESAFÍO» · «La ronda pasaría a valer 4.»                                                      |
| `challengeAccepted` propio / rival      | marca «ACEPTAS» / marca del rival (borde rojo) «EL RIVAL ACEPTA» · «La ronda vale 4.»                                             |
| `retired` (retirarse, «Me voy», tiempo) | tira de 1,4 s con el daño real: «EL RIVAL SE RETIRA · EL RIVAL PIERDE 1», «TE VAS · PIERDES 4 DE VIDA»                            |
| `pactCalled` propio / subida del rival  | marca en espera «ENCIENDES LA LLAMA» / «AVIVAS LA LLAMA · 4» · «Quien pierda recibe 4.» / nada (lo dice la pregunta que sigue)    |
| `pactRejected` propio / rival           | marca / marca del rival «NO QUISO» · «El rival pierde 1.», con su golpe de vida                                                   |
| `pactAccepted` propio / rival           | marca / marca del rival «EL RIVAL QUISO» · «La Llama vale 4: se revela al final de la ronda.»                                     |
| `pactRevealed`                          | hoja de la Llama, sin espera, hasta la siguiente «RONDA n»; su daño va antes que el de la ronda                                   |
| `roundEnded`                            | tira de 1,4 s: «GANAS LA RONDA · EL RIVAL PIERDE 2», «PIERDES LA RONDA · PIERDES 2 DE VIDA», «RONDA EMPATADA · NADIE RECIBE DAÑO» |
| `effectUsed` propio / rival             | carta que sube (la del rival, desde arriba), 1,7 s + 0,3 s                                                                        |
| `effectAnnulled`                        | sello «ANULADO» sobre esa misma carta                                                                                             |
| `turnTimedOut`                          | marca                                                                                                                             |
| `plundered`, `lifeChanged`              | región viva / vida                                                                                                                |
| `matchOver`                             | fin de partida (bloquea; vacía la cola)                                                                                           |

Las **marcas** (`Mark`) son etiquetas papel. Duran 2,8 s (`MARK_MS`) y la siguiente solo las reemplaza tras 1,2 s (`NOTICE_MIN_MS`). Las del rival llevan borde y brillo rojos.

- Móvil: pequeñas (título de 10 px, detalle de 11 px) y centradas bajo «SU TURNO».
- Escritorio: en la columna de la voz, para leerse a distancia: título de 15 px (800, espaciado 0,2em), detalle de 15 px (600, tinta al 85 %), cuadrado de tono de 12 px y sombra `0 10px 24px`. Entran desde 24 px a la derecha en ≈ 220 ms, se quedan hasta el 89 % y se apagan.
- **En espera** (`isPending`): tus propias llamadas (Llama, Avivar, Apuesta, Desafío, Contra-desafío) llevan tres puntos rojos que laten tras el título, los mismos de «SU TURNO». No dicen «esperas la respuesta»: el rival contesta en ≈ 0,5 s y su marca (borde rojo) reemplaza a la tuya en el mismo sitio en cuanto se cumplen los 1,2 s.

El lienzo de diseño original está en Claude: «HUD · Mesa de las Velas».
