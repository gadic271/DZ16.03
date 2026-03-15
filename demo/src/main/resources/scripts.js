let currentUserId = null;

function userList() {
    $.ajax({
        url: 'http://localhost:8080/api/users',
        type: 'GET',
        dataType: 'json',
        success: function (users) {
            userListSuccess(users);
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
}

function userListSuccess(users) {
    $("#userTable tbody").remove(); // очищаем таблицу
    $.each(users, function (index, user) {
        userAddRow(user);
    });
}

function userAddRow(user) {
    if ($("#userTable tbody").length == 0) {
        $("#userTable").append("<tbody></tbody>");
    }
    $("#userTable tbody").append(userBuildTableRow(user));
}

function userBuildTableRow(user) {
    return "<tr>" +
        "<td>" + user.firstname + "</td>" +
        "<td>" + user.lastname + "</td>" +
        "<td><button class='btn btn-danger btn-sm delete-btn' data-id='" + user.id + "'>Delete</button></td>" +
        "<td><button class='btn btn-warning btn-sm update-btn' data-id='" + user.id + "'>Update</button></td>" +
        "</tr>";
}

// Обработчики через делегирование (должны быть после загрузки DOM)
$(document).on('click', '.delete-btn', function() {
    var id = $(this).data('id');
    deleteUser(id);
});

$(document).on('click', '.update-btn', function() {
    var id = $(this).data('id');
    var firstname = $(this).closest('tr').find('td:eq(0)').text();
    var lastname = $(this).closest('tr').find('td:eq(1)').text();
    editUser(id, firstname, lastname);
});

function deleteUser(id) {
    $.ajax({
        url: 'http://localhost:8080/api/users/' + id,
        type: 'DELETE',
        success: function () {
            userList();
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
}

function editUser(id, firstname, lastname) {
    currentUserId = id;
    $("#firstname").val(firstname);
    $("#lastname").val(lastname);
    $("#updateButton").text("Update");
}

function handleException(request, message, error) {
    let msg = "";
    msg += "Code: " + request.status + "\n";
    msg += "Text: " + request.statusText + "\n";
    if (request.responseJSON != null) {
        msg += "Message" + request.responseJSON.Message + "\n";
    }
    alert(msg);
}

function formClear() {
    $("#firstname").val("");
    $("#lastname").val("");
    currentUserId = null;
    $("#updateButton").text("Add");
}

function updateClick() {
    const user = {
        firstname: $("#firstname").val(),
        lastname: $("#lastname").val()
    };
    if (currentUserId) {
        updateUser(currentUserId, user);
    } else {
        userAdd(user);
    }
}

function userAdd(user) {
    $.ajax({
        url: "http://localhost:8080/api/users",
        type: 'POST',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(user),
        success: function (user) {
            userAddSuccess(user);
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
}

function userAddSuccess(user) {
    formClear();
    userList(); // перезагружаем таблицу
}

function updateUser(id, user) {
    $.ajax({
        url: 'http://localhost:8080/api/users/' + id,
        type: 'PUT',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(user),
        success: function () {
            formClear();
            userList();
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
}

function deleteAllClick() {
    $.ajax({
        url: 'http://localhost:8080/api/users',
        type: 'DELETE',
        success: function () {
            userList();
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
}

function renameAllClick() {
    $.ajax({
        url: 'http://localhost:8080/api/users/rename-all-to-efimov',
        type: 'PUT',
        success: function () {
            userList();
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
}