

d3.csv("https://raw.githubusercontent.com/platers/course-evals/master/cleandata.csv", function (data) {
    var columns = ['dept', 'division', 'course', 'last_name', 'first_name', 'term', 'year', 'item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'enthusiasm', 'workload', 'recommend', 'invited', 'respondents', 'code', 'name']
    console.log(data[0]);
})
