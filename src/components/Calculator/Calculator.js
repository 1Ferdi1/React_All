import React from 'react';
import calculatorCore from '../../modules/calculator/Calculator';

class Calculator extends React.Component {

    operandHandler(operand) {
        const calc = new calculatorCore();
        let result = '';
        if (operand === 'getValue') {
            const polynomStr = document.getElementById('A').value.trim();
            const xStr = document.getElementById('xVal').value.trim();
            const polynomial = calc.getEntity(polynomStr);
            const xValue = calc.getEntity(xStr);
            result = polynomial.getValue(xValue).toString();
            document.getElementById('C').value = result;
            return;
        }
        const A = document.getElementById('A').value.trim();
        const B = document.getElementById('B').value.trim();
        result = calc[operand](calc.getEntity(A), calc.getEntity(B)).toString();
        document.getElementById('C').value = result;
    }

    render() {
        return (
            <div className="calculator-container">
                <textarea id="A" placeholder="A" rows="15" cols="20"></textarea>

                <textarea id="B" placeholder="B" rows="15" cols="20"></textarea>

                <textarea id="C" placeholder="Result" rows="15" cols="20"></textarea>


                <div className="operands">
                    <button className="operand" onClick={() => this.operandHandler('add')}>+</button>
                    <button className="operand" onClick={() => this.operandHandler('sub')}>-</button>
                    <button className="operand" onClick={() => this.operandHandler('mult')}>×</button>
                    <button className="operand" onClick={() => this.operandHandler('div')}>÷</button>
                    <button className="operand" onClick={() => this.operandHandler('pow')}>^</button>
                    <button className="operand" onClick={() => this.operandHandler('prod')}>Prod</button>
                    <button className="operand" onClick={() => this.operandHandler('one')}>One</button>
                    <button className="operand" onClick={() => this.operandHandler('zero')}>Zero</button>
                    <button className="operand" onClick={() => this.operandHandler('get value')}>Get value</button>
                    <textarea id="xVal" placeholder="Введите значение x" rows="10" cols="20"></textarea>
                </div>
            </div>
        )
    }
}

export default Calculator;