const net = require('net');
const server = net.createServer();

server.on('connection', socket => {
    console.log('Client connected');

    let min, max, answer;

    socket.on('data', data => {
        const message = JSON.parse(data);
        if (message.range) {
            [min, max] = message.range.split('-');
            answer = Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1) + parseInt(min));
            socket.write(JSON.stringify({ answer }));
        } else if (message.hint === 'more') {
            min = answer + 1;
            answer = Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1) + parseInt(min));
            socket.write(JSON.stringify({ answer }));
        } else if (message.hint === 'less') {
            max = answer - 1;
            answer = Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1) + parseInt(min));
            socket.write(JSON.stringify({ answer }));
        } else if (message.hint === 'equal') {
            console.log('Client guessed the number! Game over.');
            socket.end();
        }
    });

    socket.on('end', () => {
        console.log('Client disconnected');
    });
});

server.listen(5000, '127.0.0.1', () => {
    console.log('Server listening on port 5000');
    console.log('Ready to play the game...');
});