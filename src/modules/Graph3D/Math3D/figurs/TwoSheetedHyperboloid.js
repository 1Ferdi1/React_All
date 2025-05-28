import Figure from '../entities/Figure';
import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class TwoSheetedHyperboloid extends Figure {
    constructor(
        uSegments = 20, // "count" — сегменты по углу
        vSegments = 20, // сегменты по гиперболе
        a = 1,
        b = 1,
        c = 1,
        vMax = Math.PI // диапазон v
    ) {
        super();
        this._uSegments = Math.max(3, Math.floor(uSegments));
        this._vSegments = Math.max(4, Math.floor(vSegments));
        this._a = Math.max(0.1, a);
        this._b = Math.max(0.1, b);
        this._c = Math.max(0.1, c);
        this._vMax = Math.max(0.1, vMax);

        this.points = [];
        this.edges = [];
        this.polygons = [];

        this.generateGeometry();
    }

    get uSegments() { return this._uSegments; }
    set uSegments(value) {
        this._uSegments = Math.max(3, Math.floor(value));
        this.generateGeometry();
    }

    get vSegments() { return this._vSegments; }
    set vSegments(value) {
        this._vSegments = Math.max(4, Math.floor(value));
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

    get vMax() { return this._vMax; }
    set vMax(value) {
        this._vMax = Math.max(0.1, value);
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
        // Верхний лист
        for (let i = 0; i < this._vSegments; i++) {
            const v = (i / (this._vSegments - 1)) * this._vMax;
            const coshV = Math.cosh(v);
            const sinhV = Math.sinh(v);
            for (let j = 0; j < this._uSegments; j++) {
                const u = (j / this._uSegments) * 2 * Math.PI;
                this.points.push(new Point(
                    this._a * sinhV * Math.cos(u),
                    this._c * coshV,
                    this._b * coshV * Math.sin(u)
                ));
            }
        }
        // Нижний лист
        for (let i = 0; i < this._vSegments; i++) {
            const v = (i / (this._vSegments - 1)) * this._vMax;
            const coshV = Math.cosh(v);
            const sinhV = Math.sinh(v);
            for (let j = 0; j < this._uSegments; j++) {
                const u = (j / this._uSegments) * 2 * Math.PI;
                this.points.push(new Point(
                    -this._a * sinhV * Math.cos(u),
                    -this._c * coshV,
                    -this._b * coshV * Math.sin(u)
                ));
            }
        }
    }

    generateEdges() {
        const count = this._uSegments;
        const half = this.points.length / 2;

        // Верхний лист
        for (let i = 0; i < half; i++) {
            // Вдоль u
            if ((i + 1) % count !== 0) {
                this.edges.push(new Edge(i, i + 1));
            } else {
                this.edges.push(new Edge(i, i + 1 - count));
            }
            // Вдоль v
            if (i + count < half) {
                this.edges.push(new Edge(i, i + count));
            }
        }
        // Нижний лист
        for (let i = half; i < this.points.length; i++) {
            // Вдоль u
            if ((i + 1) % count !== 0) {
                this.edges.push(new Edge(i, i + 1));
            } else {
                this.edges.push(new Edge(i, i + 1 - count));
            }
            // Вдоль v
            if (i + count < this.points.length) {
                this.edges.push(new Edge(i, i + count));
            }
        }
    }

    generatePolygons() {
        const count = this._uSegments;
        const half = this.points.length / 2;

        // Верхний лист
        for (let i = 0; i < half - count; i++) {
            if ((i + 1) % count !== 0) {
                this.polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count], '#FF69B4'));
            } else {
                this.polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count], '#FF69B4'));
            }
        }
        // Нижний лист
        for (let i = half; i < this.points.length - count; i++) {
            if ((i + 1) % count !== 0) {
                this.polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count], '#FF69B4'));
            } else {
                this.polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count], '#FF69B4'));
            }
        }
    }

    settings() {
        return (
            <div>
                <label>
                    Сегменты по u:
                    <input
                        type="number"
                        min="3"
                        step="1"
                        value={this.uSegments}
                        onChange={e => this.uSegments = parseInt(e.target.value, 10)}
                    />
                </label>
                <label>
                    Сегменты по v:
                    <input
                        type="number"
                        min="4"
                        step="1"
                        value={this.vSegments}
                        onChange={e => this.vSegments = parseInt(e.target.value, 10)}
                    />
                </label>
                <label>
                    Коэффициент a:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.a}
                        onChange={e => this.a = parseFloat(e.target.value)}
                    />
                </label>
                <label>
                    Коэффициент b:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.b}
                        onChange={e => this.b = parseFloat(e.target.value)}
                    />
                </label>
                <label>
                    Коэффициент c:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.c}
                        onChange={e => this.c = parseFloat(e.target.value)}
                    />
                </label>
                <label>
                    Диапазон v (vMax):
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.vMax}
                        onChange={e => this.vMax = parseFloat(e.target.value)}
                    />
                </label>
            </div>
        );
    }
}

export default TwoSheetedHyperboloid;
