var identif = -1

$(function() {
    $.get('http://localhost:3019/paras', function(date) {
        date.forEach(function(date) {

            var remove = $("<button/>").css({ "margin-left": "10px" }).text("remove")
            remove.click(function() {
                identif = date._id
                $.ajax({
                    url: 'http://localhost:3019/paras/remove/' + identif,
                    type: 'DELETE',
                    success: function(response) {
                        location.reload()
                    }
                });

            })

            var edit = $("<button/>").css({ "margin-left": "20px" }).text("Editar")
            edit.click(function() {
                identif = date._id
                $("#novoPar").val(date.para);
            })

            var element = $("<li style=\"margin-bottom: 10px;\" ><b>" + date.date + ":</b> " + date.para + "</li>")

            element.append(edit).append(remove)
            $("#paras").append(element);
        })
    })

    $("#botao").click(function() {
        if (identif == -1) {
            $.post('http://localhost:3019/paras', $("#novoPar").serialize())
            alert('Added ' + ($("#novoPar").val()))
            $("#novoPar").val("")
            location.reload()
        } else {
            $.ajax({
                url: 'http://localhost:3019/paras/editar/' + identif,
                type: 'PUT',
                date: $("#paraForm").serialize(),
                success: function(response) {
                    alert('Edited: ' + ($("#novoPar").val()));
                    $("#novoPar").val("");
                    identif = -1;
                    location.reload();
                }
            });
        }
    })
});