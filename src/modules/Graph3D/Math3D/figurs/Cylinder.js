import Figure from '../entities/Figure';

import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class Cylinder extends Figure {
    constructor(radialSegments = 20, height = 15, radius = 10, heightSegments = 5) {
        super();
        this.radialSegments = radialSegments;
        this.height = height;
        this.radius = radius;
        this.heightSegments = heightSegments;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        
        this.generatePoints();
        this.generateEdges();
        this.generatePolygons();
    }

    generatePoints() {
        const angleStep = (2 * Math.PI) / this.radialSegments;
        const verticalStep = (2 * this.height) / (this.heightSegments - 1);

        for (let h = 0; h < this.heightSegments; h++) {
            const z = -this.height + h * verticalStep;
            for (let i = 0; i < this.radialSegments; i++) {
                const angle = angleStep * i;
                this.points.push(new Point(
                    this.radius * Math.cos(angle),
                    this.radius * Math.sin(angle),
                    z
                ));
            }
        }
    }

    generateEdges() {
        for (let ring = 0; ring < this.heightSegments; ring++) {
            const startIdx = ring * this.radialSegments;
            for (let i = 0; i < this.radialSegments; i++) {
                this.edges.push(new Edge(
                    startIdx + i,
                    startIdx + (i + 1) % this.radialSegments
                ));
            }
        }

        for (let i = 0; i < this.radialSegments; i++) {
            for (let ring = 0; ring < this.heightSegments - 1; ring++) {
                this.edges.push(new Edge(
                    ring * this.radialSegments + i,
                    (ring + 1) * this.radialSegments + i
                ));
            }
        }
    }
    

    generatePolygons() {
        for (let ring = 0; ring < this.heightSegments - 1; ring++) {
            for (let i = 0; i < this.radialSegments; i++) {
                const a = ring * this.radialSegments + i;
                const b = ring * this.radialSegments + (i + 1) % this.radialSegments;
                const c = (ring + 1) * this.radialSegments + (i + 1) % this.radialSegments;
                const d = (ring + 1) * this.radialSegments + i;
                
                this.polygons.push(new Polygon([a, b, c, d], '#FF0000'));
            }
        }

        const bottomCap = Array.from({length: this.radialSegments}, (_, i) => i);
        this.polygons.push(new Polygon(bottomCap, '#00FF00'));
        
        const topCapStart = (this.heightSegments - 1) * this.radialSegments;
        const topCap = Array.from({length: this.radialSegments}, (_, i) => topCapStart + i);
        this.polygons.push(new Polygon(topCap, '#0000FF'));
    }
}

export default Cylinder;