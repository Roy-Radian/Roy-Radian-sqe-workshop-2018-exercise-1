import {parseCode} from './code-analyzer';

//TODO: Implement a[i], else, else if

const valid = (x: any): x is null => x != null && x.hasOwnProperty("type");

interface WithType {
    type: string;
}
const isWithType = (x: object): x is WithType => x != null && x.hasOwnProperty("type");

interface CodePostition {
    line: number;
    column: number;
}

interface Location {
    start: CodePostition;
    end: CodePostition;
}

interface Program {
    type: "Program";
    body: Expression[];
    sourceType: string;
    loc: Location;
}
const isProgram = (x: object): x is Program => isWithType(x) ? x.type == "Program" : false;

type Expression = ExpressionStatement | FunctionDeclaration | VariableDeclaration | ValueExpression | AssignmentExpression | ReturnStatement | WhileStatement | DoWhileStatement | ForStatement |
    BreakStatement | IfStatement;
const isExpression = (x: any): x is Expression => isExpressionStatement(x) || isFunctionDeclaration(x) || isVariableDeclaration(x) || isAssignmentExpression(x) || isReturnStatement(x) || isWhileStatement(x) ||
    isDoWhileStatement(x) || isForStatement(x) || isBreakStatement(x) || isIfStatement(x);

interface ExpressionStatement {
    type: "ExpressionStatement";
    expression: Expression;
    loc: Location
}
const isExpressionStatement = (x: any): x is ExpressionStatement => isWithType(x) ? x.type === "ExpressionStatement" : false;

interface Identifier {
    type: "Identifier";
    name: string;
    loc: Location;
}
const isIdentifier = (x: any): x is Identifier => isWithType(x) ? x.type === "Identifier" : false;

interface Literal {
    type: "Literal";
    value: any;
    raw: string;
    loc: Location;
}
const isLiteral = (x: any): x is Literal => isWithType(x) ? x.type === "Literal" : false;

type BinaryOperator = "+" | "-" | "*" | "/" | ">" | "<" | ">=" | "<=" | "==" | "===" | "**";
interface BinaryExpression {
    type: "BinaryExpression";
    operator: BinaryOperator;
    left: ValueExpression;
    right: ValueExpression;
    loc: Location;
}
const isBinaryExpression = (x: any): x is BinaryExpression => isWithType(x) ? x.type === "BinaryExpression" : false;

type UnaryOperator = "!" | "-" | "+";
interface UnaryExpression {
    type: "UnaryExpression";
    operator: UnaryOperator;
    argument: ValueExpression;
    prefix: boolean;
    loc: Location;
}
const isUnaryExpression = (x: any): x is UnaryExpression => isWithType(x) ? x.type === "UnaryExpression" : false;

type ValueExpression = Literal | Identifier | BinaryExpression | UnaryExpression | UpdateExpression | ConditionalExpression | MemberExpression;
const isValueExpression = (x: any): x is ValueExpression => isLiteral(x) || isIdentifier(x) || isBinaryExpression(x) || isUnaryExpression(x) || isUpdateExpression(x) || isConditionalExpression(x);

interface BlockStatement {
    type: "BlockStatement";
    body: Expression[];
    loc: Location;
}
const isBlockStatement = (x: any): x is BlockStatement => isWithType(x) ? x.type === "BlockStatement" : false;

type Body = BlockStatement | Expression;
const isBody = (x: any): x is Body => isBlockStatement(x) || isExpression(x);

interface FunctionDeclaration {
    type: "FunctionDeclaration";
    id: Identifier;
    params: Identifier[];
    body: Body;
    generator: boolean;
    expression: boolean;
    async: boolean;
    loc: Location;
}
const isFunctionDeclaration = (x: any): x is FunctionDeclaration => isWithType(x) ? x.type === "FunctionDeclaration" : false;

interface VariableDeclarator {
    type: "VariableDeclarator";
    id: Identifier;
    init: ValueExpression;
    loc: Location;
}
const isVariableDeclarator = (x: any): x is VariableDeclarator => isWithType(x) ? x.type === "VariableDeclarator" : false;

interface VariableDeclaration {
    type: "VariableDeclaration";
    declarations: VariableDeclarator[];
    kind: "var" | "let";
    loc: Location;
}
const isVariableDeclaration = (x: any): x is VariableDeclaration => isWithType(x) ? x.type === "VariableDeclaration" : false;

type AssignmentOperator = "=" | "+=" | "-=" | "*=" | "/=";
interface AssignmentExpression {
    type: "AssignmentExpression";
    operator: AssignmentOperator;
    left: Identifier;
    right: ValueExpression;
    loc: Location;
}
const isAssignmentExpression = (x: any): x is AssignmentExpression => isWithType(x) ? x.type === "AssignmentExpression" : false;

interface UpdateExpression {
    type: "UpdateExpression";
    operator: "++" | "--";
    argument: Identifier;
    prefix: boolean;
    loc: Location;
}
const isUpdateExpression = (x: any): x is UpdateExpression => isWithType(x) ? x.type === "UpdateExpression" : false;

interface ConditionalExpression {
    type: "ConditionalExpression";
    test: ValueExpression;
    consequent: ValueExpression;
    alternate: ValueExpression;
    loc: Location;
}
const isConditionalExpression = (x: any): x is ConditionalExpression => isWithType(x) ? x.type === "ConditionalExpression" : false;

interface MemberExpression {
    type: "MemberExpression";
    computed: boolean;
    object: ValueExpression;
    property: ValueExpression;
    loc: Location;
}
const isMemberExpression = (x: any): x is MemberExpression => isWithType(x) ? x.type === "MemberExpression" : false;

interface ReturnStatement {
    type: "ReturnStatement";
    argument: ValueExpression;
    loc: Location;
}
const isReturnStatement = (x: any): x is ReturnStatement => isWithType(x) ? x.type === "ReturnStatement" : false;

interface WhileStatement {
    type: "WhileStatement";
    test: ValueExpression;
    body: BlockStatement;
    loc: Location;
}
const isWhileStatement = (x: any) : x is WhileStatement => isWithType(x) ? x.type === "WhileStatement" : false;

interface DoWhileStatement {
    type: "DoWhileStatement";
    test: ValueExpression;
    body: BlockStatement;
    loc: Location;
}
const isDoWhileStatement = (x: any): x is DoWhileStatement => isWithType(x) ? x.type === "DoWhileStatement" : false;

interface ForStatement {
    type: "ForStatement";
    init: Expression;
    test: ValueExpression;
    update: AssignmentExpression | UpdateExpression;
    body: BlockStatement;
    loc: Location;
}
const isForStatement = (x: any): x is ForStatement => isWithType(x) ? x.type === "ForStatement" : false;

interface BreakStatement {
    type: "BreakStatement";
    label: any;
    loc: Location;
}
const isBreakStatement = (x: any): x is BreakStatement => isWithType(x) ? x.type === "BreakStatement" : false;


interface IfStatement {
    type: "IfStatement";
    test: ValueExpression;
    consequent: Body;
    alternate: Body | null;
    loc: Location;
}
const isIfStatement = (x: any): x is IfStatement => isWithType(x) ? x.type === "IfStatement" : false;

const EMPTY = "";
interface AnalyzedLine {
    line: number;
    type: string;
    name: string;
    condition: string;
    value: string;
}

const expressionToAnalyzedLines = (exp: Expression): AnalyzedLine[] =>
    isExpressionStatement(exp) ? expressionStatementToAnalyzedLines(exp) :
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

const expressionStatementToAnalyzedLines = (expStatement: ExpressionStatement): AnalyzedLine[] =>
    expressionToAnalyzedLines(expStatement.expression);

const functionDeclarationToAnalyzedLines = (func: FunctionDeclaration): AnalyzedLine[] =>
    [{line: func.loc.start.line, type: func.type, name: func.id.name, condition: EMPTY, value: EMPTY}];

const variableDeclarationToAnalyzedLines = (varDec: VariableDeclaration): AnalyzedLine[] =>
    varDec.declarations.map((varDeclarator) => variableDeclaratorToAnalyzedLine(varDeclarator));

const variableDeclaratorToAnalyzedLine = (varDec: VariableDeclarator): AnalyzedLine =>
    ({line: varDec.loc.start.line, type: varDec.type, name: varDec.id.name, condition: EMPTY, value: getValOfInit(varDec.init)});

const getValOfInit = (init: ValueExpression | null): string =>
    isValueExpression(init) ? getValOfValExp(init) :
    "null";

const getValOfValExp = (v: ValueExpression): string =>
    isLiteral(v) ? v.raw :
    isIdentifier(v) ? v.name :
    isBinaryExpression(v) ? getValOfValExp(v.left) + " " + v.operator + getValOfValExp(v.right) :
    isUnaryExpression(v) ? (v.prefix ? v.operator + getValOfValExp(v.argument) : getValOfValExp(v.argument) + v.operator) :
    isUpdateExpression(v) ? (v.prefix ? v.operator + getValOfValExp(v.argument) : getValOfValExp(v.argument) + v.operator) :
    isConditionalExpression(v) ? getValOfConditionalExpression(v) :
    getValOfValExp(v.object) + "[" + getValOfValExp(v.property) + "]";

const getValOfConditionalExpression = (cond: ConditionalExpression): string =>
    `(${getValOfValExp(cond.test)} ? ${getValOfValExp(cond.consequent)} : ${getValOfValExp(cond.alternate)}`;

const valueExpressionToAnalyzedLines = (val: ValueExpression): AnalyzedLine[] =>
    isLiteral(val) ? literalExpressionToAnalyzedLines(val) :
    isIdentifier(val) ? identifierToAnalyzedLines(val) :
    isBinaryExpression(val) ? binaryExpressionToAnalyzedLines(val) :
    isUnaryExpression(val) ? unaryExpressionToAnalyzedLines(val) :
    isUpdateExpression(val) ? updateExpressionToAnalyzedLines(val) :
    isConditionalExpression(val) ? conditionalExpressionToAnalyzedLines(val) :
    memberExpressionToAnalyzedLines(val);

const literalExpressionToAnalyzedLines = (l: Literal): AnalyzedLine[] =>
    [{line: l.loc.start.line, type: l.type, name: EMPTY, condition: EMPTY, value: l.raw}];

const identifierToAnalyzedLines = (i: Identifier): AnalyzedLine[] =>
    [{line: i.loc.start.line, type: i.type, name: i.name, condition: EMPTY, value: EMPTY}];

const binaryExpressionToAnalyzedLines = (b: BinaryExpression): AnalyzedLine[] =>
    [{line: b.loc.start.line, type: b.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(b)}];

const unaryExpressionToAnalyzedLines = (u: UnaryExpression): AnalyzedLine[] =>
    [{line: u.loc.start.line, type: u.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(u)}];

const updateExpressionToAnalyzedLines = (u: UpdateExpression): AnalyzedLine[] =>
    [{line: u.loc.start.line, type: u.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(u)}];

const assignmentExpressionToAnalyzedLines = (assignmentExpression: AssignmentExpression): AnalyzedLine[] =>
    [{line: assignmentExpression.loc.start.line, type: assignmentExpression.type, name: assignmentExpression.left.name, condition: EMPTY, value: getValOfValExp(assignmentExpression.right)}];

const returnStatementToAnalyzedLines = (ret: ReturnStatement): AnalyzedLine[] =>
    [{line: ret.loc.start.line, type: ret.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(ret.argument)}];

const whileStatementToAnalyzedLines = (whileStatement: WhileStatement): AnalyzedLine[] =>
    [{line: whileStatement.loc.start.line, type: whileStatement.type, name: EMPTY, condition: getValOfValExp(whileStatement.test), value: EMPTY}];

const forStatementToAnalyzedLines = (forStatement: ForStatement): AnalyzedLine[] =>
    [{line: forStatement.loc.start.line, type: forStatement.type, name: EMPTY, condition: getValOfValExp(forStatement.test), value: EMPTY}];

const breakStatementToAnalyzedLines = (breakStatement: BreakStatement): AnalyzedLine[] =>
    [{line: breakStatement.loc.start.line, type: breakStatement.type, name: EMPTY, condition: EMPTY, value: EMPTY}];

const ifStatementToAnalyzedLines = (ifStatement: IfStatement): AnalyzedLine[] =>
    [{line: ifStatement.loc.start.line, type: ifStatement.type, name: EMPTY, condition: getValOfValExp(ifStatement.test), value: EMPTY}];

const elseToAnalyzedLines = (alt: Body): AnalyzedLine[] =>
    [{line: alt.loc.start.line, type: "else", name: EMPTY, condition: EMPTY, value: EMPTY}];

const conditionalExpressionToAnalyzedLines = (conditionalExpression: ConditionalExpression): AnalyzedLine[] =>
    [{line: conditionalExpression.loc.start.line, type: conditionalExpression.type, name: EMPTY, condition: getValOfValExp(conditionalExpression.test), value: EMPTY}];

const memberExpressionToAnalyzedLines = (memberExpression: MemberExpression): AnalyzedLine[] =>
    [{line: memberExpression.loc.start.line, type: memberExpression.type, name: EMPTY, condition: EMPTY, value: EMPTY}];

const doWhileStatementToAnalyzedLines = (doWhileStatement: DoWhileStatement): AnalyzedLine[] =>
    [{line: doWhileStatement.loc.start.line, type: doWhileStatement.type, name: EMPTY, condition: getValOfValExp(doWhileStatement.test), value: EMPTY}];

const concatAnalyzedLines = (prev: AnalyzedLine[], curr: AnalyzedLine[]): AnalyzedLine[] => prev.concat(curr);
const programToAnalyzedLines = (program: Program): AnalyzedLine[] =>
    program.body.length > 0 ? program.body.map((exp: Expression) => getAllAnalyzedLines(exp)).reduce(concatAnalyzedLines) : [];

const getAllAnalyzedLines = (exp: Expression): AnalyzedLine[] =>
    isExpressionStatement(exp) ? getAllAnalyzedLines(exp.expression) :
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

const getAnalyzedLinesFromBody = (b: Body): AnalyzedLine[] =>
    isBlockStatement(b) ? b.body.map((exp: Expression) => getAllAnalyzedLines(exp)).reduce(concatAnalyzedLines) :
        getAllAnalyzedLines(b);

const getAnalyzedLinesFromFunctionDeclaration = (func: FunctionDeclaration): AnalyzedLine[] =>
    functionDeclarationToAnalyzedLines(func).concat(getAnalyzedLinesFromBody(func.body));

const getAnalyzedLinesFromWhileStatement = (whileStatement: WhileStatement): AnalyzedLine[] =>
    whileStatementToAnalyzedLines(whileStatement).concat(getAnalyzedLinesFromBody(whileStatement.body));

const getAnalyzedLinesFromDoWhileStatement = (doWhileStatement: DoWhileStatement): AnalyzedLine[] =>
    doWhileStatementToAnalyzedLines(doWhileStatement).concat(getAnalyzedLinesFromBody(doWhileStatement.body));

const getAnalyzedLinesFromForStatement = (forStatement: ForStatement): AnalyzedLine[] =>
    forStatementToAnalyzedLines(forStatement).concat(getAnalyzedLinesFromBody(forStatement.body));

const getAnalyzedLinesFromIfStatement = (ifStatement: IfStatement): AnalyzedLine[] =>
    ifStatementToAnalyzedLines(ifStatement).concat(getAnalyzedLinesFromBody(ifStatement.consequent)).concat(getAnalyzedLinesFromAlternate(ifStatement.alternate));

const getAnalyzedLinesFromAlternate = (altBody: Body | null) : AnalyzedLine[] =>
    isBody(altBody) ? elseToAnalyzedLines(altBody).concat(getAnalyzedLinesFromBody(altBody)) : [];

export {AnalyzedLine, isProgram, programToAnalyzedLines};