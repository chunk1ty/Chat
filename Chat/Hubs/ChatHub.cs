using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Chat.Hubs
{
    public class ChatHub : Hub
    {
        public async Task JoinRoom(string room, string userName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, room);
            await Clients.Group(room).SendAsync("ReceiveMessage", userName, $" joined {room} room.");
        }

        public async Task LeaveRoom(string room, string userName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, room);
            await Clients.Group(room).SendAsync("ReceiveMessage", userName, $" left {room} room.");
        }

        public async Task SendMessage(string room, string userName, string message)
        {
            await Clients.Group(room).SendAsync("ReceiveMessage", userName, message);
        }
    }
}
