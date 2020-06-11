$(document).ready(function () {
    //recupero i dati
    var baseUrl = "http://157.230.17.132:4003/sales";

    $.ajax({
        method: "GET",
        url: baseUrl,
        success: function (response) {
            drawLines(response);
            drawPie(response);
        },
        error: function (err) {
            console.log("error");
        },
    });

    //CLICK BOTTONE
    $("button").on("click", function () {
        //la post request vuole i dati in forma { salesman: "Marco", amount: 9000, date: "12/02/2017" };

        //quindi recupero il nome
        var name = $("#salesman option:selected").text();
        var nameVal = $("#salesman option:selected").val();

        //la data (il mese per semplicita')
        var month = $("#months option:selected").text();
        var monthVal = $("#months option:selected").val();
        //trasformo la data nel formato per la post request
        var newDate = moment(month, "MMM").format("01/MM/2017"); //01/01/2017
        // e l'amount !come intero
        var amount = parseInt($("input").val());
        // console.log(name, newDate, amount);
        //creo un oggetto che poi passero alla funzione postRequest(...) come parametro
        var dataToSend = { salesman: name, amount: amount, date: newDate };
        //verifico che tutti i dati siano compilati
        if (!nameVal || !monthVal || !amount || amount < 0) {
            alert(
                "devi compilare correttamente tutti i campi prima di aggiungere "
            );
        } else {
            postRequest(dataToSend);
        }
    });

    function postRequest(dataToPost) {
        // console.log(dataToPost);
        $.ajax({
            method: "POST",
            url: baseUrl,
            data: dataToPost,
            success: function (response) {
                location.reload();
            },
            error: function (err) {
                console.log("errore");
            },
        });
    }

    function drawLines(arrayData) {
        //in computedData ho il return dell'oggetto contenente l'array di mesi e quello dei dati di vendita
        var computedData = prepareLinesData(arrayData);
        // console.log(computedData);
        // DISEGNO GRAFICO A LINEE
        var ctx = $("#lines-chart")[0].getContext("2d");
        var myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: computedData.labels, //ASSE X
                datasets: [
                    {
                        data: computedData.data, // pallini
                        fill: false, //non riempire area sotto
                        lineTension: 0, //linee rette
                        backgroundColor: "rgba(255, 0, 0, 0.822)", //colore PALLINI
                        pointRadius: 10,
                        pointStyle: "rectRounded",
                        borderColor: "rgba(46, 0, 253, 0.582)", //colore LINEE
                        borderWidth: 3,
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

    function drawPie(arrayData) {
        //devo vedere quante vendite ha fatto ogni venditore in percentuale rispetto alle vendite totali

        // quindi mi servono le vendite totali
        // e le vendite di ogni venditore
        // una cosa del tipo salesSalesman = {'Gio': 2500, 'Giu':500 ...} e un contatore delle vendite totali
        var totalSales = 0;
        var salesSalesman = {};

        //estraggo gli oggetti dell'array
        arrayData.forEach(function (singleData) {
            // console.log(singleData);
            var amount = singleData.amount; //numero
            var salesman = singleData.salesman; //stringa

            totalSales += parseInt(amount); //incremento l'amount totale ad ogni ciclo
            //mi chiedo se l'oggetto salesSalesman contiene la key salesman, se si incremento il value con amount, altrimenti lo inizializzo con il value amount
            salesSalesman.hasOwnProperty(salesman)
                ? (salesSalesman[salesman] += parseInt(amount))
                : (salesSalesman[salesman] = parseInt(amount));
        });

        //adesso ho le vendite totali e le vendite di ogni venditore quindi posso recuperare la percentuale

        // var percentageArray = []; //array che rappresenta i pezzi di torta
        for (var salesman in salesSalesman) {
            var singleSale = salesSalesman[salesman];
            var percentage = ((singleSale / totalSales) * 100).toFixed(1);
            // percentageArray.push(percentage);
            salesSalesman[salesman] = percentage;
        }
        // console.log(salesSalesman);

        salesmanArray = Object.keys(salesSalesman);
        percentageArray = Object.values(salesSalesman);

        // DISEGNO GRAFICO A TORTA
        var ctx = $("#pie-chart")[0].getContext("2d");
        var myChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: salesmanArray, //ASSE X qui dovranno essere i venditori
                datasets: [
                    {
                        // label: "# of Votes",
                        data: percentageArray, //valori pezzi di torta (le percentuali)
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 255, 192, 0.2)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 255, 192, 1)",
                        ],
                        hoverBackgroundColor: [
                            "rgba(255,99,132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                        ],
                        hoverBorderWidth: 10,
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                tooltips: {
                    callbacks: {
                        afterBody: function () {
                            return `%`; //return a string that you wish to append
                        },
                    },
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                },
                title: {
                    display: true,
                    text: "Percentage Sales ",
                },
                legend: {
                    position: "bottom",
                    labels: {
                        boxWidth: 10,
                    },
                },
            },
        });
    }

    function prepareLinesData(arrayOfData) {
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
        for (var i = 0; i < arrayOfData.length; i++) {
            // console.log(singleData);
            var amount = arrayOfData[i].amount; //numero
            var date = arrayOfData[i].date; //stringa "04/03/2017"
            var salesman = arrayOfData[i].salesman; //stringa
            //utilizzo moment per vedere il mese
            var month = moment(date, "DD-MM-YYYY");
            var nameMonth = month.format("MMMM");
            // console.log(amount, date, salesman, nameMonth);

            //per ogni oggetto devo incrementare l'amount relativo al mese
            salesForMonth[nameMonth] += parseInt(amount);

            //estraggo le chiavi dall'oggetto salesForMonth per creare l'array che sara' l'asse x della mia chart
            var months = Object.keys(salesForMonth); //["January", "February", "March", ...]
            //faccio la stessa cosa per i valori che questa volta sono l'y dei pallini
            var totalSalesForMonth = Object.values(salesForMonth); //[5960, 15240, 13790, ...]
        }

        return { labels: months, data: totalSalesForMonth };
    }
});
