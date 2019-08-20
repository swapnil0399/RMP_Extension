$(document).ready(function () {

    var colors = {
        light_primary: "#eae5ab",
        light_secondary: "#2e5f85",
        dark_primary: "#222831",
        dark_secondary: "#eae5ab",
        // dark_secondary: "#00adb5",
        light_text: "#000000"
    };
    var tabNum;
    var tab_dict =  {};
    var ajaxManager = {
        requests: [],
        addReq: function(req) {
            this.requests.push(req);
            var prof = req[0].url.substring(req[0].url.indexOf('&'))
            tab_dict[prof.substring(prof.indexOf('=')).slice(1).toUpperCase()] = req[1];
            console.log(tab_dict);
            console.log("Request Added");
            console.log("Request object length: " + this.requests.length)
            if (this.requests.length == 1) {
                console.log("Fired the run function")
                this.run();
            }
        },
        removeReq: function(req) {
            if($.inArray(req, requests) > -1)
                this.requests.splice($.inArray(req, requests), 1);
        },
        run: function() {
            var ajxmgr = this;
            var requests = this.requests;
            Promise.resolve($.ajax(this.requests[0][0])).then(function(data, error){
                if(error){
                    console.log(error)
                    $(ajxmgr.requests[0][1]).find("#overlay").css("display", "none");
                    setData(error, ajxmgr.requests[0][1], true);
                    delete tab_dict[prof_name];
                } else{
                    console.log(data);
                    var prof_name = data.NAME;
                    setData(data, tab_dict[prof_name], false);
                    $(tab_dict[prof_name]).find("#overlay").css("display", "none");
                    console.log("After the get request " + prof_name)
                    delete tab_dict[prof_name];
                    console.log(tab_dict)
                }
                ajxmgr.requests.shift();
                console.log("length: " + ajxmgr.requests.length)
                if (ajxmgr.requests.length > 0) {
                    ajxmgr.run();
                }
            });
        },
        stop: function() {
            this.requests = [];
        }
    }

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

    $(".rate").find(":submit").click(function () {
        tabNum = "#" + getTabName(this);
        console.log(tabNum);
        var URL = "http://ec2-54-174-106-197.compute-1.amazonaws.com/"
        var prof = $(tabNum).find("#txt_prof").val().toString();
        var univ = $(tabNum).find("#txt_univ").val().toString();
        console.log(prof)
        console.log(univ)
        if (prof === "" || univ === ""){
            alert("Please enter university and a professor name")
        } else {
            $(tabNum).find("#overlay").css("display", "block");
            URL = URL + "?university=" + univ + "&prof=" + prof
            var requestObject = createRequest(URL, tabNum);
            ajaxManager.addReq(requestObject);
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

    function createRequest(reqURL, tabNum) {
        var requestObject = new Array(2);
        requestObject[0] = ({
            type: 'GET',
            url: reqURL,
            datatype: 'json',
            crossDomain: true,
            success: function(data){
                return data;
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
                console.log(status);
                console.log(error);
                return error;
            }
        });
        requestObject[1] = tabNum;
        console.log(requestObject);
        return requestObject;
    }

    function setData(data, tabNum, error) {

        if(error){
            // Set Error Data
        } else {
            $(tabNum).find("#submit").hide();
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
            clearTextFields();
        }
    }

});

// http://{DOMAIN_NAME}/?university=The University of Texas at Dallas&prof=Zygmunt Haas