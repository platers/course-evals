
function tableCreate(data) {
    const column_names = ['dept', 'division', 'course', 'last_name', 'first_name', 'term', 'year', 'item1', 'item2', 'item3', 'item4',
        'item5', 'item6', 'enthusiasm', 'workload', 'recommend', 'invited', 'respondents', 'code', 'name'];
    var body = document.getElementsByTagName('body')[0];
    var tbl = document.createElement('table');
    var thead = document.createElement('thead');
    var tr = document.createElement('tr');
    for (var i = 0; i < column_names.length; i++) {
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(column_names[i]));
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    var tbdy = document.createElement('tbody');
    var num_rows = data.length;
    num_rows = Math.min(num_rows, 500);
    for (var i = 0; i < num_rows; i++) {
        var tr = document.createElement('tr');
        var keys = Object.keys(data[i]);
        var num_keys = keys.length;
        for (var j = 0; j < num_keys; j++) {
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(data[i][keys[j]]));
            tr.appendChild(td)
        }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(thead);
    tbl.appendChild(tbdy);
    body.appendChild(tbl)
}
var small = 'https://raw.githubusercontent.com/platers/course-evals/master/small.csv';
var large = 'https://raw.githubusercontent.com/platers/course-evals/master/cleandata.csv';
d3.csv(large).then(function (data) {
    console.log(data)
    data.pop(); //last row is undefined
    tableCreate(data);
})