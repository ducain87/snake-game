// Game Logic - Snake Game Engine

// Direction constants
const DIRECTION = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
};

// Direction vectors
const DIRECTION_VECTORS = {
    'UP': { x: 0, y: -1 },
    'DOWN': { x: 0, y: 1 },
    'LEFT': { x: -1, y: 0 },
    'RIGHT': { x: 1, y: 0 }
};

// Snake class
class Snake {
    constructor(gridSize) {
        this.gridSize = gridSize;
        // Start in the middle
        const center = Math.floor(gridSize / 2);
        this.body = [
            { x: center, y: center },
            { x: center - 1, y: center },
            { x: center - 2, y: center }
        ];
        this.direction = DIRECTION.RIGHT;
        this.nextDirection = DIRECTION.RIGHT;
        this.growing = false;
    }

    move() {
        // Update direction (prevent 180-degree turn)
        this.direction = this.nextDirection;

        // Get direction vector
        const dirVector = DIRECTION_VECTORS[this.direction];

        // Calculate new head position
        const head = this.body[0];
        const newHead = {
            x: head.x + dirVector.x,
            y: head.y + dirVector.y
        };

        // Add new head
        this.body.unshift(newHead);

        // Remove tail if not growing
        if (!this.growing) {
            this.body.pop();
        } else {
            this.growing = false;
        }
    }

    grow() {
        this.growing = true;
    }

    // BUG FIX #2: Prevent 180-degree turn causing game over
    // CRITICAL BUG FIX: Use string-based direction comparison
    changeDirection(newDirection) {
        // Prevent 180-degree turn
        const opposite = {
            'UP': 'DOWN',
            'DOWN': 'UP',
            'LEFT': 'RIGHT',
            'RIGHT': 'LEFT'
        };

        // Only change direction if it's not the opposite of current direction
        if (newDirection !== opposite[this.direction]) {
            this.nextDirection = newDirection;
        }
    }

    getHead() {
        return this.body[0];
    }

    checkSelfCollision() {
        const head = this.getHead();
        // Check if head collides with body (skip head itself)
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }
}

// Game class
class Game {
    constructor(gridSize = 20, cellSize = 20) {
        this.gridSize = gridSize;
        this.cellSize = cellSize;
        this.snake = new Snake(gridSize);
        this.food = null;
        this.score = 0;
        this.gameOver = false;
        this.paused = false;
        
        this.generateFood();
    }

    update() {
        if (this.gameOver || this.paused) {
            return;
        }

        // Move snake
        this.snake.move();

        // Check wall collision
        const head = this.snake.getHead();
        if (head.x < 0 || head.x >= this.gridSize ||
            head.y < 0 || head.y >= this.gridSize) {
            this.gameOver = true;
            return;
        }

        // Check self collision
        if (this.snake.checkSelfCollision()) {
            this.gameOver = true;
            return;
        }

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.snake.grow();
            this.generateFood();
        }
    }

    generateFood() {
        let newFood;
        let validPosition = false;

        while (!validPosition) {
            newFood = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };

            // Check if food is not on snake body
            validPosition = !this.snake.body.some(
                segment => segment.x === newFood.x && segment.y === newFood.y
            );
        }

        this.food = newFood;
    }

    changeDirection(direction) {
        this.snake.changeDirection(direction);
    }

    togglePause() {
        this.paused = !this.paused;
    }

    reset() {
        this.snake = new Snake(this.gridSize);
        this.score = 0;
        this.gameOver = false;
        this.paused = false;
        this.generateFood();
    }

    getState() {
        return {
            snake: this.snake.body,
            food: this.food,
            score: this.score,
            gameOver: this.gameOver,
            paused: this.paused
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Game, DIRECTION };
}
