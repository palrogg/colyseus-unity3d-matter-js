/*

  forked from colyseus-unity3d example room
  https://github.com/colyseus/colyseus-unity3d/blob/master/Server/DemoRoom.ts

  edited to add physics with matter-js

*/

import { Room, Client, generateId } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { verifyToken, User, IUser } from "@colyseus/social";

// custom class for physics with matter-js
import { PhysicsWorld } from "./PhysicsWorld";

class Entity extends Schema {
  @type("number")
  x: number = 0;

  @type("number")
  y: number = 0;
}

class Player extends Entity {
  @type("boolean")
  connected: boolean = true;
}

class Enemy extends Entity {
  @type("number")
  power: number = Math.random() * 10;
}

class State extends Schema {
  @type({ map: Entity })
  entities = new MapSchema<Entity>();

  @type(["number"])
  arrayOfNumbers = new ArraySchema<number>();
}

export class DemoRoom extends Room {
  world: PhysicsWorld;

  onInit (options: any) {
    console.log("DemoRoom created!", options);

    this.world = new PhysicsWorld;
    console.log('world created from room')
    this.world.addWalls("desert");

    this.setState(new State());
    this.populateEnemies();

    this.setPatchRate(1000 / 20);
    this.setSimulationInterval((dt) => this.update(dt));
  }

  async onAuth (options) {
    return await User.findById(verifyToken(options.token)._id);
  }

  populateEnemies () {
    // for (let i=0; i<=0; i++) {
    // 1v1 -> 1 enemy
      const enemy = new Enemy();
      enemy.x = Math.random() * 20;
      enemy.y = Math.random() * 20;
      this.state.entities[generateId()] = enemy;

      console.log('this.world = ' + this.world);
      // this.world.simulateUpdate();
      // console.log('Adding enemy at ' + enemy.x + ';' + enemy.y)
      this.state.arrayOfNumbers.push(Math.random());
    // }
  }

  requestJoin (options: any) {
    console.log("request join!", options);
    return true;
  }

  onJoin (client: Client, options: any, user: IUser) {
    console.log("client joined!", client.sessionId);
    /*let newPlayer = new Player();
    newPlayer.x = 10.0;
    newPlayer.y = 10.0;*/
    // console.log(newPlayer);
    this.state.entities[client.sessionId] = new Player();
    this.state.entities[client.sessionId].x = 0;
    this.state.entities[client.sessionId].y = 0;
    this.world.addPlayer({x: 0, y: 0, id: client.sessionId});

    console.log(this.state.entities[client.sessionId]);
  }

  async onLeave (client: Client, consented: boolean) {
    this.state.entities[client.sessionId].connected = false;

    try {
      if (consented) {
        throw new Error("consented leave!");
      }

      console.log("let's wait for reconnection!")
      const newClient = await this.allowReconnection(client, 10);
      console.log("reconnected!", newClient.sessionId);

    } catch (e) {
      console.log("disconnected!", client.sessionId);
      delete this.state.entities[client.sessionId];
    }
  }

  onMessage (client: Client, data: any) {
    console.log(data, "received from", client.sessionId);

    if (data === "move_right") {
      // this.state.entities[client.sessionId].x += 0.1;
      if(!this.state.entities[client.sessionId].y){
        this.state.entities[client.sessionId].y += 0.1;
        console.log('.y created')
      }
      if(!this.state.entities[client.sessionId].x){
        this.state.entities[client.sessionId].x += 0.1;
        console.log('.x created')
      }
      // this.world.resetPlayer(client.sessionId);
      this.world.movePlayer(client.sessionId);


    }else if (data === "move_left") {
      this.state.entities[client.sessionId].x -= 0.1;
    }
    console.log('x position: ' + this.state.entities[client.sessionId].x);

    // this.broadcast({ hello: "hello world" });
  }

  update (dt?: number) {
    // update state according to PhysicsWorld
    let updated = this.world.getUpdate(dt);
    if(updated){
      if(updated.id){
        process.stdout.write('✓');
        this.state.entities[updated.id].x = Math.round(updated.position.x);
        this.state.entities[updated.id].y = -1*Math.round(updated.position.y);
      }else{
        process.stdout.write('✗x');
      }
    }else{
      process.stdout.write('✗');
    }
  }

  onDispose () {
    console.log("disposing DemoRoom...");
  }

}
