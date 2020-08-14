import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {  } from '../urlConfig';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket;

  constructor() { 
    // this.socket = io("http://localhost:8000");

    // this.socket.on("message", (msg)=>{
    //   console.log(msg)
    // })
  }
}
