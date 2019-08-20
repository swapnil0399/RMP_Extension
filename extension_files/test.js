$(document).ready(function () {

    var colors = {
        light_primary: "#eae5ab",
        light_secondary: "#2e5f85",
        dark_primary: "#222831",
        dark_secondary: "#339999",
        light_text: "#000000"
    };
    var tabNum;
    var primary_color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    var secondary_color = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color');
    var text_color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
    init();

    $(".tablink").click(function () {
        hideAllTabs();
        var tabname = "#tab_" + $(this).text().toString();
        $(tabname).show();
        resetColorValues();
        $(this).css("background-color", primary_color);
        $(this).css("color", secondary_color);
    });

    $(this).ajaxStart(function () {
        $(tabNum).find("#overlay").css("display", "block");
    });

    $(this).ajaxComplete(function () {
        $(tabNum).find("#overlay").css("display", "none");
    });

    $(".rate").find(":submit").click(function () {
        tabNum = "#" + getTabName(this);
        console.log(tabNum);
        var URL = "http://ec2-54-174-106-197.compute-1.amazonaws.com/"
        var prof = $(tabNum).find("#txt_prof").val().toString();
        var univ = $(tabNum).find("#txt_univ").val().toString();
        URL = URL + "?university=" + univ + "&prof=" + prof
        if(!((prof == null || prof === '') || (univ == null || univ === ''))){
            $.get(URL, function (data, status) {
                console.log(data);
                data.QUALITY = parseFloat(data.QUALITY).toFixed(1);
                data.DIFFICULTY = parseFloat(data.DIFFICULTY).toFixed(1);
                $(tabNum).find('#link_rmp').attr("href", data.URL);
    
                // Populate data in HTML
                $(tabNum).find('#lbl_univ').text(data.UNIVERSITY);
                $(tabNum).find('#lbl_prof').text(data.NAME);
                $(tabNum).find('#lbl_quality').text(data.QUALITY);
                $(tabNum).find('#lbl_difficulty').text(data.DIFFICULTY);
                $(tabNum).find('#link_rmp').attr("href", data.URL)
    
                // Hide and Unhide Elements
                $(tabNum).find('#txt_univ').hide();
                $(tabNum).find('#txt_prof').hide();
                $(tabNum).find('#lbl_univ').show();
                $(tabNum).find('#lbl_prof').show();
                $(tabNum).find(".ratings").show();
                $(tabNum).find(".link").show();
                $(tabNum).find('.reset').show();
    
                // Populate Ratings Bar
                $(tabNum).find('#rating_bar_quality').attr("style", "width: " + ((data.QUALITY / 5) * 100).toString() + "%");
                $(tabNum).find('#rating_bar_diff').attr("style", "width: " + ((data.DIFFICULTY / 5) * 100).toString() + "%");
            });
            $(tabNum).find("#submit").hide();
            clearTextFields();
        }
    });

    $(".reset").click(function () {
        var tabNum = "#" + getTabName(this);
        $(tabNum).find('#txt_univ').val("").show();
        $(tabNum).find('#txt_prof').val("").show();
        $(tabNum).find('#lbl_univ').hide();
        $(tabNum).find('#lbl_prof').hide();
        $(tabNum).find(".ratings").hide();
        $(tabNum).find(".link").hide();
        $(tabNum).find('.reset').hide();
        $(tabNum).find(".submit_link").find(":submit").show();
    });

    $(".fa-cog").click(function () {
        $(".fa-question-circle").slideToggle("2000");
        $(".switch").slideToggle("1000");
    })

    $(".switch").find(":input").click(function () {
        // Change view
        var dark = false;

        if ($(this).is(':checked')) {
            // Dark theme
            dark = true;
            primary_color = colors.dark_primary;
            secondary_color = colors.dark_secondary;
            document.documentElement.style.setProperty('--primary-color', primary_color);
            document.documentElement.style.setProperty('--secondary-color', secondary_color);
            document.documentElement.style.setProperty('--text-color', secondary_color);
        }
        else {
            // Light theme
            primary_color = colors.light_primary;
            secondary_color = colors.light_secondary;
            text_color = colors.text_color;
            document.documentElement.style.setProperty('--primary-color', primary_color);
            document.documentElement.style.setProperty('--secondary-color', secondary_color);
            document.documentElement.style.setProperty('--text-color', text_color);
        }

        // Set all the toggle button to checked or unchecked
        $(".switch").find(":input").each(function () {
            if (dark)
                $(this).prop("checked", true);
            else
                $(this).prop("checked", false);
        });

        var tab = Number(getTabName(this)[4]);
        var count = 1;

        $(".tablink").each(function () {
            if (count == tab) {
                $(this).css("background-color", primary_color);
                $(this).css("color", secondary_color);
            } else {
                $(this).css("background-color", secondary_color);
                $(this).css("color", primary_color);
            }
            count++;
        });
    });

    function init() {
        var class_list = [".tab", ".ratings", ".link", ".reset", ".fa-question-circle", ".switch"]

        for (var i = 0; i < class_list.length; i++) {
            $(class_list[i]).each(function () {
                $(this).hide();
            });
        }

        for (var i = 0; i < 4; i++) {
            var tab = "#tab_" + (i + 1).toString();
            $(tab).find("#lbl_univ").hide();
            $(tab).find("#lbl_prof").hide();
            $(tab).find("#overlay").hide();
        }

        $(".tablink").first().css("background-color", primary_color);
        $(".tablink").first().css("color", secondary_color);
        $("#tab_1").show();
    }

    function hideAllTabs() {
        $(".tab").each(function () {
            $(this).hide();
        });
    }

    function clearTextFields() {
        for (var i = 0; i < 4; i++) {
            var tab = "#tab_" + (i + 1).toString();
            $(tab).find('#txt_univ').val("");
            $(tab).find('#txt_prof').val("");
        }
    }

    function getTabName(element) {
        parentId = $(element).parent().attr('id');
        if (parentId != undefined) {
            if (parentId.startsWith("tab_") == false) {
                return getTabName($(element).parent());
            }
            else {
                return parentId;
            }
        } else {
            return getTabName($(element).parent());
        }
    }

    function resetColorValues() {
        $(".tablink").each(function () {
            $(this).css("background-color", secondary_color);
            $(this).css("color", primary_color);
        });
    }

});

// http://ec2-54-197-15-125.compute-1.amazonaws.com/?university=The University of Texas at Dallas&prof=Zygmunt Haas
