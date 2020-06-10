$(document).ready(function () {
    //recupero i dati
    var baseUrl = "http://157.230.17.132:4003/sales";

    $.ajax({
        method: "GET",
        url: baseUrl,
        success: function (response) {
            drawLines(response);
        },
        error: function (err) {
            console.log("errore");
        },
    });

    function drawLines(arrayData) {
        //definisco un oggetto che avra' come key il mese e come value il numero di vendite (inizializzate a 0)
        var salesForMonth = {
            January: 0,
            February: 0,
            March: 0,
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0,
        };

        //estraggo gli oggetti dell'array
        arrayData.forEach(function (singleData) {
            // console.log(singleData);
            var amount = singleData.amount; //numero
            var date = singleData.date; //stringa
            var salesman = singleData.salesman; //stringa
            //utilizzo moment per vedere il mese
            var month = moment(date, "DD-MM-YYYY");
            var nameMonth = month.format("MMMM");
            console.log(amount, date, salesman, nameMonth);

            //per ogni oggetto devo incrementare l'amount relativo al mese
            salesForMonth[nameMonth] += amount;
        });

        //estraggo le chiavi dall'oggetto salesForMonth per creare l'array che sara' l'asse x della mia chart
        var months = Object.keys(salesForMonth); //["January", "February", "March", ...]
        //faccio la stessa cosa per i valori che questa volta sono l'y dei pallini
        var totalSalesForMonth = Object.values(salesForMonth); //[5960, 15240, 13790, ...]

        var ctx = $("#lines-chart")[0].getContext("2d");
        var myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: months, //ASSE X
                datasets: [
                    {
                        // label: "fatturato mensile", //meglio title nelle options
                        data: totalSalesForMonth, // pallini
                        fill: false, //non riempire area sotto
                        lineTension: 0, //linee rette
                        backgroundColor: "black",
                        //tutti quei colori mi danno fastidio
                        backgroundColor: "rgba(255, 0, 0, 0.822)", //colore PALLINI
                        borderColor: "rgba(46, 0, 253, 0.582)", //colore LINEE
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                title: {
                    display: true,
                    text: "total sales for months",
                },
                legend: {
                    display: false,
                },
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                },
            },
        });
    }
});
