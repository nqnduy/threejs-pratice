
const containsAssignmentOperator = (str) => /(\+=|-=|\*=|\/=)/.test(str);
const createAssignmentFunction = (operatorString, value) => new Function('value', `return value ${operatorString}${value}`);

const useSetThreeAttr = (attr) => {
    //Parse strings and execute allowed features
    const convertOperator = (initialVal, axisParam) => {
        const { operator, operand } = axisParam;
        switch (operator) {
            case '+': return createAssignmentFunction("+=", operand)(initialVal);
            case '-': return createAssignmentFunction("-=", operand)(initialVal);
            case '*': return createAssignmentFunction("*=", operand)(initialVal);
            case '/': return createAssignmentFunction("/=", operand)(initialVal);
            default: return 0;
        }
    }
    const setValue = (initialVal, axis) => {
        switch (typeof axis) {
            case 'string': {
                if (!containsAssignmentOperator(axis)) return;
                const axisParam = {
                    operator: axis.charAt(0),
                    operand: parseFloat(axis.substring(2))
                }
                return convertOperator(initialVal, axisParam);
            }
            case 'number': return axis;
            case 'function': return axis();
            default: return 0; // Invalid value
        }
    }

    return (mesh, obj) => {
        Object.keys(obj).map(key => mesh[attr][key] = setValue(mesh[attr][key], obj[key]));
        // for (const key in obj) mesh[attr][key] = setValue(mesh[attr][key], obj[key])
    }
}
export default useSetThreeAttr;