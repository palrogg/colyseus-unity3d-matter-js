import { Engine, World, Body, Bodies, Constraint } from 'matter-js';

export class PhysicsWorld {
  engine: Engine;
  player1body: Body;

  constructor() {
    this.engine = Engine.create();
    console.log('Physics: engine created');
  }

  addWalls(scene){
    console.log('Physics: creating scene “' + scene + '”');
    let ground = Bodies.rectangle(200, -20, 810, 60, { isStatic: true });
    let ground2 = Bodies.rectangle(200, -400, 2000, 600, { isStatic: true });
    World.add(this.engine.world, [ground, ground2]);
  }

  addPlayer(player) {
    var playerBox = Bodies.rectangle(0, 200, player.x, player.y);
    playerBox.id = player.id;
    this.player1body = playerBox;
    World.add(this.engine.world, [playerBox]);
    console.log(`Physics: player body added (${player.x}, ${player.y}, ${player.id})`);
  }

  movePlayer(playerId) {
    Body.applyForce( this.player1body, {x: this.player1body.position.x, y: this.player1body.position.y}, {x: 0, y: -0.05});
    console.log('Physics: force sent');
  }

  // Fake objects to debug without room
  simulateAddObjects() {
    // Example from “Getting started”: https://github.com/liabru/matter-js/wiki/Getting-started
    var boxA = Bodies.rectangle(400, 200, 80, 80);
    var ballA = Bodies.circle(380, 100, 40, 10);
    var ballB = Bodies.circle(460, 10, 40, 10);
    var ground = Bodies.rectangle(400, 380, 810, 60, { isStatic: true });

    World.add(this.engine.world, [boxA, ballA, ballB, ground]);

    console.log('Physics: fake objects added to world');
  }

  // To debug without creating a room
  simulateUpdate() {
    var myEngine = this.engine;
    var playerBody = this.player1body;
    setInterval(function() {
      Engine.update(myEngine, 1);
      // process.stdout.write('.')
      console.log(playerBody.position);
      // console.log(engine);
    }, 1);
  }

  getUpdate(dt) {
    Engine.update(this.engine, dt);
    if(this.player1body && this.player1body.hasOwnProperty('position') ){
      return this.player1body;
    }
    return false;
  }

  getCollisions() {
    // TODO
  }
}