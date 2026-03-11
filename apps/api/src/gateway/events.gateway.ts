import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsEvent } from '@servermg/shared-types';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
    @WebSocketServer()
    server!: Server;

    @SubscribeMessage(WsEvent.LOG_STREAM)
    handleLogStream(@MessageBody() data: { projectId: string }, @ConnectedSocket() client: Socket) {
        client.join(`project-${data.projectId}`);
        return { event: 'joined', data: `project-${data.projectId}` };
    }

    @SubscribeMessage(WsEvent.TERMINAL_INPUT)
    handleTerminalInput(@MessageBody() data: { serverId: string; input: string }) {
        // Forward terminal input to the agent or handle it here
        this.server.to(`server-${data.serverId}`).emit(WsEvent.TERMINAL_INPUT, data.input);
    }

    broadcastToProject(projectId: string, event: string, payload: any) {
        this.server.to(`project-${projectId}`).emit(event, payload);
    }

    broadcastToServer(serverId: string, event: string, payload: any) {
        this.server.to(`server-${serverId}`).emit(event, payload);
    }
}
