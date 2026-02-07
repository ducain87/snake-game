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
        this.setupDirectionControls(); // BUG FIX #3

        // Initial render
        this.render();
    }

    // BUG FIX #1: Properly bind keyboard input event handlers
    // Supports both arrow keys and WASD keys for movement
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (this.game.gameOver) return;

            switch(e.key) {
                // Arrow keys and WASD for movement
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
                // Space bar for pause
                case ' ':
                    e.preventDefault();
                    this.togglePause();
                    break;
            }
        });
        // BUG FIX: Keyboard events now properly handled with preventDefault
    }

    setupButtonControls() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');

        startBtn.addEventListener('click', () => this.start());
        pauseBtn.addEventListener('click', () => this.togglePause());
        resetBtn.addEventListener('click', () => this.reset());
    }

    // BUG FIX #3: 터치/모바일 디바이스를 위한 화면 방향키 버튼
    setupDirectionControls() {
        const upBtn = document.getElementById('upBtn');
        const downBtn = document.getElementById('downBtn');
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');

        // 버튼 클릭 이벤트
        upBtn.addEventListener('click', () => {
            if (!this.game.gameOver) {
                this.game.changeDirection(DIRECTION.UP);
            }
        });

        downBtn.addEventListener('click', () => {
            if (!this.game.gameOver) {
                this.game.changeDirection(DIRECTION.DOWN);
            }
        });

        leftBtn.addEventListener('click', () => {
            if (!this.game.gameOver) {
                this.game.changeDirection(DIRECTION.LEFT);
            }
        });

        rightBtn.addEventListener('click', () => {
            if (!this.game.gameOver) {
                this.game.changeDirection(DIRECTION.RIGHT);
            }
        });

        // 터치 이벤트 지원 (모바일)
        [upBtn, downBtn, leftBtn, rightBtn].forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault(); // 더블탭 줌 방지
                btn.click();
            });
        });
        // BUG FIX: 이제 좌측 버튼(←)을 포함한 모든 방향키 버튼이 정상 작동합니다
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
    console.log('Touch controls available for mobile devices!');
});
