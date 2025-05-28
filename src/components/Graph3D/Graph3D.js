import React, { useState, useEffect, useRef, useCallback } from 'react';
import Point from '../../modules/Graph3D/Math3D/entities/Point';
import Cube from '../../modules/Graph3D/Math3D/figurs/Cube';
import Cylinder from '../../modules/Graph3D/Math3D/figurs/Cylinder';
import Sphere from '../../modules/Graph3D/Math3D/figurs/Sphere';
import Math3D from '../../modules/Graph3D/Math3D';
import Canvas from '../../modules/Canvas/Canvas';
import Light from '../../modules/Graph3D/Math3D/entities/Light';
import Torus from '../../modules/Graph3D/Math3D/figurs/Torus';
import LightController from '../../modules/Graph3D/Math3D/entities/LightController';
import Ellipsoid from '../../modules/Graph3D/Math3D/figurs/Ellipsoid';
import EllipticalCylinder from '../../modules/Graph3D/Math3D/figurs/EllipticalCylinder';
import EllipticalParaboloid from '../../modules/Graph3D/Math3D/figurs/EllipticalParaboloid';
import Hyperboliccylinder from '../../modules/Graph3D/Math3D/figurs/Hyperboliccylinder';
import HyperbolicParaboloid from '../../modules/Graph3D/Math3D/figurs/HyperbolicParaboloid';
import OneSheetedHyperboloid from '../../modules/Graph3D/Math3D/figurs/OneSheetedHyperboloid';
import ParabolicCylinder from '../../modules/Graph3D/Math3D/figurs/ParabolicCylinder';
import TwoSheetedHyperboloid from '../../modules/Graph3D/Math3D/figurs/TwoSheetedHyperboloid';


const Graph3D = () => {
    const [printPolygons, setPrintPolygons] = useState(true);
    const [printPoints, setPrintPoints] = useState(true);
    const [printEdges, setPrintEdges] = useState(true);
    const [fps, setFps] = useState(0);
    const [lightPower, setLightPower] = useState(2500);
    const [selectedFigure, setSelectedFigure] = useState('cube');
    const [renderCount, setRenderCount] = useState(0);
    
    const lightPowerRef = useRef(lightPower);
    useEffect(() => {
        lightPowerRef.current = lightPower;
        WIN.LIGHT.lumen = lightPower;
    }, [lightPower]);

    const WIN = useRef({
        LEFT: -5,
        BOTTOM: -5,
        WIDTH: 10,
        HEIGHT: 10,
        CENTER: new Point(0, 0, 30),
        CAMERA: new Point(0, 0, 50),
        LIGHT: new Light(-40, 5, 10, lightPower),
    }).current;

    const math3D = useRef(new Math3D({ WIN })).current;
    const figures = useRef({
        cube: () => new Cube(),
        cylinder: () => new Cylinder(),
        sphere: () => new Sphere(),
        torus: () => new Torus(),
        ellipsoid: () => new Ellipsoid(),
        ellipticalCylinder: () => new EllipticalCylinder(),
        ellipticalParaboloid: () => new EllipticalParaboloid(),
        hyperboliccylinder: () => new Hyperboliccylinder(),
        hyperbolicParaboloid: () => new HyperbolicParaboloid(),
        oneSheetedHyperboloid: () => new OneSheetedHyperboloid(),
        parabolicCylinder: () => new ParabolicCylinder(),
        twoSheetedHyperboloid: () => new TwoSheetedHyperboloid(),

    }).current;

    const mainCanvas = useRef(null);
    const virtualCanvas = useRef(null);
    const scene = useRef([figures.cube()]);
    const reqId = useRef(null);
    const lastFpsUpdate = useRef(Date.now());
    const frameCount = useRef(0);
    
    const canRotate = useRef(false);
    const dx = useRef(0);
    const dy = useRef(0);

    const renderFrame = useCallback(() => {
        if (!scene.current.length) return;

        virtualCanvas.current?.clear();
        mainCanvas.current?.clear();

        const allPolygons = [];
        scene.current.forEach((figure, index) => {
            math3D.calcRadius(figure);
            math3D.calcDistance(figure, WIN.CAMERA, 'distance');
            math3D.calcDistance(figure, WIN.LIGHT, 'lumen');

            figure.polygons.forEach(polygon => {
                polygon.figureIndex = index;
                allPolygons.push(polygon);
            });
        });

        math3D.sortByArtistAlgorithm(allPolygons);

        if (printPolygons) {
            allPolygons.forEach(polygon => {
                const figure = scene.current[polygon.figureIndex];
                const points = polygon.points.map(index => figure.points[index]);
                const projected = points.map(point => ({
                    x: math3D.xs(point),
                    y: math3D.ys(point)
                }));

                const { isShadow, dark } = math3D.calcShadow(
                    polygon, 
                    scene.current, 
                    WIN.LIGHT
                );

                let { r, g, b } = polygon.color;
                const lumen = math3D.calcIllumination(
                    polygon.lumen,
                    lightPowerRef.current * (isShadow ? dark : 1)
                );

                r = Math.round(r * lumen);
                g = Math.round(g * lumen);
                b = Math.round(b * lumen);

                virtualCanvas.current.polygon(
                    projected, 
                    `rgb(${r},${g},${b})`
                );
            });
        }

        if (printEdges) {
            scene.current.forEach(figure => {
                figure.edges.forEach(edge => {
                    const p1 = figure.points[edge.p1];
                    const p2 = figure.points[edge.p2];
                    virtualCanvas.current.line(
                        math3D.xs(p1),
                        math3D.ys(p1),
                        math3D.xs(p2),
                        math3D.ys(p2),
                        '#000',
                        1
                    );
                });
            });
        }

        if (printPoints) {
            scene.current.forEach(figure => {
                figure.points.forEach(point => {
                    virtualCanvas.current.point(
                        math3D.xs(point),
                        math3D.ys(point),
                        '#ff0000',
                        3
                    );
                });
            });
        }

        mainCanvas.current?.context.drawImage(
            virtualCanvas.current?.canvas,
            0, 0,
            mainCanvas.current?.canvas.width,
            mainCanvas.current?.canvas.height
        );

        const now = Date.now();
        frameCount.current++;
        if (now - lastFpsUpdate.current >= 1000) {
            setFps(frameCount.current);
            frameCount.current = 0;
            lastFpsUpdate.current = now;
        }

        mainCanvas.current?.text(
            `FPS: ${fps}`,
            WIN.LEFT,
            WIN.BOTTOM + WIN.HEIGHT - 1,
            "green"
        );
    }, [printPolygons, printEdges, printPoints, math3D, WIN, fps]);

    const scheduleRender = useCallback(() => {
        if (!reqId.current) {
            reqId.current = requestAnimationFrame(() => {
                renderFrame();
                reqId.current = null;
            });
        }
    }, [renderFrame]);

    const handleSettingsChange = useCallback(() => {
        scheduleRender();
        setRenderCount(prev => prev + 1);
    }, [scheduleRender]);

    const handleWheel = useCallback((event) => {
        const delta = event.deltaY > 0 ? 0.95 : 1.05;
        scene.current.forEach(figure => {
            figure.points.forEach(point => math3D.zoom(delta, point));
        });
        scheduleRender();
    }, [math3D, scheduleRender]);

    const handleMouseDown = useCallback((event) => {
        canRotate.current = true;
        dx.current = event.offsetX;
        dy.current = event.offsetY;
    }, []);

    const handleMouseUp = useCallback(() => {
        canRotate.current = false;
    }, []);

    const handleMouseMove = useCallback((event) => {
        if (canRotate.current) {
            const sensitivity = 0.005;
            scene.current.forEach(figure => {
                figure.points.forEach(point => {
                    math3D.rotateOy(
                        (dx.current - event.offsetX) * sensitivity,
                        point
                    );
                    math3D.rotateOx(
                        (event.offsetY - dy.current) * sensitivity,
                        point
                    );
                });
            });
            dx.current = event.offsetX;
            dy.current = event.offsetY;
            scheduleRender();
        }
    }, [math3D, scheduleRender]);

    useEffect(() => {
        mainCanvas.current = new Canvas({
            id: 'canvas3D',
            width: 600,
            height: 600,
            WIN: WIN,
            callbacks: {
                wheel: handleWheel,
                mousemove: handleMouseMove,
                mouseup: handleMouseUp,
                mousedown: handleMouseDown,
                mouseleave: handleMouseUp
            }
        });

        virtualCanvas.current = new Canvas({
            canvas: document.createElement('canvas'),
            width: 600,
            height: 600,
            WIN: WIN
        });

        const animate = () => {
            renderFrame();
            reqId.current = requestAnimationFrame(animate);
        };
        reqId.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(reqId.current);
    }, [handleWheel, handleMouseMove, handleMouseUp, handleMouseDown, WIN, renderFrame]);

    return (
        <div style={{ padding: 20 }}>
            <canvas id="canvas3D" style={{ border: '1px solid #ddd' }} />
            
            <div style={{ marginTop: 20 }}>
                <LightController 
                    lightPower={lightPower}
                    onChange={setLightPower}
                />
                
                <div style={{ margin: '10px 0' }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={printPolygons}
                            onChange={e => setPrintPolygons(e.target.checked)}
                        />
                        Полигоны
                    </label>
                    
                    <label style={{ marginLeft: 15 }}>
                        <input
                            type="checkbox"
                            checked={printPoints}
                            onChange={e => setPrintPoints(e.target.checked)}
                        />
                        Точки
                    </label>
                    
                    <label style={{ marginLeft: 15 }}>
                        <input
                            type="checkbox"
                            checked={printEdges}
                            onChange={e => setPrintEdges(e.target.checked)}
                        />
                        Ребра
                    </label>
                </div>

                <div>
                    <select
                        value={selectedFigure}
                        onChange={e => {
                            setSelectedFigure(e.target.value);
                            scene.current = [figures[e.target.value]()];
                            handleSettingsChange();
                        }}
                        style={{ margin: '10px 0', padding: 5 }}
                    >
                        <option value="cube">Куб</option>
                        <option value="cylinder">Цилиндр</option>
                        <option value="sphere">Сфера</option>
                        <option value="torus">Тор</option>
                        <option value="ellipsoid">Эллипсоид</option>
                        <option value="ellipticalCylinder">Эллиптический Цилиндр</option>
                        <option value="ellipticalParaboloid">Эллиптический Параболойд</option>
                        <option value="hyperboliccylinder">Гиперболический Цилиндр</option>
                        <option value="hyperbolicParaboloid">Гиперболический Параболойд</option>
                        <option value="oneSheetedHyperboloid">Однополосный Гиперболойд</option>
                        <option value="parabolicCylinder">Параболический Цилиндр</option>
                        <option value="twoSheetedHyperboloid">Двухполосный Гиперболойд</option>
                    </select>
                </div>

                <div style={{ 
                    marginTop: 15,
                    padding: 10,
                    border: '1px solid #eee',
                    borderRadius: 8
                }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>Настройки фигуры</h4>
                    {scene.current[0]?.settings?.(handleSettingsChange)}
                </div>
            </div>
        </div>
    );
};

export default Graph3D;