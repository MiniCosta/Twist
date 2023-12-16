let players = [];
let rounds = 0;
let currentRound = 1;
let gamePage;

function startGame() {
    const welcomePage = document.getElementById('welcome-page');
    gamePage = document.getElementById('game-page');
    welcomePage.style.display = 'none';
    gamePage.style.display = 'block';
}

function selectPlayers() {
    const playerList = document.getElementById('player-list');
    const scoreTable = document.getElementById('score-table');
    const guessTable = document.getElementById('guess-table');

    // Registro de jogadores
    const numberOfPlayers = parseInt(prompt('Digite o número de jogadores:'));
    if (isNaN(numberOfPlayers) || numberOfPlayers <= 0) {
        alert('Número de jogadores inválido. Por favor, tente novamente.');
        return;
    }

    for (let i = 1; i <= numberOfPlayers; i++) {
        const playerName = prompt(`Digite o nome do jogador ${i}:`);
        players.push({ name: playerName, score: 0, guesses: [] });
    }

    // Preencher lista de jogadores
    playerList.innerHTML = players.map(player => `<li>${player.name}</li>`).join('');

    // Cálculo de rodadas
    rounds = Math.floor(52 / numberOfPlayers);

    // Preencher tabela de pontuações
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Rodada</th>' + players.map(player => `<th>${player.name}</th>`).join('');
    scoreTable.appendChild(headerRow);

    for (let i = 1; i <= rounds; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>Rodada ${i}</td>` + players.map(player => `<td id="${player.name}-round-${i}"></td>`).join('');
        scoreTable.appendChild(row);
    }

    // Adicionar última linha para a soma total dos pontos
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = '<td>Total</td>' + players.map(player => `<td id="${player.name}-total">0</td>`).join('');
    scoreTable.appendChild(totalRow);

    // Adicionar tabela de palpites
    const guessHeaderRow = document.createElement('tr');
    guessHeaderRow.innerHTML = '<th>Rodada</th>' + players.map(player => `<th>${player.name}</th>`).join('');
    guessTable.appendChild(guessHeaderRow);

    // Adicionar botão para começar a rodada
    const startRoundButton = document.createElement('button');
    startRoundButton.textContent = 'Colocar Palpites';
    startRoundButton.id = 'start-round-button';
    startRoundButton.onclick = startRound;
    gamePage.appendChild(startRoundButton);
}

function startRound() {
    if (currentRound <= rounds) {
        // Adicionar uma linha temporária para os palpites
        const guessTable = document.getElementById('guess-table');
        const guessRow = document.createElement('tr');
        guessRow.innerHTML = `<td>Rodada ${currentRound}</td>` + players.map(player => `<td id="${player.name}-guess-${currentRound}"></td>`).join('');
        guessTable.appendChild(guessRow);

        for (let i = 0; i < players.length; i++) {
            const guess = parseInt(prompt(`${players[i].name}, digite seu palpite para a rodada ${currentRound} (entre 0 e ${currentRound}):`));
            players[i].guesses.push(guess);

            // Atualizar a tabela de palpites
            const guessCell = document.getElementById(`${players[i].name}-guess-${currentRound}`);
            const previousGuesses = players[i].guesses.slice(0, currentRound);
            guessCell.textContent = previousGuesses.join(', ');
        }

        updateTable();

        // Remover botão de colocar palpites
        const startRoundButton = document.querySelector('#start-round-button');
        if (startRoundButton) {
            startRoundButton.remove();
        }

        // Adicionar botão para concluir a rodada
        const finishRoundButton = document.createElement('button');
        finishRoundButton.textContent = 'Concluir Rodada';
        finishRoundButton.id = 'finish-round-button';
        finishRoundButton.onclick = finishRound;
        gamePage.appendChild(finishRoundButton);

    } else {
        alert('Todas as rodadas foram concluídas. Clique em "Calcular Vencedor" para determinar o vencedor.');
    }
}

function finishRound() {
    if (currentRound <= rounds) {
        for (let i = 0; i < players.length; i++) {
            // Obter a pontuação da rodada
            const roundScore = parseInt(prompt(`${players[i].name}, digite sua pontuação para a rodada ${currentRound}:`));
            if (isNaN(roundScore)) {
                alert('Valor inválido. Por favor, digite um número.');
                return;
            }

            players[i].score += roundScore;

            // Atualizar a tabela de pontuações
            const cell = document.getElementById(`${players[i].name}-round-${currentRound}`);
            cell.textContent = roundScore;

            const totalCell = document.getElementById(`${players[i].name}-total`);
            totalCell.textContent = players[i].score;
        }

        // Limpar tabela de palpites
        const guessTable = document.getElementById('guess-table');
        guessTable.innerHTML = '';

        // Adicionar botão para começar nova rodada (apenas se não for a última rodada)
        if (currentRound < rounds) {
            const startRoundButton = document.createElement('button');
            startRoundButton.textContent = 'Começar Nova Rodada';
            startRoundButton.id = 'start-round-button';
            startRoundButton.onclick = startRound;
            gamePage.appendChild(startRoundButton);
        }

        // Remover botão de concluir rodada
        const finishRoundButton = document.querySelector('#finish-round-button');
        if (finishRoundButton) {
            finishRoundButton.remove();
        }

        currentRound++;
        //resetGuesses();
    } else {
        alert('Todas as rodadas foram concluídas. Clique em "Calcular Vencedor" para determinar o vencedor.');
    }
}

function resetGuesses() {
    for (let i = 0; i < players.length; i++) {
        players[i].guesses = [];
    }
}

function updateTable() {
    // Atualizar a tabela de palpites
    for (let i = 0; i < players.length; i++) {
        const guessCell = document.getElementById(`${players[i].name}-guess-${currentRound}`);
        guessCell.textContent = players[i].guesses[currentRound - 1];
    }
}

function declareWinner() {
    let winner = players[0];
    for (let i = 1; i < players.length; i++) {
        if (players[i].score > winner.score) {
            winner = players[i];
        }
    }

    alert(`O vencedor é ${winner.name} com ${winner.score} pontos!`);
}

function resetGame() {
    players = [];
    rounds = 0;
    currentRound = 1;

    const welcomePage = document.getElementById('welcome-page');
    welcomePage.style.display = 'block';
    gamePage.style.display = 'none';

    // Limpar tabelas
    const scoreTable = document.getElementById('score-table');
    scoreTable.innerHTML = '';

    const guessTable = document.getElementById('guess-table');
    guessTable.innerHTML = '';
}
