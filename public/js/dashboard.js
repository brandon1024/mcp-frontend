window.onload = () => {
    /* Update Initially */
    updateLedger();
    updateLogs();

    (function reloadRunner() {
        updateMap();
        document.getElementById('map-status-text').innerText = 'Reloading in 10s...';

        setTimeout(function() {
            document.getElementById('map-status-text').innerText = 'Reloading in 5s...';
        }, 5000);

        setTimeout(function() {
            document.getElementById('map-status-text').innerText = 'Reloading...';
        }, 9000);

        setTimeout(reloadRunner, 10000);
    })();

    document.getElementById('update-ledger-button').addEventListener('click', updateLedger, false);
    document.getElementById('update-logs-button').addEventListener('click', updateLogs, false);
};

function updateMap() {
    /*$.ajax({
        type: "get",
        url: "/dashboard/map",
        dataType: "json",
        success: function (mapcoords) {
            //map
            var COLOR_RED = 'rgba(255, 0, 0, 0.5)';
            var COLOR_BLUE = 'rgba(0, 0, 255, 0.5)';
            var renderCircle = function(context, coords, color) {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(coords[0], coords[1], 8, 0, Math.PI * 2, true);
                ctx.fill();
            };

            var c = document.getElementById("map-canvas");
            var ctx = c.getContext("2d");
            ctx.canvas.width  = window.innerWidth;
            ctx.canvas.height = 600;

            renderCircle(ctx, [100, 100], COLOR_RED);
            renderCircle(ctx, [120, 120], COLOR_BLUE);
        },
        error: function() {
            console.log('err');
        }
    });*/

    //map
    var COLOR_RED = 'rgba(255, 0, 0, 0.5)';
    var COLOR_BLUE = 'rgba(0, 0, 255, 0.5)';
    var renderCircle = function(context, coords, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(coords[0], coords[1], 8, 0, Math.PI * 2, true);
        ctx.fill();
    };

    var c = document.getElementById("map-canvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.width);
    ctx.canvas.width  = c.getBoundingClientRect().width;
    ctx.canvas.height = 600;

    renderCircle(ctx, [100, 100], COLOR_RED);
    renderCircle(ctx, [120, 120], COLOR_BLUE);
}

function updateLedger() {
    $.ajax({
        type: "get",
        url: "/dashboard/ledger",
        dataType: "json",
        success: function (ledger) {
            var tableBody = document.getElementById("report-table-body");
            while (tableBody.firstChild)
                tableBody.removeChild(tableBody.firstChild);

            for(var i = 0; i < ledger.length; i++) {
                var row = document.createElement("tr");

                var col = document.createElement("td");
                col.innerText = i+1;
                row.appendChild(col);

                var keys = Object.keys(ledger[i]);
                for(var j = 0; j < keys.length; j++) {
                    var key = keys[j];
                    var col = document.createElement("td");
                    col.innerText = ledger[i][key];

                    row.appendChild(col);
                }

                tableBody.appendChild(row);
            }
        },
        error: function() {
            console.log('err');
        }
    });
}

function updateLogs() {
    $.ajax({
        type: "get",
        url: "/dashboard/logs",
        dataType: "json",
        success: function (logs) {
            var tableBody = document.getElementById("logs-table-body");
            while (tableBody.firstChild)
                tableBody.removeChild(tableBody.firstChild);

            for(var index = 0; index < logs.length; index++) {
                var row = document.createElement("tr");

                var col = document.createElement("td");
                col.innerText = index+1;
                row.appendChild(col);

                var col = document.createElement("td");
                col.innerText = logs[index].log;
                row.appendChild(col);

                tableBody.appendChild(row);
            }
        },
        error: function() {
            console.log('err');
        }
    });
}