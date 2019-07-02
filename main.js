var RAW_DATA;
var DATA;
function tableCreate(data) {
    var tbl = document.getElementsByTagName('table')[0];
    var el = document.getElementsByTagName('tbody');
    if(el.length){
        console.log(el);
        el[0].remove();
    }
    var tbdy = document.createElement('tbody');
    var num_rows = data.length;
    num_rows = Math.min(num_rows, 500); //limit to 500 rows for better performance
    for (var i = 0; i < num_rows; i++) {
        var tr = document.createElement('tr');
        var keys = Object.keys(data[i]);
        var num_keys = keys.length;
        for (var j = 0; j < num_keys; j++) {
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(data[i][keys[j]]));
            tr.appendChild(td);
        }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
}

var small = 'https://raw.githubusercontent.com/platers/course-evals/master/small.csv';
var large = 'https://raw.githubusercontent.com/platers/course-evals/master/cleandata.csv';
d3.csv(large).then(function (data) {
    //console.log(data)
    data.pop(); //last row is undefined
    DATA = data;
    RAW_DATA = data;
    tableCreate(data);
})

function compareValues(key, order='asc'){
    return function(a, b){
        if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            console.log("bad");
            return 0;
          }
        if(order == 'desc'){
            return (a[key] < b[key]) * 2 - 1;
        } else{
            return (a[key] > b[key]) * 2 - 1;
        }
    }
}

var current_sort_column = 'dept';
var current_sort_direction = 'asc';
function sortBy(key){
    if(current_sort_column == key){
        current_sort_direction = (current_sort_direction == 'asc') ? 'desc' : 'asc';
    } else{
        current_sort_direction = 'asc';
    }
    current_sort_column = key;
    console.log(key, current_sort_direction);
    DATA.sort(compareValues(key, current_sort_direction));
    console.log("Sorted", DATA[0]);
    tableCreate(DATA);
}