const mainDisplay = document.getElementById('mainDisplay');
        const secondaryDisplay = document.getElementById('secondaryDisplay');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const menuBtn = document.getElementById('menuBtn');
        const closeBtn = document.getElementById('closeBtn');
        const history = document.getElementById('history');

        let calculationHistory = [];
        let currentExpression = '';
        let shouldResetDisplay = false;

        // Sidebar functionality
        menuBtn.addEventListener('click', () => {
            sidebar.classList.add('show');
            overlay.classList.add('show');
        });

        closeBtn.addEventListener('click', closeSidebar);
        overlay.addEventListener('click', closeSidebar);

        function closeSidebar() {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
        }

        // Calculator functionalities
        function append(value) {
            if (shouldResetDisplay) {
                mainDisplay.value = '';
                shouldResetDisplay = false;
            }
            
            if (mainDisplay.value === '0' && value !== '.') {
                mainDisplay.value = value;
            } else {
                mainDisplay.value += value;
            }
            currentExpression = mainDisplay.value;
        }

        function calculate() {
            try {
                const expression = mainDisplay.value
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/−/g, '-');
                
                const result = Function('"use strict"; return (' + expression + ')')();
                
                if (isNaN(result) || !isFinite(result)) {
                    throw new Error('Invalid result');
                }
                
                const historyItem = `${mainDisplay.value} = ${result}`;
                addToHistory(historyItem);
                
                secondaryDisplay.value = `= ${result}`;
                mainDisplay.value = result.toString();
                shouldResetDisplay = true;
                
                mainDisplay.classList.remove('error');
            } catch (error) {
                mainDisplay.value = 'Error';
                mainDisplay.classList.add('error');
                secondaryDisplay.value = '';
                shouldResetDisplay = true;
            }
        }

        function clearAll() {
            mainDisplay.value = '0';
            secondaryDisplay.value = '';
            currentExpression = '';
            mainDisplay.classList.remove('error');
        }

        function backspace() {
            if (mainDisplay.value.length > 1) {
                mainDisplay.value = mainDisplay.value.slice(0, -1);
            } else {
                mainDisplay.value = '0';
            }
        }

        function executeFunction(func) {
            try {
                const value = parseFloat(mainDisplay.value);
                let result;

                switch (func) {
                    case 'sin':
                        result = Math.sin(value);
                        break;
                    case 'cos':
                        result = Math.cos(value);
                        break;
                    case 'tan':
                        result = Math.tan(value);
                        break;
                    case 'asin':
                        result = Math.asin(value);
                        break;
                    case 'acos':
                        result = Math.acos(value);
                        break;
                    case 'atan':
                        result = Math.atan(value);
                        break;
                    case 'abs':
                        result = Math.abs(value);
                        break;
                    case 'floor':
                        result = Math.floor(value);
                        break;
                    case 'ceil':
                        result = Math.ceil(value);
                        break;
                    case 'round':
                        result = Math.round(value);
                        break;
                    case 'square':
                        result = value * value;
                        break;
                    case 'sqrt':
                        result = Math.sqrt(value);
                        break;
                    case 'exp':
                        result = Math.exp(value);
                        break;
                    case 'power10':
                        result = Math.pow(10, value);
                        break;
                    case 'log':
                        result = Math.log(value);
                        break;
                    case 'log10':
                        result = Math.log10(value);
                        break;
                    case 'factorial':
                        result = factorial(Math.floor(value));
                        break;
                    case 'random':
                        result = Math.random();
                        break;
                    case 'percent':
                        result = value / 100;
                        break;
                    default:
                        return;
                }

                const historyItem = `${func}(${value}) = ${result}`;
                addToHistory(historyItem);

                mainDisplay.value = result.toString();
                secondaryDisplay.value = historyItem;
                shouldResetDisplay = true;
                mainDisplay.classList.remove('error');
            } catch (error) {
                mainDisplay.value = 'Error';
                mainDisplay.classList.add('error');
                shouldResetDisplay = true;
            }
        }

        function factorial(n) {
            if (n < 0) throw new Error('Factorial of negative number');
            if (n === 0 || n === 1) return 1;
            if (n > 170) throw new Error('Number too large');
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            return result;
        }

        function insertConstant(constant) {
            let value;
            switch (constant) {
                case 'PI':
                    value = Math.PI;
                    break;
                case 'E':
                    value = Math.E;
                    break;
                default:
                    return;
            }
            mainDisplay.value = value.toString();
            shouldResetDisplay = true;
        }

        function toggleSign() {
            if (mainDisplay.value !== '0') {
                if (mainDisplay.value.startsWith('-')) {
                    mainDisplay.value = mainDisplay.value.substring(1);
                } else {
                    mainDisplay.value = '-' + mainDisplay.value;
                }
            }
        }

        function togglePanel(panel) {
            const trigPanel = document.getElementById('trigPanel');
            const funcPanel = document.getElementById('funcPanel');
            const trigBtn = document.getElementById('trigBtn');
            const funcBtn = document.getElementById('funcBtn');

            if (panel === 'trig') {
                trigPanel.classList.toggle('show');
                trigBtn.classList.toggle('active');
                funcPanel.classList.remove('show');
                funcBtn.classList.remove('active');
            } else {
                funcPanel.classList.toggle('show');
                funcBtn.classList.toggle('active');
                trigPanel.classList.remove('show');
                trigBtn.classList.remove('active');
            }
        }

        function addToHistory(item) {
            calculationHistory.unshift(item);
            if (calculationHistory.length > 20) {
                calculationHistory.pop();
            }
            updateHistoryDisplay();
        }

        function updateHistoryDisplay() {
            history.innerHTML = calculationHistory
                .map(item => `<div class="history-item">${item}</div>`)
                .join('');
        }

        function toggleHistory() {
            history.classList.toggle('show');
            closeSidebar();
        }

        function clearHistory() {
            calculationHistory = [];
            updateHistoryDisplay();
            closeSidebar();
        }

        function switchMode(mode) {
            // Placeholder for different calculator modes
            alert(`Switching to ${mode} mode - Feature coming soon!`);
            closeSidebar();
        }

        function toggleSecond() {
            // Placeholder for 2nd function toggle
            alert('2nd function toggle - Feature coming soon!');
        }

        // Keyboard support
        document.addEventListener('keydown', (event) => {
            const key = event.key;
            
            if ('0123456789'.includes(key)) {
                append(key);
            } else if ('+-*/'.includes(key)) {
                append(key === '*' ? '×' : key === '/' ? '÷' : key === '-' ? '−' : key);
            } else if (key === 'Enter' || key === '=') {
                calculate();
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                clearAll();
            } else if (key === 'Backspace') {
                backspace();
            } else if (key === '.') {
                append('.');
            } else if (key === '(' || key === ')') {
                append(key);
            }
        });