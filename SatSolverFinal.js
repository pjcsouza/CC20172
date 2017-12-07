exports.solve = function(fileName) {
    let formula =readFormula(fileName)
    let result = doSolve(formula.clauses, formula.variables)
    return result
}
function nextAssignment(currentAssignment) {
    //recebe um array, transforma em inteiro, acrescenta 1 e retorna para binario e volta para array
    let preIncrement=0
    let completeArray = ['0']
    for(i=currentAssignment.length-1;i>=0;i--){
        let pow = Math.pow(2, (currentAssignment.length-1)-i)
        preIncrement = preIncrement+(currentAssignment[i]*pow)
    }
    preIncrement = preIncrement+1
    preIncrement = (+preIncrement).toString(2)
    var newAssignment = preIncrement.split('')
    for(i=newAssignment.length;i<currentAssignment.length;i++){
        newAssignment = completeArray.concat(newAssignment)
    }

    return newAssignment
}
function doSolve(clauses, assignment) {
    let isSat = false
    while ((!isSat) && !runClauses(clauses, assignment)) {
        if(nextAssignment(assignment).length>assignment.length){
            isSat = true
        }else{
            assignment = nextAssignment(assignment)
        }
    }
    isSat = runClauses(clauses, assignment)
    let result = {'isSat': isSat, satisfyingAssignment: null}
    if (isSat) {
        result.satisfyingAssignment = assignment
    }
    return result
}
function readFormula(fileName) {
    let fs = require('fs')
    let cnf = fs.readFileSync(fileName).toString()
    let text = cnf.split('\n')
    let clauses = readClauses(text)
    let variables = readVariables(clauses)
    let specOk = checkProblemSpecification(text, clauses, variables)

    let result = { 'clauses': [], 'variables': [] }
    if (specOk) {
        result.clauses = clauses
        result.variables = variables
    }
    return result
}
function readClauses(text) {
    let preClauses = ''
    for(i =0; i<text.length; i++){
        if(text[i].charAt(0)!='p'&&text[i].charAt(0)!='c'){
            preClauses = preClauses+text[i]
        }
    }
    let clauses = preClauses.split(' 0')
    preClauses = [[]]
    for(i=0;i<clauses.length;i++) {
        preClauses[i] = clauses[i].split(" ")
    }
    clauses =[]
    for(i=0;i<preClauses.length;i++){

        if(preClauses[i].length>1){
            clauses[i] = preClauses[i]
        }

    }

    return clauses
}
function readVariables(clauses){
    //agrega todos os elementos das clausulas sem o sinal de negativo em um array simples
    let allVariables =[]
    for (i = 0; i < clauses.length; i++) {
        for (j = 0; j < clauses[i].length; j++) {
            let verifyOperator = clauses[i][j].charAt(0)
            if (verifyOperator == '-') {
                let clauseVar = (clauses[i][j].slice(1, this.length))
                allVariables = allVariables.concat(clauseVar)
            }else{
                let clauseVar = clauses[i][j]
                allVariables = allVariables.concat(clauseVar)
            }
        }
    }
    //procura pela maior variavel dentre todos, que sera o numero de variaveis
    let biggestVariable = allVariables[0]
    for(i = 1;i<allVariables.length;i++){
        if(biggestVariable-allVariables[i]>0){

        }else{
            biggestVariable = allVariables[i]
        }
    }
    //monta um array com zeros na quantidade de variaveis maxima
    let variables = []

    for(i=0;i<biggestVariable;i++){
        var def = ['0']
        variables = def.concat(variables)
    }
    return variables

}
function checkProblemSpecification(text, clauses, variables) {
    let numberOfVars
    let numberOfClauses
    let param =[]
    for(i =0; i<text.length; i++){
        if(text[i].charAt(0)=='p'){
            param = text[i].split(" ")
            numberOfVars = param[2]
            numberOfClauses = param [3]
        }
    }
    if(clauses.length>numberOfClauses){
        return false
    }else if(variables.length>numberOfVars){
        return false
    }else{
        return true
    }
}
function runClauses(clauses, assignment) {
    var resultAllClauses = true
    for (i = 0; i < clauses.length&&resultAllClauses; i++) {
        var result = false
        for (j = 0; j < clauses[i].length&&!result; j++) {
            var verifyOperator = clauses[i][j].charAt(0)
            if (verifyOperator == '-') {
                var clauseVar = (clauses[i][j].slice(1, this.length)) - 1
                if(assignment[clauseVar]=='0'){
                    result = true
                }else{}
            }else{
                var clauseVar = clauses[i][j]-1
                if(assignment[clauseVar]=='0'){
                }else{
                    result = true
                }
            }
        }
        resultAllClauses = result
    }return resultAllClauses
}

