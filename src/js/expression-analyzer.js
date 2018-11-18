"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//TODO: Implement a[i], else, else if
var isNull = function (x) { return x === null; };
var isProgram = function (x) { return !isNull(x) && x.type == "Program"; };
var isExpression = function (x) { return isExpressionStatement(x) || isFunctionDeclaration(x) || isVariableDeclaration(x) || isAssignmentExpression(x) || isReturnStatement(x) || isWhileStatement(x) ||
    isDoWhileStatement(x) || isForStatement(x) || isBreakStatement(x) || isIfStatement(x); };
var isExpressionStatement = function (x) { return !isNull(x) && x.type === "ExpressionStatement"; };
var isIdentifier = function (x) { return !isNull(x) && x.type === "Identifier"; };
var isLiteral = function (x) { return !isNull(x) && x.type === "Literal"; };
var isBinaryExpression = function (x) { return !isNull(x) && x.type === "BinaryExpression"; };
var isUnaryExpression = function (x) { return !isNull(x) && x.type === "UnaryExpression"; };
var isValueExpression = function (x) { return isLiteral(x) || isIdentifier(x) || isBinaryExpression(x) || isUnaryExpression(x) || isUpdateExpression(x) || isConditionalExpression(x); };
var isBlockStatement = function (x) { return !isNull(x) && x.type === "BlockStatement"; };
var isBody = function (x) { return isBlockStatement(x) || isExpression(x); };
var isFunctionDeclaration = function (x) { return !isNull(x) && x.type === "FunctionDeclaration"; };
var isVariableDeclarator = function (x) { return !isNull(x) && x.type === "VariableDeclarator"; };
var isVariableDeclaration = function (x) { return !isNull(x) && x.type === "VariableDeclaration"; };
var isAssignmentExpression = function (x) { return !isNull(x) && x.type === "AssignmentExpression"; };
var isUpdateExpression = function (x) { return !isNull(x) && x.type === "UpdateExpression"; };
var isConditionalExpression = function (x) { return !isNull(x) && x.type === "ConditionalExpression"; };
var isMemberExpression = function (x) { return !isNull(x) && x.type === "MemberExpression"; };
var isReturnStatement = function (x) { return !isNull(x) && x.type === "ReturnStatement"; };
var isWhileStatement = function (x) { return !isNull(x) && x.type === "WhileStatement"; };
var isDoWhileStatement = function (x) { return !isNull(x) && x.type === "DoWhileStatement"; };
var isForStatement = function (x) { return !isNull(x) && x.type === "ForStatement"; };
var isBreakStatement = function (x) { return !isNull(x) && x.type === "BreakStatement"; };
var isIfStatement = function (x) { return !isNull(x) && x.type === "IfStatement"; };
var EMPTY = "";
var tableEntryToHtml = function (tbl) {
    return "<tr><td>" + tbl.line + "</td><td>" + tbl.type + "</td><td>" + tbl.name + "</td><td>" + tbl.condition + "</td><td>" + tbl.value + "</td></tr>";
};
var expressionToTblEntries = function (exp) {
    return isExpressionStatement(exp) ? expressionStatementToTblEntries(exp) :
        isFunctionDeclaration(exp) ? functionDeclarationToTblEntries(exp) :
            isVariableDeclaration(exp) ? variableDeclarationToTblEntries(exp) :
                isValueExpression(exp) ? valueExpressionToTblEntries(exp) :
                    isAssignmentExpression(exp) ? assignmentExpressionToTblEntries(exp) :
                        isReturnStatement(exp) ? returnStatementToTblEntries(exp) :
                            isWhileStatement(exp) ? whileStatementToTblEntries(exp) :
                                isDoWhileStatement(exp) ? doWhileStatementToTblEntries(exp) :
                                    isForStatement(exp) ? forStatementToTblEntries(exp) :
                                        isBreakStatement(exp) ? breakStatementToTblEntries(exp) :
                                            isIfStatement(exp) ? ifStatementToTblEntries(exp) :
                                                conditionalExpressionToTblEntries(exp);
};
var expressionStatementToTblEntries = function (expStatement) {
    return expressionToTblEntries(expStatement.expression);
};
var functionDeclarationToTblEntries = function (func) {
    return [{ line: func.loc.start.line, type: func.type, name: func.id.name, condition: EMPTY, value: EMPTY }];
};
var variableDeclarationToTblEntries = function (varDec) {
    return varDec.declarations.map(function (varDeclarator) { return variableDeclaratorToTblEntry(varDeclarator); });
};
var variableDeclaratorToTblEntry = function (varDec) {
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
var valueExpressionToTblEntries = function (val) {
    return isLiteral(val) ? literalExpressionToTblEntries(val) :
        isIdentifier(val) ? identifierToTblEntries(val) :
            isBinaryExpression(val) ? binaryExpressionToTblEntries(val) :
                isUnaryExpression(val) ? unaryExpressionToTblEntries(val) :
                    isUpdateExpression(val) ? updateExpressionToTblEntries(val) :
                        isConditionalExpression(val) ? conditionalExpressionToTblEntries(val) :
                            memberExpressionToTblEntries(val);
};
var literalExpressionToTblEntries = function (l) {
    return [{ line: l.loc.start.line, type: l.type, name: EMPTY, condition: EMPTY, value: l.raw }];
};
var identifierToTblEntries = function (i) {
    return [{ line: i.loc.start.line, type: i.type, name: i.name, condition: EMPTY, value: EMPTY }];
};
var binaryExpressionToTblEntries = function (b) {
    return [{ line: b.loc.start.line, type: b.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(b) }];
};
var unaryExpressionToTblEntries = function (u) {
    return [{ line: u.loc.start.line, type: u.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(u) }];
};
var updateExpressionToTblEntries = function (u) {
    return [{ line: u.loc.start.line, type: u.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(u) }];
};
var assignmentExpressionToTblEntries = function (assignmentExpression) {
    return [{ line: assignmentExpression.loc.start.line, type: assignmentExpression.type, name: assignmentExpression.left.name, condition: EMPTY, value: getValOfValExp(assignmentExpression.right) }];
};
var returnStatementToTblEntries = function (ret) {
    return [{ line: ret.loc.start.line, type: ret.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(ret.argument) }];
};
var whileStatementToTblEntries = function (whileStatement) {
    return [{ line: whileStatement.loc.start.line, type: whileStatement.type, name: EMPTY, condition: getValOfValExp(whileStatement.test), value: EMPTY }];
};
var forStatementToTblEntries = function (forStatement) {
    return [{ line: forStatement.loc.start.line, type: forStatement.type, name: EMPTY, condition: getValOfValExp(forStatement.test), value: EMPTY }];
};
var breakStatementToTblEntries = function (breakStatement) {
    return [{ line: breakStatement.loc.start.line, type: breakStatement.type, name: EMPTY, condition: EMPTY, value: EMPTY }];
};
var ifStatementToTblEntries = function (ifStatement) {
    return [{ line: ifStatement.loc.start.line, type: ifStatement.type, name: EMPTY, condition: getValOfValExp(ifStatement.test), value: EMPTY }];
};
var conditionalExpressionToTblEntries = function (conditionalExpression) {
    return [{ line: conditionalExpression.loc.start.line, type: conditionalExpression.type, name: EMPTY, condition: getValOfValExp(conditionalExpression.test), value: EMPTY }];
};
var memberExpressionToTblEntries = function (memberExpression) {
    return [{ line: memberExpression.loc.start.line, type: memberExpression.type, name: EMPTY, condition: EMPTY, value: EMPTY }];
};
var doWhileStatementToTblEntries = function (doWhileStatement) {
    return [{ line: doWhileStatement.loc.start.line, type: doWhileStatement.type, name: EMPTY, condition: getValOfValExp(doWhileStatement.test), value: EMPTY }];
};
var notAProgram = "<table><tr><td>Not a program!</td></tr>";
var headers = "<tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr>";
var concatStringTableEntries = function (prev, curr) { return prev + curr; };
var constructTable = function (program) {
    return isProgram(program) ? tableEntriesIntoTable(programToTableEntries(program)) : //programToTableEntries(program).map((tblEntry: TableEntry): string => tblEntry.toHTML()).reduce(concatStringTableEntries) :
        notAProgram;
};
exports.constructTable = constructTable;
var tableEntriesIntoTable = function (entries) {
    return "<table>" + headers + entries.map(function (tblEntry) { return tableEntryToHtml(tblEntry); }).reduce(concatStringTableEntries) + "</table>";
};
var concatTableEntries = function (prev, curr) { return prev.concat(curr); };
var programToTableEntries = function (program) {
    return program.body.map(function (exp) { return getAllTableEntries(exp); }).reduce(concatTableEntries);
};
var getAllTableEntries = function (exp) {
    return isExpressionStatement(exp) ? getAllTableEntries(exp.expression) :
        isFunctionDeclaration(exp) ? getTableEntriesFromFunctionDeclaration(exp) :
            isVariableDeclaration(exp) ? variableDeclarationToTblEntries(exp) :
                isLiteral(exp) ? literalExpressionToTblEntries(exp) :
                    isIdentifier(exp) ? identifierToTblEntries(exp) :
                        isValueExpression(exp) ? valueExpressionToTblEntries(exp) :
                            isAssignmentExpression(exp) ? assignmentExpressionToTblEntries(exp) :
                                isReturnStatement(exp) ? returnStatementToTblEntries(exp) :
                                    isWhileStatement(exp) ? getTableEntriesFromWhileStatement(exp) :
                                        isDoWhileStatement(exp) ? getTableEntriesFromDoWhileStatement(exp) :
                                            isForStatement(exp) ? getTableEntriesFromForStatement(exp) :
                                                isBreakStatement(exp) ? breakStatementToTblEntries(exp) :
                                                    getTableEntriesFromIfStatement(exp);
};
var getTableEntriesFromBody = function (b) {
    return isBlockStatement(b) ? b.body.map(function (exp) { return getAllTableEntries(exp); }).reduce(concatTableEntries) :
        getAllTableEntries(b);
};
var getTableEntriesFromFunctionDeclaration = function (func) {
    return functionDeclarationToTblEntries(func).concat(getTableEntriesFromBody(func.body));
};
var getTableEntriesFromWhileStatement = function (whileStatement) {
    return whileStatementToTblEntries(whileStatement).concat(getTableEntriesFromBody(whileStatement.body));
};
var getTableEntriesFromDoWhileStatement = function (doWhileStatement) {
    return doWhileStatementToTblEntries(doWhileStatement).concat(getTableEntriesFromBody(doWhileStatement.body));
};
var getTableEntriesFromForStatement = function (forStatement) {
    return forStatementToTblEntries(forStatement).concat(getTableEntriesFromBody(forStatement.body));
};
var getTableEntriesFromIfStatement = function (ifStatement) {
    return ifStatementToTblEntries(ifStatement).concat(getTableEntriesFromBody(ifStatement.consequent)).concat(getTableEntriesFromAlternate(ifStatement.alternate));
};
var getTableEntriesFromAlternate = function (altBody) {
    return isBody(altBody) ? getTableEntriesFromBody(altBody) : [];
};
