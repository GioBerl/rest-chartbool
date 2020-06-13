$(document).ready(function () {
    baseUrl = "http://157.230.17.132:4003/sales";
    var bgCustomPie = [
        "rgba(240, 12, 61, 0.2)",
        "rgba(213, 12, 240, 0.2)",
        "rgba(12, 35, 240, 0.2)",
        "rgba(12, 206, 240, 0.2)",
        "rgba(39, 240, 12, 0.2)",
        "rgba(206, 240, 12, 0.2)",
    ];

    var hoverAndBorder = [
        "rgba(240, 12, 61, 1)",
        "rgba(213, 12, 240, 1)",
        "rgba(12, 35, 240, 1)",
        "rgba(12, 206, 240, 1)",
        "rgba(39, 240, 12, 1)",
        "rgba(206, 240, 12, 1)",
    ];

    $("button").on("click", function () {
        //la post request vuole i dati in forma { salesman: "Marco", amount: 9000, date: "12/02/2017" };

        //quindi recupero il nome
        var nameVal = $("#salesman option:selected").val();

        //la data (il numero del mese per semplicita')
        var monthVal = $("#months option:selected").val();
        //trasformo la data nel formato per la post request
        var newDate = moment(monthVal, "MM").format("01/MM/2017"); //01/01/2017
        // e l'amount
        var amount = parseInt($("input").val());
        // console.log(name, newDate, amount);
        //creo un oggetto che poi passero alla funzione postRequest(...) come parametro
        var dataToSend = { salesman: nameVal, amount: amount, date: newDate };
        //verifico che tutti i dati siano compilati
        if (!nameVal || !monthVal || !amount || amount < 0) {
            alert(
                "devi compilare correttamente tutti i campi prima di aggiungere "
            );
        } else {
            postRequest(dataToSend);
            //pulisco le select e l'input
            $("#salesman").val("");
            $("#months").val("");
            $("input").val("");
            // console.log(dataToSend);
        }
    });

    function postRequest(data) {
        $.ajax({
            method: "POST",
            url: baseUrl,
            data: data,
            success: function (response) {
                getRequest();
            },
            error: function (err) {
                console.log("errore");
            },
        });
    }

    getRequest();

    function getRequest() {
        $.ajax({
            method: "GET",
            url: baseUrl,
            success: function (response) {
                drawPie(response);
                drawLines(response);
            },
            error: function (err) {
                console.error(`errore ${err.status}: ${err.statusText}`);
            },
        });
    }

    function drawPie(arrayFromRequest) {
        var arrayDataToDraw = prepareDataForPie(arrayFromRequest); //mi ritorna OGGETTO contenente come values gli array da passare alla chart ---> {allSalesmans: Array(4), amountForSeller: Array(4)}
        // console.log(arrayDataToDraw, "PIE");
        var ctx = document.getElementById("pie-chart").getContext("2d");
        var pieChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: arrayDataToDraw.allSalesmans,
                datasets: [
                    {
                        label: "Amount of Sells for Salesman",
                        data: arrayDataToDraw.amountForSeller,
                        backgroundColor: bgCustomPie,
                        borderColor: hoverAndBorder,
                        borderWidth: 1,
                        hoverBorderWidth: 10,
                        hoverBackgroundColor: hoverAndBorder,
                    },
                ],
            },
            options: {
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            var nameSalesman = data.labels[tooltipItem.index];
                            var sells =
                                data.datasets[tooltipItem.datasetIndex].data[
                                    tooltipItem.index
                                ];
                            return `${nameSalesman}: ${sells}%`;
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

    function drawLines(arrayFromRequest) {
        var arrayDataToDraw = prepareDataForLines(arrayFromRequest); //mi ritorna OGGETTO con values tutti gli array da passare alla chart ---> {months: Array(12), amountForMonth: Array(12)}
        // console.log(arrayDataToDraw, "LINES");
        var ctx = document.getElementById("lines-chart").getContext("2d");
        var lineChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: arrayDataToDraw.months,
                datasets: [
                    {
                        data: arrayDataToDraw.amountForMonth,
                        fill: false, //non riempire area sotto
                        lineTension: 0, //linee rette
                        //pallini
                        pointBackgroundColor: "rgba(255,0,0,1)",
                        pointBorderColor: "rgba(255,0,0,1)",
                        pointStyle: "rectRounded",
                        pointRadius: 5,
                        //linee
                        borderColor: "rgba(46, 0, 253, 0.582)", //colore LINEE
                        borderWidth: 3,
                    },
                ],
            },
            //arrayDataToDraw.amountForMonth
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

    function prepareDataForPie(arrayInfo) {
        var objSalesmanAmount = {},
            totalSales = 0;

        //estraggo i dati dall'array
        for (var i = 0; i < arrayInfo.length; i++) {
            var singleObj = arrayInfo[i]; //{id: 1, salesman: "Marco", amount: 9000, date: "12/02/2017"}
            //per ogni venditore mi serve il nome e l'amount
            var salesman = singleObj.salesman,
                amount = parseInt(singleObj.amount);
            totalSales += amount;

            //popolo oggetto con vendite totali per ogni venditore
            objSalesmanAmount[salesman]
                ? (objSalesmanAmount[salesman] += amount)
                : (objSalesmanAmount[salesman] = amount);
        }
        // console.log(objSalesmanAmount); //{Marco: 27200, Giuseppe: 26010, Riccardo: 33000, Roberto: 32730}
        //calcolo le vendite di ogni venditore rispetto alle vendite totali (in percentuale)
        for (var salesman in objSalesmanAmount) {
            var percentage = (
                (objSalesmanAmount[salesman] / totalSales) *
                100
            ).toFixed(1);
            objSalesmanAmount[salesman] = percentage;
        }
        // console.log(objSalesmanAmount); //{Marco: "22.9", Giuseppe: "21.9", Riccardo: "27.7", Roberto: "27.5"}

        var arraySalesman = Object.keys(objSalesmanAmount);
        var arrayAmount = Object.values(objSalesmanAmount);

        return {
            allSalesmans: arraySalesman,
            amountForSeller: arrayAmount,
        };
    }

    function prepareDataForLines(arrayInfo) {
        // var monthlySales = {
        //     January: 0,
        //     February: 0,
        //     March: 0,
        //     April: 0,
        //     May: 0,
        //     June: 0,
        //     July: 0,
        //     August: 0,
        //     September: 0,
        //     October: 0,
        //     November: 0,
        //     December: 0,
        // };
        var monthlySales = {};

        for (var i = 1; i <= 12; i++) {
            //uso moment per costruire i mesi
            var date = moment(i, "M").format("MMMM");
            // e poi vado a popolare il mio oggetto
            monthlySales[date] = 0;
            // console.log(monthlySales);
        }

        //estraggo i dati dall'array
        for (var i = 0; i < arrayInfo.length; i++) {
            var singleObj = arrayInfo[i]; //{id: 1, salesman: "Marco", amount: 9000, date: "12/02/2017"}
            //mi serve il nome del mese(uso moment) e l'amount
            var amount = parseInt(singleObj.amount),
                date = singleObj.date,
                correctDate = moment(date, "DD/MM/YYYY").format("MMMM"); //January

            //incremento le vendite per ogni mese
            monthlySales[correctDate] += amount;
        }

        //estraggo gli array delle key e dei values dell'oggetto
        var arrayMonths = Object.keys(monthlySales); //array nomi mesi (lo uso anche per popolare le options della select)
        createOptionsSelect(arrayMonths);

        var arraySalesForMonth = Object.values(monthlySales); //array amount per mese
        return { months: arrayMonths, amountForMonth: arraySalesForMonth };
    }

    function createOptionsSelect(monthsArray) {
        $("#months").empty();
        $("#months").append(
            `<option value="" style="display: none;" selected disabled value="">Choose Month</option>`
        );
        //seleziono la select e aggiungo le options
        for (var i = 0; i < monthsArray.length; i++) {
            var numberMonth = i + 1;
            if (numberMonth < 10) {
                numberMonth = `0${numberMonth}`;
            }
            $("#months").append(
                `<option value=${numberMonth}>${monthsArray[i]}</option>`
            );
        }
    }
});
