import Figure from '../entities/Figure';

import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';


class Sphere extends Figure {
    constructor(radialSegments = 20, polarSegments = 1000, radius = 10) {
        super();
        this.radialSegments = radialSegments;
        this.polarSegments = polarSegments;
        this.radius = radius;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        
        this.generatePoints();
        this.generateEdges();
        this.generatePolygons();
    }

    generatePoints() {
        const polarStep = Math.PI / (this.polarSegments - 1);
        const radialStep = (2 * Math.PI) / this.radialSegments;

        for (let p = 0; p < this.polarSegments; p++) {
            const polarAngle = p * polarStep;
            const sinθ = Math.sin(polarAngle);
            const cosθ = Math.cos(polarAngle);
            
            for (let r = 0; r < this.radialSegments; r++) {
                const radialAngle = r * radialStep;
                const sinφ = Math.sin(radialAngle);
                const cosφ = Math.cos(radialAngle);
                
                this.points.push(new Point(
                    this.radius * sinθ * cosφ,
                    this.radius * sinθ * sinφ,
                    this.radius * cosθ
                ));
            }
        }
    }

    generateEdges() {
        for (let p = 0; p < this.polarSegments; p++) {
            const ringStart = p * this.radialSegments;
            for (let r = 0; r < this.radialSegments; r++) {
                this.edges.push(new Edge(
                    ringStart + r,
                    ringStart + (r + 1) % this.radialSegments
                ));
            }
        }

        for (let r = 0; r < this.radialSegments; r++) {
            for (let p = 0; p < this.polarSegments - 1; p++) {
                this.edges.push(new Edge(
                    p * this.radialSegments + r,
                    (p + 1) * this.radialSegments + r
                ));
            }
        }
    }

    generatePolygons() {
        for (let p = 0; p < this.polarSegments - 1; p++) {
            for (let r = 0; r < this.radialSegments; r++) {
                const a = p * this.radialSegments + r;
                const b = p * this.radialSegments + (r + 1) % this.radialSegments;
                const c = (p + 1) * this.radialSegments + (r + 1) % this.radialSegments;
                const d = (p + 1) * this.radialSegments + r;
                
                this.polygons.push(new Polygon([a, b, c, d], '#FFA500'));
            }
        }
    }
}


export default Sphere;