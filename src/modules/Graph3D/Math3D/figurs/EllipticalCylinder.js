import Figure from '../entities/Figure';
import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class EllipticalCylinder extends Figure {
    constructor(
        heightSegments = 10,
        radialSegments = 20,
        height = 15,
        radiusX = 6,
        radiusZ = 10
    ) {
        super();
        this._heightSegments = heightSegments;
        this._radialSegments = radialSegments;
        this._height = height;
        this._radiusX = radiusX;
        this._radiusZ = radiusZ;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        
        this.generateGeometry();
    }

    // Getters and setters
    get heightSegments() {
        return this._heightSegments;
    }

    set heightSegments(value) {
        this._heightSegments = Math.max(1, Math.floor(value));
        this.generateGeometry();
    }

    get radialSegments() {
        return this._radialSegments;
    }

    set radialSegments(value) {
        this._radialSegments = Math.max(3, Math.floor(value));
        this.generateGeometry();
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = Math.max(0.1, value);
        this.generateGeometry();
    }

    get radiusX() {
        return this._radiusX;
    }

    set radiusX(value) {
        this._radiusX = Math.max(0.1, value);
        this.generateGeometry();
    }

    get radiusZ() {
        return this._radiusZ;
    }

    set radiusZ(value) {
        this._radiusZ = Math.max(0.1, value);
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
        const heightStep = this._height / (this._heightSegments - 1);
        
        for (let h = 0; h < this._heightSegments; h++) {
            const y = h * heightStep - this._height / 2; // Центрируем по Y
            
            for (let r = 0; r < this._radialSegments; r++) {
                const angle = r * radialStep;
                const x = this._radiusX * Math.cos(angle);
                const z = this._radiusZ * Math.sin(angle);
                
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
        
        // Вертикальные ребра (столбцы)
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
                const next = current + 1;
                const below = current + this._radialSegments;
                const nextBelow = below + 1;
                
                this.polygons.push(new Polygon([
                    current,
                    next % (h * this._radialSegments + this._radialSegments),
                    nextBelow % ((h + 1) * this._radialSegments + this._radialSegments),
                    below
                ], '#00FF00'));
            }
        }
        
        // Добавляем крышки
        this.generateCaps();
        this.setIndexPolygons();
    }

    generateCaps() {
        // Нижняя крышка
        const bottomCenter = this.points.length;
        this.points.push(new Point(0, -this._height / 2, 0));
        
        for (let r = 0; r < this._radialSegments; r++) {
            const next = (r + 1) % this._radialSegments;
            this.polygons.push(new Polygon([
                r,
                next,
                bottomCenter
            ], '#00FF00'));
        }
        
        // Верхняя крышка
        const topCenter = this.points.length;
        this.points.push(new Point(0, this._height / 2, 0));
        
        const topRingStart = (this._heightSegments - 1) * this._radialSegments;
        for (let r = 0; r < this._radialSegments; r++) {
            const current = topRingStart + r;
            const next = topRingStart + (r + 1) % this._radialSegments;
            this.polygons.push(new Polygon([
                current,
                next,
                topCenter
            ], '#00FF00'));
        }
    }

    settings() {
        return (
            <div>
                <label>
                    Сегменты по высоте:
                    <input
                        type="number"
                        min="1"
                        step="1"
                        value={this.heightSegments}
                        onChange={e => this.heightSegments = parseInt(e.target.value, 10)}
                    />
                </label>
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
                    Высота:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.height}
                        onChange={e => this.height = parseFloat(e.target.value)}
                    />
                </label>
                <label>
                    Радиус X:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.radiusX}
                        onChange={e => this.radiusX = parseFloat(e.target.value)}
                    />
                </label>
                <label>
                    Радиус Z:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.radiusZ}
                        onChange={e => this.radiusZ = parseFloat(e.target.value)}
                    />
                </label>
            </div>
        );
    }
}

export default EllipticalCylinder;