const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.4;

c.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imgSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imgSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 10 },
  color: "red",
  offset: {
    x: 0,
    y: 0,
  },
  imgSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155,
  },
  sprites: {
    idle: {
      imgSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imgSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imgSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imgSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imgSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imgSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 50,
      y: 50,
    },
    width: 207,
    height: 50,
  },
});

const enemy = new Fighter({
  position: { x: 400, y: 0 },
  velocity: { x: 0, y: 10 },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imgSrc: "./img/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imgSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imgSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imgSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imgSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imgSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imgSrc: "./img/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imgSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -152,
      y: 50,
    },
    width: 150,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();
  c.fillStyle = "rgba(255,255,255,0.05)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  if (keys.a.pressed && player.lastkey == "a") {
    player.velocity.x = -5;
    player.switchSprites("run");
  } else if (keys.d.pressed && player.lastkey == "d") {
    player.velocity.x = 5;
    player.switchSprites("run");
  } else {
    player.switchSprites("idle");
  }
  if (player.velocity.y < 0) {
    player.switchSprites("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprites("fall");
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastkey == "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprites("run");
  } else if (keys.ArrowRight.pressed && enemy.lastkey == "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprites("run");
  } else {
    enemy.switchSprites("idle");
  }
  if (enemy.velocity.y < 0) {
    enemy.switchSprites("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprites("fall");
  }

  //detect collision
  if (
    rectangularCollision({
      rect1: player,
      rect2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent == 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    gsap.to('#enemyHealth',{
      width:enemy.health + "%"
    })
  }

  if (player.isAttacking && player.framesCurrent == 4) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision({
      rect1: enemy,
      rect2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent == 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    gsap.to('#playerHealth',{
      width:player.health + "%"
    })  }

  if (player.health == 0 || enemy.health == 0) {
    determineWinner({ player, enemy, timerId });
  }
  if (enemy.isAttacking && enemy.framesCurrent == 2) {
    enemy.isAttacking = false;
  }
}

decreaseTimer();

animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastkey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastkey = "a";
        break;
      case "w":
        if (player.position.y + player.height >= canvas.height - 100) {
          player.velocity.y = -15;
        }
        break;
      case " ":
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastkey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastkey = "ArrowLeft";
        break;
      case "ArrowUp":
        if (enemy.position.y + enemy.height >= canvas.height - 100) {
          enemy.velocity.y = -15;
        }
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
