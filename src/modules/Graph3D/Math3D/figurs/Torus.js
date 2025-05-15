import Figure from '../entities/Figure';
import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class Torus extends Figure {
    constructor(radialSegments = 20, tubeSegments = 10, radius = 10, tubeRadius = 3) {
        super();
        this._radialSegments = radialSegments;
        this._tubeSegments = tubeSegments;
        this._radius = radius;
        this._tubeRadius = tubeRadius;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        
        this.generateGeometry();
    }

    get radialSegments() {
        return this._radialSegments;
    }

    set radialSegments(value) {
        this._radialSegments = Math.max(3, Math.floor(value));
        this.generateGeometry();
    }

    get tubeSegments() {
        return this._tubeSegments;
    }

    set tubeSegments(value) {
        this._tubeSegments = Math.max(3, Math.floor(value));
        this.generateGeometry();
    }

    get radius() {
        return this._radius;
    }

    set radius(value) {
        this._radius = value;
        this.generateGeometry();
    }

    get tubeRadius() {
        return this._tubeRadius;
    }

    set tubeRadius(value) {
        this._tubeRadius = value;
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
        const tubeStep = (2 * Math.PI) / this._tubeSegments;

        for (let r = 0; r < this._radialSegments; r++) {
            const radialAngle = r * radialStep;
            const cosRadial = Math.cos(radialAngle);
            const sinRadial = Math.sin(radialAngle);
            
            for (let t = 0; t < this._tubeSegments; t++) {
                const tubeAngle = t * tubeStep;
                const cosTube = Math.cos(tubeAngle);
                const sinTube = Math.sin(tubeAngle);
                
                this.points.push(new Point(
                    (this._radius + this._tubeRadius * cosTube) * cosRadial,
                    (this._radius + this._tubeRadius * cosTube) * sinRadial,
                    this._tubeRadius * sinTube
                ));
            }
        }
    }

    generateEdges() {
        for (let r = 0; r < this._radialSegments; r++) {
            const ringStart = r * this._tubeSegments;
            for (let t = 0; t < this._tubeSegments; t++) {
                this.edges.push(new Edge(
                    ringStart + t,
                    ringStart + (t + 1) % this._tubeSegments
                ));
            }
        }

        for (let t = 0; t < this._tubeSegments; t++) {
            for (let r = 0; r < this._radialSegments; r++) {
                this.edges.push(new Edge(
                    r * this._tubeSegments + t,
                    ((r + 1) % this._radialSegments) * this._tubeSegments + t
                ));
            }
        }
    }

    generatePolygons() {
        for (let r = 0; r < this._radialSegments; r++) {
            for (let t = 0; t < this._tubeSegments; t++) {
                const a = r * this._tubeSegments + t;
                const b = r * this._tubeSegments + (t + 1) % this._tubeSegments;
                const c = ((r + 1) % this._radialSegments) * this._tubeSegments + (t + 1) % this._tubeSegments;
                const d = ((r + 1) % this._radialSegments) * this._tubeSegments + t;
                
                this.polygons.push(new Polygon([a, b, c, d], '#00FF00'));
            }
        }
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
                    Сегменты трубки:
                    <input
                        type="number"
                        min="3"
                        step="1"
                        value={this.tubeSegments}
                        onChange={e => this.tubeSegments = parseInt(e.target.value, 10)}
                    />
                </label>
                <label>
                    Радиус тора:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.radius}
                        onChange={e => this.radius = parseFloat(e.target.value)}
                    />
                </label>
                <label>
                    Радиус трубки:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.tubeRadius}
                        onChange={e => this.tubeRadius = parseFloat(e.target.value)}
                    />
                </label>
            </div>
        );
    }
}

export default Torus;
