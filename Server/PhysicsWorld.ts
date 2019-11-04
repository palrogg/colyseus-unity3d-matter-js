import { Engine, World, Body, Bodies, Constraint } from 'matter-js';

export class PhysicsWorld {
  engine: Engine;
  player1body: Body;

  constructor() {
    this.engine = Engine.create();
    // very slow motion
    this.engine.timing.timeScale = 0.1;
    // World.bounds = { min: { x: -Infinity, y: -Infinity }, max: { x: Infinity, y: Infinity } }
    console.log('Physics: engine created');
  }

  addWalls(scene){
    console.log('Physics: creating scene “' + scene + '”');
    var size = {width: 900, height: 600};

    var wallLeft = Bodies.rectangle(4, size.height/2, 10, size.height, {isStatic: true})
    var wallRight = Bodies.rectangle(size.width-4, size.height/2, 10, size.height, {isStatic: true})
    var wallTop = Bodies.rectangle(size.width/2, 4, size.width, 10, {isStatic: true})
    var wallBottom = Bodies.rectangle(size.width/2, size.height-4, size.width, 10, {isStatic: true})

    World.add(this.engine.world, [wallLeft, wallRight, wallTop, wallBottom]);

  }

  addPlayer(player) {
    var playerBox = Bodies.rectangle(0, 0, 60, 60); // Bodies.rectangle(0, 200, player.x, player.y);
    playerBox.id = player.id;
    this.player1body = playerBox;
    World.add(this.engine.world, [playerBox]);
    console.log(`Physics: player body added (${player.x}, ${player.y}, ${player.id})`);
  }

  resetPlayer(playerId) {
    Body.setPosition(this.player1body, {x: 0, y: 1});
  }

  movePlayer(playerId) {
    Body.applyForce( this.player1body, {x: this.player1body.position.x, y: this.player1body.position.y}, {x: 0.01, y: 0});
    console.log(`Physics: force sent, current position = (${this.player1body.position.x}, ${this.player1body.position.y})`);
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