import Player from "./player.js";
import Enemy from "./enemy.js";

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 600;

  let score = 0;
  
  const player = new Player(canvas.width / 2, canvas.height / 2, 20, 5);

  player.draw(ctx);

  const enemies = [];
  const bullets = [];

  function drawScore(){
    ctx.fillStyle = '#fff';
    ctx.font = '20px Courier New, monospace';
    ctx.fillText('Puntos: ' + score, 10, 30);
  }

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

  // Definir una función para calcular el intervalo de spawn según el puntaje
  function calculateSpawnInterval(score) {
    // Por ejemplo, podrías multiplicar el intervalo base por un factor que disminuya a medida que aumenta el puntaje
    const baseInterval = 5000; // Intervalo base de 5 segundos
    const factor = Math.max(1 - (score * 0.01), 0.5); // Factor que disminuye a medida que aumenta el puntaje
    return baseInterval * factor;
  }

  // Modificar el setInterval para usar la función de cálculo de intervalo
  setInterval(() => createEnemy(), calculateSpawnInterval(score));

  function flashBackground() {
    const body = document.querySelector('body');
    body.classList.add('flash'); // Agregar la clase para el efecto de flash

    // Crear un elemento de texto frenético
    const freneticText = document.createElement('div');
    freneticText.classList.add('frenetic-text');
    freneticText.textContent = getRandomFreneticMessage();
    body.appendChild(freneticText);

    // Remover el elemento de texto después de un corto tiempo para revertir el efecto
    setTimeout(() => {
        freneticText.remove();
        body.classList.remove('flash');
    }, 200); // Ajusta el tiempo según lo que desees para el efecto de titilación
}



function getRandomFreneticMessage() {
    const freneticMessages = [
        "╭∩╮( •̀_•́ )╭∩╮",
        "ᶠᶸᶜᵏᵧₒᵤ!",
        "(๑`^´๑)︻デ═一",
        "¿̴͚͖̇̌̀̏͋͒͝͝q̷̛̛̰̀̏̓ṳ̶̝͙͚̖̦͒̏̈̕ę̷̟͇̥͎͖̀̾̀́̆͛͠?̴̛̮̣̳̥̪̽̅ ¿̴͚͖̇̌̀̏͋͒͝͝q̷̛̛̰̀̏̓ṳ̶̝͙͚̖̦͒̏̈̕ę̷̟͇̥͎͖̀̾̀́̆͛͠ ¿̴͚͖̇̌̀̏͋͒͝͝q̷̛̛̰̀̏̓ṳ̶̝͙͚̖̦͒̏̈̕ę̷̟͇̥͎͖̀̾̀́̆͛͠ ¿̴͚͖̇̌̀̏͋͒͝͝q̷̛̛̰̀̏̓ṳ̶̝͙͚̖̦͒̏̈̕ę̷̟͇̥͎͖̀̾̀́̆͛͠ ¿̴͚͖̇̌̀̏͋͒͝͝q̷̛̛̰̀̏̓ṳ̶̝͙͚̖̦͒̏̈̕ę̷̟͇̥͎͖̀̾̀́̆͛͠",
        "n̴̰͕̽̊̆͛̂͗̔̅͑̐̐ȯ̷̡̬̙̥̼͕̈́̈̓̓̑́̊̂͌͝͠ ̵̬͐̈́̅̑͘n̷̪̭̪̤̥͚͉̯̫̪̔̎͐̎͜͝ͅö̸̩͔̼̻͎̤̟̪̒͒̃̀́̊͋͜͝ ̴̨͇͓̯̟̤̯̱̒̊̕͠n̷͚̝̞͖̽̆͆̉͑̽̀ǫ̸̧̨̺͚̟̜̖̿͘̕̕ ̵̩̾ṇ̶͊̏͊̄͘ö̴̫́ ̵̨̛̰̼̤́̐͋̑̉̔͒̓̋̓n̶̛͉̈́̎̉̎͗̋̊̕o̵͉̔ ̶͍͍̫͖̋̍̎̋̆̈́̀̂n̷̗̻̳̫͌̿͂͂̑̊̋́͑̋͂͘͝õ̷̢̳̌̑̏̓̀",
        "el tiempo es como una montaña",

    ];
    return freneticMessages[Math.floor(Math.random() * freneticMessages.length)];
}

  // Modificar la función updateEnemies para que los enemigos sigan al jugador
function updateEnemies() {
  enemies.forEach((enemy) => {
      enemy.draw(ctx);

      // Calcular la dirección hacia el jugador
      const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);

      // Calcular la velocidad de seguimiento (la mitad de la velocidad del jugador)
      const speed = player.speed / 2;

      // Calcular las componentes de velocidad en x e y basadas en el ángulo y la velocidad de seguimiento
      const speedX = Math.cos(angle) * speed;
      const speedY = Math.sin(angle) * speed;

      // Mover al enemigo hacia el jugador
      enemy.x += speedX;
      enemy.y += speedY;

      // Disparar una bala si pasa cierto tiempo
      if (Math.random() < 0.01) {
          const bullet = {
              x: enemy.x + enemy.size / 2,
              y: enemy.y + enemy.size / 2,
              size: 5,
              color: "#FF0000",
              speedX: speedX * 2, // Disparo a doble velocidad de seguimiento
              speedY: speedY * 2,
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
            alert("Hiciste "+ score + " puntos! " + randomMessage);
            location.reload();
        }, 500);
    }, 500);
}



function increaseScore() {
  score += 100;
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
                  increaseScore(); // Incrementar el puntaje
                  flashBackground();
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

    drawScore();

    requestAnimationFrame(update);
  }

  update();
});
