



fetch('/admin/chart',
    {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (text) {
        var options = {
            chart: {
                height: 350,
                type: 'area'
            },
            dataLabels:{
                enabled: false
            },
            stroke: {
                curve: 'smooth',
            },
            series: [{
                name: 'sales',
                data: text.sales
            },{
                name: 'profit',
                data: text.profit
            }],
            xaxis: {
                type: 'date',
                categories: text.date
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm'
                }
            }
        }
        var chart = new ApexCharts(document.getElementById('chartDiv'), options)
        chart.render()
    })
    .catch(function (error) {
        //Something went wrong
        console.log(error);
    });


    



