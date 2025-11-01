exports.eventBookingSocket = (io) => {
  io.on('connection', (socket) => {
    // client can join event rooms to receive updates only for events they care about
    socket.on('join_event', (data) => {
      const { event_id } = data || {};
      if (event_id) {
        socket.join(`event_${event_id}`);
      }
    });

    socket.on('leave_event', (data) => {
      const { event_id } = data || {};
      if (event_id) {
        socket.leave(`event_${event_id}`);
      }
    });

    socket.on('disconnect', () => {
      // no-op
    });
  });
};
