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
- **Música**: botón de icono «Música» (`aria-pressed`, nota / nota tachada) con el mismo estilo que el de pantalla completa. En el título va a su izquierda, en la cabecera; durante la partida, en la esquina superior izquierda (`TableControls`), porque arriba a la derecha están la pista y las marcas. Activada por defecto; la elección se guarda en `localStorage`.
- **Efectos de sonido**: botón de icono «Efectos de sonido» (`aria-pressed`, altavoz / altavoz tachado), igual al de música y justo a su derecha, en la cabecera del título y en `TableControls`. Es independiente de la música: activado por defecto y con su propia clave en `localStorage`.
- **Carga** («Mazo barajado»): una carta grande inclinada que baraja 16 personajes (nombre y ataque del roster) sobre su propio arte difuminado, contador gigante 000–100 y barra fina con brasa. El porcentaje sale de los pasos reales de carga y solo llega a 100 con la mesa lista; luego se desvanece.

- **Cantar**: sello grande (66 px; 56 px en móvil). Punto rojo = Ritual listo. Al abrirse muestra tiras para Ritual, Pacto y Desafío o Contra, y el sello cambia a una X roja. Encima lleva etiquetas «PACTO · n» y «RONDA · VALE n».
- **Me voy**: círculo pequeño aparte, para no tocarlo sin querer. Su nombre accesible y la confirmación dicen lo que cuesta irse: 1 de vida, o lo que vale la ronda si hay un Desafío aceptado.
- **Tiras** (`Banner`): tira de papel con patrón en los extremos y sello estampado opcional. `win` = verde, `lose` = rojo. En pantalla alta van en la franja de arriba, nunca sobre la mano del rival.
- **Tiras de turno** (`TurnStrip`): «TU TURNO» entra por la izquierda (olas verdes) y «TURNO DEL RIVAL» por la derecha (asanoha roja). En pantalla alta, también en la franja de arriba.
- **Señal de turno**: etiqueta «TU TURNO», varilla de incienso que se quema y sello con los segundos. En los últimos 5 s todo se pone rojo y el borde de la pantalla se enciende. «SU TURNO» aparece junto a la vida del rival. Mientras se ve un anuncio o una pregunta el reloj se para: la barra baja al 60 %, la etiqueta dice «EN PAUSA» y en móvil aparece un icono de pausa junto a los segundos. En pantalla estrecha la barra se corre a la izquierda lo justo para no pisar «RONDA · VALE n».
- **Revelar efecto**: la carta sube con un rebote (animación original; no cambiarla). Solo para los efectos propios.
- **Fin de partida**: tarjeta con sello dorado y estrella (victoria) o sello rojo (derrota).

## Dónde aparecen los avisos

Pantalla alta = la misma regla que la mesa 3D (`aspect-ratio < 0.8`, variante `tall:` de Tailwind).

| Pieza               | Pantalla alta (móvil)                                 | Pantalla ancha (escritorio)                            |
| ------------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| Pregunta y anuncio  | `top: 72px; left/right: 14px`, bajo la vida del rival | `right: 20px`, centrada en vertical, 424 px de ancho   |
| Resultado del duelo | `top: 68px; left/right: 10px`                         | arriba a la derecha (`right: 40px; top: 16px`, 516 px) |
| Marca               | centrada a 128 px                                     | arriba a la derecha (56 px)                            |

En 390×844 todo termina antes de y = 245: la mano del rival empieza hacia y = 255. Nada oscurece la mesa.

## Llamadas del rival y preguntas (C · «voz del rival»)

`PromptCard`: tarjeta washi **sin fondo ni modal**, con banda de rayas de 7 px, `role="dialog"` no modal, nombre del sello y descripción del mensaje.

- **Desafío**: borde rojo y brillo rojo, sello «DESAFÍO», «TE RETIRAS EN N S» y tres botones de dos líneas (52 px).
- **Contra-desafío**: doble filete rojo y dorado, brillo de brasa, el valor viejo tachado.
- **Pacto / Re-pacto / Apuesta**: sello, mensaje entre «», reloj y botones en una línea (44 px). SUBIR ▸ cambia la fila por el escalón (− n +, FALTA, SUBIR A n), el mensaje dice «Subes a N de daño.» y aparece VOLVER. Con 4 respuestas (Re-pacto disponible) los botones pasan a dos líneas; el Ritual va en el hueco de la derecha del mensaje.
- **Neutras** (`foldConfirm`, `discardEffect`, el Pacto propio): mismo sitio, borde y banda de tinta, sin flecha ni sello de vela. El Pacto propio lleva CANCELAR en el hueco de la derecha y APOSTAR ▸ abre el escalón.
- En móvil una flecha roja apunta a la vida del rival; en escritorio, un sello de vela de 32 px sobre la banda.
- Escritorio: atajos 1–9 en la esquina de cada botón (los números no llegan a la mano), y el foco va al primer botón (al campo del escalón al subir).

## Anuncios grandes (J)

`Headline`: uno cada vez, en cola con las tiras (`stage.ts`). `notify` no se resuelve hasta que el anuncio se cierra, así el juego espera.

- Hoja washi: sello de color (o el arte del efecto), título, detalle y resultado. Si lo hizo el rival: borde rojo, flecha papel en móvil y banda con sello de vela en escritorio.
- Duelo: banda oscura con filetes dorados, las dos cartas (la ganadora con brillo, la perdedora apagada), «X (a) vence a Y (b).» y «LLEVAS n DE 3».
- Pie: barra de lectura y «TOCA PARA SEGUIR» (móvil) o «CLIC O ESPACIO PARA SEGUIR» (escritorio).
- Se cierran con un toque, clic, Espacio o Intro, o solos tras el tiempo de lectura: `2000 + 40 ms × letras`, entre 3,5 y 5 s (igual con movimiento reducido; solo se quitan las animaciones).

## Ver de cerca una carta de la mesa (I)

`CloseUp`: tocar o hacer clic en una carta ya jugada, de cualquier lado, abre el duelo de cerca (velo oscuro, `role="dialog"` «Duelo n de cerca»). Las cartas de la mano se siguen jugando con un toque; en escritorio el puntero es una mano sobre las cartas de la mesa.

- Móvil: una carta de 252×372 con nombre, facción y ataque; pestañas «RIVAL · n» / «TÚ · n» (empieza la tocada; sin pestañas si solo hay una carta del duelo). Con sello: «CON SELLO · Si ganas el duelo con esta carta, tomas un efecto.». Pie «TOCA FUERA PARA CERRAR».
- Escritorio: las dos cartas a 270 px con «VS», la tocada encendida y, si el duelo ya se resolvió, sello «GANAS», «PIERDES» o «EMPATE». Pie «CLIC FUERA O ESC PARA CERRAR»; el foco va al diálogo.
- No para el reloj del turno. Se cierra al tocar fuera, con Esc, al recoger la mesa o cuando llega una pregunta, y no se abre mientras hay una. Los anuncios (J) se ven encima.
- La mesa 3D avisa por `TableListener` (`cardInspected`, `sealHovered`, `tableCleared`); el estado vive en `ui/hud/table-watch.ts`.

## Cartas con sello en tu mano

- Las cartas de tu mano con sello (`hasSeal(card, vira)`: legendarias siempre; Perico y Perica solo con su vira) llevan filete dorado `#C9A35A` con brillo cálido, un sello de lacre que sobresale de la esquina superior izquierda (≈36 px en móvil, ≈48 en escritorio, girado 8°) y una cinta «CON SELLO» en el borde de abajo. Es una malla encima de la carta (`three/cards/seal-marks.ts`), pintada en canvas con los valores del lienzo para cada layout. En la mesa la carta conserva solo la estrella pequeña de la cara; la mano del rival no lleva nada.
- Escritorio: al pasar el ratón (no en táctil) aparece a su izquierda `SealTooltip`, papel con filete dorado, estrella, «CON SELLO» y la regla, colocado con el rectángulo proyectado de la carta.

## Qué es cada aviso

| Evento                                 | Antes              | Ahora                                                      |
| -------------------------------------- | ------------------ | ---------------------------------------------------------- |
| `roundStarted`                         | tira               | tira (franja de arriba en móvil)                           |
| `turnStarted`                          | tira de turno      | tira de turno + barra de turno                             |
| `ritualSung`                           | tira               | tira                                                       |
| `ritualLost`                           | toast              | marca                                                      |
| `duelResolved`                         | toast              | anuncio (banda de duelo)                                   |
| `effectEarned`                         | toast              | marca                                                      |
| `effectGained`                         | nada               | nada (la carta vuela a la bandeja)                         |
| `challengeCalled` (propio)             | tira               | marca                                                      |
| `challengeAccepted` propio / rival     | tira               | marca «ACEPTAS» / anuncio «EL RIVAL ACEPTA»                |
| `retired` (retirarse o «Me voy»)       | tira               | anuncio con el daño real, de los dos lados                 |
| `pactCalled` propio / subida del rival | toast              | marca / nada (lo dice la pregunta que sigue)               |
| `pactRejected` propio / rival          | toast              | marca / anuncio «NO QUISO»                                 |
| `pactAccepted` propio / rival          | toast              | marca / anuncio «EL RIVAL QUISO»                           |
| `pactAnnulled` propio / rival          | toast              | marca / anuncio                                            |
| `pactRevealed`                         | toast              | anuncio: quién gana, los dos valores y quién pierde cuánto |
| `roundEnded`                           | tira               | anuncio                                                    |
| `effectUsed` propio / rival            | carta              | carta que sube / anuncio con el arte del efecto            |
| `effectAnnulled`                       | tira               | anuncio                                                    |
| `turnTimedOut`                         | toast              | marca                                                      |
| `plundered`, `lifeChanged`             | región viva / vida | igual                                                      |
| `matchOver`                            | fin de partida     | igual                                                      |

Las **marcas** (`Mark`) son etiquetas papel pequeñas que no esperan: en móvil centradas bajo «SU TURNO», en escritorio arriba a la derecha; duran 2,8 s y la siguiente reemplaza a la anterior.

El lienzo de diseño original está en Claude: «HUD · Mesa de las Velas».
