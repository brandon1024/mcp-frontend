window.onload = () => {
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

    $.ajax({
        type: "get",
        url: "/dashboard/ledger",
        dataType: "json",
        success: function (json) {
            var table = document.getElementById("ledger");
            var ledger = json["ledger"];

            for(var i = 0; i < ledger.length; i++) {
                var row = document.createElement("div");
                row.classList.add("row");

                var keys = Object.keys(ledger[i]);
                for(var j = 0; j < keys.length; j++) {
                    var key = keys[j];

                    var col = document.createElement("div");
                    col.classList.add("col");
                    col.innerText = ledger[i][key];

                    row.appendChild(col);
                }

                //TODO: ADD BALANCE
                var col = document.createElement("div");
                col.classList.add("col");
                col.innerText = 'stuff';
                row.appendChild(col);

                table.appendChild(row);
            }

            console.log(json);
        },
        error: function() {
            console.log('err');
        }
    });
};