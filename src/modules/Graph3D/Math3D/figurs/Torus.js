import Figure from '../entities/Figure';

import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class Torus extends Figure {
    constructor(radialSegments = 20, tubeSegments = 10, radius = 10, tubeRadius = 3) {
        super();
        this.radialSegments = radialSegments;
        this.tubeSegments = tubeSegments;
        this.radius = radius;
        this.tubeRadius = tubeRadius;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        
        this.generatePoints();
        this.generateEdges();
        this.generatePolygons();
    }

    generatePoints() {
        const radialStep = (2 * Math.PI) / this.radialSegments;
        const tubeStep = (2 * Math.PI) / this.tubeSegments;

        for (let r = 0; r < this.radialSegments; r++) {
            const radialAngle = r * radialStep;
            const cosRadial = Math.cos(radialAngle);
            const sinRadial = Math.sin(radialAngle);
            
            for (let t = 0; t < this.tubeSegments; t++) {
                const tubeAngle = t * tubeStep;
                const cosTube = Math.cos(tubeAngle);
                const sinTube = Math.sin(tubeAngle);
                
                this.points.push(new Point(
                    (this.radius + this.tubeRadius * cosTube) * cosRadial,
                    (this.radius + this.tubeRadius * cosTube) * sinRadial,
                    this.tubeRadius * sinTube
                ));
            }
        }
    }

    generateEdges() {
        for (let r = 0; r < this.radialSegments; r++) {
            const ringStart = r * this.tubeSegments;
            for (let t = 0; t < this.tubeSegments; t++) {
                this.edges.push(new Edge(
                    ringStart + t,
                    ringStart + (t + 1) % this.tubeSegments
                ));
            }
        }

        for (let t = 0; t < this.tubeSegments; t++) {
            for (let r = 0; r < this.radialSegments; r++) {
                this.edges.push(new Edge(
                    r * this.tubeSegments + t,
                    ((r + 1) % this.radialSegments) * this.tubeSegments + t
                ));
            }
        }
    }

    generatePolygons() {
        for (let r = 0; r < this.radialSegments; r++) {
            for (let t = 0; t < this.tubeSegments; t++) {
                const a = r * this.tubeSegments + t;
                const b = r * this.tubeSegments + (t + 1) % this.tubeSegments;
                const c = ((r + 1) % this.radialSegments) * this.tubeSegments + (t + 1) % this.tubeSegments;
                const d = ((r + 1) % this.radialSegments) * this.tubeSegments + t;
                
                this.polygons.push(new Polygon([a, b, c, d], '#00FF00'));
            }
        }
    }
}


export default Torus;