class Graph2DLogic {
    constructor(WIN, canvas) {
        this.WIN = WIN;
        this.canvas = canvas;
        this.funcs = [];
        this.canMove = false;
        this.derivativeX = 0;
        this.ZOOM = 0.5;
        this.DX = 0.001;
    }

    // Координатные преобразования
    sx(x) {
        return x * (this.WIN.WIDTH / this.canvas.canvas.width);
    }

    sy(y) {
        return -y * (this.WIN.HEIGHT / this.canvas.canvas.height);
    }

    // Управление функциями
    addFunction(f, num, color = 'blue', printDer = false) {
        this.funcs[num] = { f, color, printDer };
    }

    delFunction(num) {
        this.funcs[num] = null;
    }

    // Обработка событий
    handleMouseDown = () => this.canMove = true;
    handleMouseUp = () => this.canMove = false;
    handleMouseLeave = () => this.canMove = false;

    handleMouseMove(e) {
        if (this.canMove) {
            this.WIN.LEFT -= this.sx(e.movementX);
            this.WIN.BOTTOM += this.sy(e.movementY);
        }
        this.derivativeX = this.WIN.LEFT + this.sx(e.offsetX);
    }

    handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? this.ZOOM : -this.ZOOM;
        this.WIN.WIDTH += delta;
        this.WIN.HEIGHT += delta;
        this.WIN.LEFT -= delta / 2;
        this.WIN.BOTTOM -= delta / 2;
    }

    // Отрисовка
    render() {
        this.canvas.clear();
        this.drawGrid();
        this.funcs.forEach(func => func && this.drawFunction(func));
    }

    drawGrid() {
        // Сетка
        for (let x = Math.ceil(this.WIN.LEFT); x < this.WIN.LEFT + this.WIN.WIDTH; x++) {
            this.canvas.line(x, this.WIN.BOTTOM, x, this.WIN.BOTTOM + this.WIN.HEIGHT, '#EEE');
        }
        for (let y = Math.ceil(this.WIN.BOTTOM); y < this.WIN.BOTTOM + this.WIN.HEIGHT; y++) {
            this.canvas.line(this.WIN.LEFT, y, this.WIN.LEFT + this.WIN.WIDTH, y, '#EEE');
        }

        // Оси
        this.canvas.line(this.WIN.LEFT, 0, this.WIN.LEFT + this.WIN.WIDTH, 0, 'green', 2);
        this.canvas.line(0, this.WIN.BOTTOM, 0, this.WIN.BOTTOM + this.WIN.HEIGHT, 'green', 2);

        // Стрелки
        this.canvas.line(this.WIN.LEFT + this.WIN.WIDTH, 0, this.WIN.LEFT + this.WIN.WIDTH - 0.5, 0.5, 'green', 2);
        this.canvas.line(this.WIN.LEFT + this.WIN.WIDTH, 0, this.WIN.LEFT + this.WIN.WIDTH - 0.5, -0.5, 'green', 2);
        this.canvas.line(0, this.WIN.BOTTOM + this.WIN.HEIGHT, 0.5, this.WIN.BOTTOM + this.WIN.HEIGHT - 0.5, 'green', 2);
        this.canvas.line(0, this.WIN.BOTTOM + this.WIN.HEIGHT, -0.5, this.WIN.BOTTOM + this.WIN.HEIGHT - 0.5, 'green', 2);
    }

    drawFunction(func) {
        const dx = this.WIN.WIDTH / 500;
        let x = this.WIN.LEFT;
        while (x < this.WIN.LEFT + this.WIN.WIDTH) {
            try {
                const y1 = func.f(x);
                const y2 = func.f(x + dx);
                this.canvas.line(x, y1, x + dx, y2, func.color);
            } catch(e) {}
            x += dx;
        }

        if (func.printDer) {
            const k = (func.f(this.derivativeX + this.DX) - func.f(this.derivativeX)) / this.DX;
            const b = func.f(this.derivativeX) - k * this.derivativeX;
            this.canvas.line(
                this.WIN.LEFT, 
                k * this.WIN.LEFT + b, 
                this.WIN.LEFT + this.WIN.WIDTH, 
                k * (this.WIN.LEFT + this.WIN.WIDTH) + b, 
                'black'
            );
            this.canvas.point(this.derivativeX, func.f(this.derivativeX), 'green');
        }
    }
}