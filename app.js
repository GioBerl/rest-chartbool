$(document).ready(function () {
    //recupero i dati
    var baseUrl = "http://157.230.17.132:4003/sales";

    $.ajax({
        method: "GET",
        url: baseUrl,
        success: function (response) {
            console.log(response);
            drawLines();
        },
        error: function (err) {
            console.log("errore");
        },
    });

    function drawLines() {
        var ctx = $("#lines-chart")[0].getContext("2d");
        var myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"], //ASSE X
                datasets: [
                    {
                        label: "fatturato mensile",
                        data: [12, 19, 3, 5, 2, 3],
                        fill: false, //non riempire area sotto
                        lineTension: 0, //linee rette
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
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
