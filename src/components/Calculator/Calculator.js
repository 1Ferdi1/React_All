import React from 'react';
import calculatorCore from '../../modules/calculator/сalculators/Calculator.js';

class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.calc = new calculatorCore();
    }

    componentDidMount() {
        this.addEventListeners();
    }

    render() {
        return (
            <div className="calculator-container">
                <textarea id="A" placeholder="A" rows="15" cols="20"></textarea>

                <textarea id="B" placeholder="B" rows="15" cols="20"></textarea>

                <textarea id="C" placeholder="Result" rows="15" cols="20"></textarea>


                <div className="operands">
                    <button className="operand" data-operand="add">+</button>
                    <button className="operand" data-operand="sub">-</button>
                    <button className="operand" data-operand="mult">×</button>
                    <button className="operand" data-operand="div">÷</button>
                    <button className="operand" data-operand="pow">^</button>
                    <button className="operand" data-operand="prod">Prod</button>
                    <button className="operand" data-operand="one">One</button>
                    <button className="operand" data-operand="zero">Zero</button>
                    <button className="operand" data-operand="getValue">Get value</button>
                    <textarea id="xVal" placeholder="Введите значение x" rows="10" cols="20"></textarea>
                </div>
            </div>
        )
    }

    addEventListeners() {
        const buttons = document.querySelectorAll('.operand');
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                this.operandHandler(event);
            });
        });


    }

    operandHandler(event) {
        const operand = event.target.dataset.operand;
        let result = '';
        if (operand === 'getValue') {
            const polynomStr = document.getElementById('A').value.trim();
            const xStr = document.getElementById('xVal').value.trim();
            const polynomial = this.calc.getEntity(polynomStr);
            const xValue = this.calc.getEntity(xStr);
            result = polynomial.getValue(xValue).toString();
            document.getElementById('C').value = result;
            return;
        }
        const A = document.getElementById('A').value.trim();
        const B = document.getElementById('B').value.trim();
        result = this.calc[operand](this.calc.getEntity(A), this.calc.getEntity(B)).toString();
        document.getElementById('C').value = result;
    }
}

export default Calculator;