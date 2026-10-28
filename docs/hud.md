# Sistema visual del HUD

El HUD sigue el diseño de las cartas, no el de sus ilustraciones: papel, tinta, sellos y patrones japoneses.

## Base

| Token                    | Valor     | Uso                                |
| ------------------------ | --------- | ---------------------------------- |
| `--washi`                | `#F2E8D5` | fondo de tarjetas, tiras y toasts  |
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

- `--sg-dark`: olas seigaiha sobre `#141210`, como el reverso de las cartas de juego.
- `--sg-ink` y `--sg-green`: olas sobre papel, como el pie de las cartas.
- `--asa-red`: asanoha sobre `#7A2618`, como el reverso de las cartas de efecto. Se usa para el rival y el Desafío.

## Piezas

- **Cantar**: sello grande (66 px; 56 px en móvil). Punto rojo = Ritual listo. Al abrirse muestra tiras para Ritual, Pacto y Desafío o Contra, y el sello cambia a una X roja. Encima lleva etiquetas «PACTO · n» y «RONDA · VALE n».
- **Me voy**: círculo pequeño aparte, para no tocarlo sin querer.
- **Tiras** (`.banner`): tira de papel con patrón en los extremos y sello estampado opcional. `win` = verde, `lose` = rojo.
- **Tiras de turno** (`.tstrip`): «TU TURNO» entra por la izquierda (olas verdes) y «TURNO DEL RIVAL» por la derecha (asanoha roja).
- **Señal de turno**: etiqueta «TU TURNO», varilla de incienso que se quema y sello con los segundos. En los últimos 5 s todo se pone rojo y el borde de la pantalla se enciende. «SU TURNO» aparece junto a la vida del rival.
- **Toasts**: tiras de papel con sello de color, título, etiqueta, detalle y resultado. Línea de tinta = tiempo restante; se pausan con el cursor y se cierran con un toque.
- **Modales** (`ask`): tarjeta papel con banda de patrón arriba (olas para el Pacto, asanoha roja para el Desafío), reloj de incienso opcional, título en etiqueta y botones papel/tinta.
- **Revelar efecto**: la carta sube con un rebote (animación original; no cambiarla).
- **Fin de partida**: tarjeta con sello dorado y estrella (victoria) o sello rojo (derrota).

El lienzo de diseño original está en Claude: «HUD · Mesa de las Velas».
