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
        for (var j = 0; j < num_keys; j++) {
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(data[i][keys[j]]));
            tr.appendChild(td);
        }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
}

var small = 'https://raw.githubusercontent.com/platers/course-evals/master/small.csv';  //only for testing
var large = 'https://raw.githubusercontent.com/platers/course-evals/master/cleandata.csv';
d3.csv(large).then(function (data) {
    //console.log(data)
    data.pop(); //last row is undefined
    for (var i = 0; i < data.length; i++) {
        data[i]['item1'] = parseFloat(data[i]['item1']);
        data[i]['item2'] = parseFloat(data[i]['item2']);
        data[i]['item3'] = parseFloat(data[i]['item3']);
        data[i]['item4'] = parseFloat(data[i]['item4']);
        data[i]['item5'] = parseFloat(data[i]['item5']);
        data[i]['item6'] = parseFloat(data[i]['item6']);
        data[i]['year'] = parseInt(data[i]['year']);
        data[i]['enthusiasm'] = parseFloat(data[i]['enthusiasm']);
        data[i]['workload'] = parseFloat(data[i]['workload']);
        data[i]['recommend'] = parseFloat(data[i]['recommend']);
        data[i]['invited'] = parseInt(data[i]['recommend']);
        data[i]['respondents'] = parseInt(data[i]['respondents']);
    }

    DATA = data;
    RAW_DATA = data;
    tableCreate(data);
})

function compareValues(key, order = 'asc') {
    return function (a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            console.log("bad");
            return 0;
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
function sortBy(key) {
    if (current_sort_column == key) {
        current_sort_direction = (current_sort_direction == 'asc') ? 'desc' : 'asc';
    } else {
        current_sort_direction = 'asc';
    }
    current_sort_column = key;
    console.log(key, current_sort_direction);
    DATA.sort(compareValues(key, current_sort_direction));
    console.log("Sorted", DATA[0]);
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
            DATA.push(RAW_DATA[i]);
        }
    }

    var group_input = $('#select').val();
    if(group_input != ""){
        DATA = groupBy(DATA, group_input);
    }
    tableCreate(DATA);
}

function groupBy(data, key){
    var d = {};
    var grouped = [];
    for (var i = 0; i < data.length; i++) {
        if(key == 'instructor'){
            var name = data[i]['first_name'] + data[i]['last_name'];
            if(!(name in d)){
                d[name] = [];
            }
            d[name].push(data[i]);   
        } else{
            if(!(data[i][key] in d)){
                d[data[i][key]] = [];
            }
            d[data[i][key]].push(data[i]);      
        }  
    }
    for(var k in d){
        for(var i = 1; i < d[k].length; i++){
            d[k][0]['item1'] += d[k][i]['item1'];
            d[k][0]['item2'] += d[k][i]['item2'];
            d[k][0]['item3'] += d[k][i]['item3'];
            d[k][0]['item4'] += d[k][i]['item4'];
            d[k][0]['item5'] += d[k][i]['item5'];
            d[k][0]['item6'] += d[k][i]['item6'];
            d[k][0]['invited'] += d[k][i]['invited'];
            d[k][0]['recommend'] += d[k][i]['recommend'];
            d[k][0]['workload'] += d[k][i]['workload'];
            d[k][0]['respondents'] += d[k][i]['respondents'];
            d[k][0]['enthusiasm'] += d[k][i]['enthusiasm'];
        }
        d[k][0]['item1'] /= d[k].length;
        d[k][0]['item2'] /= d[k].length;
        d[k][0]['item3'] /= d[k].length;
        d[k][0]['item4'] /= d[k].length;
        d[k][0]['item5'] /= d[k].length;
        d[k][0]['item6'] /= d[k].length;
        d[k][0]['invited'] /= d[k].length;
        d[k][0]['recommend'] /= d[k].length;
        d[k][0]['workload'] /= d[k].length;
        d[k][0]['respondents'] /= d[k].length;
        d[k][0]['enthusiasm'] /= d[k].length;
        d[k][0]['item1'] = +(d[k][0]['item1'].toFixed(1));
        d[k][0]['item2'] = +(d[k][0]['item2'].toFixed(1));
        d[k][0]['item3'] = +(d[k][0]['item3'].toFixed(1));
        d[k][0]['item4'] = +(d[k][0]['item4'].toFixed(1));
        d[k][0]['item5'] = +(d[k][0]['item5'].toFixed(1));
        d[k][0]['item6'] = +(d[k][0]['item6'].toFixed(1));
        d[k][0]['invited'] = +(d[k][0]['invited'].toFixed(1));
        d[k][0]['recommend'] = +(d[k][0]['recommend'].toFixed(1));
        d[k][0]['workload'] = +(d[k][0]['workload'].toFixed(1));
        d[k][0]['respondents'] = +(d[k][0]['respondents'].toFixed(1));
        d[k][0]['enthusiasm'] = +(d[k][0]['enthusiasm'].toFixed(1));

        if(key == 'dept'){
            d[k][0]['code'] = 'N/A';
            d[k][0]['course'] = 'N/A';
            d[k][0]['last_name'] = 'N/A';
            d[k][0]['first_name'] = 'N/A';
            d[k][0]['term'] = 'N/A';
            d[k][0]['name'] = 'N/A';
        }
        if(key == 'code'){
            d[k][0]['term'] = 'N/A';
        }
        if(key == 'instructor'){
            d[k][0]['code'] = 'N/A';
            d[k][0]['course'] = 'N/A';
            d[k][0]['term'] = 'N/A';
            d[k][0]['name'] = 'N/A';
        }
        grouped.push(d[k][0]);
    }
    return grouped;
}

$(document).ready(function() {  // required for materialize select
    $('select').formSelect();
});