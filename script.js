let players = [];
let rounds = 0;
let currentRound = 1;
let gamePage;
let firstPlayerIndex = 0; // Variável para acompanhar o primeiro jogador

function startGame() {
    const welcomePage = document.getElementById('welcome-page');
    gamePage = document.getElementById('game-page');
    welcomePage.style.display = 'none';
    gamePage.style.display = 'block';
}
// function chooseFirstPlayer() {
//     const randomIndex = Math.floor(Math.random() * players.length);
//     alert(`O primeiro jogador é: ${players[firstPlayerIndex].name}`);
// }

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
        // Atualizar o índice do primeiro jogador para a próxima rodada
        firstPlayerIndex = (firstPlayerIndex + 1) % players.length;

        // Adicionar uma linha temporária para os palpites e checkboxes
        const guessTable = document.getElementById('guess-table');
        const guessRow = document.createElement('tr');
        guessRow.innerHTML = `<td>Rodada ${currentRound}</td>` + players.map(player => `
            <td id="${player.name}-guess-${currentRound}"></td>
            <td>
                <input type="number" id="${player.name}-input-${currentRound}" placeholder="Palpite" />
                <input type="checkbox" id="${player.name}-result-${currentRound}" /> Acertou
            </td>`).join('');
        guessTable.appendChild(guessRow);

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
            const currentPlayerIndex = (firstPlayerIndex + i) % players.length; // Use o índice ajustado
            const guessInput = document.getElementById(`${players[currentPlayerIndex].name}-input-${currentRound}`);
            const resultCheckbox = document.getElementById(`${players[currentPlayerIndex].name}-result-${currentRound}`);

            const guess = parseInt(guessInput.value) || 0;
            const isCorrect = resultCheckbox.checked;

            const roundScore = isCorrect ? 10 + guess : 0;

            players[currentPlayerIndex].score += roundScore;

            // Atualizar a tabela de pontuações
            const cell = document.getElementById(`${players[currentPlayerIndex].name}-round-${currentRound}`);
            cell.textContent = roundScore+10;

            const totalCell = document.getElementById(`${players[currentPlayerIndex].name}-total`);
            totalCell.textContent = players[currentPlayerIndex].score;
        }

        // Limpar tabela de palpites e checkboxes
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
