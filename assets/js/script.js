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

		var div1 = $("<div>").addClass("col-md-1 pt-3 rounded");
		div1.html(timeIndex + " " + ampm);

		var taskdesc = tasks["tasks" + timeIndex];
		var div2 = $("<div>").addClass("col-md-10 pt-3 task-description rounded");
		div2.attr("data-hr-slot", "tasks" + timeIndex);
		div2.html(taskdesc);
		// var txtarea2 = $("<textarea>").addClass(
		// 	"form-control col-md-10 task-description"
		// );
		// txtarea2.attr("data-hr-slot", "tasks" + timeIndex);
		// txtarea2.val(taskdesc);

		var btn3 = $("<button>").addClass(
			"col-md-1 btn btn-primary btn-save rounded"
		);
		btn3.attr("type", "button");
		btn3.html("<i class='fas fa-save'></i>");

		divRow.append(div1, div2, btn3);
		//console.log(divRow);
		$(".container").append(divRow);
	}
	$(".btn-save").on("click", function (event) {
		var t = $(this).prev();
		console.log(t);
		var text = t.val().trim();
		var taskid = $(t).attr("data-hr-slot");
		var div2 = $("<div>").addClass("col-md-10 pt-3 task-description");
		div2.attr("data-hr-slot", "tasks" + timeIndex);
		div2.html(text);
		t.replaceWith(div2);
		saveTasks(taskid, text);
	});
	$(".task-description").on("click", function (event) {
		if ($(this).attr("class").indexOf("bg-secondary") > -1) {
			return false;
		}
		var taskdesc = $(this).html();
		var txtarea2 = $("<textarea>").addClass(
			"form-control col-md-10 txt-task-description"
		);
		if ($(this).attr("class").indexOf("bg-warning") > -1)
			txtarea2.addClass("bg-warning");
		if ($(this).attr("class").indexOf("bg-success") > -1)
			txtarea2.addClass("bg-success");
		var taskid = $(this).attr("data-hr-slot");
		txtarea2.attr("data-hr-slot", taskid);
		txtarea2.val(taskdesc);
		$(this).replaceWith(txtarea2);
		txtarea2.focus();
	});
}
function pageSetup() {
	var today = moment().format("dddd MMMM Do YYYY");
	$("#currentDay").html(today);
	buildTasksHtml();
	auditTask();
}

setInterval(function () {
	auditTask();
	console.log;
}, 1000 * 60);

function auditTask() {
	var currentTime = moment();
	var currentHour = moment().hour();
	var passed12 = false;
	$(".due-soon").remove();
	$("#now").remove();
	$(".container .hours .task-description").each(function (index) {
		console.log($(this));
		$(this).removeClass("bg-secondary bg-warning bg-success");
		var t = $(this).attr("data-hr-slot").replace("tasks", "");
		if (passed12) {
			t = Number(t) + 12;
		}
		if (t == 12) passed12 = true;

		var taskTime = moment().set({
			hour: t,
			minute: "00",
			second: "00",
		});

		var btn = $(this).next();
		btn.removeAttr("disabled");
		$(this).removeAttr("disabled");
		if (t == currentHour) {
			$(this).addClass("bg-success ");
			btn.removeAttr("disabled");
			$(this).removeAttr("disabled");
			var text = $(this).prev().html();
			// $(this)
			// 	.prev()
			// 	.html(
			// 		text + "<a href='#' class='badge badge-success'>This Hour</a>"
			// 	);

			$(this)
				.prev()
				.html(
					text +
						"<span class='badge badge-pill badge-success text-align-left' id ='now'>Now&nbsp; </span>"
				);
		} else if (taskTime.isBefore(currentTime)) {
			$(this).addClass("bg-secondary");
			console.log($(this).next());
			btn.attr("disabled", "disabled");
			$(this).prop("disabled", true);
		}
		// if (currentTime.diff(endTime, "minutes") > -6000) {

		// }
		else if (Math.abs(moment().diff(taskTime, "minutes")) < 120) {
			$(this).addClass("bg-warning");
			var text = $(this).prev().html();

			$(this)
				.prev()
				.html(
					text +
						"<span class='badge badge-pill badge-warning text-align-left due-soon'>Due Soon&nbsp; </span>"
				);
		}

		console.log(
			"abs difference taskTime= " +
				taskTime.format("hh:mm:ss") +
				" " +
				Math.abs(moment().diff(taskTime, "minutes"))
		);
	});

	// var hrs = currentTime.diff(endTime, "minutes");
	//console.log(hrs);

	//console.log(endTime.format("dddd MMMM Do YYYY,h:mm:ss a"));
}
window.onload = pageSetup;
