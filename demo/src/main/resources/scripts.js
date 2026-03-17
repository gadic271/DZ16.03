let currentUserId = null;

function userList() {
    $.ajax({
        url: 'http://localhost:8081/api/users',
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
        "<td>" + user.age + "</td>" +
        "<td><button class='btn btn-danger btn-sm delete-btn' data-id='" + user.id + "'>Delete</button></td>" +
        "<td><button class='btn btn-warning btn-sm update-btn' data-id='" + user.id + "'>Update</button></td>" +
        "<td><input type='checkboox' class='user-checkbox' data-id='" + user.id + "'></td>" +
        "</tr>";
}

$(document).on('click', '.delete-btn', function() {
    var id = $(this).data('id');
    deleteUser(id);
});

$(document).on('click', '.update-btn', function() {
    var id = $(this).data('id');
    var firstname = $(this).closest('tr').find('td:eq(0)').text();
    var lastname = $(this).closest('tr').find('td:eq(1)').text();
    var age = $(this).closest('tr').find('td:eq(2)').text();
    editUser(id, firstname, lastname, age);
});

function deleteUser(id) {
    $.ajax({
        url: 'http://localhost:8081/api/users/' + id,
        type: 'DELETE',
        success: function () {
            userList();
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
}

function editUser(id, firstname, lastname, age) {
    currentUserId = id;
    $("#firstname").val(firstname);
    $("#lastname").val(lastname);
    $("#age").val(age);
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
    $("#age").val("");
    currentUserId = null;
    $("#updateButton").text("Add");
}

function updateClick() {
    const user = {
        firstname: $("#firstname").val(),
        lastname: $("#lastname").val(),
        age: $("#age").val()
    };
    if (currentUserId) {
        updateUser(currentUserId, user);
    } else {
        userAdd(user);
    }
}

function userAdd(user) {
    $.ajax({
        url: "http://localhost:8081/api/users",
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
    userList();
}

function updateUser(id, user) {
    $.ajax({
        url: 'http://localhost:8081/api/users/' + id,
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
        url: 'http://localhost:8081/api/users',
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
        url: 'http://localhost:8081/api/users/rename-all-to-efimov',
        type: 'PUT',
        success: function () {
            userList();
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });
}

function setAllAgesTo100Click() {
    $.ajax({
        url: 'http://localhost:8081/api/users/age/set-to-100',
        type: 'PUT',
        success: function () {
            userList();
        },
        error: function (request, message, error) {
            handleException(request, message, error);
        }
    });

function deleteSelectedClick() {
    var selectedIds = [];
    $('.user-checkbox:checked').each(function() {
        selectedIds.push($(this).data('id'));
    });

    if (selectedIds.length === 0) {
        alert("No users selected");
        return;
    }

    if (!confirm("Delete " + selectedIds.length + " selected user(s)?")) {
        return;
    }

    var deletedCount = 0;
    selectedIds.forEach(function(id) {
        $.ajax({
            url: 'http://localhost:8081/api/users/' + id,
            type: 'DELETE',
            success: function() {
                deletedCount++;
                if (deletedCount === selectedIds.length) {
                    userList();
                }
            },
            error: function(request, message, error) {
                handleException(request, message, error);

            }
        });
    });
}


}