import Figure from '../entities/Figure';
import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class ParabolicCylinder extends Figure {
    constructor(
        xSegments = 20,
        zSegments = 20,
        size = 5
    ) {
        super();
        this._xSegments = Math.max(2, Math.floor(xSegments));
        this._zSegments = Math.max(2, Math.floor(zSegments));
        this._size = Math.max(0.1, size);

        this.points = [];
        this.edges = [];
        this.polygons = [];

        this.generateGeometry();
    }

    get xSegments() { return this._xSegments; }
    set xSegments(value) {
        this._xSegments = Math.max(2, Math.floor(value));
        this.generateGeometry();
    }

    get zSegments() { return this._zSegments; }
    set zSegments(value) {
        this._zSegments = Math.max(2, Math.floor(value));
        this.generateGeometry();
    }

    get size() { return this._size; }
    set size(value) {
        this._size = Math.max(0.1, value);
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
        // x ∈ [-size, size], z ∈ [-size, size]
        const xStep = (2 * this._size) / (this._xSegments - 1);
        const zStep = (2 * this._size) / (this._zSegments - 1);

        for (let i = 0; i < this._xSegments; i++) {
            const x = -this._size + i * xStep;
            const y = (x * x) / this._size;
            for (let j = 0; j < this._zSegments; j++) {
                const z = -this._size + j * zStep;
                this.points.push(new Point(x, y, z));
            }
        }
    }

    generateEdges() {
        // Вдоль x (по z)
        for (let i = 0; i < this._xSegments; i++) {
            for (let j = 0; j < this._zSegments; j++) {
                const idx = i * this._zSegments + j;
                // Вдоль z
                if (j < this._zSegments - 1) {
                    this.edges.push(new Edge(idx, idx + 1));
                }
                // Вдоль x
                if (i < this._xSegments - 1) {
                    this.edges.push(new Edge(idx, idx + this._zSegments));
                }
            }
        }
    }

    generatePolygons() {
        for (let i = 0; i < this._xSegments - 1; i++) {
            for (let j = 0; j < this._zSegments - 1; j++) {
                const idx = i * this._zSegments + j;
                this.polygons.push(new Polygon([
                    idx,
                    idx + 1,
                    idx + 1 + this._zSegments,
                    idx + this._zSegments
                ], '#00BFFF'));
            }
        }
        this.setIndexPolygons();
    }

    settings() {
        return (
            <div>
                <label>
                    Сегменты по X:
                    <input
                        type="number"
                        min="2"
                        step="1"
                        value={this.xSegments}
                        onChange={e => this.xSegments = parseInt(e.target.value, 10)}
                    />
                </label>
                <label>
                    Сегменты по Z:
                    <input
                        type="number"
                        min="2"
                        step="1"
                        value={this.zSegments}
                        onChange={e => this.zSegments = parseInt(e.target.value, 10)}
                    />
                </label>
                <label>
                    Размер области:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.size}
                        onChange={e => this.size = parseFloat(e.target.value)}
                    />
                </label>
            </div>
        );
    }
}

export default ParabolicCylinder;
