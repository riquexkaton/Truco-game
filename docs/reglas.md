# Reglas del juego (borrador)

Juego de cartas dark fantasy con ilustraciones estilo anime, inspirado en el truco venezolano. La idea es que se aprenda rápido y que la profundidad venga de capas que se suman al núcleo.

> Todos los números (vida, daño, ataque) son valores iniciales para probar y ajustar en partidas de prueba.

---

## 1. Objetivo

Bajar la vida del campeón rival de **20 a 0**.

---

## 2. Componentes

| Mazo            | Cartas                | Para qué sirve                                       |
| --------------- | --------------------- | ---------------------------------------------------- |
| Mazo de juego   | 40 (4 facciones × 10) | Las cartas que se juegan en los duelos               |
| Mazo de viras   | 4 (una por facción)   | Define qué facción está "encendida" en cada ronda    |
| Mazo de efectos | 20                    | Efectos especiales que se ganan con cartas con sello |

### Facciones (nombres provisionales)

| Palo    | Facción                  | Estilo                     |
| ------- | ------------------------ | -------------------------- |
| Espadas | Orden del Acero          | Ataque alto, poca curación |
| Bastos  | Brujas del Bosque Muerto | Control, maldiciones       |
| Copas   | Clan de la Sangre        | Robo de vida               |
| Oros    | Culto del Sol Negro      | Escudos, curación, pactos  |

---

## 3. Las cartas

- Cada carta tiene un **número de ataque** visible. Gana el más alto; no hay jerarquía que memorizar.
- **Cartas normales:** ataque del 1 al 10.
- **Legendarias:** ataque 11–12. La más fuerte de las fijas es el **1 de Espadas (12)**.
- **Perico y Perica:** cada facción tiene uno de cada uno. Su valor depende de la vira:

| Carta  | Inactiva (vira de otra facción) | Activa (vira de su facción) |
| ------ | ------------------------------- | --------------------------- |
| Perico | 6                               | 15                          |
| Perica | 5                               | 14                          |

Activos, el Perico y la Perica son las cartas más fuertes del juego, por encima de cualquier legendaria. Inactivos, se juegan como cartas normales.

### Cartas con sello

Las cartas con sello son las que permiten tomar cartas de efecto. Llevan un sello visible en la carta.

- Perico y Perica **activos**
- Legendarias

Un Perico o una Perica inactivos **no** cuentan como carta con sello.

---

## 4. Estructura de la partida

| Término | Qué es                                                    | Equivalente en el truco   |
| ------- | --------------------------------------------------------- | ------------------------- |
| Partida | El juego completo, hasta que un campeón llega a 0 de vida | Partida                   |
| Ronda   | Una mano de 3 cartas; gana quien se lleve 2 duelos        | Mano                      |
| Duelo   | Cada enfrentamiento carta contra carta                    | Primera, segunda, tercera |

---

## 5. Cómo se juega una ronda

1. Cada jugador recibe **3 cartas** del mazo de juego.
2. Se revela una carta del **mazo de viras**. El Perico y la Perica de esa facción quedan **activos** durante la ronda.
3. Se juegan **3 duelos**: cada jugador pone una carta y gana la de mayor ataque.
4. Quien gane **2 duelos** gana la ronda.
5. El ganador de la ronda le hace daño al campeón rival.

### Quién empieza

- Primera ronda: al azar. Después se alterna.
- Dentro de la ronda, quien gana un duelo juega primero en el siguiente.

### Tu turno

Tu **turno** es el momento en que te toca poner tu carta en un duelo. Cada jugador tiene hasta 3 turnos por ronda.

### Empates

- Si dos cartas empatan, ese duelo no cuenta para nadie.
- Después de un empate, en el siguiente duelo juega primero quien jugó primero en el duelo empatado.
- Si al final ninguno ganó 2 duelos, gana la ronda quien haya ganado más duelos.
- Si siguen empatados, nadie recibe daño.

---

## 6. Daño, Desafío y Me voy

El ganador de la ronda hace **2 de daño**.

En su turno, un jugador puede decir **"Desafío"**. El rival elige:

| Respuesta       | Resultado                                                                                                      |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| Aceptar         | La ronda ahora hace **4 de daño**                                                                              |
| Retirarse       | Pierde la ronda y recibe **1 de daño**                                                                         |
| Contra-desafiar | La ronda ahora hace **6 de daño**; quien desafió primero debe aceptar o retirarse (si se retira, recibe **4**) |

Como la vira se ve desde el inicio de la ronda, ambos jugadores saben qué facción está encendida. Desafiar es la forma de farolear: ¿tienes el Perico activo o no?

### Tener la palabra

Como en el truco, quien **acepta** un Desafío queda con la palabra:

- Más adelante en esa misma ronda, en cualquiera de sus turnos, puede **contra-desafiar** (la ronda pasa a **6**). El rival acepta o se retira (si se retira, recibe **4**).
- Quien hizo el Desafío no puede volver a subir: la palabra la tiene el otro.
- El máximo es **6**; después de un contra-desafío ya nadie puede subir.

### Me voy

En su turno, un jugador puede decir **"Me voy"** (como irse al mazo en el truco):

- Abandona la ronda: el rival la gana.
- Quien se va recibe **1 de daño**, sin importar lo que valiera la ronda por un Desafío.
- Si había un Pacto aceptado, se sigue revelando al final de la ronda y su daño se aplica igual.

---

## 7. Cartas de efecto

### Cómo se obtienen

Cuando **ganas un duelo con una carta con sello**, tomas una carta del mazo de efectos. No hace falta ganar la ronda.

**Ejemplo:** la vira es de Copas. El rival juega un 9 y tú lo matas con la Perica de Copas (14). Ganas ese duelo y tomas una carta de efecto en ese momento.

Que una carta tenga sello depende de la carta, no de su ataque final: un Perico activo con Maldición que igual gana el duelo sigue dando efecto.

### Cómo se guardan

- Máximo **2** cartas de efecto guardadas a la vez.
- Si ya tienes 2 y ganas otro duelo con sello, **robas igual y descartas la que quieras** de las 3.
- Se guardan **boca abajo**. El rival ve cuántas tienes, pero no cuáles.
- Los efectos guardados se conservan entre rondas.
- Si el mazo de efectos se acaba, se barajan los descartes y se forma uno nuevo.

### Cómo se usan

- Solo **1** por turno, y se usa **antes** de jugar tu carta del duelo.
- No se pueden usar al responder un Desafío ni al retirarse: solo en tu turno de duelo.
- Al usarla, la carta se revela y va a los descartes.

### Contenido del mazo de efectos (20 cartas)

| Efecto    | Qué hace                                                                              | Cantidad |
| --------- | ------------------------------------------------------------------------------------- | -------- |
| Golpe     | 2 de daño al campeón rival                                                            | 5        |
| Sanación  | Recuperas 2 de vida                                                                   | 5        |
| Saqueo    | Robas una carta al azar de la mano del rival y le das una de las tuyas (la eliges tú) | 3        |
| Maldición | −4 de ataque a la próxima carta que juegue el rival                                   | 4        |
| Sello     | Anula la próxima carta de efecto del rival                                            | 3        |

### Detalles del Saqueo

- Es un **intercambio**: ambos jugadores mantienen la misma cantidad de cartas, así que la ronda siempre puede jugarse completa.
- La carta que robas es **al azar**; la que entregas la **eliges tú**.
- Solo se puede usar si el rival todavía tiene al menos una carta en la mano.
- Si robas un Perico o una Perica activos, siguen activos en tu mano: la vira activa a la facción, no al jugador.
- Combo posible: robar una carta con sello, jugarla, ganar el duelo y tomar otro efecto. Es válido; depende del azar del robo.

### Detalles del Golpe y la Sanación

- Golpe y Sanación valen **2**, igual que el daño base de una ronda, para que los efectos no pesen más que ganar los duelos.
- Si un Golpe deja al campeón en 0, la partida termina en ese instante, aunque la ronda no haya acabado.
- La Sanación no puede subir la vida por encima de **20**.

### Detalles de la Maldición

- Se ve al jugarla: el rival sabe que su próxima carta llega debilitada y puede "sacrificar" una carta débil para absorberla.
- El ataque nunca baja de **0**.
- Si el rival no juega otra carta en esa ronda, la Maldición **expira** al final de la ronda.

### Detalles del Sello

- Lo activas en tu turno y queda puesto hasta que anule la próxima carta de efecto del rival o hasta que termine la ronda.
- Un Sello **no puede ser anulado** por otro Sello.

---

## 8. Pacto y Ritual (capa avanzada)

Apuestas paralelas a los duelos, inspiradas en el envido y la flor. Se desbloquean más adelante en la campaña (ver sección 9).

### Pacto (envido)

Se calcula con la regla del envido del truco, para que una mano fuerte en los duelos no tenga por fuerza un Pacto fuerte (y al revés).

**Cuánto vale tu Pacto:**

| Cartas                                                          | Valor                        |
| --------------------------------------------------------------- | ---------------------------- |
| Cartas de ataque **10 o más** (las "figuras": legendarias y 10) | **0**                        |
| Cartas de ataque 1 a 9                                          | Su ataque **base** impreso   |
| **Dos cartas de la misma facción**                              | La suma de las dos **+ 20**  |
| Sin dos cartas de la misma facción                              | La carta más alta (sin bono) |

- Se usa el ataque base impreso: el Perico cuenta como **6** y la Perica como **5**, aunque estén activos.
- Con 3 cartas de la misma facción se cuentan las 2 mejores.
- El máximo es **37** (un 9 y un 8 de la misma facción). Sin pareja, el Pacto va de 0 a 9.

**Ejemplos:**

- Baltasar (12, Carnero) + Oriana (11, Cayado) + Sor Irene (2, Velo): gana casi seguro los duelos, pero su Pacto vale **2** (las figuras valen 0 y no hay pareja de facción).
- Baltasar (12) + Garín (10), los dos de Carnero: pareja de figuras, Pacto **20**.
- Un 5 y un 3 de la misma facción: casi no ganan duelos, pero su Pacto vale **28**.

**Cómo se canta:**

1. Solo se puede cantar en tu turno, **antes de jugar tu carta del primer duelo**.
2. Hay tres apuestas, como envido, real envido y falta envido:

| Apuesta  | Quien pierda el Pacto recibe                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------- |
| Pacto    | **2** de daño                                                                                           |
| Re-pacto | **4** de daño                                                                                           |
| Apuesta  | Un número elegido: de **4** (o uno más que la apuesta anterior) hasta **la vida que le queda al rival** |

3. Quien responde puede **aceptar**, **rechazar** o **subir** a una apuesta mayor. Las subidas siguen hasta que alguien acepte o rechace.
4. Si **rechaza**, recibe el daño de la apuesta anterior (1 si rechaza la primera).
5. Si **acepta**, el resultado se fija en ese momento, pero **el ganador se revela al final de la ronda**. Quien tenga menos Pacto recibe el daño apostado.
6. Empate: gana quien empezó la ronda.

- El Pacto ya no cura: el que pierde recibe daño.
- En digital, cada jugador ve solo su propio valor de Pacto; el del rival no se muestra.

### Ritual (flor)

- Si tus **3 cartas son de la misma facción**, tienes Ritual.
- **Hay que cantarlo**, antes de jugar tu primera carta de la ronda. Si juegas sin cantarlo, **lo pierdes**.
- Al cantarlo, el rival recibe **3 de daño** y tú tomas **1 carta de efecto** (aplican las reglas normales de guardado).
- El Ritual **anula el Pacto**: si te cantan Pacto y tienes Ritual, puedes responder cantándolo y el Pacto se cancela. Después de un Ritual no se puede cantar Pacto en esa ronda.
- Es raro: sale en aproximadamente el 5% de las manos.

---

## 9. Progresión (campaña)

El juego se enseña jugando, sin manual: como en Overcooked, cada etapa de la campaña introduce **una sola mecánica nueva** y la complejidad sube poco a poco. Al terminar la campaña, el jugador ya juega con todas las reglas.

| Etapa | Se introduce                   | Cómo se enseña                                                                               |
| ----- | ------------------------------ | -------------------------------------------------------------------------------------------- |
| 1     | Duelos y ataque                | Manos fijas: el jugador aprende que el número más alto gana y que se necesitan 2 de 3 duelos |
| 2     | La vira, el Perico y la Perica | El rival tiene cartas altas; solo se le gana activando el Perico con la vira correcta        |
| 3     | Desafío y retirarse            | El rival desafía con manos débiles: el jugador aprende a detectar el farol y a farolear      |
| 4     | Cartas con sello y efectos     | Se introducen Golpe y Sanación primero; luego Maldición, Saqueo y Sello                      |
| 5     | Pacto y Ritual                 | Se activan las apuestas paralelas                                                            |

**Principios de diseño de cada etapa:**

- Cada combate está pensado para que la mecánica nueva sea **necesaria** para ganar, no solo opcional.
- Los primeros combates de cada etapa pueden tener manos preparadas; después se vuelve aleatorio.
- La mecánica nueva se presenta con un texto corto en pantalla, no con un tutorial largo.
- Las reglas se programan como **módulos activables**, para poder encender cada capa según la etapa.

---

## 10. Equivalencias con el truco

| Truco                                   | Este juego                                                   |
| --------------------------------------- | ------------------------------------------------------------ |
| Cada jugada (primera, segunda, tercera) | Duelo                                                        |
| La mano de 3 cartas                     | Ronda                                                        |
| Truco / retruco                         | Desafío / Contra-desafío                                     |
| No quiero                               | Retirarse                                                    |
| Irse al mazo                            | Me voy (−1 de vida)                                          |
| Envido / real envido / falta envido     | Pacto / Re-pacto / Apuesta (figuras valen 0, +20 por pareja) |
| Flor                                    | Ritual (hay que cantarlo)                                    |
| Vira (una de las 40 cartas)             | Vira (mazo aparte, una por facción)                          |
| Perico y perica                         | Perico y Perica, solo activos con la vira de su facción      |
| Partida a puntos                        | Bajar la vida del campeón a 0                                |

---

## 11. Pendiente por decidir

- Si las cartas tendrán **vida propia** (quedarse en la mesa y recibir golpes) o solo ataque.
- Valores exactos de ataque de cada carta y cuáles son legendarias además del 1 de Espadas.
- Nombres finales de las facciones y de los términos (usar los del truco o propios).
- Capas futuras: sinergias de facción, campeones con habilidad pasiva, viras especiales, construcción de mazo.
- Formato: la campaña con progresión está decidida; falta definir si habrá 1v1 online después de la campaña.
- Modos de juego (Rápido / Completo): descartados por ahora para no dividir a los jugadores online.
- Probar si el Saqueo (intercambio) es demasiado fuerte con 3 copias; si lo es, bajar a 2.
- Mecánicas de riesgo para capas futuras (de menos a más caótica): apostar efectos en el Desafío, sacrificio de sangre (descartado del núcleo por ahora), jugar a ciegas, forzar efectos (50% doble / 50% en contra), cartas inestables, Eclipse.
