function rectangularCollision({ rect1, rect2 }) {
  return (
    rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
    rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
    rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
    rect1.attackBox.position.y <= rect2.position.y + rect2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#displayText").style =
    "position: absolute; background-color: white; padding: 20px;color: black;justify-content: center;align-items: center; width 100px; top: 238px;";

  let timeCount = document.querySelector("#timer").innerHTML;

  if (timeCount != 0) {
    if (player.health == enemy.health) {
      document.querySelector("#displayText").innerHTML = "Tie";
    } else if (player.health > enemy.health) {
      document.querySelector("#displayText").innerHTML = "Samurai Won";
    } else if (player.health < enemy.health) {
      document.querySelector("#displayText").innerHTML = "Kenji Won";
    }
  }
}

let timerId;
let timer = 60;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer -= 1;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer == 0) {
    determineWinner(player, enemy, timerId);
  }
}
