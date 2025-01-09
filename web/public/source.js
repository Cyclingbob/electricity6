let values = day

const xValues = values.map(item => item.time)
const yValues = values.map(item => item.generation)

console.log(values.length)

// let date1 = new Date()
// let date2 = new Date()
// date2.setHours(date1.getHours() - 1)
// let date3 = new Date()
// date3.setHours(date2.getHours() - 1)

// const xValues = [date1, date2, date3]
// const yValues = [15242, 8256, 2799]

var day_graph = new Chart("source-chart", {
    type: "line",
    data: {
        labels: xValues,
        datasets: [{
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(0,0,255,1.0)",
            borderColor: "rgba(0,0,255,0.1)",
            data: yValues
        }]
    },
    options: { 
        legend: {display: false},
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 50000
                }
            }],
            xAxes: [{
                type: "time",
                time: {
                    unit: 'hour' // Adjust time unit as needed
                }
            }]
        }
    }
});