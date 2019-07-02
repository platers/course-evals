
function tableCreate(data){
    var body = document.body,
        tbl  = document.createElement('table');

    for(var i = 0; i < data.length; i++){
        var tr = document.createElement('tr');
        var keys = Object.keys(data[i]);
        for(var j = 0; j < keys.length; j++){
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(data[i][keys[j]]));
        }
    }
    body.appendChild(tbl);
}

d3.csv("https://raw.githubusercontent.com/platers/course-evals/master/cleandata.csv").then(function(data) {
    console.log(data)
    data.pop(); //last row is undefined
    tableCreate(data);
})
.catch(function(error){
    console.log("Could not load data") 
})