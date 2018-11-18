interface CodePostition {
    line: number;
    column: number;
}

interface Location {
    start: CodePostition;
    end: CodePostition;
}

type Expression = ExpressionStatement | FunctionDeclaration | VariableDeclaration | ValueExpression | AssignmentExpression | ReturnStatement | WhileStatement | DoWhileStatement | ForStatement |
    BreakStatement | IfStatement;

interface ExpressionStatement {
    type: "ExpressionStatement";
    expression: Expression;
    loc: Location
}
let isExpressionStatement = (x: any): x is ExpressionStatement => x.type === "ExpressionStatement";

interface Identifier {
    type: "Identifier";
    name: string;
    loc: Location;
}
let isIdentifier = (x: any): x is Identifier => x.type === "Identifier";

interface Literal {
    type: "Literal";
    value: any;
    raw: string;
    loc: Location;
}
let isLiteral = (x: any): x is Literal => x.type === "Literal";

type BinaryOperator = "+" | "-" | "*" | "/" | ">" | "<" | ">=" | "<=" | "==" | "===" | "**";
interface BinaryExpression {
    type: "BinaryExpression";
    operator: BinaryOperator;
    left: ValueExpression;
    right: ValueExpression;
    loc: Location;
}
let isBinaryExpression = (x: any): x is BinaryExpression => x.type === "BinaryExpression";

type UnaryOperator = "!" | "-" | "+";
interface UnaryExpression {
    type: "UnaryExpression";
    operator: UnaryOperator;
    argument: ValueExpression;
    prefix: boolean;
    loc: Location;
}
let isUnaryExpression = (x: any): x is UnaryExpression => x.type === "UnaryExpression";

type ValueExpression = Literal | Identifier | BinaryExpression | UnaryExpression | UpdateExpression | ConditionalExpression;
let isValueExpression = (x: any): x is ValueExpression => isLiteral(x) || isIdentifier(x) || isBinaryExpression(x) || isUnaryExpression(x) || isUpdateExpression(x) || isConditionalExpression(x);

    interface BlockStatement {
    type: "BlockStatement";
    body: Expression[];
}
let isBlockStatement = (x: any): x is BlockStatement => x.type === "BlockStatement";

interface FunctionDeclaration {
    type: "FunctionDeclaration";
    id: Identifier;
    params: Identifier[];
    body: BlockStatement | Expression;
    generator: boolean;
    expression: boolean;
    async: boolean;
    loc: Location;
}
let isFunctionDeclaration = (x: any): x is FunctionDeclaration => x.type === "FunctionDeclaration";

interface VariableDeclarator {
    type: "VariableDeclarator";
    id: Identifier;
    init: ValueExpression;
    loc: Location;
}
let isVariableDeclarator = (x: any): x is VariableDeclarator => x.type === "VariableDeclarator";

interface VariableDeclaration {
    type: "VariableDeclaration";
    declarations: VariableDeclarator[];
    kind: "var" | "let";
    loc: Location;
}
let isVariableDeclaration = (x: any): x is VariableDeclaration => x.type === "VariableDeclaration";

type AssignmentOperator = "=" | "+=" | "-=" | "*=" | "/=";
interface AssignmentExpression {
    type: "AssignmentExpression";
    operator: AssignmentOperator;
    left: Identifier;
    right: ValueExpression;
    loc: Location;
}
let isAssignmentExpression = (x: any): x is AssignmentExpression => x.type === "AssignmentExpression";

interface UpdateExpression {
    type: "UpdateExpression";
    operator: "++" | "--";
    argument: Identifier;
    prefix: boolean;
    loc: Location;
}
let isUpdateExpression = (x: any): x is UpdateExpression => x.type === "UpdateExpression";

interface ReturnStatement {
    type: "ReturnStatement";
    argument: ValueExpression;
    loc: Location;
}
let isReturnStatement = (x: any): x is ReturnStatement => x.type === "ReturnStatement";

interface WhileStatement {
    type: "WhileStatement";
    test: ValueExpression;
    body: BlockStatement;
    loc: Location;
}
let isWhileStatement = (x: any) : x is WhileStatement => x.type === "WhileStatement";

interface DoWhileStatement {
    type: "DoWhileStatement";
    test: ValueExpression;
    body: BlockStatement;
    loc: Location;
}
let isDoWhileStatement = (x: any): x is DoWhileStatement => x.type === "DoWhileStatement";

interface ForStatement {
    type: "ForStatement";
    init: Expression;
    test: ValueExpression;
    update: AssignmentExpression | UpdateExpression;
    body: BlockStatement;
    loc: Location;
}
let isForStatement = (x: any): x is ForStatement => x.type === "ForStatement";

interface BreakStatement {
    type: "BreakStatement";
    label: any;
    loc: Location;
}
let isBreakStatement = (x: any): x is BreakStatement => x.type === "BreakStatement";


interface IfStatement {
    type: "IfStatement";
    test: ValueExpression;
    consequent: BlockStatement | Expression;
    alternate: BlockStatement | Expression | null;
    loc: Location;
}
let isIfStatement = (x: any): x is IfStatement => x.type === "IfStatement";

interface ConditionalExpression {
    type: "ConditionalExpression";
    test: ValueExpression;
    consequent: ValueExpression;
    alternate: ValueExpression;
    loc: Location;
}
let isConditionalExpression = (x: any): x is ConditionalExpression => x.type === "ConditionalExpression";


const EMPTY = "";
const tblEntryToHTML = () => `<tr><td>${this.line}</td><td>${this.type}</td><td>${this.name}</td><td>${this.condition}</td><td>${this.value}</td></tr>`;
interface TableEntry {
    line: number;
    type: string;
    name: string;
    condition: string;
    value: string;
    toHTML: () => string;
}

let expressionToTblEntries = (exp: Expression): TableEntry[] =>
    isExpressionStatement(exp) ? expressionStatementToTblEntries(exp) :
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


let expressionStatementToTblEntries = (expStatement: ExpressionStatement): TableEntry[] =>
    expressionToTblEntries(expStatement.expression);

let functionDeclarationToTblEntries = (func: FunctionDeclaration): TableEntry[] =>
    [{line: func.loc.start.line, type: func.type, name: func.id.name, condition: EMPTY, value: EMPTY, toHTML: tblEntryToHTML}];

let variableDeclarationToTblEntries = (varDec: VariableDeclaration): TableEntry[] =>
    varDec.declarations.map((varDeclarator) => variableDeclaratorToTblEntry(varDeclarator));

const variableDeclaratorToTblEntry = (varDec: VariableDeclarator): TableEntry =>
    ({line: varDec.loc.start.line, type: varDec.type, name: varDec.id.name, condition: EMPTY, value: getValOfInit(varDec.init), toHTML: tblEntryToHTML});

const getValOfInit = (init: ValueExpression | null): string =>
    isValueExpression(init) ? getValOfValExp(init) :
    "null";

const getValOfValExp = (v: ValueExpression): string =>
    isLiteral(v) ? v.raw :
    isIdentifier(v) ? v.name :
    isBinaryExpression(v) ? getValOfValExp(v.left) + " " + v.operator + getValOfValExp(v.right) :
    isUnaryExpression(v) ? (v.prefix ? v.operator + getValOfValExp(v.argument) : getValOfValExp(v.argument) + v.operator) :
    isUpdateExpression(v) ? (v.prefix ? v.operator + getValOfValExp(v.argument) : getValOfValExp(v.argument) + v.operator) :
    getValOfConditionalExpression(v);

const getValOfConditionalExpression = (cond: ConditionalExpression): string =>
    `(${getValOfValExp(cond.test)} ? ${getValOfValExp(cond.consequent)} : ${getValOfValExp(cond.alternate)}`;

const valueExpressionToTblEntries = (val: ValueExpression): TableEntry[] =>
    isLiteral(val) ? literalExpressionToTblEntries(val) :
    isIdentifier(val) ? identifierToTblEntries(val) :
    isBinaryExpression(val) ? binaryExpressionToTblEntries(val) :
    isUnaryExpression(val) ? unaryExpressionToTblEntries(val) :
    isUpdateExpression(val) ? updateExpressionToTblEntries(val) :
    conditionalExpressionToTblEntries(val);

const literalExpressionToTblEntries = (l: Literal): TableEntry[] =>
    [{line: l.loc.start.line, type: l.type, name: EMPTY, condition: EMPTY, value: l.raw, toHTML: tblEntryToHTML}];

const identifierToTblEntries = (i: Identifier): TableEntry[] =>
    [{line: i.loc.start.line, type: i.type, name: i.name, condition: EMPTY, value: EMPTY, toHTML: tblEntryToHTML}];

const binaryExpressionToTblEntries = (b: BinaryExpression): TableEntry[] =>
    [{line: b.loc.start.line, type: b.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(b), toHTML: tblEntryToHTML}];

const unaryExpressionToTblEntries = (u: UnaryExpression): TableEntry[] =>
    [{line: u.loc.start.line, type: u.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(u), toHTML: tblEntryToHTML}];

const updateExpressionToTblEntries = (u: UpdateExpression): TableEntry[] =>
    [{line: u.loc.start.line, type: u.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(u), toHTML: tblEntryToHTML}];

const assignmentExpressionToTblEntries = (assignmentExpression: AssignmentExpression): TableEntry[] =>
    [{line: assignmentExpression.loc.start.line, type: assignmentExpression.type, name: assignmentExpression.left.name, condition: EMPTY, value: getValOfValExp(assignmentExpression.right), toHTML: tblEntryToHTML}];

const returnStatementToTblEntries = (ret: ReturnStatement): TableEntry[] =>
    [{line: ret.loc.start.line, type: ret.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(ret.argument), toHTML: tblEntryToHTML}];

const whileStatementToTblEntries = (whileStatement: WhileStatement): TableEntry[] =>
    [{line: whileStatement.loc.start.line, type: whileStatement.type, name: EMPTY, condition: getValOfValExp(whileStatement.test), value: EMPTY, toHTML: tblEntryToHTML}];

const forStatementToTblEntries = (forStatement: ForStatement): TableEntry[] =>
    [{line: forStatement.loc.start.line, type: forStatement.type, name: EMPTY, condition: getValOfValExp(forStatement.test), value: EMPTY, toHTML: tblEntryToHTML}];

const breakStatementToTblEntries = (breakStatement: BreakStatement): TableEntry[] =>
    [{line: breakStatement.loc.start.line, type: breakStatement.type, name: EMPTY, condition: EMPTY, value: EMPTY, toHTML: tblEntryToHTML}];

const ifStatementToTblEntries = (ifStatement: IfStatement): TableEntry[] =>
    [{line: ifStatement.loc.start.line, type: ifStatement.type, name: EMPTY, condition: getValOfValExp(ifStatement.test), value: EMPTY, toHTML: tblEntryToHTML}];

const conditionalExpressionToTblEntries = (conditionalExpression: ConditionalExpression): TableEntry[] =>
    [{line: conditionalExpression.loc.start.line, type: conditionalExpression.type, name: EMPTY, condition: getValOfValExp(conditionalExpression.test), value: EMPTY, toHTML: tblEntryToHTML}];

const doWhileStatementToTblEntries = (doWhileStatement: DoWhileStatement): TableEntry[] =>
    [{line: doWhileStatement.loc.start.line, type: doWhileStatement.type, name: EMPTY, condition: getValOfValExp(doWhileStatement.test), value: EMPTY, toHTML: tblEntryToHTML}];