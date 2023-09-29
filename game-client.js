const net = require('net');

const [min, max] = process.argv.slice(2);
const client = new net.Socket();
const range = `${min}-${max}`;

let guessMin = parseInt(min);
let guessMax = parseInt(max);

client.connect(5000, '127.0.0.1', () => {
    console.log(`Connected to Game-Server, guessing number between ${range}`);
    client.write(JSON.stringify({ range }));
});

client.on('data', data => {
    const message = JSON.parse(data);
    if (message.answer) {
        console.log(`Server's guess: ${message.answer}`);
        const guess = Math.floor((guessMin + guessMax) / 2);
        if (message.answer < guess) {
            guessMax = guess - 1;
            client.write(JSON.stringify({ hint: 'more' }));
        } else if (message.answer > guess) {
            guessMin = guess + 1;
            client.write(JSON.stringify({ hint: 'less' }));
        } else {
            console.log('Guessed the number! Game over.');
            client.end();
        }
    }
});

client.on('end', () => {
    console.log('Connection closed');
});