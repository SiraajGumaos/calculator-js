let firstNum = "";
let secondNum = "";
let currentOperator = null;
let shouldResetDisplay = false;

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => (b === 0 ? "Error: Div by 0" : a / b);

function operate(operator, a, b) {
  const num1 = parseFloat(a);
  const num2 = parseFloat(b);
  if (isNaN(num1) || isNaN(num2)) return "";

  switch (operator) {
    case "+":
      return add(num1, num2);
    case "-":
      return subtract(num1, num2);
    case "*":
      return multiply(num1, num2);
    case "/":
      return divide(num1, num2);
    default:
      return "";
  }
}

const display = document.getElementById("display");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton = document.getElementById("equals");
const clearButton = document.getElementById("clear");
const decimalButton = document.getElementById("decimal");
const backspaceButton = document.getElementById("backspace");

function updateDisplay(value) {
  if (!isNaN(value) && value.toString().includes(".")) {
    display.textContent = Math.round(value * 100000) / 100000;
  } else {
    display.textContent = value;
  }
}

function appendNumber(number) {
  if (
    display.textContent === "0" ||
    shouldResetDisplay ||
    display.textContent === "Error: Div by 0"
  ) {
    resetDisplay();
  }
  display.textContent += number;
}

function resetDisplay() {
  display.textContent = "";
  shouldResetDisplay = false;
}

function setOperator(operator) {
  if (currentOperator !== null && shouldResetDisplay) {
    currentOperator = operator;
    return;
  }

  if (currentOperator !== null) {
    evaluatePair();
  }

  firstNum = display.textContent;
  currentOperator = operator;
  shouldResetDisplay = true;
}

function evaluatePair() {
  if (currentOperator === null || shouldResetDisplay) return;

  secondNum = display.textContent;
  const result = operate(currentOperator, firstNum, secondNum);

  updateDisplay(result);

  if (result === "Error: Div by 0") {
    clearAll();
  } else {
    firstNum = result.toString();
    currentOperator = null;
  }
}

function appendDecimal() {
  if (shouldResetDisplay) resetDisplay();

  if (display.textContent.includes(".")) return;
  if (display.textContent === "") display.textContent = "0";
  display.textContent += ".";
}

function deleteDigit() {
  if (shouldResetDisplay || display.textContent === "Error: Div by 0") return;
  display.textContent = display.textContent.toString().slice(0, -1);
  if (display.textContent === "") display.textContent = "0";
}

function clearAll() {
  firstNum = "";
  secondNum = "";
  currentOperator = null;
  display.textContent = "0";
  shouldResetDisplay = false;
}

numberButtons.forEach((btn) =>
  btn.addEventListener("click", () => appendNumber(btn.textContent)),
);
operatorButtons.forEach((btn) =>
  btn.addEventListener("click", () =>
    setOperator(btn.getAttribute("data-operator")),
  ),
);
equalsButton.addEventListener("click", () => {
  evaluatePair();
  shouldResetDisplay = true;
});
clearButton.addEventListener("click", clearAll);
decimalButton.addEventListener("click", appendDecimal);
backspaceButton.addEventListener("click", deleteDigit);

window.addEventListener("keydown", (e) => {
  if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
  if (e.key === ".") appendDecimal();
  if (e.key === "=" || e.key === "Enter") {
    e.preventDefault();
    evaluatePair();
    shouldResetDisplay = true;
  }
  if (e.key === "Backspace") deleteDigit();
  if (e.key === "Escape" || e.key.toLowerCase() === "c") clearAll();
  if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
    setOperator(e.key);
  }
});
