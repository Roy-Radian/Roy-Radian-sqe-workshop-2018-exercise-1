import {parseCode} from './code-analyzer';

//TODO: Implement a[i], else, else if

const isNull = (x: any): x is null => x === null;

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
const isProgram = (x: any): x is Program => !isNull(x) && x.type == "Program";

type Expression = ExpressionStatement | FunctionDeclaration | VariableDeclaration | ValueExpression | AssignmentExpression | ReturnStatement | WhileStatement | DoWhileStatement | ForStatement |
    BreakStatement | IfStatement;
const isExpression = (x: any): x is Expression => isExpressionStatement(x) || isFunctionDeclaration(x) || isVariableDeclaration(x) || isAssignmentExpression(x) || isReturnStatement(x) || isWhileStatement(x) ||
    isDoWhileStatement(x) || isForStatement(x) || isBreakStatement(x) || isIfStatement(x);

interface ExpressionStatement {
    type: "ExpressionStatement";
    expression: Expression;
    loc: Location
}
const isExpressionStatement = (x: any): x is ExpressionStatement => !isNull(x) && x.type === "ExpressionStatement";

interface Identifier {
    type: "Identifier";
    name: string;
    loc: Location;
}
const isIdentifier = (x: any): x is Identifier => !isNull(x) && x.type === "Identifier";

interface Literal {
    type: "Literal";
    value: any;
    raw: string;
    loc: Location;
}
const isLiteral = (x: any): x is Literal => !isNull(x) && x.type === "Literal";

type BinaryOperator = "+" | "-" | "*" | "/" | ">" | "<" | ">=" | "<=" | "==" | "===" | "**";
interface BinaryExpression {
    type: "BinaryExpression";
    operator: BinaryOperator;
    left: ValueExpression;
    right: ValueExpression;
    loc: Location;
}
const isBinaryExpression = (x: any): x is BinaryExpression => !isNull(x) && x.type === "BinaryExpression";

type UnaryOperator = "!" | "-" | "+";
interface UnaryExpression {
    type: "UnaryExpression";
    operator: UnaryOperator;
    argument: ValueExpression;
    prefix: boolean;
    loc: Location;
}
const isUnaryExpression = (x: any): x is UnaryExpression => !isNull(x) && x.type === "UnaryExpression";

type ValueExpression = Literal | Identifier | BinaryExpression | UnaryExpression | UpdateExpression | ConditionalExpression | MemberExpression;
const isValueExpression = (x: any): x is ValueExpression => isLiteral(x) || isIdentifier(x) || isBinaryExpression(x) || isUnaryExpression(x) || isUpdateExpression(x) || isConditionalExpression(x);

interface BlockStatement {
    type: "BlockStatement";
    body: Expression[];
    loc: Location;
}
const isBlockStatement = (x: any): x is BlockStatement => !isNull(x) && x.type === "BlockStatement";

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
const isFunctionDeclaration = (x: any): x is FunctionDeclaration => !isNull(x) && x.type === "FunctionDeclaration";

interface VariableDeclarator {
    type: "VariableDeclarator";
    id: Identifier;
    init: ValueExpression;
    loc: Location;
}
const isVariableDeclarator = (x: any): x is VariableDeclarator => !isNull(x) && x.type === "VariableDeclarator";

interface VariableDeclaration {
    type: "VariableDeclaration";
    declarations: VariableDeclarator[];
    kind: "var" | "let";
    loc: Location;
}
const isVariableDeclaration = (x: any): x is VariableDeclaration => !isNull(x) && x.type === "VariableDeclaration";

type AssignmentOperator = "=" | "+=" | "-=" | "*=" | "/=";
interface AssignmentExpression {
    type: "AssignmentExpression";
    operator: AssignmentOperator;
    left: Identifier;
    right: ValueExpression;
    loc: Location;
}
const isAssignmentExpression = (x: any): x is AssignmentExpression => !isNull(x) && x.type === "AssignmentExpression";

interface UpdateExpression {
    type: "UpdateExpression";
    operator: "++" | "--";
    argument: Identifier;
    prefix: boolean;
    loc: Location;
}
const isUpdateExpression = (x: any): x is UpdateExpression => !isNull(x) && x.type === "UpdateExpression";

interface ConditionalExpression {
    type: "ConditionalExpression";
    test: ValueExpression;
    consequent: ValueExpression;
    alternate: ValueExpression;
    loc: Location;
}
const isConditionalExpression = (x: any): x is ConditionalExpression => !isNull(x) && x.type === "ConditionalExpression";

interface MemberExpression {
    type: "MemberExpression";
    computed: boolean;
    object: ValueExpression;
    property: ValueExpression;
    loc: Location;
}
const isMemberExpression = (x: any): x is MemberExpression => !isNull(x) && x.type === "MemberExpression";

interface ReturnStatement {
    type: "ReturnStatement";
    argument: ValueExpression;
    loc: Location;
}
const isReturnStatement = (x: any): x is ReturnStatement => !isNull(x) && x.type === "ReturnStatement";

interface WhileStatement {
    type: "WhileStatement";
    test: ValueExpression;
    body: BlockStatement;
    loc: Location;
}
const isWhileStatement = (x: any) : x is WhileStatement => !isNull(x) && x.type === "WhileStatement";

interface DoWhileStatement {
    type: "DoWhileStatement";
    test: ValueExpression;
    body: BlockStatement;
    loc: Location;
}
const isDoWhileStatement = (x: any): x is DoWhileStatement => !isNull(x) && x.type === "DoWhileStatement";

interface ForStatement {
    type: "ForStatement";
    init: Expression;
    test: ValueExpression;
    update: AssignmentExpression | UpdateExpression;
    body: BlockStatement;
    loc: Location;
}
const isForStatement = (x: any): x is ForStatement => !isNull(x) && x.type === "ForStatement";

interface BreakStatement {
    type: "BreakStatement";
    label: any;
    loc: Location;
}
const isBreakStatement = (x: any): x is BreakStatement => !isNull(x) && x.type === "BreakStatement";


interface IfStatement {
    type: "IfStatement";
    test: ValueExpression;
    consequent: Body;
    alternate: Body | null;
    loc: Location;
}
const isIfStatement = (x: any): x is IfStatement => !isNull(x) && x.type === "IfStatement";

const EMPTY = "";
interface TableEntry {
    line: number;
    type: string;
    name: string;
    condition: string;
    value: string;
}
const tableEntryToHtml = (tbl: TableEntry): string =>
    `<tr><td>${tbl.line}</td><td>${tbl.type}</td><td>${tbl.name}</td><td>${tbl.condition}</td><td>${tbl.value}</td></tr>`;


const expressionToTblEntries = (exp: Expression): TableEntry[] =>
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


const expressionStatementToTblEntries = (expStatement: ExpressionStatement): TableEntry[] =>
    expressionToTblEntries(expStatement.expression);

const functionDeclarationToTblEntries = (func: FunctionDeclaration): TableEntry[] =>
    [{line: func.loc.start.line, type: func.type, name: func.id.name, condition: EMPTY, value: EMPTY}];

const variableDeclarationToTblEntries = (varDec: VariableDeclaration): TableEntry[] =>
    varDec.declarations.map((varDeclarator) => variableDeclaratorToTblEntry(varDeclarator));

const variableDeclaratorToTblEntry = (varDec: VariableDeclarator): TableEntry =>
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

const valueExpressionToTblEntries = (val: ValueExpression): TableEntry[] =>
    isLiteral(val) ? literalExpressionToTblEntries(val) :
    isIdentifier(val) ? identifierToTblEntries(val) :
    isBinaryExpression(val) ? binaryExpressionToTblEntries(val) :
    isUnaryExpression(val) ? unaryExpressionToTblEntries(val) :
    isUpdateExpression(val) ? updateExpressionToTblEntries(val) :
    isConditionalExpression(val) ? conditionalExpressionToTblEntries(val) :
    memberExpressionToTblEntries(val);

const literalExpressionToTblEntries = (l: Literal): TableEntry[] =>
    [{line: l.loc.start.line, type: l.type, name: EMPTY, condition: EMPTY, value: l.raw}];

const identifierToTblEntries = (i: Identifier): TableEntry[] =>
    [{line: i.loc.start.line, type: i.type, name: i.name, condition: EMPTY, value: EMPTY}];

const binaryExpressionToTblEntries = (b: BinaryExpression): TableEntry[] =>
    [{line: b.loc.start.line, type: b.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(b)}];

const unaryExpressionToTblEntries = (u: UnaryExpression): TableEntry[] =>
    [{line: u.loc.start.line, type: u.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(u)}];

const updateExpressionToTblEntries = (u: UpdateExpression): TableEntry[] =>
    [{line: u.loc.start.line, type: u.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(u)}];

const assignmentExpressionToTblEntries = (assignmentExpression: AssignmentExpression): TableEntry[] =>
    [{line: assignmentExpression.loc.start.line, type: assignmentExpression.type, name: assignmentExpression.left.name, condition: EMPTY, value: getValOfValExp(assignmentExpression.right)}];

const returnStatementToTblEntries = (ret: ReturnStatement): TableEntry[] =>
    [{line: ret.loc.start.line, type: ret.type, name: EMPTY, condition: EMPTY, value: getValOfValExp(ret.argument)}];

const whileStatementToTblEntries = (whileStatement: WhileStatement): TableEntry[] =>
    [{line: whileStatement.loc.start.line, type: whileStatement.type, name: EMPTY, condition: getValOfValExp(whileStatement.test), value: EMPTY}];

const forStatementToTblEntries = (forStatement: ForStatement): TableEntry[] =>
    [{line: forStatement.loc.start.line, type: forStatement.type, name: EMPTY, condition: getValOfValExp(forStatement.test), value: EMPTY}];

const breakStatementToTblEntries = (breakStatement: BreakStatement): TableEntry[] =>
    [{line: breakStatement.loc.start.line, type: breakStatement.type, name: EMPTY, condition: EMPTY, value: EMPTY}];

const ifStatementToTblEntries = (ifStatement: IfStatement): TableEntry[] =>
    [{line: ifStatement.loc.start.line, type: ifStatement.type, name: EMPTY, condition: getValOfValExp(ifStatement.test), value: EMPTY}];

const conditionalExpressionToTblEntries = (conditionalExpression: ConditionalExpression): TableEntry[] =>
    [{line: conditionalExpression.loc.start.line, type: conditionalExpression.type, name: EMPTY, condition: getValOfValExp(conditionalExpression.test), value: EMPTY}];

const memberExpressionToTblEntries = (memberExpression: MemberExpression): TableEntry[] =>
    [{line: memberExpression.loc.start.line, type: memberExpression.type, name: EMPTY, condition: EMPTY, value: EMPTY}];

const doWhileStatementToTblEntries = (doWhileStatement: DoWhileStatement): TableEntry[] =>
    [{line: doWhileStatement.loc.start.line, type: doWhileStatement.type, name: EMPTY, condition: getValOfValExp(doWhileStatement.test), value: EMPTY}];

const notAProgram: string = "<table><tr><td>Not a program!</td></tr>";
const headers: string = "<tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr>";
const concatStringTableEntries = (prev: string, curr: string): string => prev + curr;
const constructTable = (program: any): string =>
    isProgram(program) ? tableEntriesIntoTable(programToTableEntries(program)) : //programToTableEntries(program).map((tblEntry: TableEntry): string => tblEntry.toHTML()).reduce(concatStringTableEntries) :
    notAProgram;

const tableEntriesIntoTable = (entries: TableEntry[]): string =>
    "<table>" + headers + entries.map((tblEntry: TableEntry): string => tableEntryToHtml(tblEntry)).reduce(concatStringTableEntries) + "</table>";

const concatTableEntries = (prev: TableEntry[], curr: TableEntry[]): TableEntry[] => prev.concat(curr);
const programToTableEntries = (program: Program): TableEntry[] =>
    program.body.map((exp: Expression) => getAllTableEntries(exp)).reduce(concatTableEntries);

const getAllTableEntries = (exp: Expression): TableEntry[] =>
    isExpressionStatement(exp) ? getAllTableEntries(exp.expression) :
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

const getTableEntriesFromBody = (b: Body): TableEntry[] =>
    isBlockStatement(b) ? b.body.map((exp: Expression) => getAllTableEntries(exp)).reduce(concatTableEntries) :
        getAllTableEntries(b);

const getTableEntriesFromFunctionDeclaration = (func: FunctionDeclaration): TableEntry[] =>
    functionDeclarationToTblEntries(func).concat(getTableEntriesFromBody(func.body));

const getTableEntriesFromWhileStatement = (whileStatement: WhileStatement): TableEntry[] =>
    whileStatementToTblEntries(whileStatement).concat(getTableEntriesFromBody(whileStatement.body));

const getTableEntriesFromDoWhileStatement = (doWhileStatement: DoWhileStatement): TableEntry[] =>
    doWhileStatementToTblEntries(doWhileStatement).concat(getTableEntriesFromBody(doWhileStatement.body));

const getTableEntriesFromForStatement = (forStatement: ForStatement): TableEntry[] =>
    forStatementToTblEntries(forStatement).concat(getTableEntriesFromBody(forStatement.body));

const getTableEntriesFromIfStatement = (ifStatement: IfStatement): TableEntry[] =>
    ifStatementToTblEntries(ifStatement).concat(getTableEntriesFromBody(ifStatement.consequent)).concat(getTableEntriesFromAlternate(ifStatement.alternate));

const getTableEntriesFromAlternate = (altBody: Body | null) : TableEntry[] =>
    isBody(altBody) ? getTableEntriesFromBody(altBody) : [];

export {constructTable};