import React from 'react';

import Light from './Math3D/entities/Light';
import Point from './Math3D/entities/Point';

import Cube from './Math3D/figurs/Cube';
import Cylinder from './Math3D/figurs/Cylinder';
import Sphere from './Math3D/figurs/Sphere';
import Torus from './Math3D/figurs/Torus';

import Math3D from './Math3D'
import Canvas from '../Canvas/Canvas'

class Graph3D extends React.Component {
    constructor(options) {
        super(options);

        this.WIN = {
            LEFT: -5,
            BOTTOM: -5,
            WIDTH: 10,
            HEIGHT: 10,
            CENTER: new Point(0, 0, 30),
            CAMERA: new Point(0, 0, 50),
            LIGHT: new Light(-40, 5, 10, 25000)
        };

        this.scene = new Cube();
        this.math3D = new Math3D({ WIN: this.WIN });
        this.canvas = new Canvas({
            id: 'canvas3D',
            width: 600,
            height: 600,
            WIN: this.WIN,
            callbacks: {
                wheel: (event) => this.wheel(event),
                mousemove: (event) => this.mousemove(event),
                mouseup: () => this.mouseup(),
                mousedown: (event) => this.mousedown(event),
                mouseleave: () => this.mouseleave(),
            },
        });

        this.canRotate = false;
        this.dx = 0;
        this.dy = 0;
        this.printPolygons = true;
        this.printPoint = true;
        this.printEdges = true;

        this.renderFrame();
        this.addEventListeners();
        this.figures = {
            cube: () => new Cube(),
            cylinder: () => new Cylinder(),
            sphere: () => new Sphere(),
            torus: () => new Torus
        };
    }
    
    wheel(event) {
        const delta = (event.wheelDelta > 0) ? 1.1 : 0.9;
        this.scene.points.forEach(point => this.math3D.zoom(delta, point));
        this.renderFrame();
    }

    mouseup() {
        this.canRotate = false;
    }

    mouseleave() {
        this.canRotate = false;
    }

    mousedown(event) {
        this.canRotate = true;
        this.dx = event.offsetX;
        this.dy = event.offsetY;
    }

    mousemove(event) {
        if (this.canRotate) {
            const ROTATION_SENSITIVITY = 5;
            const gradus = Math.PI / 180 / ROTATION_SENSITIVITY;

            this.scene.points.forEach(point => {
                this.math3D.rotateOy(-(this.dx-event.offsetX) * gradus, point);
                this.math3D.rotateOx(-(this.dy-event.offsetY) * gradus, point);
            });

            this.dx = event.offsetX;
            this.dy = event.offsetY;
            this.renderFrame();
        }
    }

    addEventListeners(){
        document.getElementById('printPolygons').addEventListener(
            'change', (event) => {
                this.printPolygons = event.target.checked;
                this.renderFrame();
            }
        )

        document.getElementById('printPoint').addEventListener(
            'change', (event) => {
                this.printPoint = event.target.checked;
                this.renderFrame();
            }
        )

        document.getElementById('printEdges').addEventListener(
            'change', (event) => {
                this.printEdges = event.target.checked;
                this.renderFrame();
            }
        )

        document.getElementById('listFigure').addEventListener(
            'change', (event) => {
                this.scene = this.figures[event.target.value]();
                this.renderFrame();
            }
        )
    }
   
    renderFrame() {
        this.canvas.clear();

        if (this.printPolygons) {
            this.math3D.calcDistance(this.scene, this.WIN.CAMERA, 'distance');
            this.math3D.sortByArtistAlgorithm(this.scene.polygons);
            this.math3D.calcDistance(this.scene, this.WIN.LIGHT, 'lumen');
            this.scene.polygons.forEach(polygon => {
                const points = polygon.points.map(index => this.scene.points[index]);
                const projectedPoints = points.map(point => ({
                    x: this.math3D.xs(point),
                    y: this.math3D.ys(point)
                }));
                const lumen = this.math3D.calcIllumination(polygon.lumen, this.WIN.LIGHT.lumen);
                let{r, g, b} = polygon.color;
                r=Math.round(r*lumen);
                g=Math.round(g*lumen);
                b=Math.round(b*lumen);
                this.canvas.polygon(projectedPoints, polygon.rgbToHex(r, g, b));
            });
        }

        if(this.printEdges){
            this.scene.edges.forEach(edge => {
                const p1 = this.scene.points[edge.p1];
                const p2 = this.scene.points[edge.p2];
                this.canvas.line(
                    this.math3D.xs(p1),
                    this.math3D.ys(p1),
                    this.math3D.xs(p2),
                    this.math3D.ys(p2)
                );
            });
        }

        if(this.printPoint){
            this.scene.points.forEach(point => {
                this.canvas.point(
                    this.math3D.xs(point),
                    this.math3D.ys(point)
                );
            });
        }
    }
}


export default Graph3D;