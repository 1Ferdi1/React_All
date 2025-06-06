import Figure from '../entities/Figure';
import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class Cylinder extends Figure {
    constructor(radialSegments = 20, height = 15, radius = 10, heightSegments = 5) {
        super();
        this._radialSegments = radialSegments;
        this._height = height;
        this._radius = radius;
        this._heightSegments = heightSegments;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        
        this.generateGeometry();
    }

    get radialSegments() {
        return this._radialSegments;
    }

    set radialSegments(value) {
        this._radialSegments = Math.max(0, Math.floor(value)); // минимум 3
        this.generateGeometry();
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
        this.generateGeometry();
    }

    get radius() {
        return this._radius;
    }

    set radius(value) {
        this._radius = value;
        this.generateGeometry();
    }

    get heightSegments() {
        return this._heightSegments;
    }

    set heightSegments(value) {
        this._heightSegments = Math.max(1, Math.floor(value));
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
        const angleStep = (2 * Math.PI) / this._radialSegments;
        const verticalStep = (2 * this._height) / (this._heightSegments - 1);

        for (let h = 0; h < this._heightSegments; h++) {
            const z = -this._height + h * verticalStep;
            for (let i = 0; i < this._radialSegments; i++) {
                const angle = angleStep * i;
                this.points.push(new Point(
                    this._radius * Math.cos(angle),
                    this._radius * Math.sin(angle),
                    z
                ));
            }
        }
    }

    generateEdges() {
        for (let ring = 0; ring < this._heightSegments; ring++) {
            const startIdx = ring * this._radialSegments;
            for (let i = 0; i < this._radialSegments; i++) {
                this.edges.push(new Edge(
                    startIdx + i,
                    startIdx + (i + 1) % this._radialSegments
                ));
            }
        }

        for (let i = 0; i < this._radialSegments; i++) {
            for (let ring = 0; ring < this._heightSegments - 1; ring++) {
                this.edges.push(new Edge(
                    ring * this._radialSegments + i,
                    (ring + 1) * this._radialSegments + i
                ));
            }
        }
    }

    generatePolygons() {
        for (let ring = 0; ring < this._heightSegments - 1; ring++) {
            for (let i = 0; i < this._radialSegments; i++) {
                const a = ring * this._radialSegments + i;
                const b = ring * this._radialSegments + (i + 1) % this._radialSegments;
                const c = (ring + 1) * this._radialSegments + (i + 1) % this._radialSegments;
                const d = (ring + 1) * this._radialSegments + i;
                
                this.polygons.push(new Polygon([a, b, c, d], '#FF0000'));
            }
        }

        const bottomCap = Array.from({length: this._radialSegments}, (_, i) => i);
        this.polygons.push(new Polygon(bottomCap, '#00FF00'));
        
        const topCapStart = (this._heightSegments - 1) * this._radialSegments;
        const topCap = Array.from({length: this._radialSegments}, (_, i) => topCapStart + i);
        this.polygons.push(new Polygon(topCap, '#0000FF'));
        this.setIndexPolygons();
    }

    settings() {
        return (
            <div>
                <label>
                    Радиус:
                    <input
                        type="number"
                        value={this.radius}
                        min="0"
                        step="1"
                        onChange={(e) => {
                            this.radius = parseFloat(e.target.value);
                        }}
                    />
                </label>
                <label>
                    Высота:
                    <input
                        type="number"
                        value={this.height}
                        min="0"
                        step="1"
                        onChange={(e) => {
                            this.height = parseFloat(e.target.value);
                        }}
                    />
                </label>
                <label>
                    Радиальные сегменты:
                    <input
                        type="number"
                        value={this.radialSegments}
                        min="0"
                        step="1"
                        onChange={(e) => {
                            this.radialSegments = parseInt(e.target.value, 10);
                        }}
                    />
                </label>
                <label>
                    Вертикальные сегменты:
                    <input
                        type="number"
                        value={this.heightSegments}
                        min="0"
                        step="1"
                        onChange={(e) => {
                            this.heightSegments = parseInt(e.target.value, 10);
                        }}
                    />
                </label>
            </div>
        );
    }
}

export default Cylinder;
