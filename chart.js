// Получение контекста для рисования
let canvas = window.document.querySelector('canvas');
let context = canvas.getContext('2d');

// Переменные 
let chart = null;
let pauseMode = false;

// Функции
const realTimeDemo = (xData, yData, data) => {
  let i = 50;
  let interval = setInterval(()=>{
    if(i > data.length) clearInterval(interval);
    else if(!pauseMode){
      chart.config.data.labels.push(xData[i]);
      chart.config.data.datasets[0].data.push(yData[i]);
      chart.config.options.scales.x.min++;
      chart.config.options.scales.x.max++;
      chart.update();
      i++;
    }
  }, 400);
}
const createLineChart = (xData, yData) => {
  let gradient = context.createLinearGradient(0, 0, 0, window.screen.width/2);
  gradient.addColorStop(0, 'rgba(74, 169, 230, 0.8)');
  gradient.addColorStop(1, 'rgba(74, 169, 230, 0.001)');
  let data = {
    labels: xData,
    datasets: [{
      label: 'Global Price of Aluminum',
      data: yData,
      pointStyle: false,
      fill: true,
      backgroundColor: gradient,
      borderWidth: 2,
      borderColor: 'rgba(74, 169, 230, 1)',
      tension: 0.2
    }]
  }
  let xScaleConfig = {
    min: 0,
    max: 50,
    ticks: {
      autoSkip: true,
      maxRotation: 0,
      // minRotation: 90,
      color: 'rgba(74, 169, 230, 0.9)'
    },
    border: {
      color: 'rgba(74, 169, 230, 1)'
    },
    grid: {
      color: 'rgba(74, 169, 230, 0.3)'
    }
  }
  let yScaleConfig = {
    ticks: {
      color: 'rgba(74, 169, 230, 0.9)'
    },
    border: {
      color: 'rgba(74, 169, 230, 1)'
    },
    grid: {
      color: 'rgba(74, 169, 230, 0.3)'
    }
  }
  let config = {
    type: 'line',
    data: data,
    options: {
      scales: {
        x: xScaleConfig,
        y: yScaleConfig
      },
      plugins: {
        legend: {
          display: false
        }
      },
      animation: {
        duration: 400,
        easing: 'linear'
      }
    }
  }
  chart = new Chart(context, config);
}

// Получение данных с сервера
axios.get('https://www.alphavantage.co/query?function=ALUMINUM&interval=monthly&apikey=demo')
.then((response)=>{
  let data = response.data.data;
  let xData = [];
  let yData = [];
  for(let i = data.length - 1; i > 0; i--){
    if(data[i].value !== '.'){
      xData.push(data[i].date);
      yData.push(data[i].value);
    }
  }
  let xStartData = [];
  let yStartData = [];
  let xParseData = [];
  let yParseData = [];
  for(let i = 0; i < data.length; i++){
    if(i < 50){
      xStartData.push(xData[i]);
      yStartData.push(yData[i]);
    }else{
      xParseData.push(xData[i]);
      yParseData.push(yData[i]);
    }
  }
  createLineChart(xStartData, yStartData);
  realTimeDemo(xParseData, yParseData, data);
});

// ОБРАБОТЧИКИ СОБЫТИЙ
window.addEventListener('click', ()=>pauseMode = !pauseMode);