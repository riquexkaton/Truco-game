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

- `--sg-dark`: olas seigaiha sobre `#141210`.
- `--sg-ink` y `--sg-green`: olas sobre papel, como el pie de las cartas.
- `--asa-red`: asanoha sobre `#7A2618`. Se usa para el rival y el Desafío.

## Reversos

- **Cartas de juego** («Tapete dorado»): negro `#120E0A`, banda de puntos dorados `#C9A35A`, panel interior con brillo radial, esquinas, varillas con rombos y un medallón de 12 ramas con estrella dorada `#D9B66B`.
- **Cartas de efecto** («Llama ritual»): la misma banda y panel sobre `#0E0B08`, rombo dorado y gran llama dorada con brillo de brasa. Los efectos boca abajo del rival (`.effect-back`) repiten la llama.
- Se pintan en canvas (`textures/card-backs.ts`) desde los trazados SVG del diseño de 400×600: los marcos van a todo el ancho y los motivos centrales con escala uniforme.

## Piezas

- **Pantalla de título** («Abanico de cartas»): sello de vela, «MESA DE LAS VELAS» y botón de pantalla completa. «ELIGE UNA CARTA» sobre un abanico de 4 cartas (JUGAR, REGLAS, MAZO, AJUSTES) que entra repartido; al pasar o enfocar una carta, su descripción aparece debajo. Solo JUGAR funciona: va alzada, con filete dorado y aura; las demás dicen «PRÓXIMAMENTE». El abanico se escala para caber en pantalla.
- **Carga** («Mazo barajado»): una carta grande inclinada que baraja 16 personajes (nombre y ataque del roster) sobre su propio arte difuminado, contador gigante 000–100 y barra fina con brasa. El porcentaje sale de los pasos reales de carga y solo llega a 100 con la mesa lista; luego se desvanece.

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
