import Player from "./player.js";
import Enemy from "./enemy.js";

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 600;
  
  const player = new Player(canvas.width / 2, canvas.height / 2, 20, 5);

  player.draw(ctx);

  const enemies = [];
  const bullets = [];

  function createEnemy() {
    const size = 20;
    const x = Math.random() * (canvas.width - size);
    const y = Math.random() * (canvas.height - size);

    const distanceToPlayer = Math.sqrt(
      (player.x - x) ** 2 + (player.y - y) ** 2
    );
    if (distanceToPlayer < 100) {
      return;
    }

    const enemy = new Enemy(x, y, size, "#00FF00");
    enemies.push(enemy);
  }

  setInterval(createEnemy, 5000);

  function updateEnemies() {
    enemies.forEach((enemy) => {
      enemy.draw(ctx);

      if (Math.random() < 0.01) {
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);

        const bullet = {
          x: enemy.x + enemy.size / 2,
          y: enemy.y + enemy.size / 2,
          size: 5,
          color: "#FF0000",
          speedX: Math.cos(angle) * 5,
          speedY: Math.sin(angle) * 5,
          isPlayerBullet: false,
        };

        bullets.push(bullet);
      }
    });
  }

  function updateBullets() {
    bullets.forEach((bullet) => {
      ctx.fillStyle = bullet.color;
      ctx.fillRect(bullet.x, bullet.y, bullet.size, bullet.size);
    });
  }

  function moveBullets() {
    bullets.forEach((bullet) => {
      bullet.x += bullet.speedX;
      bullet.y += bullet.speedY;
    });
  }

  function killPlayer() {
    const deathMessages = [
        "╭∩╮( •̀_•́ )╭∩╮",
        "ᶠᶸᶜᵏᵧₒᵤ!",
        "(๑`^´๑)︻デ═一"
    ];
    const randomMessage = deathMessages[Math.floor(Math.random() * deathMessages.length)];
    
    const canvas = document.getElementById('gameCanvas');
    canvas.classList.add('shake');
    canvas.classList.add('red');
    
    setTimeout(() => {
        canvas.classList.remove('shake');
        setTimeout(() => {
            canvas.classList.remove('red');
            alert("Game Over! " + randomMessage);
            location.reload();
        }, 500);
    }, 500);
}




  function checkCollisions() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];

        if (bullet.isPlayerBullet) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                if (
                    bullet.x < enemy.x + enemy.size &&
                    bullet.x + bullet.size > enemy.x &&
                    bullet.y < enemy.y + enemy.size &&
                    bullet.y + bullet.size > enemy.y
                ) {
                    bullets.splice(i, 1); // Eliminar la bala del jugador
                    enemies.splice(j, 1); // Eliminar el enemigo
                    break; // Salir del bucle interno
                }
            }
        } else {
            const playerLeft = player.x;
            const playerRight = player.x + player.size;
            const playerTop = player.y;
            const playerBottom = player.y + player.size;

            if (
                bullet.x + bullet.size > playerLeft &&
                bullet.x < playerRight &&
                bullet.y + bullet.size > playerTop &&
                bullet.y < playerBottom
            ) {
                killPlayer();
                bullets.splice(i, 1); // Eliminar la bala del enemigo
                break; // Salir del bucle
            }
        }
    }
}


  const keysPressed = {};

  document.addEventListener("keydown", function (event) {
    keysPressed[event.key] = true;
  });

  document.addEventListener("keyup", function (event) {
    delete keysPressed[event.key];
  });

  function updatePlayer() {
    if ("ArrowLeft" in keysPressed || "a" in keysPressed || "A" in keysPressed) {
      if (player.x > 0) {
        player.moveLeft();
      }
    }
    if ("ArrowUp" in keysPressed || "w" in keysPressed || "W" in keysPressed) {
      if (player.y > 0) {
        player.moveUp();
      }
    }
    if ("ArrowRight" in keysPressed || "d" in keysPressed || "D" in keysPressed) {
      if (player.x + player.size < canvas.width) {
        player.moveRight();
      }
    }
    if ("ArrowDown" in keysPressed || "s" in keysPressed || "S" in keysPressed) {
      if (player.y + player.size < canvas.height) {
        player.moveDown();
      }
    }
  }

  function checkPlayerCollision() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const distanceToPlayer = Math.sqrt((player.x - enemy.x) ** 2 + (player.y - enemy.y) ** 2);

        if (distanceToPlayer < (player.size + enemy.size) / 2) { // Verificar si hay colisión entre jugador y enemigo
            killPlayer(); // Llamar a la función para matar al jugador
            return; // Salir de la función, ya que el jugador está muerto
        }
    }
}


  canvas.addEventListener("mousedown", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);

    const bullet = {
      x: player.x + player.size / 2,
      y: player.y + player.size / 2,
      size: 5,
      color: "#FFFFFF",
      speedX: Math.cos(angle) * 5,
      speedY: Math.sin(angle) * 5,
      isPlayerBullet: true,
    };

    bullets.push(bullet);
  });

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateEnemies();
    updateBullets();
    moveBullets();
    checkCollisions();
    checkPlayerCollision();
    player.draw(ctx);
    updatePlayer();

    requestAnimationFrame(update);
  }

  update();
});
