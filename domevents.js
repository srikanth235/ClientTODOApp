globalListIdentifier = "list1";
/** Helper functions start here. */
function loadLocalStorage() {
    localStorage.setItem("globalList", 
                          {
                            "list1":{Task1 : {date: new Date().toDateString(),done: false},  
                            "list2":{Task2 : {date:new Date().toDateString()}}}
                        );
}
function getGlobalList() {
    return localStorage.getItem("globalList");
}

function getCurrentListIdentifier() {
    return globalListIdentifier;
}

function isSomeTaskSelected() {
    return $('.task:checkbox:checked').val();
}

function getTasksHTMLRepresentation() {
    var result= '';
    var taskList = (getGlobalList()[getCurrentListIdentifier()];

    // comparator for sorting is based on due dates of tasks 
    var tasks = Object.keys(taskList).sort(function(a, b) {
                                               return taskList[a]["date"] > taskList[b]["date"];
                                           });
    for(var i = 0; i < tasks.length; i++) {
        var className;
        if(isCompleted(tasks[i])) {
            className = "completed-task-row";
        } else {
            className = "incompleted-task-row";
        }
        result = result + '<tr class="'+className+'"><td><input type="checkbox" class = "task" name="'
                 + tasks[i]+'"id="'+tasks[i]+'"/>'+ tasks[i] +'</td><td class="date">' 
                 + getDateStringForDisplay(taskList[tasks[i]]["date"])
                 + '</td></tr>';
    }
    return result;
}

function getHTMLForAddList() {
    return '<tr id="add-list"><td> + Add a list</td></tr>';
}

function getHTMLForNewList(listName) {
   var result = '<tr><td class = "list-name">'
            + '<span class="delete-list"> x </span>'
            + listName
            + '</td></tr>';
   return result;      
}

function getListsHTMLRepresentation() {
    var result= '';
    // comparator for sorting is based on names of the list
    var listNames = Object.keys(allTasks).sort(function(a, b) {
                                               return a > b;
                                           });
  
    for(var i = 0; i < listNames.length; i++) {
        result = result + getHTMLForNewList(listNames[i]);
    }
    result = result + getHTMLForAddList();
    return result;
}

function deleteTask(taskDescription) {
    delete (allTasks[getCurrentListIdentifier()][taskDescription]);
}

function markAsDone(taskDescription) {
    (allTasks[getCurrentListIdentifier()][taskDescription])["done"] = true;
}

function isCompleted(taskDescription) {
    return allTasks[getCurrentListIdentifier()][taskDescription]["done"] === true;
}

function getDateStringForDisplay(dueDate) {
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
    return dueDate;
}
/** Helper functions end here. */

/** Functions for displaying HTML elements start here*/
function loadDatePicker() {
    $(function() {
        $("#datepicker").datepicker({
            showOn: "button",
            buttonImage: "images/calendar.gif",
            buttonImageOnly: true
        });
    });
}

function displayNormalTextBox() {
    $(".rhs-top-box").html(
        '<input id="user-input" type = "text" value = ""/> '
        +    '<input id="datepicker" type = "hidden"/> '
        +    '<input id="add-task" type = "button" value="Add Task"/>');
    loadDatePicker();
}

function renderTasks() {
    var content = getTasksHTMLRepresentation();
    var e = $('#task-list').html(content);
}

function renderLists() {
    var content = getListsHTMLRepresentation();
    var e = $('#global-list').html(content);
}

function resetDisplayedTasksList() {
    var modifiedHTML = getTasksHTMLRepresentation();
    var e = $('#task-list').html(modifiedHTML);
}

function resetDisplayedGlobalList() {
    var modifiedHTML = getGlobalListHTMLRepresentation();
    var e = $('#global-list').html(modifiedHTML);
}

function addTask(taskDescription) {
    var dueDate = $("#datepicker").val();
    (allTasks[getCurrentListIdentifier()])[taskDescription] = dueDate;
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
/* Functions for displaying HTML elements end here*/

/* Functions for adding listeners start here */
function addTaskActionListener() {
   $(".task").on("click", function() {
        if(isSomeTaskSelected() === "on") {
            displayDeleteMenu();
        } else {
            displayNormalTextBox();
        }
    });
}

function addNewListListener() {
    $("#add-list").on("click", function() {
         $('#add-list').replaceWith('<tr id="new-list"><td><input id="new-list-name" type="text" value="New List" /></td></tr>'); 
         $('#new-list-name').select();
         addInputListNameActionListener();
    });
    
}

function addInputListNameActionListener() {
    $("#new-list-name").on("blur", function() {
	 var listName = $('#new-list-name').val();
         $('#new-list').replaceWith(getHTMLForNewList(listName));
         $(getHTMLForAddList()).appendTo('#global-list');
         addNewListListener(); 
         addSelectListListener();
    });
}

function addSelectListListener() {
    $(".list-name").on("click", function() {
         $(".list-name").removeClass("selected-list");
         $(this).addClass("selected-list");
         globalListIdentifier = this.textContent.substring(2).trim();
         resetDisplayedTasksList(); 
    });
}

function addDeleteListListener() {
    $(".delete-list").on("click", function(event) {
         event.stopPropagation();
    });
}

/* Functions for adding listeners end here */ 
$(document).ready(function() { 
    renderLists();
    renderTasks();
    $("#add-task").on("click", function() {
            var taskDescription = $("#user-input").val();
            if(taskDescription.length > 0) {
                addTask(taskDescription);
                resetDisplayedTasksList();      
            }  
    });
    addTaskActionListener();
    addNewListListener();
    addSelectListListener();
    addDeleteListListener();
    loadDatePicker();
});
