
import './style.css'

import Phaser, { Physics, Scene } from 'phaser'

const sizes = {
  width: 500,
  height: 500
};

const speedDown = 300;

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 50;
    this.target;
    this.points = 0;
    this.textScore;
    this.timedEvent;
    this.remainingTime
  }

  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("basket", "/assets/basket.png");
    this.load.image("apple", "./assets/apple.png");
  }

  create() {
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.player = this.physics.add.image(0, sizes.height - 75, "basket").setOrigin(0, 0);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    this.player.setSize(this.player.width/10, this.player.height - this.player.height/10);
    this.target = this.physics.add.image(0, sizes.height - 500, "apple").setOrigin(0, 0);
    this.target.setMaxVelocity(0, speedDown);
    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this);
    this.cursor = this.input.keyboard.createCursorKeys();
    this.KeyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.KeyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.textScore = this.add.text(sizes.width - 120, 10, "Score:0",{
      font:"25px Arial",
      fill:"#000000",
    });
    this.textTime = this.add.text(sizes.width - 490, 10, "Remaining Time:00",{
      font:"25px Arial",
      fill:"#000000",
    })  
    this.timedEvent = this.time.delayedCall(3000,this.gameOver,[],this)
  }

  update() {
    this.remainingTime=this.timedEvent.getRemainingSeconds()
    this.textTime.setText(`remaining Time: ${Math.round(this.remainingTime).toString()}`)
    const { left, right } = this.cursor;
    if (this.KeyA.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (this.KeyD.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
    }
  }

  getRandomX() {
    return Math.floor(Math.random() * 480);
  }

  gameOver(){
    console.log("Game Over 😊")
  }

  targetHit() {
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    console.log(this.points);
    this.textScore.setText(`Score: ${this.points}`)
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas:gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: false,
    }
  },
  scene: [GameScene]
};

const game = new Phaser.Game(config);