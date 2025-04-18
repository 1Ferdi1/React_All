import { useRef } from 'react';
import calculatorCore from '../../modules/calculator/Calculator';


const Calculator=()=> {
    const aRef = useRef();
    const bRef = useRef();
    const cRef = useRef();
    const operandHandler=(operand) => {
        const Calculator = new calculatorCore;
        const a = Calculator.getValue(aRef.current.value);
        const b = Calculator.getValue(bRef.current.value);
        const c = Calculator[operand](a,b);
        cRef.current.value = c.toString();
        }
        return (
            <div className="calculator-container">
                <textarea ref={aRef} placeholder='A'></textarea>
                <textarea ref={bRef} placeholder='B'></textarea>
                <textarea ref={cRef} placeholder='Result'></textarea>

                <div className="operands">
                    <button onClick={() => operandHandler('add')}>+</button>
                    <button onClick={() => operandHandler('sub')}>-</button>
                    <button onClick={() => operandHandler('mult')}>×</button>
                    <button onClick={() => operandHandler('div')}>÷</button>
                    <button onClick={() => operandHandler('pow')}>^</button>
                    <button onClick={() => operandHandler('prod')}>Prod</button>
                    <button onClick={() => operandHandler('one')}>One</button>
                    <button onClick={() => operandHandler('zero')}>Zero</button>
                    <button onClick={() => operandHandler('get value')}>Get value</button>
                </div>
            </div>
        );
    }

export default Calculator;