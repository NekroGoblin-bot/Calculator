const display = document.querySelector(".display");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");

let currentValue = "0";
let previousValue = null;
let selectedOperation = null;
let shouldStartNewValue = false;

const operationSymbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷"
};

function updateDisplay() {
    if (selectedOperation) {
        const secondValue = shouldStartNewValue ? "" : ` ${currentValue}`;
        display.textContent = `${previousValue} ${operationSymbols[selectedOperation]}${secondValue}`;
    } else {
        display.textContent = currentValue;
    }
}

function enterNumber(number) {
    if (number === "." && currentValue.includes(".")) return;

    if (shouldStartNewValue) {
        currentValue = number === "." ? "0." : number;
        shouldStartNewValue = false;
    } else if (currentValue === "0" && number !== ".") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}

function calculate(first, operation, second) {
    const a = Number(first);
    const b = Number(second);
    const calculations = {
        "+": a + b,
        "-": a - b,
        "*": a * b,
        "/": b === 0 ? null : a / b
    };
    const result = calculations[operation];
    return result === null ? "Error" : String(Number(result.toFixed(10)));
}

function chooseOperation(operation) {
    if (selectedOperation && !shouldStartNewValue) evaluate();
    previousValue = currentValue;
    selectedOperation = operation;
    shouldStartNewValue = true;
    updateDisplay();
}

function evaluate() {
    if (!selectedOperation || shouldStartNewValue) return;
    currentValue = calculate(previousValue, selectedOperation, currentValue);
    previousValue = null;
    selectedOperation = null;
    shouldStartNewValue = true;
    updateDisplay();
}

function clearCalculator() {
    currentValue = "0";
    previousValue = null;
    selectedOperation = null;
    shouldStartNewValue = false;
    updateDisplay();
}

function deleteLastDigit() {
    if (shouldStartNewValue) return;
    currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
    updateDisplay();
}

numberButtons.forEach((button) => button.addEventListener("click", () => enterNumber(button.textContent)));
operatorButtons.forEach((button) => button.addEventListener("click", () => chooseOperation(button.dataset.operation)));
document.querySelector('[data-action="clear"]').addEventListener("click", clearCalculator);
document.querySelector('[data-action="delete"]').addEventListener("click", deleteLastDigit);
document.querySelector('[data-action="equals"]').addEventListener("click", evaluate);

document.addEventListener("keydown", (event) => {
    if (/^[0-9.]$/.test(event.key)) enterNumber(event.key);
    if (["+", "-", "*", "/"].includes(event.key)) chooseOperation(event.key);
    if (event.key === "Enter" || event.key === "=") evaluate();
    if (event.key === "Escape") clearCalculator();
    if (event.key === "Backspace") deleteLastDigit();
});
