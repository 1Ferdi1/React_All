import React from 'react';
import {Graph2DLogic} from '../../modules/Graph2D/Graph2D';
import Canvas from '../../modules/Canvas/Canvas';

class Graph2D extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.logic = null;
        this.WIN = {
            LEFT: -10,
            BOTTOM: -10,
            WIDTH: 20,
            HEIGHT: 20
        };
        this.state = { functions: [] };
    }

    componentDidMount() {
        const canvasInstance = new Canvas({
            WIN: this.WIN,
            id: 'graphCanvas',
            width: 600,
            height: 600,
            callbacks: {
                wheel: e => this.logic.handleWheel(e),
                mousemove: e => this.logic.handleMouseMove(e),
                mouseup: () => this.logic.handleMouseUp(),
                mousedown: () => this.logic.handleMouseDown(),
                mouseleave: () => this.logic.handleMouseLeave()
            }
        });

        this.logic = new Graph2DLogic(this.WIN, canvasInstance);
        this.forceUpdate();
    }

    addFunction = () => {
        const num = this.state.functions.length;
        this.setState({ 
            functions: [...this.state.functions, { id: num, expr: '', color: '#0000ff' }]
        });
    };

    updateFunction = (id, expr, color) => {
        try {
            const f = new Function('x', `return ${expr}`);
            this.logic.addFunction(f, id, color);
            this.logic.render();
        } catch(e) {
            console.error('Некорректная функция:', e);
        }
    };

    renderControls() {
        return this.state.functions.map(func => (
            <div key={func.id} className="function-control">
                <input
                    placeholder="f(x)"
                    onChange={e => this.updateFunction(func.id, e.target.value, func.color)}
                />
                <input
                    type="color"
                    value={func.color}
                    onChange={e => this.updateFunction(func.id, func.expr, e.target.value)}
                />
                <button onClick={() => this.logic.delFunction(func.id)}>
                    Удалить
                </button>
            </div>
        ));
    }

    render() {
        return (
            <div className="graph-2d">
                <canvas 
                    id="graphCanvas"
                    ref={this.canvasRef}
                    width={600}
                    height={600}
                    style={{ border: '1px solid #ddd' }}
                />
                
                <div className="controls">
                    <button onClick={this.addFunction} className="add-btn">
                        + Добавить функцию
                    </button>
                    {this.renderControls()}
                </div>
            </div>
        );
    }
}

export default Graph2D;