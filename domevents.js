allTasks = {"list1":{Task3 : 5, Task5: 4, Task4 : 3}};
listIdentifier="list1";
function getTasksHTMLRepresentation() {
	var result= '<table id="task-list"/>';
	var taskList = allTasks[listIdentifier];
	// comparator for sorting based on dates
	var tasks = Object.keys(taskList).sort(function(a, b) {return taskList[a] - taskList[b];});
	for(var i = 0; i < tasks.length; i++)
	    result = result + '<tr><td><input type="checkbox" id="'+tasks[i]+'"/>'+ tasks[i] +'</td></tr>';
    result = result + '</table>';
    return result;
}

function addTask(taskDescription) {
    (allTasks[listIdentifier])[taskDescription] = 6;
}

function deleteTask(taskDescription) {
	delete (allTasks[listIdentifier])[key];
}

$(document).ready(function() { 
    var content = getTasksHTMLRepresentation();
    var e = $('#task-list').html(content);
    
    $("#add-task").on("click", function() {
            var taskDescription = $("#user-input").val();
            addTask(taskDescription);
            var modifiedHTML = getTasksHTMLRepresentation();
            var e = $('#task-list').html(modifiedHTML);
    });
    
    $(".rhs-bottom-box").on("click", function() {
       alert("Some item selected");
    });
});