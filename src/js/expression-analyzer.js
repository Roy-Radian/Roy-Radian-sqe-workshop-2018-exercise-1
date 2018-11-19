"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//TODO: Implement a[i], else, else if
var valid = function (x) { return x != null && x.hasOwnProperty("type"); };
var isWithType = function (x) { return x != null && x.hasOwnProperty("type"); };
var isProgram = function (x) { return isWithType(x) ? x.type == "Program" : false; };
exports.isProgram = isProgram;
var isExpression = function (x) { return isExpressionStatement(x) || isFunctionDeclaration(x) || isVariableDeclaration(x) || isAssignmentExpression(x) || isReturnStatement(x) || isWhileStatement(x) ||
    isDoWhileStatement(x) || isForStatement(x) || isBreakStatement(x) || isIfStatement(x); };
var isExpressionStatement = function (x) { return isWithType(x) ? x.type === "ExpressionStatement" : false; };
var isIdentifier = function (x) { return isWithType(x) ? x.type === "Identifier" : false; };
var isLiteral = function (x) { return isWithType(x) ? x.type === "Literal" : false; };
var isBinaryExpression = function (x) { return isWithType(x) ? x.type === "BinaryExpression" : false; };
var isUnaryExpression = function (x) { return isWithType(x) ? x.type === "UnaryExpression" : false; };
var isValueExpression = function (x) { return isLiteral(x) || isIdentifier(x) || isBinaryExpression(x) || isUnaryExpression(x) || isUpdateExpression(x) || isConditionalExpression(x); };
var isBlockStatement = function (x) { return isWithType(x) ? x.type === "BlockStatement" : false; };
var isBody = function (x) { return isBlockStatement(x) || isExpression(x); };
var isFunctionDeclaration = function (x) { return isWithType(x) ? x.type === "FunctionDeclaration" : false; };
var isVariableDeclarator = function (x) { return isWithType(x) ? x.type === "VariableDeclarator" : false; };
var isVariableDeclaration = function (x) { return isWithType(x) ? x.type === "VariableDeclaration" : false; };
var isAssignmentExpression = function (x) { return isWithType(x) ? x.type === "AssignmentExpression" : false; };
var isUpdateExpression = function (x) { return isWithType(x) ? x.type === "UpdateExpression" : false; };
var isConditionalExpression = function (x) { return isWithType(x) ? x.type === "ConditionalExpression" : false; };
var isMemberExpression = function (x) { return isWithType(x) ? x.type === "MemberExpression" : false; };
var isReturnStatement = function (x) { return isWithType(x) ? x.type === "ReturnStatement" : false; };
var isWhileStatement = function (x) { return isWithType(x) ? x.type === "WhileStatement" : false; };
var isDoWhileStatement = function (x) { return isWithType(x) ? x.type === "DoWhileStatement" : false; };
var isForStatement = function (x) { return isWithType(x) ? x.type === "ForStatement" : false; };
var isBreakStatement = function (x) { return isWithType(x) ? x.type === "BreakStatement" : false; };
var isIfStatement = function (x) { return isWithType(x) ? x.type === "IfStatement" : false; };
var EMPTY = "";
var expressionToAnalyzedLines = function (exp) {
    return isExpressionStatement(exp) ? expressionStatementToAnalyzedLines(exp) :
        isFunctionDeclaration(exp) ? functionDeclarationToAnalyzedLines(exp) :
            isVariableDeclaration(exp) ? variableDeclarationToAnalyzedLines(exp) :
                isValueExpression(exp) ? valueExpressionToAnalyzedLines(exp) :
                    isAssignmentExpression(exp) ? assignmentExpressionToAnalyzedLines(exp) :
                        isReturnStatement(exp) ? returnStatementToAnalyzedLines(exp) :
                            isWhileStatement(exp) ? whileStatementToAnalyzedLines(exp) :
                                isDoWhileStatement(exp) ? doWhileStatementToAnalyzedLines(exp) :
                                    isForStatement(exp) ? forStatementToAnalyzedLines(exp) :
                                        isBreakStatement(exp) ? breakStatementToAnalyzedLines(exp) :
                                            isIfStatement(exp) ? ifStatementToAnalyzedLines(exp) :
                                                conditionalExpressionToAnalyzedLines(exp);
};
var expressionStatementToAnalyzedLines = function (expStatement) {
    return expressionToAnalyzedLines(expStatement.expression);
};
var functionDeclarationToAnalyzedLines = function (func) {
    return [{ line: func.loc.start.line, type: func.type, name: func.id.name, condition: EMPTY, value: EMPTY }];
};
var variableDeclarationToAnalyzedLines = function (varDec) {
    return varDec.declarations.map(function (varDeclarator) { return variableDeclaratorToAnalyzedLine(varDeclarator); });
};
var variableDeclaratorToAnalyzedLine = function (varDec) {
    return ({ line: varDec.loc.start.line, type: varDec.type, name: varDec.id.name, condition: EMPTY, value: getValOfInit(varDec.init) });
};
var getValOfInit = function (init) {
    return isValueExpression(init) ? getValOfValExp(init) :
        "null";
};
var getValOfValExp = function (v) {
    return isLiteral(v) ? v.raw :
        isIdentifier(v) ? v.name :
            isBinaryExpression(v) ? getValOfValExp(v.left) + " " + v.operator + getValOfValExp(v.right) :
                isUnaryExpression(v) ? (v.prefix ? v.operator + getValOfValExp(v.argument) : getValOfValExp(v.argument) + v.operator) :
                    isUpdateExpression(v) ? (v.prefix ? v.operator + getValOfValExp(v.argument) : getValOfValExp(v.argument) + v.operator) :
                        isConditionalExpression(v) ? getValOfConditionalExpression(v) :
                            getValOfValExp(v.object) + "[" + getValOfValExp(v.property) + "]";
};
var getValOfConditionalExpression = function (cond) {
    return "(" + getValOfValExp(cond.test) + " ? " + getValOfValExp(cond.consequent) + " : " + getValOfValExp(cond.alternate);
};
var valueExpressionToAnalyzedLines = function (val) {
    return isLiteral(val) ? literalExpressionToAnalyzedLines(val) :
        isIdentifier(val) ? identifierToAnalyzedLines(val) :
            isBinaryExpression(val) ? binaryExpressionToAnalyzedLines(val) :
                isUnaryExpression(val) ? unaryExpressionToAnalyzedLines(val) :
                    isUpdateExpression(val) ? updateExpressionToAnalyzedLines(val) :
                        isConditionalExpression(val) ? conditionalExpressionToAnalyzedLines(val) :
                            memberExpressionToAnalyzedLines(val);
};
var literalExpressionToAnalyzedLines = function (l) {
    return [{ line: l.loc.start.line, type: l.type, name: EMPTY, condition: EMPTY, value: l.raw }];
};
var identifierToAnalyzedLines = function (i) {
    return [{ line: i.loc.start.line, type: i.type, name: i.name, condition: EMPTY, value: EMPTY }];
};
var binaryExpressionToAnalyzedLines = function (b) {
    return [{ line: b.loc.start.line, type: b.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(b) }];
};
var unaryExpressionToAnalyzedLines = function (u) {
    return [{ line: u.loc.start.line, type: u.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(u) }];
};
var updateExpressionToAnalyzedLines = function (u) {
    return [{ line: u.loc.start.line, type: u.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(u) }];
};
var assignmentExpressionToAnalyzedLines = function (assignmentExpression) {
    return [{ line: assignmentExpression.loc.start.line, type: assignmentExpression.type, name: assignmentExpression.left.name, condition: EMPTY, value: getValOfValExp(assignmentExpression.right) }];
};
var returnStatementToAnalyzedLines = function (ret) {
    return [{ line: ret.loc.start.line, type: ret.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(ret.argument) }];
};
var whileStatementToAnalyzedLines = function (whileStatement) {
    return [{ line: whileStatement.loc.start.line, type: whileStatement.type, name: EMPTY, condition: getValOfValExp(whileStatement.test), value: EMPTY }];
};
var forStatementToAnalyzedLines = function (forStatement) {
    return [{ line: forStatement.loc.start.line, type: forStatement.type, name: EMPTY, condition: getValOfValExp(forStatement.test), value: EMPTY }];
};
var breakStatementToAnalyzedLines = function (breakStatement) {
    return [{ line: breakStatement.loc.start.line, type: breakStatement.type, name: EMPTY, condition: EMPTY, value: EMPTY }];
};
var ifStatementToAnalyzedLines = function (ifStatement) {
    return [{ line: ifStatement.loc.start.line, type: ifStatement.type, name: EMPTY, condition: getValOfValExp(ifStatement.test), value: EMPTY }];
};
var elseToAnalyzedLines = function (alt) {
    return [{ line: alt.loc.start.line, type: "else", name: EMPTY, condition: EMPTY, value: EMPTY }];
};
var conditionalExpressionToAnalyzedLines = function (conditionalExpression) {
    return [{ line: conditionalExpression.loc.start.line, type: conditionalExpression.type, name: EMPTY, condition: getValOfValExp(conditionalExpression.test), value: EMPTY }];
};
var memberExpressionToAnalyzedLines = function (memberExpression) {
    return [{ line: memberExpression.loc.start.line, type: memberExpression.type, name: EMPTY, condition: EMPTY, value: EMPTY }];
};
var doWhileStatementToAnalyzedLines = function (doWhileStatement) {
    return [{ line: doWhileStatement.loc.start.line, type: doWhileStatement.type, name: EMPTY, condition: getValOfValExp(doWhileStatement.test), value: EMPTY }];
};
var concatAnalyzedLines = function (prev, curr) { return prev.concat(curr); };
var programToAnalyzedLines = function (program) {
    return program.body.length > 0 ? program.body.map(function (exp) { return getAllAnalyzedLines(exp); }).reduce(concatAnalyzedLines) : [];
};
exports.programToAnalyzedLines = programToAnalyzedLines;
var getAllAnalyzedLines = function (exp) {
    return isExpressionStatement(exp) ? getAllAnalyzedLines(exp.expression) :
        isFunctionDeclaration(exp) ? getAnalyzedLinesFromFunctionDeclaration(exp) :
            isVariableDeclaration(exp) ? variableDeclarationToAnalyzedLines(exp) :
                isLiteral(exp) ? literalExpressionToAnalyzedLines(exp) :
                    isIdentifier(exp) ? identifierToAnalyzedLines(exp) :
                        isValueExpression(exp) ? valueExpressionToAnalyzedLines(exp) :
                            isAssignmentExpression(exp) ? assignmentExpressionToAnalyzedLines(exp) :
                                isReturnStatement(exp) ? returnStatementToAnalyzedLines(exp) :
                                    isWhileStatement(exp) ? getAnalyzedLinesFromWhileStatement(exp) :
                                        isDoWhileStatement(exp) ? getAnalyzedLinesFromDoWhileStatement(exp) :
                                            isForStatement(exp) ? getAnalyzedLinesFromForStatement(exp) :
                                                isBreakStatement(exp) ? breakStatementToAnalyzedLines(exp) :
                                                    getAnalyzedLinesFromIfStatement(exp);
};
var getAnalyzedLinesFromBody = function (b) {
    return isBlockStatement(b) ? b.body.map(function (exp) { return getAllAnalyzedLines(exp); }).reduce(concatAnalyzedLines) :
        getAllAnalyzedLines(b);
};
var getAnalyzedLinesFromFunctionDeclaration = function (func) {
    return functionDeclarationToAnalyzedLines(func).concat(getAnalyzedLinesFromBody(func.body));
};
var getAnalyzedLinesFromWhileStatement = function (whileStatement) {
    return whileStatementToAnalyzedLines(whileStatement).concat(getAnalyzedLinesFromBody(whileStatement.body));
};
var getAnalyzedLinesFromDoWhileStatement = function (doWhileStatement) {
    return doWhileStatementToAnalyzedLines(doWhileStatement).concat(getAnalyzedLinesFromBody(doWhileStatement.body));
};
var getAnalyzedLinesFromForStatement = function (forStatement) {
    return forStatementToAnalyzedLines(forStatement).concat(getAnalyzedLinesFromBody(forStatement.body));
};
var getAnalyzedLinesFromIfStatement = function (ifStatement) {
    return ifStatementToAnalyzedLines(ifStatement).concat(getAnalyzedLinesFromBody(ifStatement.consequent)).concat(getAnalyzedLinesFromAlternate(ifStatement.alternate));
};
var getAnalyzedLinesFromAlternate = function (altBody) {
    return isBody(altBody) ? elseToAnalyzedLines(altBody).concat(getAnalyzedLinesFromBody(altBody)) : [];
};
