import { Engine, World, Body, Bodies, Constraint } from 'matter-js';

export class PhysicsWorld {
  engine: Engine;

  constructor() {
    this.engine = Engine.create();
    console.log('engine created');
  }

  addPlayer(position) {
    console.log('Adding player!')
    console.log(position);
  }

  // Fake objects to debug without room
  simulateAddObjects() {
    // Example from “Getting started”: https://github.com/liabru/matter-js/wiki/Getting-started
    var boxA = Bodies.rectangle(400, 200, 80, 80);
    var ballA = Bodies.circle(380, 100, 40, 10);
    var ballB = Bodies.circle(460, 10, 40, 10);
    var ground = Bodies.rectangle(400, 380, 810, 60, { isStatic: true });

    World.add(this.engine.world, [boxA, ballA, ballB, ground]);

    console.log('objects added to world');
  }

  // Interval to debug without creating a room
  simulateUpdate() {
    var myEngine = this.engine;
    setInterval(function() {
      Engine.update(myEngine, 1000 / 60);
      process.stdout.write('.')
      // console.log(engine);
    }, 1000 / 60);
  }

  getCollisions() {
    // setInterval(function() {
    //   Engine.update(this.engine, 1000 / 60);
    //   console.log('.')
    //   // console.log(engine);
    // }, 1000 / 60);
    console.log('x');
    return "Hello"
  }

}