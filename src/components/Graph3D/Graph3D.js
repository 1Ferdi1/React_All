import React, { Component } from 'react';
import Point from '../../modules/Graph3D/Math3D/entities/Point.js';
import Cube from '../../modules/Graph3D/Math3D/figurs/Cube.js';
import Cylinder from '../../modules/Graph3D/Math3D/figurs/Cylinder.js';
import Sphere from '../../modules/Graph3D/Math3D/figurs/Sphere.js';
import Math3D from '../../modules/Graph3D/Math3D.js';
import Canvas from '../../modules/Canvas/Canvas.js';
import Light from '../../modules/Graph3D/Math3D/entities/Light.js';
import Torus from '../../modules/Graph3D/Math3D/figurs/Torus.js';

class Graph3D extends Component {
    constructor(props) {
        super(props);

        this.WIN = {
            LEFT: -5,
            BOTTOM: -5,
            WIDTH: 10,
            HEIGHT: 10,
            CENTER: new Point(0, 0, 30),
            CAMERA: new Point(0, 0, 50),
            LIGHT: new Light(-40, 5, 10, 25000),
        };

        this.state = {
            scene: new Cube(),
            canRotate: false,
            dx: 0,
            dy: 0,
            printPolygons: true,
            printPoint: true,
            printEdges: true,
        };

        this.canvasRef = React.createRef();
        this.math3D = new Math3D({ WIN: this.WIN });
        this.figures = {
            cube: () => new Cube(),
            cylinder: () => new Cylinder(),
            sphere: () => new Sphere(),
            torus: () => new Torus(),
        };
    }

    componentDidMount() {
        this.canvas = new Canvas({
            id: 'canvas3D',
            width: 600,
            height: 600,
            WIN: this.WIN,
            callbacks: {
                wheel: this.handleWheel.bind(this),
                mousemove: this.handleMouseMove.bind(this),
                mouseup: this.handleMouseUp.bind(this),
                mousedown: this.handleMouseDown.bind(this),
                mouseleave: this.handleMouseLeave.bind(this),
            },
        });
        this.canvasRef.current = this.canvas;

        this.renderFrame();
    }

    handleWheel(event) {
        const delta = event.wheelDelta > 0 ? 1.1 : 0.9;
        this.state.scene.points.forEach((point) => this.math3D.zoom(delta, point));
        this.renderFrame();
    }

    handleMouseUp() {
        this.setState({ canRotate: false });
    }

    handleMouseLeave() {
        this.setState({ canRotate: false });
    }

    handleMouseDown(event) {
        this.setState({
            canRotate: true,
            dx: event.offsetX,
            dy: event.offsetY,
        });
    }

    handleMouseMove(event) {
        if (this.state.canRotate) {
            const ROTATION_SENSITIVITY = 5;
            const gradus = Math.PI / 180 / ROTATION_SENSITIVITY;

            this.state.scene.points.forEach((point) => {
                this.math3D.rotateOy(-(this.state.dx - event.offsetX) * gradus, point);
                this.math3D.rotateOx(-(this.state.dy - event.offsetY) * gradus, point);
            });

            this.setState({
                dx: event.offsetX,
                dy: event.offsetY,
            });
            this.renderFrame();
        }
    }

    renderFrame() {
        const canvas = this.canvasRef.current;
        if (!canvas) return;

        canvas.clear();
        const { scene } = this.state;

        this.math3D.calcDistance(scene, this.WIN.CAMERA, 'distance');
        this.math3D.sortByArtistAlgorithm(scene.polygons);
        this.math3D.calcDistance(scene, this.WIN.LIGHT, 'lumen');

        if (this.state.printPolygons) {
            scene.polygons.forEach((polygon) => {
                const points = polygon.points.map((index) => scene.points[index]);
                const projectedPoints = points.map((point) => ({
                    x: this.math3D.xs(point),
                    y: this.math3D.ys(point),
                }));
                const lumen = this.math3D.calcIllumination(polygon.lumen, this.WIN.LIGHT.lumen);

                let { r, g, b } = polygon.color;
                r = Math.round(r * lumen);
                g = Math.round(g * lumen);
                b = Math.round(b * lumen);

                canvas.polygon(projectedPoints, polygon.rgbToHex(r, g, b));
            });
        }

        if (this.state.printEdges) {
            scene.edges.forEach((edge) => {
                const p1 = scene.points[edge.p1];
                const p2 = scene.points[edge.p2];
                canvas.line(
                    this.math3D.xs(p1),
                    this.math3D.ys(p1),
                    this.math3D.xs(p2),
                    this.math3D.ys(p2)
                );
            });
        }

        if (this.state.printPoint) {
            scene.points.forEach((point) => {
                canvas.point(this.math3D.xs(point), this.math3D.ys(point));
            });
        }
    }

    render() {
        return (
            <div>
            <canvas id="canvas3D"></canvas>
            <div>
                <label>
                <input
                    type="checkbox"
                    checked={this.state.printPolygons}
                    onChange={(e) => {
                    this.setState({ printPolygons: e.target.checked }, () => {
                        this.renderFrame();
                    });
                    }}
                />
                Полигоны
                </label>
                <label>
                <input
                    type="checkbox"
                    checked={this.state.printPoint}
                    onChange={(e) => {
                    this.setState({ printPoint: e.target.checked }, () => {
                        this.renderFrame();
                    });
                    }}
                />
                Точки
                </label>
                <label>
                <input
                    type="checkbox"
                    checked={this.state.printEdges}
                    onChange={(e) => {
                    this.setState({ printEdges: e.target.checked }, () => {
                        this.renderFrame();
                    });
                    }}
                />
                Ребра
                </label>

                <select
                onChange={(e) => {
                    this.setState({ scene: this.figures[e.target.value]() }, () => this.renderFrame())}}
                >
                <option value="cube">Куб</option>
                <option value="cylinder">Цилиндр</option>
                <option value="sphere">Шар</option>
                <option value="torus">Бублик</option>
                </select>
            </div>
            </div>
        );
    }
}

export default Graph3D;