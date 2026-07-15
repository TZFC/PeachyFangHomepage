document.addEventListener('DOMContentLoaded', () => {
  // UI Elements
  const logContainer = document.getElementById('logContainer') as HTMLDivElement;
  const pieChart = document.getElementById('pieChart') as HTMLDivElement;
  const labelWealthy = document.getElementById('labelWealthy') as HTMLSpanElement;
  const labelWorker = document.getElementById('labelWorker') as HTMLSpanElement;
  
  // Controls
  const inputs = {
    initialWealthy: document.getElementById('initialWealthy') as HTMLInputElement,
    initialWealthyNum: document.getElementById('initialWealthyNum') as HTMLInputElement,
    growthRate: document.getElementById('growthRate') as HTMLInputElement,
    growthRateNum: document.getElementById('growthRateNum') as HTMLInputElement,
    wealthTax: document.getElementById('wealthTax') as HTMLInputElement,
    wealthTaxNum: document.getElementById('wealthTaxNum') as HTMLInputElement,
    paycheck: document.getElementById('paycheck') as HTMLInputElement,
    paycheckNum: document.getElementById('paycheckNum') as HTMLInputElement,
    incomeTax: document.getElementById('incomeTax') as HTMLInputElement,
    incomeTaxNum: document.getElementById('incomeTaxNum') as HTMLInputElement,
    expense: document.getElementById('expense') as HTMLInputElement,
    expenseNum: document.getElementById('expenseNum') as HTMLInputElement,
    yearSlider: document.getElementById('yearSlider') as HTMLInputElement,
    yearNum: document.getElementById('yearNum') as HTMLInputElement
  };
  
  const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
  
  // i18n
  const i18nData = (document.getElementById('i18n-data') as HTMLDivElement)?.dataset || {};
  const t = (key: string, params: Record<string, any> = {}) => {
    let str = i18nData[key] || "";
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
    return str;
  };

  const formatNum = (num: number) => Number(num.toFixed(2));

  interface State {
    w: number;
    k: number;
    total: number;
    wRatio: number;
    kRatio: number;
    currentPaycheck: number;
    currentExpense: number;
  }

  interface Params {
    initialWealthy: number;
    growthRate: number;
    wealthTax: number;
    paycheck: number;
    incomeTax: number;
    expense: number;
    targetYear: number;
  }

  // Simulation Engine
  const simulateYear = (state: State, params: Params) => {
    const logs: string[] = [];
    
    // 1. Interest
    const growthMult = 1 + (params.growthRate / 100);
    const wGrow = formatNum(state.w * (params.growthRate / 100));
    const kGrow = formatNum(state.k * (params.growthRate / 100));
    let w = formatNum(state.w + wGrow);
    let k = formatNum(state.k + kGrow);
    let total = formatNum(w + k);
    
    let currentPaycheck = formatNum(state.currentPaycheck * growthMult);
    let currentExpense = formatNum(state.currentExpense * growthMult);
    
    logs.push(t('interest', { growthRate: params.growthRate, wealthy: w, worker: k, total: total }));
    
    // 2. Wealth Tax
    const wTax = formatNum(w * (params.wealthTax / 100));
    const kTax = formatNum(k * (params.wealthTax / 100));
    w = formatNum(w - wTax);
    k = formatNum(k - kTax);
    const totalWealthTax = formatNum(wTax + kTax);
    logs.push(t('wealthtax', { taxRate: params.wealthTax, wealthyTax: wTax, workerTax: kTax, wealthy: w, worker: k }));
    
    // 3. Paycheck
    // Note: wealthy pays the worker
    let actualPaycheck = currentPaycheck;
    if (w < actualPaycheck) {
      // Can only pay what they have
      actualPaycheck = w;
    }
    w = formatNum(w - actualPaycheck);
    k = formatNum(k + actualPaycheck);
    logs.push(t('paycheck', { paycheck: actualPaycheck, wealthy: w, worker: k }));
    
    // 4. Income Tax (paid by worker on the paycheck)
    const incomeTax = formatNum(actualPaycheck * (params.incomeTax / 100));
    k = formatNum(k - incomeTax);
    logs.push(t('incometax', { taxRate: params.incomeTax, incomeTax: incomeTax, worker: k }));
    
    // 5. Social Welfare
    const totalTax = formatNum(totalWealthTax + incomeTax);
    const welfare = formatNum(totalTax / 2);
    w = formatNum(w + welfare);
    k = formatNum(k + welfare);
    logs.push(t('welfare', { totalTax: totalTax, welfare: welfare, wealthy: w, worker: k }));
    
    // 6. Living Expense (Step 7 in user prompt context)
    const expense = currentExpense;
    w = formatNum(w - expense);
    k = formatNum(k - expense);
    logs.push(t('expense', { expense: expense, wealthy: w, worker: k }));
    
    // 8. Ratio and Rescale
    const displayW = Math.max(0, w);
    const displayK = Math.max(0, k);
    const displayTotal = formatNum(displayW + displayK);
    
    const wRatioRaw = displayTotal > 0 ? (displayW / displayTotal) : 0;
    const kRatioRaw = displayTotal > 0 ? (displayK / displayTotal) : 0;
    
    const wRatio = formatNum(wRatioRaw * 100);
    const kRatio = formatNum(kRatioRaw * 100);
    
    const macroTotal = total;
    w = formatNum(macroTotal * wRatioRaw);
    k = formatNum(macroTotal * kRatioRaw);
    
    logs.push(t('ratio', { macroTotal: macroTotal, wealthyRatio: wRatio, workerRatio: kRatio, wealthy: w, worker: k }));
    
    const finalTotal = formatNum(w + k);
    return { state: { w, k, total: finalTotal, wRatio, kRatio, currentPaycheck, currentExpense }, logs };
  };

  const STATE_KEY = 'wealthSimulationState';

  // Load state from sessionStorage if available
  const savedStateStr = sessionStorage.getItem(STATE_KEY);
  if (savedStateStr) {
    try {
      const savedState = JSON.parse(savedStateStr);
      if (savedState.initialWealthy !== undefined) {
         inputs.initialWealthy.value = savedState.initialWealthy;
         inputs.initialWealthyNum.value = savedState.initialWealthy;
      }
      if (savedState.growthRate !== undefined) {
         inputs.growthRate.value = savedState.growthRate;
         inputs.growthRateNum.value = savedState.growthRate;
      }
      if (savedState.wealthTax !== undefined) {
         inputs.wealthTax.value = savedState.wealthTax;
         inputs.wealthTaxNum.value = savedState.wealthTax;
      }
      if (savedState.paycheck !== undefined) {
         inputs.paycheck.value = savedState.paycheck;
         inputs.paycheckNum.value = savedState.paycheck;
      }
      if (savedState.incomeTax !== undefined) {
         inputs.incomeTax.value = savedState.incomeTax;
         inputs.incomeTaxNum.value = savedState.incomeTax;
      }
      if (savedState.expense !== undefined) {
         inputs.expense.value = savedState.expense;
         inputs.expenseNum.value = savedState.expense;
      }
      if (savedState.targetYear !== undefined) {
         inputs.yearSlider.value = savedState.targetYear;
         inputs.yearNum.value = savedState.targetYear;
      }
    } catch (e) {
      console.error("Failed to parse saved state", e);
    }
  }

  const runSimulation = () => {
    const params: Params = {
      initialWealthy: parseFloat(inputs.initialWealthy.value) || 0,
      growthRate: parseFloat(inputs.growthRate.value) || 0,
      wealthTax: parseFloat(inputs.wealthTax.value) || 0,
      paycheck: parseFloat(inputs.paycheck.value) || 0,
      incomeTax: parseFloat(inputs.incomeTax.value) || 0,
      expense: parseFloat(inputs.expense.value) || 0,
      targetYear: parseInt(inputs.yearSlider.value, 10) || 0
    };
    
    sessionStorage.setItem(STATE_KEY, JSON.stringify(params));
    
    let state: State = {
      w: params.initialWealthy,
      k: 100 - params.initialWealthy,
      total: 100,
      wRatio: params.initialWealthy,
      kRatio: 100 - params.initialWealthy,
      currentPaycheck: params.paycheck,
      currentExpense: params.expense
    };
    
    logContainer.innerHTML = '';
    
    // Initial state log
    const initialDiv = document.createElement('div');
    initialDiv.innerHTML = `<div class="log-year">${t('year', {year: 0})}</div>
                            <div class="log-entry">${t('initial', {wealthy: state.w, worker: state.k, total: state.total})}</div>`;
    logContainer.appendChild(initialDiv);

    for (let y = 1; y <= params.targetYear; y++) {
      if (state.w <= 0 || state.k <= 0) {
        break; // Stop simulating further years if someone is bankrupt
      }
      
      const result = simulateYear(state, params);
      state = result.state;
      
      const yearDiv = document.createElement('div');
      yearDiv.innerHTML = `<div class="log-year">${t('year', {year: y})}</div>` +
                          result.logs.map(l => `<div class="log-entry">${l}</div>`).join('');
      logContainer.appendChild(yearDiv);
    }

    // Auto scroll to bottom
    logContainer.scrollTop = logContainer.scrollHeight;
    
    // Update Pie Chart
    if (state.w <= 0 || state.k <= 0) {
      pieChart.style.background = 'rgba(255, 255, 255, 0.1)';
    } else {
      pieChart.style.background = `conic-gradient(#ff4757 0% ${state.wRatio}%, #1e90ff ${state.wRatio}% 100%)`;
    }
    
    // Update Labels
    labelWealthy.innerText = `${t('wealthy')}: ${state.wRatio}% (${state.w})`;
    labelWorker.innerText = `${t('worker')}: ${state.kRatio}% (${state.k})`;
  };

  // Setup Event Listeners for sync and update
  const setupSync = (slider: HTMLInputElement, numInput: HTMLInputElement) => {
    slider.addEventListener('input', (e: Event) => {
      numInput.value = (e.target as HTMLInputElement).value;
      runSimulation();
    });
    numInput.addEventListener('input', (e: Event) => {
      slider.value = (e.target as HTMLInputElement).value;
      runSimulation();
    });
  };

  setupSync(inputs.initialWealthy, inputs.initialWealthyNum);
  setupSync(inputs.growthRate, inputs.growthRateNum);
  setupSync(inputs.wealthTax, inputs.wealthTaxNum);
  setupSync(inputs.paycheck, inputs.paycheckNum);
  setupSync(inputs.incomeTax, inputs.incomeTaxNum);
  setupSync(inputs.expense, inputs.expenseNum);
  setupSync(inputs.yearSlider, inputs.yearNum);

  resetBtn.addEventListener('click', () => {
    inputs.initialWealthy.value = '95';
    inputs.initialWealthyNum.value = '95';
    inputs.growthRate.value = '10';
    inputs.growthRateNum.value = '10';
    inputs.wealthTax.value = '0';
    inputs.wealthTaxNum.value = '0';
    inputs.paycheck.value = '1';
    inputs.paycheckNum.value = '1';
    inputs.incomeTax.value = '30';
    inputs.incomeTaxNum.value = '30';
    inputs.expense.value = '1';
    inputs.expenseNum.value = '1';
    inputs.yearSlider.value = '0';
    inputs.yearNum.value = '0';
    runSimulation();
  });

  // Sticky Pie Chart Scroll Effect (Mobile)
  const layout = document.querySelector('.wealth-layout') as HTMLDivElement;
  const pieContainer = document.querySelector('.wealth-pie-container') as HTMLDivElement;
  
  if (layout && pieContainer && pieChart) {
    let originalOffsetTop = 0;
    
    const updatePieSize = () => {
      if (window.innerWidth > 900) {
        pieChart.style.width = '';
        pieChart.style.height = '';
        return;
      }
      
      // On mobile, the default size is 200px
      if (originalOffsetTop === 0 && pieContainer.offsetTop > 0) {
        originalOffsetTop = pieContainer.offsetTop;
      }
      
      const layoutRect = layout.getBoundingClientRect();
      const stickyThreshold = 16; // 1rem in px
      
      // How much we've scrolled past the point where the pie chart becomes sticky
      // It starts sticking when layoutRect.top + originalOffsetTop <= stickyThreshold
      const overScroll = Math.max(0, stickyThreshold - (layoutRect.top + originalOffsetTop));
      
      // Shrink over a scroll distance of 300px, min scale is 0.5
      const scale = Math.max(0.5, 1 - (overScroll / 300));
      
      pieChart.style.width = `${200 * scale}px`;
      pieChart.style.height = `${200 * scale}px`;
    };

    window.addEventListener('scroll', updatePieSize, { passive: true });
    window.addEventListener('resize', () => {
      // Recalculate offset on resize if we are at the top, or just reset
      if (window.scrollY < 100) originalOffsetTop = 0;
      updatePieSize();
    }, { passive: true });
    
    // Initial call
    // setTimeout to ensure layout is done
    setTimeout(updatePieSize, 100);
  }

  // Initial Run
  runSimulation();
});
