
M.AutoInit();   //initialize materialize


var RAW_DATA;
var DATA;
function tableCreate(data) {
    var tbl = document.getElementsByTagName('table')[0];
    var el = document.getElementsByTagName('tbody');
    if (el.length) {
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
        for (var j = 0; j < num_keys - 1; j++) {    //-1 to remove course column
            var td = document.createElement('td');
            var x = data[i][keys[j]];
            if (!isNaN(x) && x < 2000) {  //truncate floats
                x = x.toFixed(1);
            }
            td.appendChild(document.createTextNode(x));
            tr.appendChild(td);
        }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
}

function populateAutocomplete(data){
    var dept = {};
    var code = {};
    var last = {};
    var first = {};
    for (var i = 0; i < data.length; i++) {
        dept[data[i].dept] = null;
        code[data[i].code] = null;
        last[data[i].last_name] = null;
        first[data[i].first_name] = null;

    }
    $('#dept').autocomplete('updateData', dept);
    $('#code').autocomplete('updateData', code);
    $('#last_name').autocomplete('updateData', last);
    $('#first_name').autocomplete('updateData', first);
}

var small = 'https://raw.githubusercontent.com/platers/course-evals/master/small.csv';  //only for testing
var large = 'https://raw.githubusercontent.com/platers/course-evals/master/cleandata.csv';  //change to local directory when done testing
d3.csv(large).then(function (data) {    //process data from csv
    //console.log(data)
    data.pop(); //last row is undefined
    var numericalKeys = ['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'invited', 'recommend', 'workload', 'respondents', 'enthusiasm'];
    for (var i = 0; i < data.length; i++) {
        for(var k of numericalKeys){
            data[i][k] = parseFloat(data[i][k]);
        }

    }
    DATA = Array.from(data);
    RAW_DATA = Array.from(data);
    tableCreate(data);
    populateAutocomplete(Array.from(data));
})

function compareValues(key, order = 'asc') {
    return function (a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            console.log("bad");
            return 0;
        }
        if(isNaN(a[key]) != isNaN(b[key])){ //push NaN's to bottom
            return (isNaN(a[key])) * 2 - 1;
        }
        if (order == 'desc') {
            return (a[key] < b[key]) * 2 - 1;
        } else {
            return (a[key] > b[key]) * 2 - 1;
        }
    }
}

var current_sort_column = 'dept';
var current_sort_direction = 'asc';
function sortBy(data, key) {
    current_sort_column = key;
    //console.log(key, current_sort_direction);
    data.sort(compareValues(key, current_sort_direction));
    return data;
}

function sortClicked(key) {
    if (current_sort_column == key) {
        current_sort_direction = (current_sort_direction == 'asc') ? 'desc' : 'asc';
    } else {
        current_sort_direction = 'asc';
    }
    DATA = sortBy(DATA, key);
    tableCreate(DATA);
}

function applyFilters() {
    DATA = [];
    var code_input = document.getElementById('code').value;
    var dept_input = document.getElementById('dept').value;
    var last_name_input = document.getElementById('last_name').value;
    var first_name_input = document.getElementById('first_name').value;
    for (var i = 0; i < RAW_DATA.length; i++) {
        if ((new RegExp(code_input, 'i')).test(RAW_DATA[i].code) &&
            (new RegExp(dept_input, 'i')).test(RAW_DATA[i].dept) &&
            (new RegExp(last_name_input, 'i')).test(RAW_DATA[i].last_name) &&
            (new RegExp(first_name_input, 'i')).test(RAW_DATA[i].first_name)) {
            DATA.push(Object.assign({}, RAW_DATA[i]));
        }
    }

    var group_input = $('#select').val();
    if (group_input != "none") {
        DATA = groupBy(DATA, group_input);
    }
    DATA = sortBy(DATA, current_sort_column);
    tableCreate(DATA);
}

function groupBy(data, key) {
    var d = {};
    var grouped = [];
    for (var i = 0; i < data.length; i++) {
        if (key == 'instructor') {
            var name = data[i]['first_name'] + data[i]['last_name'];
            if (!(name in d)) {
                d[name] = [];
            }
            d[name].push(data[i]);
        } else {
            if (!(data[i][key] in d)) {
                d[data[i][key]] = [];
            }
            d[data[i][key]].push(data[i]);
        }
    }
    for (var k in d) {
        var numericalKeys = ['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'invited', 'recommend', 'workload', 'respondents', 'enthusiasm'];
        var stringKeys = ['dept', 'division', 'code', 'name', 'first_name', 'last_name', 'term', 'year'];
        var dict = {};
        for (var j of numericalKeys) {
            dict[j] = [];
        }
        for (var i = 0; i < d[k].length; i++) {
            for (var j of numericalKeys) {
                if (!isNaN(d[k][i][j])) {
                    dict[j].push(d[k][i][j]);
                }
            }
            for (var j of stringKeys) {
                if (d[k][i][j] != d[k][0][j]) {
                    d[k][0][j] = 'N/A';
                }
            }
            for (var j of numericalKeys) {
                if (dict[j].length > 0) {
                    var s = 0;
                    for (var x of dict[j]) {
                        s += x;
                    }
                    d[k][0][j] = s / dict[j].length;
                    d[k][0][j] = +(d[k][0][j].toFixed(1));
                } else {
                    d[k][0][j] = NaN;
                }
            }
        }
        grouped.push(d[k][0]);
    }
    return grouped;
}