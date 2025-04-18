import React from 'react';

import Complex from './classes/Complex';
import Matrix from './classes/Matrix';
import Member from './classes/Member';
import Polynomial from './classes/Polynomial';
import Vector from './classes/Vector';

import ComplexCalculator from './сalculators/ComplexCalculator';
import MatrixCalculator from './сalculators/MatrixCalculator';
import VectorCalculator from './сalculators/VectorCalculator';
import PolynomialCalculator from './сalculators/PolynomialCalculator';
import RealCalculator from './сalculators/RealCalculator';

class calculatorCore extends React.Component {
    complex(re, im) {
        return new Complex(re, im);
    }

    vector(values) {
        return new Vector(values);
    }

    matrix(values) {
        return new Matrix(values);
    }

    getEntity(str) {
        str = str.replace(/\s/g, '');
        if (str.includes('[')) return this.getMatrix(str);
        if (str.includes('(')) return this.getVector(str);
        if (str.includes('x') || str.includes('^')) return this.getPolynomial(str);
        return this.getComplex(str);
    }

    getMatrix(str) {
        const arr = str.slice(1, -1).split('|').map(elems => elems.split(';').map(elem => this.getEntity(elem)));
        return this.matrix(arr);
    }

    getVector(str) {
        const arr = str.slice(1, -1).split(',').map(elem => this.getEntity(elem));
        return this.vector(arr);
    }

    getComplex(str) {
        if (str === 'i') return this.complex(0, 1);
        if (str === '-i') return this.complex(0, -1);
        if (str === '') return this.complex(0, 0);
        str = str.replace(/\s+/g, '');
        const regex = /^(-?\d*\.?\d*)?([+-](?:\d*\.?\d*)?i)?$/;
        const match = str.match(regex);
        let re = 0, im = 0;
        if (match[1] !== undefined && match[1] !== '') {
            re = parseFloat(match[1]);
        }
        if (match[2]) {
            if (match[2] === '+i' || match[2] === 'i') {
                im = 1;
            } else if (match[2] === '-i') {
                im = -1;
            } else {
                im = parseFloat(match[2].replace('i', ''));
            }
        }
        if (re === 0 && im === 0) return this.complex(0, 0);
        if (re === 0) {
            if (im === 1) return this.complex(0, 1);
            if (im === -1) return this.complex(0, -1);
            return this.complex(0, im);
        }
        if (im === 0) return this.complex(re, 0);
        return this.complex(re, im);
    }

    getPolynomial(str) {
        str = str.replace(/\s+/g, '')
            .replace(/-/g, '+-')
            .replace(/\+{2,}/g, '+');
        if (str.startsWith('+')) {
            str = str.substring(1);
        }
        const terms = str.split('+').filter(term => term !== '');
        const members = terms.map(term => this.getMember(term));
        return new Polynomial(members);
    }

    getMember(str) {
        if (!str) return new Member(0, 0);
        let value = 1;
        let power = 0;
        if (str.includes('x')) {
            const parts = str.split('x');
            if (parts[0] === '-') value = -1;
            else if (parts[0] === '') value = 1;
            else value = parseFloat(parts[0]);
            if (parts[1]) {
                power = parseInt(parts[1].replace('^', ''));
            } else {
                power = 1;
            }
        } else {
            value = parseFloat(str);
            power = 0;
        }
        return new Member(value, power);
    }

    get(elem) {
        if (elem instanceof Matrix) {
            return new MatrixCalculator(this.get(elem.values[0][0]));
        }
        if (elem instanceof Vector) {
            return new VectorCalculator(this.get(elem.values[0]));
        }
        if (elem instanceof Complex) {
            return new ComplexCalculator();
        }
        if (elem instanceof Polynomial) {
            return new PolynomialCalculator();
        }
        return new RealCalculator();
    }

    add(a, b) {
        return this.get(a).add(a, b);
    }

    sub(a, b) {
        return this.get(a).sub(a, b);
    }

mult(a, b) {
        return this.get(a).mult(a, b);
    }

    div(a, b) {
        return this.get(a).div(a, b);
    }

    prod(a, p) {
        return this.get(a).prod(a, p);
    }

    pow(a, p) {
        return this.get(a).pow(a, p);
    }

    zero(elem) {
        if (elem instanceof Matrix) {
            return this.get(elem).zero(elem.values.length);
        }
        if (elem instanceof Vector) {
            return this.get(elem).zero(elem.values.length);
        }
        return this.get().zero();
    }

    one(elem) {
        if (elem instanceof Matrix) {
            return this.get(elem).one(elem.values.length);
        }
        if (elem instanceof Vector) {
            return this.get(elem).one(elem.values.length);
        }
        return this.get().one();
    }
}

export default calculatorCore;