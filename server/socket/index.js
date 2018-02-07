module.exports = (io) => {
  console.log('sockets running')
  io.on('connect', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)
    // console.log(socket)

    //data from raspberry pi...
    socket.on('sensorData', (data) => {
      console.log(data)
      //socket.broadcast.emit('data', data)
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}
