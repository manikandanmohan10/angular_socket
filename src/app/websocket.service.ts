import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Socket } from 'socket.io-client';
// import { environment } from '../environments/environment';

interface MessageData {
  message: string;
  time?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  
  private socket$!: WebSocketSubject<any>;
  public receivedData: MessageData[] = [];
  public sentData: MessageData[] = [];

  public connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket("ws://localhost:5000/ws");

      this.socket$.subscribe((data: MessageData) => {
        this.receivedData.push(data);
      });
    }
  }

  sendMessage(message: string) {
    this.socket$.next({ message });
    this.sentData.push({message})
  }
    
  close() {
    this.socket$.complete();
  }
}
