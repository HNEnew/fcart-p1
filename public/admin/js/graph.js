// console.log('0000000000000000000000000000000')
// fetch('/admin/chart',
//     {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' }
//     })
//     .then(function (response) {
//         console.log('00000000000000000000000000111111111111')
//         console.log(response)
//         return response.text();
//     })
//     .then(function (text) {
//         console.log(text)
//         console.log('000000000000000000000022222222')
//         // let series = csvToSeries(text);
//         // renderChart(series);
//     })
//     .catch(function (error) {
//         //Something went wrong
//         console.log(error);
//     });
//     console.log('0000000000000000000000333333333')




    // .then(function (response) {
    //     console.log('00000000000000000000000000111111111111')
    //     console.log(response)
    //     return response.text();
    // })
    // .then(function (text) {
    //     console.log(text)
    //     console.log('000000000000000000000022222222')
    //     let series = csvToSeries(text);
    //     renderChart(series);
    // })
    // .catch(function (error) {
    //     //Something went wrong
    //     console.log(error);
    // });
    // console.log('0000000000000000000000333333333')

// function csvToSeries(text) {
//     const lifeExp = 'average_life_expectancy';
//     let dataAsJson = JSC.csv2Json(text);
//     let white = [], black = [];
//     dataAsJson.forEach(function (row) {
//         //add either to Black, White arrays, or discard.
//         if (row.sex === 'Both Sexes') {
//             if (row.race === 'Black') {
//                 black.push({ x: row.year, y: row[lifeExp] });
//             } else if (row.race === 'White') {
//                 white.push({ x: row.year, y: row[lifeExp] });
//             }
//         }
//     });
//     return [
//         { name: 'Black', points: black },
//         { name: 'White', points: white },
//     ];
// }
// function renderChart(series) {
//     JSC.Chart('chartDiv', {
//         title_label_text: 'Life Expectancy in the United States',
//         annotations: [{
//             label_text: 'Source: National Center for Health Statistics',
//             position: 'bottom left'
//         }],
//         legend_visible: false,
//         xAxis_crosshair_enabled: true,
//         defaultSeries_firstPoint_label_text: '<b>%seriesName</b>',
//         defaultPoint_tooltip: '%seriesName <b>%yValue</b> years',
//         series: series
//     });
// }

