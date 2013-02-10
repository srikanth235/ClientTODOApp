allTasks = {"list1":{Task3 : new Date().toDateString(), Task5: new Date().toDateString(), Task4 : new Date().toDateString()}};
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
        result = result + '<tr><td><input type="checkbox" class = "task" name="'+tasks[i]+'"id="'+tasks[i]+'"/>'+ tasks[i] +'  ' + taskList[tasks[i]]+ '</td></tr>';
    return result;
}

function addTask(taskDescription) {
    var dueDate = $("#datepicker").val();
    var month = "Jan";
    switch(dueDate.substring(0, 2)) {
        case "01": 
             month = "Jan";
             break;
        case "02": 
             month = "Feb";
             break;
        case "03": 
             month = "Mar";
             break;
        case "04": 
             month = "Apr";
             break;
        case "05": 
             month = "May";
             break;
        case "06": 
             month = "Jun";
             break;
        case "07": 
             month = "Jul";
             break;
        case "08": 
             month = "Aug";
             break;
        case "09": 
             month = "Sep";
             break;
        case "10": 
             month = "Oct";
             break;
        case "11": 
             month = "Nov";
             break;
        case "12": 
             month = "Dec";
             break; 
    }
    dueDate = month + " " + dueDate.substring(3,5);
    (allTasks[getCurrentListIdentifier()])[taskDescription] = dueDate;
}

function deleteTask(taskDescription) {
    delete (allTasks[getCurrentListIdentifier()][taskDescription]);
}

function markAsDone(taskDescription) {
    (allTasks[getCurrentListIdentifier()][taskDescription]).completed = true;
    alert(taskDescription + (allTasks[getCurrentListIdentifier()][taskDescription]).completed);
}

function isCompleted(taskDescription) {
    return allTasks[getCurrentListIdentifier()][taskDescription].completed === true;
}

function displayDeleteMenu() {
    $(".rhs-top-box").html(
        '<input id = "mark-done" type = "button" value="Mark Done"/>' 
        + '<input id = "delete-selected" type = "button" value="Delete Selected"/>'
        + '<input id = "delete-completed" type = "button" value="Delete Completed"/>');
    
    $("#delete-selected, #delete-completed, #mark-done").on("click", function() {
        var tasks = $('.task:checkbox');
        for(var i = 0; i < tasks.length; i++) { 
                switch(this.id) {
                    case "mark-done":
                        if(tasks[i].checked === true) 
                            markAsDone(tasks[i].name); 
                        break;
                    case "delete-selected":
                        if(tasks[i].checked === true)
                            deleteTask(tasks[i].name);
                        break;
                    case "delete-completed":
                        alert(isCompleted(tasks[i].name));
                        if(isCompleted(tasks[i].name))  
                            deleteTask(tasks[i].name);
                        break; 
                 }
            }
        resetDisplayedTasksList();          
        displayNormalTextBox();
        addTaskActionListener();
    }); 
}

function addTaskActionListener() {
   $(".task").on("click", function() {
        if(isSomeTaskSelected() === "on") {
            displayDeleteMenu();
        } else {
            displayNormalTextBox();
        }
    });
}
function displayNormalTextBox() {
    $(".rhs-top-box").html(
        '<input id="user-input" type = "text" value = ""/>'
        +    '<input id="datepicker" type = "hidden"/>'
        +    '<input id="add-task" type = "button" value="Add Task"/>');
    loadDatePicker();
}

function resetDisplayedTasksList() {
    var modifiedHTML = getTasksHTMLRepresentation();
    var e = $('#task-list').html(modifiedHTML);
}

function loadDatePicker() {
    $(function() {
        $( "#datepicker" ).datepicker({
            showOn: "button",
            buttonImage: "images/calendar.gif",
            buttonImageOnly: true
        });
    });
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

    addTaskActionListener();
    loadDatePicker();
});
