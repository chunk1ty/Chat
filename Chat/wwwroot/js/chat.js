"use strict";

$(document).ready(function () {
    var _currentRoom = "",
        _userName = "";

    $('#myModal').modal("show");

    $("#sendButton").prop("disabled", true);
    var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
    connection.start().then(function () {
        $("#sendButton").prop("disabled", false);
    }).catch(function (err) {
        return console.error(err.toString());
    });

    connection.on("ReceiveMessage", function (userName, message) {
        var userMessage = userName + ": " + message;
        $("#messagesList").append("<li>" + userMessage + "</li>");
    });

    $("#continueBtn").on("click", function () {
        _userName = $("#userName").val();
        if (_userName === "") {
            return;
        }

        _currentRoom = "family";

        connection.invoke("JoinRoom", "family", _userName).catch(function (err) {
            return console.error(err.toString());
        });

        $('#myModal').modal('hide');
    });

    $("#sendButton").on("click", function () {
        if (_userName === "" || _currentRoom === "") {
            return $('#myModal').modal("show");
        }

        var message = $("#messageInput").val();

        connection.invoke("SendMessage", _currentRoom, _userName, message).catch(function (err) {
            return console.error(err.toString());
        });

        $("#messageInput").val("");
    });

    $("#rooms").on("click", "input", function () {
        if (_userName === "" || _currentRoom === "") {
            return $('#myModal').modal("show");
        }

        var selectedRoom = $(this).attr('id');

        if (_currentRoom === selectedRoom) {
            return;
        }

        connection.invoke("LeaveRoom", _currentRoom, _userName).catch(function (err) {
            return console.error(err.toString());
        });

        $("#messagesList").empty();

        _currentRoom = selectedRoom;

        connection.invoke("JoinRoom", _currentRoom, _userName).catch(function (err) {
            return console.error(err.toString());
        });
    });
});