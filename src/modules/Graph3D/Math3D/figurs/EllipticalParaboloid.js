import Figure from '../entities/Figure';
import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class EllipticalParaboloid extends Figure {
    constructor(
        radialSegments = 20,
        heightSegments = 10,
        maxHeight = 10,
        a = 7,
        b = 4
    ) {
        super();
        this._radialSegments = radialSegments;
        this._heightSegments = heightSegments;
        this._maxHeight = maxHeight;
        this._a = a;
        this._b = b;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        
        this.generateGeometry();
    }

    // Геттеры и сеттеры с валидацией
    get radialSegments() {
        return this._radialSegments;
    }

    set radialSegments(value) {
        this._radialSegments = Math.max(3, Math.floor(value));
        this.generateGeometry();
    }

    get heightSegments() {
        return this._heightSegments;
    }

    set heightSegments(value) {
        this._heightSegments = Math.max(2, Math.floor(value));
        this.generateGeometry();
    }

    get maxHeight() {
        return this._maxHeight;
    }

    set maxHeight(value) {
        this._maxHeight = Math.max(0.1, value);
        this.generateGeometry();
    }

    get a() {
        return this._a;
    }

    set a(value) {
        this._a = Math.max(0.1, value);
        this.generateGeometry();
    }

    get b() {
        return this._b;
    }

    set b(value) {
        this._b = Math.max(0.1, value);
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
        const radialStep = (2 * Math.PI) / this._radialSegments;
        const maxU = Math.sqrt(this._maxHeight);
        const heightStep = maxU / (this._heightSegments - 1);
        
        for (let h = 0; h < this._heightSegments; h++) {
            const u = h * heightStep;
            
            for (let r = 0; r < this._radialSegments; r++) {
                const angle = r * radialStep;
                const x = this._a * u * Math.cos(angle);
                const y = u * u;
                const z = this._b * u * Math.sin(angle);
                
                this.points.push(new Point(x, y, z));
            }
        }
    }

    generateEdges() {
        // Горизонтальные ребра (кольца)
        for (let h = 0; h < this._heightSegments; h++) {
            const ringStart = h * this._radialSegments;
            for (let r = 0; r < this._radialSegments; r++) {
                this.edges.push(new Edge(
                    ringStart + r,
                    ringStart + (r + 1) % this._radialSegments
                ));
            }
        }
        
        // Вертикальные ребра (меридианы)
        for (let r = 0; r < this._radialSegments; r++) {
            for (let h = 0; h < this._heightSegments - 1; h++) {
                this.edges.push(new Edge(
                    h * this._radialSegments + r,
                    (h + 1) * this._radialSegments + r
                ));
            }
        }
    }

    generatePolygons() {
    for (let h = 0; h < this._heightSegments - 1; h++) {
        for (let r = 0; r < this._radialSegments; r++) {
            const current = h * this._radialSegments + r;
            const next = h * this._radialSegments + (r + 1) % this._radialSegments;
            const below = (h + 1) * this._radialSegments + r;
            const nextBelow = (h + 1) * this._radialSegments + (r + 1) % this._radialSegments;

            this.polygons.push(new Polygon([current, next, nextBelow, below], '#00FF00'));
        }
    }
    this.setIndexPolygons();
}

    settings() {
        return (
            <div>
                <label>
                    Радиальные сегменты:
                    <input
                        type="number"
                        min="3"
                        step="1"
                        value={this.radialSegments}
                        onChange={e => this.radialSegments = parseInt(e.target.value, 10)}
                    />
                </label>
                <label>
                    Сегменты по высоте:
                    <input
                        type="number"
                        min="2"
                        step="1"
                        value={this.heightSegments}
                        onChange={e => this.heightSegments = parseInt(e.target.value, 10)}
                    />
                </label>
                <label>
                    Максимальная высота:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.maxHeight}
                        onChange={e => this.maxHeight = parseFloat(e.target.value)}
                    />
                </label>
                <label>
                    Коэффициент A:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.a}
                        onChange={e => this.a = parseFloat(e.target.value)}
                    />
                </label>
                <label>
                    Коэффициент B:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.b}
                        onChange={e => this.b = parseFloat(e.target.value)}
                    />
                </label>
            </div>
        );
    }
}

export default EllipticalParaboloid;