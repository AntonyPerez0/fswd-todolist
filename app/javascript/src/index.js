import $ from 'jquery';
import { indexTasks, postTask, deleteTask, markTaskComplete, markTaskActive } from "./requests.js";

$(document).on('submit', '#new-task-form', function(e) {
  e.preventDefault();
  var content = $('#task-content').val();
  if (content.trim() !== '') {
    postTask(content, function(response) {
      $('#task-content').val('');
      indexTasks(renderTasks);
    }, function(request, errorMsg) {
      console.log(request, errorMsg);
    });
  }
});

$(document).on('click', '.btn-delete', function() {
  var taskId = $(this).closest('.task').data('id');
  deleteTask(taskId, function(response) {
    indexTasks(renderTasks);
  }, function(request, errorMsg) {
    console.log(request, errorMsg);
  });
});

$(document).on('click', '.btn-complete', function() {
  var taskElement = $(this).closest('.task');
  var taskId = taskElement.data('id');
  var isCompleted = $(this).text() === "Completed";
  if (isCompleted) {
    markTaskActive(taskId, function(response) {
      taskElement.removeClass('completed');
      $(this).text('Complete');
      indexTasks(renderTasks);
    }.bind(this), function(request, errorMsg) {
      console.log(request, errorMsg);
    });
  } else {
    markTaskComplete(taskId, function(response) {
      taskElement.addClass('completed');
      $(this).text('Completed');
      indexTasks(renderTasks);
    }.bind(this), function(request, errorMsg) {
      console.log(request, errorMsg);
    });
  }
});

function renderTasks(response) {
  var htmlString = response.tasks.map(function(task) {
    var completedClass = task.completed ? 'completed' : '';
    return "<div class='task " + completedClass + "' data-id='" + task.id + "'>" +
           "<span>" + task.content + "</span>" +
           "<div>" +
           "<button class='btn btn-success btn-sm btn-complete'>" + (task.completed ? "Completed" : "Complete") + "</button>" +
           "<button class='btn btn-danger btn-sm btn-delete'>Delete</button>" +
           "</div>" +
           "</div>";
  });
  $("#tasks").html(htmlString);
}

indexTasks(renderTasks);