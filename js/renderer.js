// Renderer - Canvas Drawing and UI Updates

class Renderer {
    constructor(canvasId, cellSize = 20) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = cellSize;
        
        // Colors
        this.colors = {
            snake: '#4ade80',      // Green
            snakeHead: '#22c55e',  // Darker green
            food: '#f87171',       // Red
            grid: '#2a2a4e'        // Dark blue
        };
    }

    clear() {
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid(gridSize) {
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 0.5;

        // Draw vertical lines
        for (let i = 0; i <= gridSize; i++) {
            const x = i * this.cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        // Draw horizontal lines
        for (let i = 0; i <= gridSize; i++) {
            const y = i * this.cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawSnake(snakeBody) {
        snakeBody.forEach((segment, index) => {
            const x = segment.x * this.cellSize;
            const y = segment.y * this.cellSize;

            // Different color for head
            if (index === 0) {
                this.ctx.fillStyle = this.colors.snakeHead;
                // Draw head with rounded corners
                this.roundRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2, 4);
            } else {
                this.ctx.fillStyle = this.colors.snake;
                // Draw body segments
                this.ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
            }

            // Add shine effect to head
            if (index === 0) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.fillRect(x + 2, y + 2, this.cellSize / 2, this.cellSize / 2);
            }
        });
    }

    drawFood(food) {
        const x = food.x * this.cellSize;
        const y = food.y * this.cellSize;
        const center = this.cellSize / 2;

        // Draw apple-like food
        this.ctx.fillStyle = this.colors.food;
        this.ctx.beginPath();
        this.ctx.arc(x + center, y + center, center - 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Add highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.beginPath();
        this.ctx.arc(x + center - 3, y + center - 3, 3, 0, Math.PI * 2);
        this.ctx.fill();
    }

    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
        this.ctx.fill();
    }

    render(gameState, gridSize) {
        // Clear canvas
        this.clear();

        // Draw grid
        this.drawGrid(gridSize);

        // Draw food
        if (gameState.food) {
            this.drawFood(gameState.food);
        }

        // Draw snake
        if (gameState.snake) {
            this.drawSnake(gameState.snake);
        }
    }

    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('게임 오버!', this.canvas.width / 2, this.canvas.height / 2);

        this.ctx.font = '20px Arial';
        this.ctx.fillText('재시작 버튼을 눌러주세요', this.canvas.width / 2, this.canvas.height / 2 + 40);
    }

    drawPaused() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('일시정지', this.canvas.width / 2, this.canvas.height / 2);
    }
}

// UI Manager
class UIManager {
    constructor() {
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.highScore = this.loadHighScore();
        this.updateHighScore();
    }

    updateScore(score) {
        this.scoreElement.textContent = score;
        
        if (score > this.highScore) {
            this.highScore = score;
            this.updateHighScore();
            this.saveHighScore();
        }
    }

    updateHighScore() {
        this.highScoreElement.textContent = this.highScore;
    }

    loadHighScore() {
        const saved = localStorage.getItem('snakeHighScore');
        return saved ? parseInt(saved) : 0;
    }

    saveHighScore() {
        localStorage.setItem('snakeHighScore', this.highScore);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Renderer, UIManager };
}
