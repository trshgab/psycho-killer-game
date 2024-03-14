import Player from './player.js';
import Enemy from './enemy.js';

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 600;

    const player = new Player(canvas.width / 2, canvas.height / 2, 20, 10); // Aumentamos la velocidad del jugador

    // Dibujar al jugador inicialmente
    player.draw(ctx);

    const enemies = []; // Almacenar los enemigos creados
    const bullets = []; // Almacenar las balas creadas por el jugador

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

        // Permitir que algunos enemigos disparen
        enemies.forEach(enemy => {
            if (Math.random() < 0.3) { // 30% de probabilidad de disparar
                const bullet = { x: enemy.x, y: enemy.y, size: 5, color: '#FF0000', speed: 5 };
                bullets.push(bullet);
            }
        });
    }

    // Función para actualizar y dibujar balas
    function updateBullets() {
        bullets.forEach(bullet => {
            ctx.fillStyle = bullet.color;
            ctx.fillRect(bullet.x, bullet.y, bullet.size, bullet.size);
        });
    }

    // Función para mover las balas disparadas por el jugador
    function moveBullets() {
        bullets.forEach(bullet => {
            bullet.x += bullet.speedX;
            bullet.y += bullet.speedY;
        });
    }

    // Función para verificar colisiones entre balas y enemigos
    function checkCollisions() {
        for (let i = bullets.length - 1; i >= 0; i--) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                const bullet = bullets[i];
                const enemy = enemies[j];

                if (
                    bullet.x < enemy.x + enemy.size &&
                    bullet.x + bullet.size > enemy.x &&
                    bullet.y < enemy.y + enemy.size &&
                    bullet.y + bullet.size > enemy.y
                ) {
                    // Si hay colisión entre bala y enemigo, eliminarlos
                    bullets.splice(i, 1);
                    enemies.splice(j, 1);
                    break;
                }
            }
        }
    }

    // Función para verificar colisión entre jugador y enemigos
    function checkPlayerCollision() {
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            const distanceToPlayer = Math.sqrt((player.x - enemy.x) ** 2 + (player.y - enemy.y) ** 2);

            if (distanceToPlayer < 20) { // Si el jugador choca con un enemigo
                // Reiniciar el juego (el jugador muere)
                alert("Game Over! You were killed by an enemy.");
                location.reload(); // Recargar la página para reiniciar el juego
                return; // Salir de la función, ya que el juego se ha reiniciado
            }
        }
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

    // Agregar la lógica de disparo del jugador con el mouse
    canvas.addEventListener('mousedown', function(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const angle = Math.atan2(mouseY - player.y, mouseX - player.x);

        const bullet = {
            x: player.x + player.size / 2,
            y: player.y + player.size / 2,
            size: 5,
            color: '#FFFFFF',
            speedX: Math.cos(angle) * 5, // Velocidad en X basada en el ángulo
            speedY: Math.sin(angle) * 5  // Velocidad en Y basada en el ángulo
        };

        bullets.push(bullet);
    });

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        updateEnemies(); // Actualizar y dibujar enemigos
        updateBullets(); // Actualizar y dibujar balas
        moveBullets(); // Mover balas
        checkCollisions(); // Verificar colisiones entre balas y enemigos
        checkPlayerCollision(); // Verificar colisión entre jugador y enemigos
        player.draw(ctx); // Dibujar al jugador
        updatePlayer(); // Actualizar la posición del jugador

        requestAnimationFrame(update); // Llamar a la función de actualización de nuevo para un movimiento fluido
    }

    update(); // Comenzar el bucle de actualización
});

