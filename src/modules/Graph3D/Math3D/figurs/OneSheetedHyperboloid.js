import Figure from '../entities/Figure';
import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class OneSheetedHyperboloid extends Figure {
    constructor(
        radialSegments = 32,
        heightSegments = 20,
        a = 1,
        b = 1,
        c = 1,
        heightScale = 1.5 // Лучше использовать масштаб высоты, а не угол
    ) {
        super();
        this._radialSegments = Math.max(3, Math.floor(radialSegments));
        this._heightSegments = Math.max(2, Math.floor(heightSegments));
        this._a = Math.max(0.1, a);
        this._b = Math.max(0.1, b);
        this._c = Math.max(0.1, c);
        this._heightScale = Math.max(0.1, heightScale);

        this.points = [];
        this.edges = [];
        this.polygons = [];

        this.generateGeometry();
    }

    // Геттеры и сеттеры с валидацией
    get radialSegments() { return this._radialSegments; }
    set radialSegments(value) {
        this._radialSegments = Math.max(3, Math.floor(value));
        this.generateGeometry();
    }

    get heightSegments() { return this._heightSegments; }
    set heightSegments(value) {
        this._heightSegments = Math.max(2, Math.floor(value));
        this.generateGeometry();
    }

    get a() { return this._a; }
    set a(value) {
        this._a = Math.max(0.1, value);
        this.generateGeometry();
    }

    get b() { return this._b; }
    set b(value) {
        this._b = Math.max(0.1, value);
        this.generateGeometry();
    }

    get c() { return this._c; }
    set c(value) {
        this._c = Math.max(0.1, value);
        this.generateGeometry();
    }

    get heightScale() { return this._heightScale; }
    set heightScale(value) {
        this._heightScale = Math.max(0.1, value);
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
        const uStep = (2 * Math.PI) / this._radialSegments;
        const vMin = -this._heightScale;
        const vMax = this._heightScale;
        const vStep = (vMax - vMin) / (this._heightSegments - 1);

        for (let i = 0; i < this._heightSegments; i++) {
            const v = vMin + i * vStep;
            const coshV = Math.cosh(v);
            const sinhV = Math.sinh(v);

            for (let j = 0; j < this._radialSegments; j++) {
                const u = j * uStep;
                const x = this._a * coshV * Math.cos(u);
                const y = this._c * sinhV;
                const z = this._b * coshV * Math.sin(u);
                this.points.push(new Point(x, y, z));
            }
        }
    }

    generateEdges() {
        // Горизонтальные ребра (кольца)
        for (let i = 0; i < this._heightSegments; i++) {
            const ringStart = i * this._radialSegments;
            for (let j = 0; j < this._radialSegments; j++) {
                this.edges.push(new Edge(
                    ringStart + j,
                    ringStart + (j + 1) % this._radialSegments
                ));
            }
        }
        // Вертикальные ребра (меридианы)
        for (let j = 0; j < this._radialSegments; j++) {
            for (let i = 0; i < this._heightSegments - 1; i++) {
                this.edges.push(new Edge(
                    i * this._radialSegments + j,
                    (i + 1) * this._radialSegments + j
                ));
            }
        }
    }

    generatePolygons() {
        for (let i = 0; i < this._heightSegments - 1; i++) {
            for (let j = 0; j < this._radialSegments; j++) {
                const current = i * this._radialSegments + j;
                const next = i * this._radialSegments + (j + 1) % this._radialSegments;
                const below = (i + 1) * this._radialSegments + j;
                const belowNext = (i + 1) * this._radialSegments + (j + 1) % this._radialSegments;

                this.polygons.push(new Polygon(
                    [current, next, belowNext, below],
                    '#00FF00'
                ));
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
                    Вертикальные сегменты:
                    <input
                        type="number"
                        min="2"
                        step="1"
                        value={this.heightSegments}
                        onChange={e => this.heightSegments = parseInt(e.target.value, 10)}
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
                <label>
                    Коэффициент C:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.c}
                        onChange={e => this.c = parseFloat(e.target.value)}
                    />
                </label>
                <label>
                    Масштаб высоты:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.heightScale}
                        onChange={e => this.heightScale = parseFloat(e.target.value)}
                    />
                </label>
            </div>
        );
    }
}

export default OneSheetedHyperboloid;
