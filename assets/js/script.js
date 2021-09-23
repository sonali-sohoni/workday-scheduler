$(".btn-save").on("click", function (event) {
	var t = $(this).prev();
	console.log(t);
	var text = t.val().trim();
	var taskid = $(t).attr("data-hr-slot");
	console.log(taskid);
	console.log(text);
	saveTasks(taskid, text);
});

var tasks = [];
function saveTasks(taskid, text) {
	// var tasksJson = localStorage.getItem("work-hr-tasks");
	// if (tasksJson) {
	// 	tasks = JSON.parse(tasksJson);
	// } else tasks = [];
	var newTask = {};
	newTask[taskid] = text;
	console.log(newTask);
	tasks.push(newTask);
	console.log(tasks);
	localStorage.setItem("work-hr-tasks", JSON.stringify(tasks));
}

function getTasks() {
  	var tasksJson = localStorage.getItem("work-hr-tasks");
		if (tasksJson) {
			tasks = JSON.parse(tasksJson);
		} else tasks = [];
}

function buildTasksHtml() {
  for (var i = 8; i <= 17; i++){
    var divRow = $("<div>");
    divRow.classList.add("row hours");
  }
}
