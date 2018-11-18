var _this = this;
var isExpressionStatement = function (x) { return x.type === "ExpressionStatement"; };
var isIdentifier = function (x) { return x.type === "Identifier"; };
var isLiteral = function (x) { return x.type === "Literal"; };
var isBinaryExpression = function (x) { return x.type === "BinaryExpression"; };
var isUnaryExpression = function (x) { return x.type === "UnaryExpression"; };
var isValueExpression = function (x) { return isLiteral(x) || isIdentifier(x) || isBinaryExpression(x) || isUnaryExpression(x) || isUpdateExpression(x) || isConditionalExpression(x); };
var isBlockStatement = function (x) { return x.type === "BlockStatement"; };
var isFunctionDeclaration = function (x) { return x.type === "FunctionDeclaration"; };
var isVariableDeclarator = function (x) { return x.type === "VariableDeclarator"; };
var isVariableDeclaration = function (x) { return x.type === "VariableDeclaration"; };
var isAssignmentExpression = function (x) { return x.type === "AssignmentExpression"; };
var isUpdateExpression = function (x) { return x.type === "UpdateExpression"; };
var isReturnStatement = function (x) { return x.type === "ReturnStatement"; };
var isWhileStatement = function (x) { return x.type === "WhileStatement"; };
var isDoWhileStatement = function (x) { return x.type === "DoWhileStatement"; };
var isForStatement = function (x) { return x.type === "ForStatement"; };
var isBreakStatement = function (x) { return x.type === "BreakStatement"; };
var isIfStatement = function (x) { return x.type === "IfStatement"; };
var isConditionalExpression = function (x) { return x.type === "ConditionalExpression"; };
var EMPTY = "";
var tblEntryToHTML = function () { return "<tr><td>" + _this.line + "</td><td>" + _this.type + "</td><td>" + _this.name + "</td><td>" + _this.condition + "</td><td>" + _this.value + "</td></tr>"; };
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
    return [{ line: func.loc.start.line, type: func.type, name: func.id.name, condition: EMPTY, value: EMPTY, toHTML: tblEntryToHTML }];
};
var variableDeclarationToTblEntries = function (varDec) {
    return varDec.declarations.map(function (varDeclarator) { return variableDeclaratorToTblEntry(varDeclarator); });
};
var variableDeclaratorToTblEntry = function (varDec) {
    return ({ line: varDec.loc.start.line, type: varDec.type, name: varDec.id.name, condition: EMPTY, value: getValOfInit(varDec.init), toHTML: tblEntryToHTML });
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
                        getValOfConditionalExpression(v);
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
                        conditionalExpressionToTblEntries(val);
};
var literalExpressionToTblEntries = function (l) {
    return [{ line: l.loc.start.line, type: l.type, name: EMPTY, condition: EMPTY, value: l.raw, toHTML: tblEntryToHTML }];
};
var identifierToTblEntries = function (i) {
    return [{ line: i.loc.start.line, type: i.type, name: i.name, condition: EMPTY, value: EMPTY, toHTML: tblEntryToHTML }];
};
var binaryExpressionToTblEntries = function (b) {
    return [{ line: b.loc.start.line, type: b.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(b), toHTML: tblEntryToHTML }];
};
var unaryExpressionToTblEntries = function (u) {
    return [{ line: u.loc.start.line, type: u.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(u), toHTML: tblEntryToHTML }];
};
var updateExpressionToTblEntries = function (u) {
    return [{ line: u.loc.start.line, type: u.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(u), toHTML: tblEntryToHTML }];
};
var assignmentExpressionToTblEntries = function (assignmentExpression) {
    return [{ line: assignmentExpression.loc.start.line, type: assignmentExpression.type, name: assignmentExpression.left.name, condition: EMPTY, value: getValOfValExp(assignmentExpression.right), toHTML: tblEntryToHTML }];
};
var returnStatementToTblEntries = function (ret) {
    return [{ line: ret.loc.start.line, type: ret.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(ret.argument), toHTML: tblEntryToHTML }];
};
var whileStatementToTblEntries = function (whileStatement) {
    return [{ line: whileStatement.loc.start.line, type: whileStatement.type, name: EMPTY, condition: getValOfValExp(whileStatement.test), value: EMPTY, toHTML: tblEntryToHTML }];
};
var forStatementToTblEntries = function (forStatement) {
    return [{ line: forStatement.loc.start.line, type: forStatement.type, name: EMPTY, condition: getValOfValExp(forStatement.test), value: EMPTY, toHTML: tblEntryToHTML }];
};
var breakStatementToTblEntries = function (breakStatement) {
    return [{ line: breakStatement.loc.start.line, type: breakStatement.type, name: EMPTY, condition: EMPTY, value: EMPTY, toHTML: tblEntryToHTML }];
};
var ifStatementToTblEntries = function (ifStatement) {
    return [{ line: ifStatement.loc.start.line, type: ifStatement.type, name: EMPTY, condition: getValOfValExp(ifStatement.test), value: EMPTY, toHTML: tblEntryToHTML }];
};
var conditionalExpressionToTblEntries = function (conditionalExpression) {
    return [{ line: conditionalExpression.loc.start.line, type: conditionalExpression.type, name: EMPTY, condition: getValOfValExp(conditionalExpression.test), value: EMPTY, toHTML: tblEntryToHTML }];
};
var doWhileStatementToTblEntries = function (doWhileStatement) {
    return [{ line: doWhileStatement.loc.start.line, type: doWhileStatement.type, name: EMPTY, condition: getValOfValExp(doWhileStatement.test), value: EMPTY, toHTML: tblEntryToHTML }];
};
