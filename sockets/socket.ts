import { Socket } from 'socket.io';
import { UsuariosLista } from '../classes/Usuarios-lista';
import { Usuario } from '../classes/Usuario';

export const usuariosConectados = new UsuariosLista();


export const conectarCliente = (client: Socket) => {
    const usuario = new Usuario(client.id);
    usuariosConectados.agregar(usuario);
}

export const disconnect = (client: Socket) => {
    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuariosConectados.borrarUsuario(client.id);
    });
}

export const message = (client: Socket, io: SocketIO.Server) => {
    client.on('mensaje', (payload: { de: string, cuerpo: string }) => {
        console.log('Mensaje recibido', payload);
        io.emit('mensaje-nuevo', payload);
    });
}

export const configUser = (client: Socket, io: SocketIO.Server) => {
    client.on('configurar-usuario', (payload, callback: Function) => {
        usuariosConectados.actualizarNombre(client.id, payload.name);
        callback({
            ok: true,
            message: `Usuario ${payload.name} configurado`
        });
        //io.emit('mensaje-nuevo', payload);
    });
}