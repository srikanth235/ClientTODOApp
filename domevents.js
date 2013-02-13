ls = localStorage;
/** Local Storage functions start here. */
function initGlobalList() {
    globalListIdentifier = "Default";
    if("globalList" in ls) {
        globalList = JSON.parse(ls.getItem("globalList"));
    } else {
        globalList = {"Default":null};
        updateLocalStorage();
    }
}

function getGlobalList() {
    return globalList;
}

function updateLocalStorage() {
    ls.setItem("globalList", JSON.stringify(globalList));
}

function loadLocalStorage() {
    globalList = JSON.parse(ls.getItem("globalList"));
}

function addList(listDescription) {
    globalList[listDescription] = {};
    updateLocalStorage();
}

function deleteList(listDescription) {
    delete globalList[listDescription];
    updateLocalStorage();
}

function addTask(taskDescription) {    
    var dueDate = $("#datepicker").val();
    if(globalList[getCurrentListIdentifier()] === null)
        globalList[getCurrentListIdentifier()] = {};
    globalList[getCurrentListIdentifier()][taskDescription] = {"date": dueDate, "done": false};
    updateLocalStorage();
}

function deleteTask(taskDescription) {
    delete (globalList[getCurrentListIdentifier()][taskDescription]);
    updateLocalStorage();
}

function markAsDone(taskDescription) {
    var updatedGlobalList = getGlobalList();
    (updatedGlobalList[getCurrentListIdentifier()][taskDescription])["done"] = true;
    updateLocalStorage(updatedGlobalList);
}

/** Local Storage functions end here. */

/** Helper functions start here. */
function selectDefaultList() {
	$(".list-name").click();
}

function getCurrentListIdentifier() {
    return globalListIdentifier;
}

function isSomeTaskSelected() {
    return $('.task:checkbox:checked').val();
}

function getTasksHTMLRepresentation() {
    var result= '';
    if(!(getCurrentListIdentifier() in getGlobalList())) {
          return '';
    }
    var taskList = (getGlobalList())[getCurrentListIdentifier()];

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
   if(listName != "Default")
       className = "delete-list";
   else 
       className = "default-list";

   var result = '<tr><td class = "list-name">'
            + '<span class='+className+'> x </span>'
            + listName
            + '</td></tr>';
   return result;      
}

function getListsHTMLRepresentation() {
    var result= '';
    // comparator for sorting is based on names of the list
    var listNames = Object.keys(getGlobalList()).sort(function(a, b) {
                                               return a > b;
                                           });
  
    for(var i = 0; i < listNames.length; i++) {
        result = result + getHTMLForNewList(listNames[i]);
    }
    result = result + getHTMLForAddList();
    return result;
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

function isCompleted(taskDescription) {
    return getGlobalList()[getCurrentListIdentifier()][taskDescription]["done"] === true;
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
    addSelectListListener();         
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
    addSelectTaskActionListener();
    addTaskActionListener();
}

function resetDisplayedGlobalList() {
    var modifiedHTML = getGlobalListHTMLRepresentation();
    var e = $('#global-list').html(modifiedHTML);
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
        addSelectTaskActionListener();
        addTaskActionListener(); 
    }); 
}

function populateDefaultText() {
    $('#jsonstring').val("Please provide json string and click import...");
}
/* Functions for displaying HTML elements end here*/

/* Functions for adding listeners start here */
function addTaskActionListener() {
   $("#add-task").on("click", function() {
            var taskDescription = $("#user-input").val();
            if(taskDescription.length > 0) {
                addTask(taskDescription);
                taskDescription = $("#user-input").val("");
                resetDisplayedTasksList();      
            }  
    });
}

function addSelectTaskActionListener() {
   $('.task:checkbox').on("click", function() {
        var count = 0; 
        event.stopPropagation();
        var tasks = $('.task:checkbox');
        for(var i = 0; i < tasks.length; i++)
	    if($(tasks[i]).is(':checked') === true) {
                count++;
        }
        if(count > 0) {
            displayDeleteMenu();
        } else {
            displayNormalTextBox();
            addTaskActionListener(); 
        } 
   });
}

function addNewListListener() {
    $("#add-list").on("click", function() {	
         $('#add-list').replaceWith('<tr id="new-list"><td><input id="new-list-name" type="text" value="New List" /></td></tr>'); 
         $('#new-list-name').select();
         addInputListNameActionListener();     
         addDeleteListListener();
    });    
}

function addInputListNameActionListener() {
    $("#new-list-name").on("blur", function() {
	 var listName = $('#new-list-name').val();
         addList(listName);
         $('#new-list').replaceWith(getHTMLForNewList(listName));
         $(getHTMLForAddList()).appendTo('#global-list');
         addNewListListener(); 
         addSelectListListener();
         addTaskActionListener();
    });
}

function addSelectListListener() {
    $(".list-name").on("click", function() {
         $(".list-name").removeClass("selected-list");
         $(this).addClass("selected-list");
         globalListIdentifier = this.textContent.substring(2).trim();
         resetDisplayedTasksList(); 
	 addSelectTaskActionListener();
         addTaskActionListener(); 
    });
}

function addDeleteListListener() {
    $(".delete-list").on("click", function(event) {
         event.stopPropagation();
         var selectedList = this.parentNode.textContent.substring(2).trim();
         deleteList(selectedList);
         $(this.parentNode.parentNode).remove();
    });
}

function addImportActionListener() {
    $("#import").on("click", function() {
         var json = $("#jsonstring").val();
         var importedLists = JSON.parse(json);
         alert(importedLists);
         for(var list in importedLists) {
             if (importedLists.hasOwnProperty(list)) {
                 alert(list);
                 if(!(list in globalList)) {
                     alert("New List");
                     globalList[list] = importedLists[list];
                 }
                 for(var task in list) {
                     if(list.hasOwnProperty(task)) {
                        if(!(task in globalList[list]))
                            globalList[list][task] = importedLists[list][task]; 
                     }
                 }
             }
         }
         renderLists();
         renderTasks();
         addSelectTaskActionListener();
         addNewListListener();
         //addDeleteListListener();
    addSelectListListener();
    addTaskActionListener();
    addImportActionListener();
    addExportActionListener();
    addJSONStringListener();
    populateDefaultText();
    loadDatePicker();
    selectDefaultList();
    });

}

function addExportActionListener() {
    $("#export").on("click", function() {
         alert("All tasks across all lists in JSON format is:" + JSON.stringify(getGlobalList()));
    });
}

function addJSONStringListener() {
    $("#jsonstring").on("focus", function() {
         $(this).val("");
    });

    $("#jsonstring").on("blur", function() {
         var string = $("#jsonstring").val();
         if(string === "")
            $(this).val("Please provide json string and click import...");
    });
}
/* Functions for adding listeners end here */ 
$(document).ready(function() { 
    loadLocalStorage();
    initGlobalList();
    renderLists();
    renderTasks();
    addSelectTaskActionListener();
    addNewListListener();
    addDeleteListListener();
    addSelectListListener();
    addTaskActionListener();
    addImportActionListener();
    addExportActionListener();
    addJSONStringListener();
    populateDefaultText();
    loadDatePicker();
    selectDefaultList();
});
