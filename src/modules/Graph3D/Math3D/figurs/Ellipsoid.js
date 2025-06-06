import Figure from '../entities/Figure';
import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class Ellipsoid extends Figure {
    constructor(
        verticalSegments = 20,
        horizontalSegments = 20,
        radiusX = 18,
        radiusY = 14,
        radiusZ = 10
    ) {
        super();
        this._verticalSegments = verticalSegments;
        this._horizontalSegments = horizontalSegments;
        this._radiusX = radiusX;
        this._radiusY = radiusY;
        this._radiusZ = radiusZ;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        
        this.generateGeometry();
    }

    // Getters and setters with validation
    get verticalSegments() {
        return this._verticalSegments;
    }

    set verticalSegments(value) {
        this._verticalSegments = Math.max(3, Math.floor(value));
        this.generateGeometry();
    }

    get horizontalSegments() {
        return this._horizontalSegments;
    }

    set horizontalSegments(value) {
        this._horizontalSegments = Math.max(3, Math.floor(value));
        this.generateGeometry();
    }

    get radiusX() {
        return this._radiusX;
    }

    set radiusX(value) {
        this._radiusX = Math.max(0.1, value);
        this.generateGeometry();
    }

    get radiusY() {
        return this._radiusY;
    }

    set radiusY(value) {
        this._radiusY = Math.max(0.1, value);
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
        const verticalStep = Math.PI / this._verticalSegments;
        const horizontalStep = (2 * Math.PI) / this._horizontalSegments;

        for (let i = 0; i <= this._verticalSegments; i++) {
            const theta = i * verticalStep;  // Vertical angle [0, PI]
            
            for (let j = 0; j <= this._horizontalSegments; j++) {
                const phi = j * horizontalStep;  // Horizontal angle [0, 2PI]
                
                // Parametric equations for ellipsoid
                const x = this._radiusX * Math.sin(theta) * Math.cos(phi);
                const y = this._radiusY * Math.sin(theta) * Math.sin(phi);
                const z = this._radiusZ * Math.cos(theta);
                
                this.points.push(new Point(x, y, z));
            }
        }
    }

    generateEdges() {
        const pointsPerRow = this._horizontalSegments + 1;
        
        // Horizontal edges (parallels)
        for (let i = 0; i <= this._verticalSegments; i++) {
            for (let j = 0; j < this._horizontalSegments; j++) {
                const current = i * pointsPerRow + j;
                const next = current + 1;
                this.edges.push(new Edge(current, next));
            }
        }
        
        // Vertical edges (meridians)
        for (let j = 0; j <= this._horizontalSegments; j++) {
            for (let i = 0; i < this._verticalSegments; i++) {
                const current = i * pointsPerRow + j;
                const next = (i + 1) * pointsPerRow + j;
                this.edges.push(new Edge(current, next));
            }
        }
    }

    generatePolygons() {
        const pointsPerRow = this._horizontalSegments + 1;
        
        for (let i = 0; i < this._verticalSegments; i++) {
            for (let j = 0; j < this._horizontalSegments; j++) {
                const a = i * pointsPerRow + j;
                const b = i * pointsPerRow + j + 1;
                const c = (i + 1) * pointsPerRow + j + 1;
                const d = (i + 1) * pointsPerRow + j;
                
                this.polygons.push(new Polygon([a, b, c, d], '#00FF00'));
            }
        }
        this.setIndexPolygons();
    }

    settings() {
        return (
            <div>
                <label>
                    Вертикальные сегменты:
                    <input
                        type="number"
                        min="3"
                        step="1"
                        value={this.verticalSegments}
                        onChange={e => this.verticalSegments = parseInt(e.target.value, 10)}
                    />
                </label>
                <label>
                    Горизонтальные сегменты:
                    <input
                        type="number"
                        min="3"
                        step="1"
                        value={this.horizontalSegments}
                        onChange={e => this.horizontalSegments = parseInt(e.target.value, 10)}
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
                    Радиус Y:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.radiusY}
                        onChange={e => this.radiusY = parseFloat(e.target.value)}
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

export default Ellipsoid;