taskList = {Task3 : 5, Task5: 4, Task4 : 3};
function getTasksHTMLRepresentation() {
	var result= '<table id="task-list"/>';
	// comparator for sorting based on dates
	var tasks = Object.keys(taskList).sort(function(a, b) {return taskList[a] - taskList[b];});
	for(var i = 0; i < tasks.length; i++)
	    result = result + '<tr><td><input type="checkbox" value="'+tasks[i]+'"/>'+ tasks[i] +'</td></tr>';
    result = result + '</table>';
    return result;
}
$(document).ready(function() { 
    var content = getTasksHTMLRepresentation();
    var e = $('#task-list').html(content);
    $("#add-task").on("click", function() {
            var value = $("#user-input").val(); 
            var e = $('#task-list').html("");
    });
    
    $(".rhs-bottom-box").on("click", function() {
       alert("Some item selected");
    });
});