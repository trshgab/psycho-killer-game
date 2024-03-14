import Player from './player.js';
import Enemy from './enemy.js';

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 600;

    const player = new Player(canvas.width / 2, canvas.height / 2, 20, 5); // Aumentamos la velocidad del jugador

    // Dibujar al jugador inicialmente
    player.draw(ctx);

    const enemies = []; // Almacenar los enemigos creados

    // Función para crear enemigos
    function createEnemy() {
        const size = 20;
        const x = Math.random() * (canvas.width - size); // Generar coordenadas X aleatorias
        const y = Math.random() * (canvas.height - size); // Generar coordenadas Y aleatorias

        // Verificar que el enemigo no esté muy cerca del jugador
        const distanceToPlayer = Math.sqrt((player.x - x) ** 2 + (player.y - y) ** 2);
        if (distanceToPlayer < 100) {
            return; // Si está muy cerca, no crear el enemigo
        }

        const enemy = new Enemy(x, y, size, '#00FF00'); // Crear un enemigo verde
        enemies.push(enemy); // Agregar el enemigo al array de enemigos
    }

    // Llamar a la función createEnemy cada 5 segundos
    setInterval(createEnemy, 5000);

    // Función para actualizar y dibujar enemigos
    function updateEnemies() {
        enemies.forEach(enemy => {
            enemy.draw(ctx);
        });
    }

    // Agregar la lógica de movimiento del jugador
    const keysPressed = {}; // Almacenar las teclas presionadas

    document.addEventListener('keydown', function(event) {
        keysPressed[event.key] = true;
    });

    document.addEventListener('keyup', function(event) {
        delete keysPressed[event.key];
    });

    function updatePlayer() {
        if ('ArrowLeft' in keysPressed || 'a' in keysPressed) {
            if (player.x > 0) { // Verificar que el jugador no se mueva más allá del borde izquierdo
                player.moveLeft();
            }
        }
        if ('ArrowUp' in keysPressed || 'w' in keysPressed) {
            if (player.y > 0) { // Verificar que el jugador no se mueva más allá del borde superior
                player.moveUp();
            }
        }
        if ('ArrowRight' in keysPressed || 'd' in keysPressed) {
            if (player.x + player.size < canvas.width) { // Verificar que el jugador no se mueva más allá del borde derecho
                player.moveRight();
            }
        }
        if ('ArrowDown' in keysPressed || 's' in keysPressed) {
            if (player.y + player.size < canvas.height) { // Verificar que el jugador no se mueva más allá del borde inferior
                player.moveDown();
            }
        }
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        updateEnemies(); // Actualizar y dibujar enemigos
        player.draw(ctx); // Dibujar al jugador
        updatePlayer(); // Actualizar la posición del jugador

        requestAnimationFrame(update); // Llamar a la función de actualización de nuevo para un movimiento fluido
    }

    update(); // Comenzar el bucle de actualización
});
