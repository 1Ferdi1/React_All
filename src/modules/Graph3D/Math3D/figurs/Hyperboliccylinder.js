import Figure from '../entities/Figure';
import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class HyperbolicCylinder extends Figure {
    constructor(
        segments = 10,
        scale = 5
    ) {
        super();
        this._segments = segments;
        this._scale = scale;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        
        this.generateGeometry();
    }

    // Геттеры и сеттеры с валидацией
    get segments() {
        return this._segments;
    }

    set segments(value) {
        this._segments = Math.max(3, Math.floor(value));
        this.generateGeometry();
    }

    get scale() {
        return this._scale;
    }

    set scale(value) {
        this._scale = Math.max(0.1, value);
        this.generateGeometry();
    }

    generateGeometry() {
        this.points = [];
        this.edges = [];
        this.polygons = [];
        this.generatePoints();
        this.generateEdges();
        this.generatePolygons();
    }

    generatePoints() {
        const segments = this._segments;
        const scale = this._scale;

        // Первая часть (положительная)
        for (let i = -segments; i < segments; i++) {
            for (let j = 0; j < segments; j++) {
                const x = i + scale / segments;
                const y = x * x / scale;
                const z = j - scale;
                this.points.push(new Point(x, y, z));
            }
        }

        // Вторая часть (отрицательная)
        for (let i = -segments; i < segments; i++) {
            for (let j = 0; j < segments; j++) {
                const x = i - scale / segments;
                const y = x * x / -scale;
                const z = j + scale;
                this.points.push(new Point(x, y, z));
            }
        }
    }

    generateEdges() {
        const totalPoints = this.points.length;
        const halfPoints = totalPoints / 2;
        const segments = this._segments;
        const pointsPerRow = 2 * segments;
        
        // Ребра для первой части
        for (let i = 0; i < halfPoints; i++) {
            // Горизонтальные ребра
            if ((i + 1) % pointsPerRow !== 0) {
                this.edges.push(new Edge(i, i + 1));
            }
            // Вертикальные ребра
            if (i + pointsPerRow < halfPoints) {
                this.edges.push(new Edge(i, i + pointsPerRow));
            }
        }
        
        // Ребра для второй части
        for (let i = halfPoints; i < totalPoints; i++) {
            const relativeIndex = i - halfPoints;
            // Горизонтальные ребра
            if ((relativeIndex + 1) % pointsPerRow !== 0) {
                this.edges.push(new Edge(i, i + 1));
            }
            // Вертикальные ребра
            if (relativeIndex + pointsPerRow < halfPoints) {
                this.edges.push(new Edge(i, i + pointsPerRow));
            }
        }
    }

    generatePolygons() {
        const totalPoints = this.points.length;
        const halfPoints = totalPoints / 2;
        const segments = this._segments;
        const pointsPerRow = 2 * segments;
        
        // Полигоны для первой части
        for (let i = 0; i < halfPoints - pointsPerRow; i++) {
            if ((i + 1) % pointsPerRow !== 0) {
                this.polygons.push(new Polygon([
                    i,
                    i + 1,
                    i + 1 + pointsPerRow,
                    i + pointsPerRow
                ], '#00FF00'));
            }
        }
        
        // Полигоны для второй части
        for (let i = halfPoints; i < totalPoints - pointsPerRow; i++) {
            const relativeIndex = i - halfPoints;
            if ((relativeIndex + 1) % pointsPerRow !== 0) {
                this.polygons.push(new Polygon([
                    i,
                    i + 1,
                    i + 1 + pointsPerRow,
                    i + pointsPerRow
                ], '#00FF00'));
            }
        }
    }

    settings() {
        return (
            <div>
                <label>
                    Количество сегментов:
                    <input
                        type="number"
                        min="3"
                        step="1"
                        value={this.segments}
                        onChange={e => this.segments = parseInt(e.target.value, 10)}
                    />
                </label>
                <label>
                    Масштаб:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.scale}
                        onChange={e => this.scale = parseFloat(e.target.value)}
                    />
                </label>
            </div>
        );
    }
}

export default HyperbolicCylinder;