// Main Controller - Integrates Game Logic and Renderer

class GameController {
    constructor() {
        this.game = null;
        this.renderer = null;
        this.uiManager = null;
        this.gameLoop = null;
        this.fps = 10; // Game speed (moves per second)
        
        this.init();
    }

    init() {
        // Initialize game
        this.game = new Game(20, 20);
        this.renderer = new Renderer('gameCanvas', 20);
        this.uiManager = new UIManager();

        // Setup controls
        this.setupKeyboardControls();
        this.setupButtonControls();

        // Initial render
        this.render();
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (this.game.gameOver) return;

            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    this.game.changeDirection(DIRECTION.UP);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    this.game.changeDirection(DIRECTION.DOWN);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.game.changeDirection(DIRECTION.LEFT);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.game.changeDirection(DIRECTION.RIGHT);
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePause();
                    break;
            }
        });
    }

    setupButtonControls() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');

        startBtn.addEventListener('click', () => this.start());
        pauseBtn.addEventListener('click', () => this.togglePause());
        resetBtn.addEventListener('click', () => this.reset());
    }

    start() {
        if (this.gameLoop) {
            return; // Already running
        }

        if (this.game.gameOver) {
            this.reset();
        }

        this.gameLoop = setInterval(() => {
            this.update();
            this.render();
        }, 1000 / this.fps);
    }

    togglePause() {
        if (this.game.gameOver) return;

        this.game.togglePause();
        
        if (this.game.paused) {
            this.renderer.drawPaused();
        } else {
            this.render();
        }
    }

    reset() {
        // Stop game loop
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }

        // Reset game
        this.game.reset();
        this.uiManager.updateScore(0);
        this.render();
    }

    update() {
        if (this.game.paused) return;

        this.game.update();

        // Update UI
        const state = this.game.getState();
        this.uiManager.updateScore(state.score);

        // Check game over
        if (this.game.gameOver) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }

    render() {
        const state = this.game.getState();
        this.renderer.render(state, this.game.gridSize);

        if (state.gameOver) {
            this.renderer.drawGameOver();
        } else if (state.paused) {
            this.renderer.drawPaused();
        }
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const gameController = new GameController();
    
    // Auto-start message
    console.log('🐍 Snake Game loaded! Press Start button or use arrow keys to play.');
    console.log('Controls: Arrow keys or WASD to move, Space to pause');
});
