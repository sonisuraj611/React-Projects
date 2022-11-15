import { useReducer } from 'react';
import './App.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';


export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  EVALUATE: 'evaluate',
}
const reducer = (state, { type, payload }) => {
  switch (type) {

    case ACTIONS.ADD_DIGIT:
      if (state.overWrite) {
        return {
          ...state,
          overWrite: false,
          currentOperand: payload.digit
        }
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      return {
        ...state, currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.DELETE_DIGIT:
      if (state.overWrite) {
        return {
          ...state,
          currentOperand: null,
          overWrite: false
        }
      }
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      if (state.currentOperand == null) {
        return state
      }
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)

      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      return {
        ...state,
        operation: payload.operation,
        previousOperand: evaluate(state),
        currentOperand: null
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.EVALUATE:
      if (state.previousOperand == null || state.currentOperand == null || state.operation == null) {
        return state
      }
      return {
        ...state,
        operation: null,
        previousOperand: null,
        overWrite: true,
        currentOperand: evaluate(state),
      }
    default:
      return state
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const current = parseFloat(currentOperand)
  const previous = parseFloat(previousOperand)
  if (isNaN(previous) || isNaN(current)) return ""
  let value = ""
  switch (operation) {
    case '+':
      value = previous + current
      break;

    case '-':
      value = previous - current
      break;

    case '*':
      value = previous * current
      break;

    case '/':
      value = previous / current
      break;
    default:
      return value
  }
  return value.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>


      <OperationButton dispatch={dispatch} operation={"/"} />
      <DigitButton dispatch={dispatch} digit={"1"} />
      <DigitButton dispatch={dispatch} digit={"2"} />
      <DigitButton dispatch={dispatch} digit={"3"} />
      <OperationButton dispatch={dispatch} operation={"*"} />
      <DigitButton dispatch={dispatch} digit={"4"} />
      <DigitButton dispatch={dispatch} digit={"5"} />
      <DigitButton dispatch={dispatch} digit={"6"} />
      <OperationButton dispatch={dispatch} operation={"+"} />
      <DigitButton dispatch={dispatch} digit={"7"} />
      <DigitButton dispatch={dispatch} digit={"8"} />
      <DigitButton dispatch={dispatch} digit={"9"} />
      <OperationButton dispatch={dispatch} operation={"-"} />
      <DigitButton dispatch={dispatch} digit={"."} />
      <DigitButton dispatch={dispatch} digit={"0"} />
      <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
