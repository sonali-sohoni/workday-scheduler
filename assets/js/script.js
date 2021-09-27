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
		if (!taskdesc) taskdesc = "";
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
	//$(".btn-save").on("click", function (event) {
	$(".container").on("click", ".btn-save", function (event) {
		var t = $(this).prev();
		console.log(t);
		var text = t.val().trim();
		var taskid = $(t).attr("data-hr-slot");
		var div2 = $("<div>").addClass("col-md-10 pt-3 task-description");
		div2.attr("data-hr-slot", taskid);
		div2.html(text);
		t.replaceWith(div2);
		saveTasks(taskid, text);
		auditTask();
	});
	$(".container").on("click", ".task-description", function (event) {
		console.log(event);
		if ($(this).attr("class").indexOf("bg-secondary") > -1) {
			return false;
		}
		console.log($(this));
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
	// var today = moment().format("dddd MMMM Do YYYY");
	// $("#currentDay").html(today);

	buildTasksHtml();
	auditTask();
}

setInterval(function () {
	auditTask();
	console.log;
}, 1000 * 120);

function setDisplayDate() {
	var displayDateStr = $("#currentDay").text();
	displayDateStr += " 11:59:00";

	var displayDate = moment(displayDateStr, "dddd MMMM Do YYYY hh:mm:ss");
	var today = moment().format("dddd MMMM Do YYYY");
	if (moment().isAfter(displayDate, "days")) {
		$("#currentDay").html(today);
		localStorage.removeItem("work-hr-tasks");
		console.log(
			moment().format("dddd MMMM Do YYYY hh:mm:ss") +
				" " +
				displayDate.format("dddd MMMM Do YYYY hh:mm:ss") +
				" localstorage cleared. ****"
		);
		$(".container").empty();
		buildTasksHtml();
	} else {
		$("#currentDay").html(today);
	}
	//remove old tasks
}

function auditTask() {
	setDisplayDate();
	var currentTime = moment();
	var currentHour = moment().hour(); //	moment().hour() >= 13 ? moment().hour() - 12 :
	//currentHour = currentHour === 0 ? 12 : currentHour;
	console.log(" time now " + currentTime);
	var passed12 = false;
	$(".due-soon").remove();
	$("#now").remove();

	$(".container .hours .task-description ,.txt-task-description").each(
		//,
		function (index) {
			//console.log($(this));
			$(this).removeClass("bg-secondary bg-warning bg-success");
			var t = $(this).attr("data-hr-slot").replace("tasks", "");

			var format = "hh:mm:ss";
			var taskTime = moment().set({
				hour: t,
				minute: "00",
				second: "00",
			}); //moment("8:00:00", format);
			beforeTime = moment("7:59:00", format);
			afterTime = moment("12:00:01", format);
			if (taskTime.isBetween(beforeTime, afterTime)) {
				console.log("is between");
			} else {
				t = Number(t) + 12;
				taskTime = moment().set({
					hour: t, //Number(t) + 12,
					minute: "00",
					second: "00",
				});
				console.log("is not between");
			}

			console.log("Task time = " + taskTime.format("hh:mm:ss"));

			// if (passed12) {
			// 	t = Number(t) + 12;
			// }
			// if (t == 12) passed12 = true;

			// var

			var btn = $(this).next();
			btn.removeAttr("disabled");
			$(this).removeAttr("disabled");

			if (t == currentHour) {
				$(this).addClass("bg-success ");
				console.log("green cell");
				btn.removeAttr("disabled");
				$(this).removeAttr("disabled");
				$(this).prop("disabled", false);
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
				console.log("gray cell");
			}
			// if (currentTime.diff(endTime, "minutes") > -6000) {

			// }
			else if (Math.abs(currentTime.diff(taskTime, "minutes")) < 120) {
				$(this).addClass("bg-warning");
				var text = $(this).prev().html();
				$(this).removeAttr("disabled");
				$(this).prop("disabled", false);
				$(this)
					.prev()
					.html(
						text +
							"<span class='badge badge-pill badge-warning text-align-left due-soon'>Due Soon&nbsp; </span>"
					);
				console.log("orange cell");
			}
			console.log($(this).prop("disabled"));
			// console.log(
			// 	"abs difference taskTime= " +
			// 		taskTime.format("hh:mm:ss") +
			// 		" " +
			// 		Math.abs(moment().diff(taskTime, "minutes"))
			// );
		}
	);

	// var hrs = currentTime.diff(endTime, "minutes");
	//console.log(hrs);

	//console.log(endTime.format("dddd MMMM Do YYYY,h:mm:ss a"));
}
window.onload = pageSetup;
