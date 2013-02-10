allTasks = {"list1":{Task3 : 5, Task5: 4, Task4 : 3}};
function getCurrentListIdentifier() {
    return "list1";
}

function isSomeTaskSelected() {
    return $('.task:checkbox:checked').val();
}

function getTasksHTMLRepresentation() {
    var result= '';
    var taskList = allTasks[getCurrentListIdentifier()];
    // comparator for sorting is based on due dates of tasks 
    var tasks = Object.keys(taskList).sort(function(a, b) {return taskList[a] - taskList[b];});
    for(var i = 0; i < tasks.length; i++)
        result = result + '<tr><td><input type="checkbox" class = "task" name="'+tasks[i]+'"id="'+tasks[i]+'"/>'+ tasks[i] +'</td></tr>';
    
    return result;
}

function addTask(taskDescription) {
    (allTasks[getCurrentListIdentifier()])[taskDescription] = 6;
}

function deleteTask(taskDescription) {
    delete (allTasks[getCurrentListIdentifier()][taskDescription]);
}

function displayDeleteMenu() {
    $(".rhs-top-box").html(
        '<input id="delete-selected" type = "button" value="Delete Selected"/>'
        + '<input id="delete-completed" type = "button" value="Delete Completed"/>');
    
    $("#delete-selected").on("click", function() {
        var tasks = $('.task:checkbox');
        for(var i = 0; i < tasks.length; i++)
            if(tasks[i].checked === true) { 
                deleteTask(tasks[i].name);
            }
        resetDisplayedTasksList();          
        displayNormalTextBox();
    }); 
}

function displayNormalTextBox() {
    $(".rhs-top-box").html(
        '<input id="user-input" type = "text" value = ""/>'
        +     '<input id="add-task" type = "button" value="Add Task"/>');
}


function resetDisplayedTasksList() {
    var modifiedHTML = getTasksHTMLRepresentation();
    var e = $('#task-list').html(modifiedHTML);
}

$(document).ready(function() { 
    var content = getTasksHTMLRepresentation();
    var e = $('#task-list').html(content);
    
    $("#add-task").on("click", function() {
            var taskDescription = $("#user-input").val();
            if(taskDescription.length > 0) {
                addTask(taskDescription);
                resetDisplayedTasksList();      
            }  
    });
    
    $(".task").on("click", function() {
        if(isSomeTaskSelected() === "on") {
            displayDeleteMenu();
        } else {
            displayNormalTextBox();
        }
    });
    
});
