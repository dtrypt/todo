  $(function() {

    function taskHtml(task) {
      var checkedStatus = task.done ? "checked" : "";
      var liClass = task.done ? "completed" : "";
      var liElement = '<li id="listItem-' + task.id +'" class="' + liClass + '">' +
        '<div class="view"><input class="toggle" type="checkbox"' +
        " data-id='" + task.id + "'" + //data id is task id
        checkedStatus +
        '><label>' +
        task.title +
        '</label></div></li>'; //trying to understand the '' & "" locations, '' pulls element out of string?
      return liElement;
    }

    function toggleTask(e) { //why don't we use () and $(this) vs e.target?
      var itemId = $(e.target).data("id"); //.data() allows us to attach hidden data to item
      //console.log(itemId);
      var doneValue = Boolean($(e.target).is(':checked'));
      //console.log("done:", doneValue);
      $.post("/tasks/" + itemId, { //why do we need / at the end for updating?
        _method: "PUT",
        task: {
          done: doneValue
        }
      }).success(function(data) {
        var liHtml = taskHtml(data);
        console.log(liHtml);
        console.log(data.id);
        var $li = $("#listItem-" + data.id); //why do we use a global $var, seems to not matter
        $li.replaceWith(liHtml); //if id of li is replaced, full string is replaced
        $('.toggle').click(toggleTask); //does toggleTask run thru the function again or just output the value?
      });
    }

    function retrieveIndex() {
      $.get("/tasks").success( function(data) {
        var htmlString = "";
        $.each(data, function(index, task) {
          htmlString += taskHtml(task);
        });

        var ulTodos = $('.todo-list');
        ulTodos.html(htmlString);

        $('.toggle').change(toggleTask);
        $('.new-todo').val('');
      });
    };

    retrieveIndex();

    $('#new-form').submit(function(event){
      event.preventDefault();
      var newTask = {
        task: { //task comes from the $.each I believe?
          title: $('.new-todo').val()
        } //default boolean false because left empty
      };
      $.post("/tasks", newTask).success(function() {
        //var htmlString = taskHtml(data);
        //var ulTodos = $('.todo-list');

        retrieveIndex();
        
        //ulTodos.append(htmlString);
        //$('.toggle').click(toggleTask); //post error on toggle if page isnt refreshed
      });
    });

  });