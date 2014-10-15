var allowedChars = /^[\w-+=&' ]+$/;
var currentCardID = "#add-part";

function slideCard($card, direction, side) {
    if (direction === "in") {
        if (side === "right") {
            $card.switchClass("off-left", "off-right", 0);
            $card.removeClass("hidden");
            $card.removeClass("off-right", 300, "swing", function () {
                $card.find("input.focus").focus();
            });
        } else {
            $card.switchClass("off-right", "off-left", 0);
            $card.removeClass("hidden");
            $card.removeClass("off-left", 300, "swing", function () {
                $card.find("input.focus").focus();
            });
        }
    } else {
        if (side === "right") {
            $card.addClass("off-right", 300, "swing", function () {
                $card.addClass("hidden");
            });
        } else {
            $card.addClass("off-left", 300, "swing", function () {
                $card.addClass("hidden");
            });
        }
    }
};

function toCard(targetCardID, currentCardID) {
    if ($(currentCardID).nextAll(targetCardID).length !== 0) {
        slideCard($(currentCardID), "out", "left");
        slideCard($(targetCardID), "in", "right");
    } else if ($(currentCardID).prevAll(targetCardID).length !== 0) {
        slideCard($(currentCardID), "out", "right");
        slideCard($(targetCardID), "in", "left");
    }

    $("ol.steps li.steps-active").removeClass("steps-active");
    var stepIndex = $(targetCardID).index() + 1;
    $("ol.steps li:nth-child(" + stepIndex + ")").addClass("steps-active");

    return targetCardID;
};

function enableCard($cards) {
    $cards.each(function (index) {
        var stepIndex = $(this).index() + 1;
        $("ol.steps li:nth-child(" + stepIndex + ")").addClass("btn-enabled");
    });

    $cards.prev(".card").children(".next").addClass("btn-enabled");
    $cards.next(".card").children(".back").addClass("btn-enabled");
};

function disableCard($cards) {
    $cards.each(function (index) {
        var stepIndex = $(this).index() + 1;
        $("ol.steps li:nth-child(" + stepIndex + ")").removeClass("btn-enabled");
    });

    $cards.prev(".card").children(".next").removeClass("btn-enabled");
    $cards.next(".card").children(".back").removeClass("btn-enabled");
};

function enableFastTrack() {
    $(".card:first-child .next, .submit").addClass("fast-track");
    $("ol.steps li:last-child").addClass("fast-track");
    enableCard($(".card"));
};

function disableFastTrack() {
    $(".card:first-child .next, .submit").removeClass("fast-track");
    $("ol.steps li:last-child").removeClass("fast-track");
    disableCard($(".card").slice(2));
}

function addInputField(id, readOnly, key, value) {
    if (readOnly === undefined) readOnly = false;
    if (key === undefined) key = "";
    if (value === undefined) value = "";

    $newRow = $(id + " tbody tr:last-child").clone().find("input").val("").end();
    $newRow.find("input").attr("placeholder", "");

    var $removeButton = $($.parseHTML('<span class="glyphicon glyphicon-remove"></span>'));

    $removeButton.click(function () {
        $(this).closest('tr').children('td').animate({padding: 0}).wrapInner('<div />').children().slideUp(200, function () {
            $(this).closest('tr').remove();
            $(id + " table tbody tr").each(function (idx) {
                $(this).children().first().text(idx + 1);
            });
            if (id == "#add-attributes") {
                if (validateAddAttributes()) {
                    enableCard($("#barcode"));
                } else {
                    disableCard($("#barcode"));
                }
            } else if (id == "#barcode") {
                if (validateBarcode()) {
                    $(".submit").addClass("btn-enabled");
                } else {
                    $(".submit").removeClass("btn-enabled");
                }
            }
        });
    });

    $newRow.find("input").on("change keyup paste focus", function () {
        if (id == "#add-attributes") {
            if (validateAddAttributes()) {
                enableCard($("#barcode"));
            } else {
                disableCard($("#barcode"));
            }
        } else if (id == "#barcode") {
            if (validateBarcode()) {
                $(".submit").addClass("btn-enabled");
            } else {
                $(".submit").removeClass("btn-enabled");
            }
        }
    });

    $newRow.find("td:last-child").append($removeButton);

    $newRow.find("td:nth-child(2) input").val(key);
    $newRow.find("td:nth-child(3) input").val(value);
    if (readOnly) $newRow.find("td:nth-child(2) input").attr({readonly: true, tabindex: -1});

    if (readOnly) {
        $(id + " tbody tr td:nth-child(2) input:not([readonly])").first().parents("tr").before($newRow);
    } else {
        $(id + " tbody tr:last-child").before($newRow);
    }

    $(id + " table tbody tr").each(function (idx) {
        $(this).children().first().text(idx + 1);
    });
};

function addAttributes(fields) {
    $("#add-attributes table tbody tr td:nth-child(2) input[readonly]").parents("tr").find("span.glyphicon-remove").click();
    $.each(fields, function (index, value) {
        addInputField("#add-attributes", true, value);
    })
}

function validateEditDetails() {
    var partName = allowedChars.test($("#partNameInput").val())
    var category = $("#categoryInput").val() !== null;
    var description = /^[^'"\\]*$/.test($("#descriptionInput").val());
    var datasheet = /^[^'"\\\s]+$/.test($("#datasheetInput").val());
    var location = allowedChars.test($("#locationInput").val());

    if (partName || !$("#partNameInput").val()) {
        $("#partNameInput").parent().removeClass("has-error");
    } else {
        $("#partNameInput").parent().addClass("has-error");
    }

    if (description || !$("#descriptionInput").val()) {
        $("#descriptionInput").parent().removeClass("has-error");
    } else {
        $("#descriptionInput").parent().addClass("has-error");
    }

    if (datasheet || !$("#datasheetInput").val()) {
        $("#datasheetInput").parent().removeClass("has-error");
    } else {
        $("#datasheetInput").parent().addClass("has-error");
    }

    if (location || !$("#locationInput").val()) {
        $("#locationInput").parent().removeClass("has-error");
    } else {
        $("#locationInput").parent().addClass("has-error");
    }

    if (partName && category && description && datasheet && location) {
        enableCard($("#add-attributes"));
    } else {
        disableCard($("#add-attributes"));
    }
}

function validateAddAttributes() {
    var flag = true;
    $("#add-attributes table tbody tr input").parent().removeClass("has-error");
    $("#add-attributes table tbody tr").each(function (index, value) {
        $key = $(this).find("td:nth-child(2) input");
        $val = $(this).find("td:nth-child(3) input");
        if (($key.val() == "") ? !($val.val() == "") : ($val.val() == "")) { //XNOR
            flag = false;
        }
    });

    $("#add-attributes table tbody tr input").each(function (index, value) {
        if (!/^[^"\\]*$/.test($(this).val())) {
            $(this).parent().addClass("has-error");
            flag = false;
        }
    });

    flag = flag && $("#add-attributes table tbody tr").length > 1;

    return flag;
}

function validateBarcode() {
    var flag = true;
    $("#barcode table tbody tr input").parent().removeClass("has-error");
    $("#barcode table tbody tr").each(function (index, value) {
        $key = $(this).find("td:nth-child(2) input");
        $val = $(this).find("td:nth-child(3) input");
        if (($key.val() == "") ? !($val.val() == "") : ($val.val() == "")) { //XNOR
            flag = false;
        }
    });

    $("#barcode table tbody tr input").each(function (index, value) {
        if (!/^\d*$/.test($(this).val())) {
            $(this).parent().addClass("has-error");
            flag = false;
        }
    });

    flag = flag && $("#barcode table tbody tr").length > 1;

    return flag;
}

function Attribute(attribute, value, priority) {
    this.attribute = attribute;
    this.value = value;
    this.priority = priority;
}

function Bag(barcode, quantity) {
    this.barcode = barcode;
    this.quantity = quantity;
}

function Part(partNum, name, category, description, datasheet, location, bags, attributes) {
    this.part_num = partNum;
    this.name = name;
    this.category = category;
    this.description = description;
    this.datasheet = datasheet;
    this.location = location;
    this.bags = bags;
    this.attributes = attributes;
}

function showToast(alertType, title, message) {
    hideToast();
    alertType = "alert-" + alertType;
    var $toast = $("#toast-alert")
        .addClass(alertType);
    $toast.append("<strong>" + title + ': </strong><p style="display:inline">' + message + "</p>");
    $toast.children(".hide-toast").click(function () {
        $toast.removeClass(alertType);
        $toast.children(":not(button)").remove();
        $toast.hide();
    });
    $toast.show();
}

function hideToast() {
    $("#toast-alert > button").click();
}

function submitData() {
    var attributes = [];
    var bags = [];

    $attributes = $("#add-attributes table tr:not(:last-child)");

    $attributes.each(function (index) {
        attributes.push(new Attribute(
            $(this).find("td:nth-child(2) input").val(),
            $(this).find("td:nth-child(3) input").val(),
            $(this).children("td:nth-child(1)").text()
        ));
    });

    $bags = $("#barcode table tr:not(:last-child)");

    $bags.each(function (index) {
        bags.push(new Bag(
            $(this).find("td:nth-child(2) input").val(),
            $(this).find("td:nth-child(3) input").val()
        ));
    });

    var part = new Part(
        $('#partNumberInput').val(),
        $('#partNameInput').val(),
        $('#categoryInput').val(),
        $('#descriptionInput').val(),
        $('#datasheetInput').val(),
        $('#locationInput').val().toUpperCase(),
        bags,
        attributes
    );

    var parts = {
        "parts": [part]
    };

    var data = JSON.stringify(parts);
    $.post("/submit/part", data, "json")
        .done(function (xhr) {
            result = $.parseJSON(xhr);

            if (result.validation_code) {
                showToast("danger", result.title, result.message);
            } else {
                showToast("success", result.title, result.message);
                resetPage();
            }
        })
        .fail(function (xhr) {
            showToast("danger", "Error", "Could not submit part. Error code: " + xhr.status);
        });
}

function resetPage() {
    currentCardID = toCard("#add-part", "#barcode");
    $("#categoryInput").val("");
    $(".card table tr:not(:last-child) td span").click();
    $("input, textarea").val("");
    disableFastTrack();
    disableCard($(".card").slice(1));

}

$(document).ready(function () {
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

    $(".to-card").click(function () {
        if ($(this).hasClass("btn-enabled")) {
            var target = $(this).attr("card");
            if (!(("#" + target) === currentCardID)) {
                currentCardID = toCard("#" + target, currentCardID);
            }
        }
    });

    $(".card .next").click(function () {
        if ($(this).hasClass("fast-track")) {
            var target = "barcode";
            $(".card .next, ol.steps li").addClass("btn-enabled")
        } else {
            var target = $(this).parent().next().attr("id");
        }
        if ($(this).hasClass("btn-enabled")) {
            currentCardID = toCard("#" + target, currentCardID);
        }
    });

    $(".card .back").click(function () {
        if ($(this).hasClass("btn-enabled")) {
            var target = $(this).parent().prev().attr("id");
            currentCardID = toCard("#" + target, currentCardID);
        }
    });

    $("#partNumberInput").on("change keyup paste", function () {
        if (allowedChars.test($(this).val())) {
            enableCard($("#edit-details"));

            var query = {"partNumber": $(this).val()};
            $.post("/validate/partNumber", query, function (result) {

                if (result != 0) {
                    result = $.parseJSON(result);
                    data = result.parts;
                    console.log(data);
                    $("#partNumberInput").parent().addClass("has-success");
                    enableFastTrack();
                    $("#partNumberInput").tooltip();

                } else if (result == 0) {
                    $("#partNumberInput").parent().removeClass("has-success");
                    disableFastTrack();
                    $("#partNumberInput").tooltip('destroy');
                }
            });
        } else {
            disableCard($("#edit-details"));
            if (!$(this).val()) {
                $("#partNumberInput").parent().removeClass("has-error");
            } else {
                $("#partNumberInput").parent().addClass("has-error");
            }
        }
    });

    $('#locationInput').on("change keyup paste", function () {
        var location = allowedChars.test($("#locationInput").val());
        if (location) {
            var query = {"location": $(this).val()};
            $.post("validate/location", query, function (result) {
                if (result == 1) {
                    $("#locationInput").parent().removeClass("has-error");
                    $("#locationInput").parent().addClass("has-success");
                } else {
                    $("#locationInput").parent().addClass("has-error");
                }
            });
        }
    });

    $("#barcode table tbody").on("change keyup paste focus", function () {
        bags = $("#barcode table tr:not(:last-child)");

        bags.each(function (index) {
            barcode = $(this).find("td:nth-child(2) input");
            //console.log(barcode);
            var query = {"barcode": barcode.val()};
            $.post("validate/barcode", query, function (result) {
                console.log(result);
                if (result == 1) {
                    barcode.parent().removeClass("has-error");
                    barcode.parent().addClass("has-success");
                } else {
                    barcode.parent().removeClass("has-success");
                    barcode.parent().addClass("has-error");
                }
            });
        });
    });

    $("#add-attributes tbody tr:last-child input").on("focus", function () {
        addInputField("#add-attributes");
        var index = $(this).parent().index() + 1;
        $(this).parents("tr").prev().find("td:nth-child(" + index + ") input").focus();
    });

    $("#barcode tbody tr:last-child input").on("focus", function () {
        addInputField("#barcode");
        var index = $(this).parent().index() + 1;
        $(this).parents("tr").prev().find("td:nth-child(" + index + ") input").focus();
    });

    $("#edit-details input, #edit-details select, #edit-details textarea").on("change keyup paste", function () {
        if (validateEditDetails()) {
            enableCard($("#add-attributes"));
        } else {
            disableCard($(".card").slice(3));
        }
    });

    $("#edit-details select").change(function () {
        var attributes = {
            capacitor: [
                "Type",
                "Capacitance",
                "Tolerance",
                "Voltage Rating",
                "Series",
                "Package",
                "Mounting Type"],
            connector: [
                "Pitch",
                "Series",
                "Number of Positions",
                "Number of Rows",
                "Connector Type",
                "Contact Type",
                "Mounting Type",
                "Package"],
            diode: [
                "Type",
                "Series",
                "Direction",
                "Channels",
                "Voltage Forward",
                "Voltage Reverse",
                "Mounting Type",
                "Package"],
            ic: [
                "Type",
                "Series",
                "Package",
                "Mounting Type"],
            inductor: [
                "Type",
                "Series",
                "Inductance",
                "Tolerance",
                "Shielding",
                "Current Rating",
                "Mounting Type",
                "Package"],
            oscillator: [
                "Frequency",
                "Type",
                "Series",
                "Function",
                "VS",
                "Current Supply",
                "Mounting Type",
                "Package"],
            resistor: [
                "Resistance",
                "Tolerance",
                "Series",
                "Power",
                "Channels",
                "Mounting Type",
                "Package"],
            other: [
                "Part Type",
                "Mounting Type",
                "Series",
                "Package"]
        };
        addAttributes(attributes[$(this).val()]);
    });

    $(".card form").find("input:last").keydown(function (event) {
        if (event.keyCode == 13 || event.keyCode == 9) {
            $(this).parents(".card").find(".next").click();
            event.preventDefault();
            return false;
        }
    });

    $("#btn-confirm-submit").click(function () {
        if ($(this).hasClass("btn-enabled")) {
            submitData();
        }
    });

});