// ============================================
// GAME STATE & VARIABLES
// ============================================
let balance = 1000;
let currentGame = null;
let soundEnabled = true;

// Statistics
let stats = {
    totalGames: 0,
    totalWins: 0,
    totalProfit: 0,
    biggestWin: 0
};

// Blackjack
let blackjackDeck = [];
let playerHand = [];
let dealerHand = [];
let currentBet = 0;

// Roulette & Craps History
let rouletteHistory = [];
let crapsHistory = [];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    updateBalance(0);
    updateStats();
    document.querySelector('.game-btn').click();
});

// ============================================
// BALANCE & STATISTICS
// ============================================
function updateBalance(amount) {
    balance += amount;
    document.getElementById('balance').textContent = '$' + balance;
    
    // Update profit stats
    if (amount > 0) {
        stats.totalProfit += amount;
        if (amount > stats.biggestWin) {
            stats.biggestWin = amount;
        }
    } else if (amount < 0) {
        stats.totalProfit += amount;
    }
    
    if (balance <= 0) {
        showNotification('Sem fundos! Seu saldo foi resetado para $1000', 'info');
        balance = 1000;
        updateBalance(0);
    }
    
    saveStats();
    updateStats();
}

function updateStats() {
    document.getElementById('total-games').textContent = stats.totalGames;
    document.getElementById('total-wins').textContent = stats.totalWins;
    document.getElementById('total-profit').textContent = '$' + stats.totalProfit;
    document.getElementById('biggest-win').textContent = '$' + stats.biggestWin;
}

function saveStats() {
    localStorage.setItem('casinoStats', JSON.stringify(stats));
    localStorage.setItem('casinoBalance', balance);
}

function loadStats() {
    const savedStats = localStorage.getItem('casinoStats');
    const savedBalance = localStorage.getItem('casinoBalance');
    
    if (savedStats) {
        stats = JSON.parse(savedStats);
    }
    
    if (savedBalance) {
        balance = parseInt(savedBalance);
    }
}

function resetBalance() {
    if (confirm('Tem certeza que deseja resetar seu saldo e estatísticas?')) {
        balance = 1000;
        stats = {
            totalGames: 0,
            totalWins: 0,
            totalProfit: 0,
            biggestWin: 0
        };
        updateBalance(0);
        updateStats();
        showNotification('Saldo e estatísticas resetados!', 'info');
    }
}

// ============================================
// GAME SELECTION
// ============================================
function selectGame(game) {
    document.querySelectorAll('.game-container').forEach(g => g.classList.remove('active'));
    document.querySelectorAll('.game-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(game + '-game').classList.add('active');
    event.target.closest('.game-btn').classList.add('active');
    currentGame = game;
}

// ============================================
// SLOT MACHINE
// ============================================
const slotSymbols = ['🍒', '🍋', '🍊', '🍇', '🍉', '⭐', '💎', '7️⃣'];
let isSpinning = false;

function spinSlots() {
    if (isSpinning) return;
    
    const bet = parseInt(document.getElementById('slot-bet').value);
    if (bet > balance || bet <= 0) {
        showMessage('slot-message', 'Aposta inválida!', 'info');
        return;
    }

    isSpinning = true;
    stats.totalGames++;
    updateBalance(-bet);
    
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];

    // Animation
    reels.forEach(reel => reel.classList.add('spinning'));
    
    setTimeout(() => {
        const results = [];
        reels.forEach((reel) => {
            const symbol = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
            results.push(symbol);
            reel.textContent = symbol;
            reel.classList.remove('spinning');
        });

        // Check win
        if (results[0] === results[1] && results[1] === results[2]) {
            const multiplier = results[0] === '💎' ? 10 : results[0] === '7️⃣' ? 7 : 5;
            const winAmount = bet * multiplier;
            stats.totalWins++;
            updateBalance(winAmount);
            showMessage('slot-message', `JACKPOT! Você ganhou $${winAmount}! (${multiplier}x)`, 'win');
            playSound('win');
        } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
            const winAmount = bet * 2;
            stats.totalWins++;
            updateBalance(winAmount);
            showMessage('slot-message', `Par! Você ganhou $${winAmount}! (2x)`, 'win');
            playSound('win');
        } else {
            showMessage('slot-message', `Você perdeu $${bet}`, 'lose');
            playSound('lose');
        }
        
        isSpinning = false;
    }, 1000);
}

// ============================================
// ROULETTE
// ============================================
let selectedBet = null;
let isSpinningRoulette = false;

function betRoulette(color) {
    if (isSpinningRoulette) return;
    
    const bet = parseInt(document.getElementById('roulette-bet').value);
    if (bet > balance || bet <= 0) {
        showMessage('roulette-message', 'Aposta inválida!', 'info');
        return;
    }

    isSpinningRoulette = true;
    selectedBet = color;
    stats.totalGames++;
    updateBalance(-bet);

    const wheel = document.getElementById('roulette-wheel');
    const spins = Math.floor(Math.random() * 5) + 5;
    const rotation = spins * 360 + Math.floor(Math.random() * 360);
    
    wheel.style.transform = `rotate(${rotation}deg)`;
    playSound('spin');

    setTimeout(() => {
        const result = Math.floor(Math.random() * 37); // 0-36
        let resultColor;
        
        if (result === 0) {
            resultColor = 'green';
        } else if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(result)) {
            resultColor = 'red';
        } else {
            resultColor = 'black';
        }

        // Add to history
        addToRouletteHistory(result, resultColor);

        if (resultColor === selectedBet) {
            const multiplier = selectedBet === 'green' ? 35 : 2;
            const winAmount = bet * multiplier;
            stats.totalWins++;
            updateBalance(winAmount);
            showMessage('roulette-message', `${result} ${resultColor.toUpperCase()}! Você ganhou $${winAmount}! (${multiplier}x)`, 'win');
            playSound('win');
        } else {
            showMessage('roulette-message', `${result} ${resultColor.toUpperCase()}! Você perdeu $${bet}`, 'lose');
            playSound('lose');
        }

        wheel.style.transform = 'rotate(0deg)';
        isSpinningRoulette = false;
    }, 3000);
}

function addToRouletteHistory(number, color) {
    rouletteHistory.unshift({ number, color });
    if (rouletteHistory.length > 10) rouletteHistory.pop();
    
    const historyContainer = document.getElementById('roulette-history');
    historyContainer.innerHTML = '';
    
    rouletteHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = `history-item ${item.color}`;
        historyItem.textContent = item.number;
        historyContainer.appendChild(historyItem);
    });
}

// ============================================
// BLACKJACK
// ============================================
function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = [];

    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }

    return deck.sort(() => Math.random() - 0.5);
}

function getCardValue(card) {
    if (card.value === 'A') return 11;
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    return parseInt(card.value);
}

function calculateScore(hand) {
    let score = hand.reduce((sum, card) => sum + getCardValue(card), 0);
    let aces = hand.filter(card => card.value === 'A').length;

    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}

function displayCard(card, hidden = false) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    
    if (hidden) {
        cardDiv.classList.add('hidden');
        cardDiv.textContent = '?';
    } else {
        if (card.suit === '♥' || card.suit === '♦') {
            cardDiv.classList.add('red');
        }
        cardDiv.textContent = card.value + card.suit;
    }
    
    return cardDiv;
}

function startBlackjack() {
    const bet = parseInt(document.getElementById('blackjack-bet').value);
    if (bet > balance || bet <= 0) {
        showMessage('blackjack-message', 'Aposta inválida!', 'info');
        return;
    }

    currentBet = bet;
    stats.totalGames++;
    updateBalance(-bet);

    blackjackDeck = createDeck();
    playerHand = [blackjackDeck.pop(), blackjackDeck.pop()];
    dealerHand = [blackjackDeck.pop(), blackjackDeck.pop()];

    updateBlackjackDisplay();

    document.getElementById('bj-start').style.display = 'none';
    document.getElementById('bj-hit').style.display = 'inline-block';
    document.getElementById('bj-stand').style.display = 'inline-block';
    document.getElementById('bj-surrender').style.display = 'inline-block';

    playSound('deal');

    if (calculateScore(playerHand) === 21) {
        setTimeout(() => endBlackjack(), 500);
    }
}

function hit() {
    playerHand.push(blackjackDeck.pop());
    updateBlackjackDisplay();
    playSound('deal');

    if (calculateScore(playerHand) > 21) {
        setTimeout(() => endBlackjack(), 500);
    }
}

function stand() {
    document.getElementById('bj-surrender').style.display = 'none';
    
    while (calculateScore(dealerHand) < 17) {
        dealerHand.push(blackjackDeck.pop());
        updateBlackjackDisplay(true);
    }
    
    setTimeout(() => endBlackjack(), 500);
}

function surrender() {
    const returnAmount = Math.floor(currentBet * 0.5);
    updateBalance(returnAmount);
    showMessage('blackjack-message', `Você desistiu. Recebeu $${returnAmount} de volta (50%)`, 'info');
    resetBlackjackButtons();
}

function updateBlackjackDisplay(revealDealer = false) {
    const playerCards = document.getElementById('player-cards');
    const dealerCards = document.getElementById('dealer-cards');
    
    playerCards.innerHTML = '';
    dealerCards.innerHTML = '';

    playerHand.forEach(card => playerCards.appendChild(displayCard(card)));
    dealerHand.forEach((card, index) => {
        dealerCards.appendChild(displayCard(card, !revealDealer && index === 1));
    });

    document.getElementById('player-score').textContent = 'Pontos: ' + calculateScore(playerHand);
    document.getElementById('dealer-score').textContent = revealDealer ? 
        'Pontos: ' + calculateScore(dealerHand) : 'Pontos: ' + getCardValue(dealerHand[0]);
}

function endBlackjack() {
    updateBlackjackDisplay(true);

    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);

    resetBlackjackButtons();

    if (playerScore > 21) {
        showMessage('blackjack-message', `Estourou! (${playerScore}) Você perdeu $${currentBet}`, 'lose');
        playSound('lose');
    } else if (dealerScore > 21 || playerScore > dealerScore) {
        const winAmount = currentBet * 2;
        stats.totalWins++;
        updateBalance(winAmount);
        showMessage('blackjack-message', `Você ganhou! (${playerScore} vs ${dealerScore}) +$${winAmount}`, 'win');
        playSound('win');
    } else if (playerScore === dealerScore) {
        updateBalance(currentBet);
        showMessage('blackjack-message', `Empate! (${playerScore}) Aposta devolvida`, 'info');
        playSound('push');
    } else {
        showMessage('blackjack-message', `Dealer ganhou! (${dealerScore} vs ${playerScore}) -$${currentBet}`, 'lose');
        playSound('lose');
    }
}

function resetBlackjackButtons() {
    document.getElementById('bj-hit').style.display = 'none';
    document.getElementById('bj-stand').style.display = 'none';
    document.getElementById('bj-surrender').style.display = 'none';
    document.getElementById('bj-start').style.display = 'inline-block';
}

// ============================================
// CRAPS (DADOS)
// ============================================
const diceSymbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
let isRolling = false;

function rollDice() {
    if (isRolling) return;
    
    const bet = parseInt(document.getElementById('craps-bet').value);
    if (bet > balance || bet <= 0) {
        showMessage('craps-message', 'Aposta inválida!', 'info');
        return;
    }

    isRolling = true;
    stats.totalGames++;
    updateBalance(-bet);

    const die1 = document.getElementById('die1');
    const die2 = document.getElementById('die2');

    die1.classList.add('rolling');
    die2.classList.add('rolling');
    playSound('roll');

    setTimeout(() => {
        const roll1 = Math.floor(Math.random() * 6) + 1;
        const roll2 = Math.floor(Math.random() * 6) + 1;
        const total = roll1 + roll2;

        die1.textContent = diceSymbols[roll1 - 1];
        die2.textContent = diceSymbols[roll2 - 1];
        die1.classList.remove('rolling');
        die2.classList.remove('rolling');

        document.getElementById('dice-result').textContent = `Resultado: ${total}`;

        // Add to history
        addToCrapsHistory(total);

        if (total === 7 || total === 11) {
            const winAmount = bet * 2;
            stats.totalWins++;
            updateBalance(winAmount);
            showMessage('craps-message', `Vitória! (${total}) Você ganhou $${winAmount}! (2x)`, 'win');
            playSound('win');
        } else if (total === 2 || total === 3 || total === 12) {
            showMessage('craps-message', `Craps! (${total}) Você perdeu $${bet}`, 'lose');
            playSound('lose');
        } else {
            updateBalance(bet);
            showMessage('craps-message', `Empate! (${total}) Aposta devolvida`, 'info');
            playSound('push');
        }
        
        isRolling = false;
    }, 1000);
}

function addToCrapsHistory(total) {
    crapsHistory.unshift(total);
    if (crapsHistory.length > 10) crapsHistory.pop();
    
    const historyContainer = document.getElementById('craps-history');
    historyContainer.innerHTML = '';
    
    crapsHistory.forEach(num => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        if (num === 7 || num === 11) {
            historyItem.classList.add('win');
            historyItem.style.background = 'var(--green)';
            historyItem.style.borderColor = 'var(--green)';
            historyItem.style.color = 'white';
        } else if (num === 2 || num === 3 || num === 12) {
            historyItem.classList.add('lose');
            historyItem.style.background = 'var(--red)';
            historyItem.style.borderColor = 'var(--red)';
            historyItem.style.color = 'white';
        } else {
            historyItem.classList.add('draw');
            historyItem.style.background = 'var(--gold)';
            historyItem.style.borderColor = 'var(--gold)';
            historyItem.style.color = 'var(--dark)';
        }
        
        historyItem.textContent = num;
        historyContainer.appendChild(historyItem);
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function showMessage(elementId, text, type) {
    const msg = document.getElementById(elementId);
    msg.textContent = text;
    msg.className = `message ${type}`;
    msg.style.display = 'block';

    setTimeout(() => {
        msg.style.display = 'none';
    }, 4000);
}

function showNotification(text, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `message ${type}`;
    notification.textContent = text;
    notification.style.position = 'fixed';
    notification.style.top = '2rem';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.zIndex = '9999';
    notification.style.maxWidth = '90%';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ============================================
// SOUND SYSTEM
// ============================================
function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('sound-toggle');
    btn.textContent = soundEnabled ? '🔊' : '🔇';
    btn.classList.toggle('muted');
}

function playSound(type) {
    if (!soundEnabled) return;
    
    // Visual feedback since we can't play actual audio files
    const soundFeedback = {
        'win': '🎉',
        'lose': '😢',
        'spin': '🎡',
        'roll': '🎲',
        'deal': '🃏',
        'push': '🤝'
    };
    
    if (soundFeedback[type]) {
        const feedback = document.createElement('div');
        feedback.textContent = soundFeedback[type];
        feedback.style.position = 'fixed';
        feedback.style.top = '50%';
        feedback.style.left = '50%';
        feedback.style.transform = 'translate(-50%, -50%)';
        feedback.style.fontSize = '5rem';
        feedback.style.zIndex = '9999';
        feedback.style.pointerEvents = 'none';
        feedback.style.animation = 'soundPop 0.5s ease';
        
        document.body.appendChild(feedback);
        
        setTimeout(() => feedback.remove(), 500);
    }
}

// Add sound pop animation
const style = document.createElement('style');
style.textContent = `
    @keyframes soundPop {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ============================================
// AUTO PLAY (BONUS FEATURE)
// ============================================
let autoPlayInterval = null;

function autoPlay(game) {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
        showNotification('Auto Play desativado', 'info');
        return;
    }
    
    if (game === 'slots') {
        showNotification('Auto Play ativado! Clique novamente para parar', 'info');
        autoPlayInterval = setInterval(() => {
            if (!isSpinning) {
                spinSlots();
            }
        }, 2000);
    }
}

// Clear auto play when changing games
const originalSelectGame = selectGame;
selectGame = function(game) {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
    originalSelectGame(game);
};