import assert from 'assert';
import {isProgram, programToAnalyzedLines} from '../src/js/expression-analyzer';

describe('Make sure isProgram can handle a program, null, objects without type, and objects with bad type', () => {
    assert.equal(isProgram({ 'type': 'Program', 'body': [], 'sourceType': 'script', 'loc': { 'start': { 'line': 0, 'column': 0 }, 'end': { 'line': 0, 'column': 0 } } }), true);
    assert.equal(isProgram(null), false);
    assert.equal(isProgram({'loc': { 'start': { 'line': 0, 'column': 0 }, 'end': { 'line': 0, 'column': 0 }}}), false);
    assert.equal(isProgram({ 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 1, 'column': 4 }, 'end': { 'line': 1, 'column': 5 } } }, 'init': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 1, 'column': 8 }, 'end': { 'line': 1, 'column': 9 } } }, 'loc': { 'start': { 'line': 1, 'column': 4 }, 'end': { 'line': 1, 'column': 9 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 10 } } }), false);
});

const varDecProgram = { 'type': 'Program', 'body': [ { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'b', 'loc': { 'start': { 'line': 1, 'column': 4 }, 'end': { 'line': 1, 'column': 5 } } }, 'init': null, 'loc': { 'start': { 'line': 1, 'column': 4 }, 'end': { 'line': 1, 'column': 5 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 6 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 6 } } };
const varDecAnalyzedLines = [{line: 1, type: 'VariableDeclarator', name: 'b', condition: '', value: 'null'}];
const varDecAndInitProgram = { 'type': 'Program', 'body': [ { 'type': 'VariableDeclaration', 'declarations': [ { 'type': 'VariableDeclarator', 'id': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 1, 'column': 4 }, 'end': { 'line': 1, 'column': 5 } } }, 'init': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 1, 'column': 8 }, 'end': { 'line': 1, 'column': 9 } } }, 'loc': { 'start': { 'line': 1, 'column': 4 }, 'end': { 'line': 1, 'column': 9 } } } ], 'kind': 'let', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 10 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 10 } } };
const varDecAndInitAnalyzedLines = [{line: 1, type: 'VariableDeclarator', name: 'a', condition: '', value: '5'}];
describe('Variable Declaration is parsed correctly, with and without initialization', () => {
    if (isProgram(varDecProgram))
        assert.deepEqual(programToAnalyzedLines(varDecProgram), varDecAnalyzedLines);
    else
        assert.fail();

    if (isProgram(varDecAndInitProgram))
        assert.deepEqual(programToAnalyzedLines(varDecAndInitProgram), varDecAndInitAnalyzedLines);
    else
        assert.fail();
});

const simpleVarAssignmentProgram = { 'type': 'Program', 'body': [ { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 1 } } }, 'right': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 1, 'column': 4 }, 'end': { 'line': 1, 'column': 5 } } }, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 5 } } }, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 6 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 6 } } };
const simpleVarAssignmentAnalyzedLines = [{line: 1, type: 'AssignmentExpression', name: 'a', condition: '', value: 5}];
const compoundVarAssignmentProgram = { 'type': 'Program', 'body': [ { 'type': 'ExpressionStatement', 'expression': { 'type': 'AssignmentExpression', 'operator': '=', 'left': { 'type': 'Identifier', 'name': 'a', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 1 } } }, 'right': { 'type': 'BinaryExpression', 'operator': '/', 'left': { 'type': 'BinaryExpression', 'operator': '+', 'left': { 'type': 'Literal', 'value': 5, 'raw': '5', 'loc': { 'start': { 'line': 1, 'column': 5 }, 'end': { 'line': 1, 'column': 6 } } }, 'right': { 'type': 'Literal', 'value': 2, 'raw': '2', 'loc': { 'start': { 'line': 1, 'column': 9 }, 'end': { 'line': 1, 'column': 10 } } }, 'loc': { 'start': { 'line': 1, 'column': 5 }, 'end': { 'line': 1, 'column': 10 } } }, 'right': { 'type': 'MemberExpression', 'computed': true, 'object': { 'type': 'Identifier', 'name': 'm', 'loc': { 'start': { 'line': 1, 'column': 12 }, 'end': { 'line': 1, 'column': 13 } } }, 'property': { 'type': 'Literal', 'value': 3, 'raw': '3', 'loc': { 'start': { 'line': 1, 'column': 14 }, 'end': { 'line': 1, 'column': 15 } } }, 'loc': { 'start': { 'line': 1, 'column': 12 }, 'end': { 'line': 1, 'column': 16 } } }, 'loc': { 'start': { 'line': 1, 'column': 4 }, 'end': { 'line': 1, 'column': 16 } } }, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 16 } } }, 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 17 } } } ], 'sourceType': 'script', 'loc': { 'start': { 'line': 1, 'column': 0 }, 'end': { 'line': 1, 'column': 17 } } };
const compoundVarAssignmentAnalyzedLines = [{line: 1, type: 'AssignmentExpression', name: 'a', condition: '', value: '5 +2 /m[3]'}];
describe('Variable Assignment is parsed correctly', () => {
    if (isProgram(simpleVarAssignmentProgram))
        assert.deepEqual(programToAnalyzedLines(simpleVarAssignmentProgram), simpleVarAssignmentAnalyzedLines);
    else
        assert.fail();

    if (isProgram(compoundVarAssignmentProgram))
        assert.deepEqual(programToAnalyzedLines(compoundVarAssignmentProgram), compoundVarAssignmentAnalyzedLines);
    else
        assert.fail();
});