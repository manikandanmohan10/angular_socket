import { animate } from '@angular/animations';
import { Component } from '@angular/core';
import { io, Socket } from 'socket.io-client';

interface Message {
  message: any;
}

@Component({
  selector: 'app-socket',
  templateUrl: './socket.component.html',
  styleUrls: ['./socket.component.css']
})
export class SocketComponent {
  public message: any
  private socket: Socket;
  public receivedData: Message[] = []
  public sentData: Message[] = []

  public initialData: Message[] = []

  constructor() {
    this.socket = io('http://localhost:5000');
  }

  ngOnInit(){
    this.socket.on('message', (data: any)=>{
      this.receivedData.push(data);
      console.log(this.receivedData)
    })

    this.callServer()
  }

  callServer() {
    this.socket.emit('connect-io', 'hello');
    this.socket.on('my-response', (response) => {
      console.log(response);
      this.processData(response)
      console.log('After for')
    });
  }  

  processData(data: any) {
    for (let i = 0; i < data.data.length; i++){
      this.receivedData.push({'message': data.data[i].sent_text})
      this.sentData.push({'message': data.data[i].received_text})
    }
  }

  sendData(message: any) {
    const data = { message: message };
    this.socket.emit('message', data);
    this.sentData.push(data);
  }

  clearData(){
    this.socket.emit('clear', 'data');
  }
}
