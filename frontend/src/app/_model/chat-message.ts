export class ChatMessage {
    id?: number;
    senderUsername: string;
    receiverUsername: string;
    content: string;
    timestamp: Date;
    isRead: boolean;

    constructor() {
        this.senderUsername = '';
        this.receiverUsername = '';
        this.content = '';
        this.timestamp = new Date();
        this.isRead = false;
    }
} 