# 🔭 Sondeo Estelar: La Búsqueda de Mundos Ocultos

¡Bienvenido, explorador! "Sondeo Estelar" es un juego de estrategia y descubrimiento para dos jugadores, inspirado en el clásico "Batalla Naval" pero con un giro cósmico. En lugar de destruir, tu misión es localizar, identificar y catalogar cuerpos celestes ocultos en un sector inexplorado del espacio antes que tu rival.

Este proyecto fue construido con React y Vite, y utiliza la tecnología **WebRTC** a través de PeerJS para establecer una conexión directa (peer-to-peer) entre los jugadores, sin necesidad de un servidor central para la partida.

## 🌌 ¿Cómo se Juega?

El objetivo es ser el primer astrónomo en descubrir todos los cuerpos celestes que tu oponente ha desplegado en su mapa.

### Fase 1: Mapeado Cósmico

Al iniciar, cada jugador entra en la fase de preparación. Aquí, deberás desplegar estratégicamente tus "descubrimientos potenciales" en tu cuadrícula.

* Selecciona un cuerpo celeste de la lista.
* Usa el botón **"Rotar Eje"** para cambiar su orientación (horizontal o vertical).
* Haz clic en el tablero para posicionarlo.
* Una vez que todos los cuerpos estén en su lugar, confirma tu mapeado para avisarle a tu oponente que estás listo.

### Fase 2: Exploración Activa

Cuando ambos jugadores están listos, comienza la exploración por turnos.

* En tu turno, haz clic en una coordenada del mapa de tu oponente para lanzar una **sonda de escaneo**.
* Tu oponente te indicará el resultado:
    * **Vacío Cósmico (⚫)**: No hay nada de interés en ese sector.
    * **Contacto Estelar (🛰️)**: ¡Felicidades! Has detectado una parte de un cuerpo celeste.
    * **Descubrimiento Completo (🛰️)**: Cuando logras detectar todas las partes de un cuerpo celeste, se considera un "Descubrimiento Completo" y se revela en el tablero.

### Victoria

El primer jugador en realizar un "Descubrimiento Completo" de los 5 cuerpos celestes de su oponente gana la partida y recibe el título de **Gran Explorador Cósmico**.

## ✨ Los Cuerpos Celestes

Cada jugador cuenta con un catálogo de 5 cuerpos celestes de diferentes tamaños:

| Nombre                        | Tamaño (Sectores) | Emoji |
| ----------------------------- | :---------------: | :---: |
| Gigante Gaseoso Inexplorado   |         5         |  🪐   |
| Exoplaneta Oceánico           |         4         |  🌎   |
| Satélite Errante              |         3         |  🌑   |
| Sistema Binario de Asteroides |         2         |  ☄️   |
| Cometa Congelado              |         1         |  💫   |

## 🚀 Tecnología Utilizada

* **Vite:** Entorno de desarrollo ultrarrápido para aplicaciones web modernas.
* **React:** Librería para construir interfaces de usuario interactivas.
* **PeerJS:** Librería que simplifica la implementación de conexiones WebRTC para la comunicación directa entre navegadores.
* **CSS Moderno:** Estilos personalizados para crear una atmósfera espacial inmersiva.

## 💻 Cómo Jugar Localmente

Puedes ejecutar este proyecto en tu propia máquina para probarlo o para jugar con alguien en tu misma red.

### Prerrequisitos

* Tener [Node.js](https://nodejs.org/) instalado (versión 18 o superior recomendada).

### Pasos de Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/PabloGGuizar/sondeo-estelar.git](https://github.com/PabloGGuizar/sondeo-estelar.git)
    ```

2.  **Navega al directorio del proyecto:**
    ```bash
    cd sondeo-estelar
    ```

3.  **Instala las dependencias:**
    ```bash
    npm install
    ```

4.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

### Simular una Partida

1.  Abre tu navegador y ve a la dirección que te indica la terminal (usualmente `http://localhost:5173`). Esta será la ventana del **Jugador 1 (Anfitrión)**.
2.  Abre una segunda pestaña o una nueva ventana del navegador y ve a la misma dirección. Esta será la ventana del **Jugador 2 (Invitado)**.
3.  En la ventana del Jugador 1, copia el "ID de Enlace Directo".
4.  En la ventana del Jugador 2, pega el ID en el campo de texto y haz clic en "Sincronizar".
5.  ¡Que comience la exploración!

## 👤 Autoría y Comunidad

La idea y desarrollo de **Sondeo Estelar** fue realizada por **Juan Pablo Guízar** ([PabloGGuizar](https://github.com/PabloGGuizar)) con ayuda de **Gemini**.

* El repositorio de este proyecto se encuentra en: [GitHub - PabloGGuizar/sondeo-estelar](https://github.com/PabloGGuizar/sondeo-estelar).
* Este proyecto está indexado en el **Repositorio de aplicaciones educativas**, una colección de recursos creados por la comunidad **Vibe Coding Educativo**.
* Consulta más aplicaciones de esta comunidad en: [Repositorio Vibe Coding Educativo](https://github.com/vceduca/repositorio).
* Únete a la comunidad en Telegram: [t.me/vceduca](https://t.me/vceduca).
* Este proyecto se adhiere al [Decálogo del Conocimiento Abierto](https://vceduca.github.io/decalogo/).
