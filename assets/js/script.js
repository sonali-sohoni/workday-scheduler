var tasks = {};
function getTasks() {
	var tasksJson = localStorage.getItem("work-hr-tasks");
	if (tasksJson) {
		tasks = JSON.parse(tasksJson);
	} else tasks = {};

	var temp = { "8am": "abc", "9am": "def", "10am": "pqr" };
	var x = JSON.stringify(temp);
	var y = JSON.parse(x);
	console.log(x);
	console.log(y);
}
function saveTasks(taskid, text) {
	// var tasksJson = localStorage.getItem("work-hr-tasks");
	// if (tasksJson) {
	// 	tasks = JSON.parse(tasksJson);
	// } else tasks = [];
	getTasks();

	tasks[taskid] = text;
	console.log(tasks);
	console.log(JSON.stringify(tasks));
	localStorage.setItem("work-hr-tasks", JSON.stringify(tasks));
}

function buildTasksHtml() {
	getTasks();
	for (var i = 8; i <= 17; i++) {
		var ampm = i < 12 ? "am" : "pm";
		var timeIndex = i > 12 ? i - 12 : i;
		var divRow = $("<div>");
		divRow.addClass("row hours border-top border-bottom");

		var div1 = $("<div>").addClass("col-md-1 pt-3");
		div1.html(timeIndex + " " + ampm);

		var taskdesc = tasks["tasks" + timeIndex];
		var div2 = $("<div>").addClass("col-md-10 pt-3 task-description");
		div2.attr("data-hr-slot", "tasks" + timeIndex);
		div2.html(taskdesc);
		// var txtarea2 = $("<textarea>").addClass(
		// 	"form-control col-md-10 task-description"
		// );
		// txtarea2.attr("data-hr-slot", "tasks" + timeIndex);
		// txtarea2.val(taskdesc);

		var btn3 = $("<button>").addClass("col-md-1 btn btn-primary btn-save");
		btn3.attr("type", "button");
		btn3.html("<i class='fas fa-save'></i>");

		divRow.append(div1, div2, btn3);
		console.log(divRow);
		$(".container").append(divRow);
	}
	$(".btn-save").on("click", function (event) {
		var t = $(this).prev();
		console.log(t);
		var text = t.val().trim();
		var taskid = $(t).attr("data-hr-slot");
		console.log(taskid);
		console.log(text);
		saveTasks(taskid, text);
	});
}

window.onload = buildTasksHtml;
