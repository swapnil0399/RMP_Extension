$(document).ready(function() {

    init();

    $(".tablink").click(function(){
        hideAllTabs();
        var tabname = "#tab_" + $(this).text().toString();
        $(tabname).show();
    });

    $(this).ajaxStart(function(){
        $(".loader").show();
    });

    $(this).ajaxComplete(function(){
        $(".loader").hide();
    });

    $(".rate").find(":submit").click(function(){
        var tabNum = "#" + getTabName(this);
        console.log(tabNum);
        var URL = "http://ec2-54-87-246-226.compute-1.amazonaws.com/"
        var prof = $(tabNum).find("#txt_prof").val().toString();
        console.log(prof)
        var univ = $(tabNum).find("#txt_univ").val().toString();
        console.log(univ)
        URL = URL + "?university=" + univ + "&prof=" + prof
        var jsonMimeType = "application/json;charset=UTF-8";

        $.ajax({
            type : "GET",
            url : URL,
            beforeSend: function(x) {
                if(x && x.overrideMimeType) {
                    x.overrideMimeType(jsonMimeType);
                }
            },
            dataType: "json",
            success: function(data){
                console.log(data);
                data.QUALITY = parseFloat(data.QUALITY).toFixed(1);
                data.DIFFICULTY = parseFloat(data.DIFFICULTY).toFixed(1);
    
                console.log(data["UNIVERSITY"]);
                console.log(data["NAME"]);
                console.log(data["QUALITY"]);
                console.log(data["DIFFICULTY"]);
                console.log(data["URL"]);
                $(tabNum).find('#link_rmp').attr("href", data.URL);
    
    
    
                // Populate data in HTML
                $(tabNum).find('h1#lbl_univ').text(data.UNIVERSITY);
                $(tabNum).find('h2#lbl_prof').text(data.NAME);
                $(tabNum).find('h1#lbl_quality').text(data.QUALITY);
                $(tabNum).find('h1#lbl_difficulty').text(data.DIFFICULTY);
                $(tabNum).find('#link_rmp').attr("href", data.URL)
    
                // Hide and Unhide Elements
                $(tabNum).find('#txt_univ').hide();
                $(tabNum).find('#txt_prof').hide();
                $(tabNum).find('h1#lbl_univ').show();
                $(tabNum).find('h2#lbl_prof').show();
                $(tabNum).find(".ratings").show();
                $(tabNum).find(".link").show();
                $(tabNum).find('.reset').show();
    
                // Populate Ratings Bar
                $(tabNum).find('#rating_bar_quality').attr("style", "width: " + ((data.QUALITY/5)*100).toString() + "%");
                $(tabNum).find('#rating_bar_diff').attr("style", "width: " + ((data.DIFFICULTY/5)*100).toString() + "%");
            }  
        });
        $(tabNum).find("#submit").hide();
        clearTextFields();
    });


    //     $.getJSON(URL, function(data){

    //         console.log(data);
    //         data.QUALITY = parseFloat(data.QUALITY).toFixed(1);
    //         data.DIFFICULTY = parseFloat(data.DIFFICULTY).toFixed(1);

    //         console.log(data.UNIVERSITY);
    //         console.log(data.NAME);
    //         console.log(data.QUALITY);
    //         console.log(data.DIFFICULTY);
    //         console.log(data.URL);
    //         $(tabNum).find('#link_rmp').attr("href", data.URL);



    //         // Populate data in HTML
    //         $(tabNum).find('h1#lbl_univ').text(data.UNIVERSITY);
    //         $(tabNum).find('h2#lbl_prof').text(data.NAME);
    //         $(tabNum).find('h1#lbl_quality').text(data.QUALITY);
    //         $(tabNum).find('h1#lbl_difficulty').text(data.DIFFICULTY);
    //         $(tabNum).find('#link_rmp').attr("href", data.URL)

    //         // Hide and Unhide Elements
    //         $(tabNum).find('#txt_univ').hide();
    //         $(tabNum).find('#txt_prof').hide();
    //         $(tabNum).find('h1#lbl_univ').show();
    //         $(tabNum).find('h2#lbl_prof').show();
    //         $(tabNum).find(".ratings").show();
    //         $(tabNum).find(".link").show();
    //         $(tabNum).find('.reset').show();

    //         // Populate Ratings Bar
    //         $(tabNum).find('#rating_bar_quality').attr("style", "width: " + ((data.QUALITY/5)*100).toString() + "%");
    //         $(tabNum).find('#rating_bar_diff').attr("style", "width: " + ((data.DIFFICULTY/5)*100).toString() + "%");
    //     });
    //     $(tabNum).find("#submit").hide();
    //     clearTextFields();
    // });

    $(".reset").click(function(){
        var tabNum = "#" + getTabName(this);
        $(tabNum).find('#txt_univ').val("").show();
        $(tabNum).find('#txt_prof').val("").show();
        $(tabNum).find('h1#lbl_univ').hide();
        $(tabNum).find('h2#lbl_prof').hide();
        $(tabNum).find(".ratings").hide();
        $(tabNum).find(".link").hide();
        $(tabNum).find('.reset').hide();
        $(tabNum).find(".submit_link").find(":submit").show();
    });

    $(".fa-cog").click(function(){
        $(".fa-question-circle").slideToggle("2000");
        $(".switch").slideToggle("1000");
    })

    function init(){
        $(".loader").hide();
        var class_list = [".tab", ".ratings", ".link", ".reset", ".fa-question-circle", ".switch"]
        
        for(var i = 0; i < class_list.length; i++){
            $(class_list[i]).each(function(){
                $(this).hide();
            });
        }

        for(var i = 0; i < 4; i++){
            var tab = "#tab_" + (i+1).toString();
            $(tab).find("#lbl_univ").hide();
            $(tab).find("#lbl_prof").hide();
        }
        $("#tab_1").show();
    }

    function hideAllTabs(){
        $(".tab").each(function(){
            $(this).hide();
        });
    }

    function clearTextFields(){
        for(var i = 0; i < 4; i++){
            var tab = "#tab_" + (i+1).toString();
            $(tab).find('#txt_univ').val("");
            $(tab).find('#txt_prof').val("");
        }
    }

    function getTabName(element){
        parentId = $(element).parent().attr('id');
        if(parentId != undefined){
            if(parentId.startsWith("tab_") == false){
                return getTabName($(element).parent());
            }
            else{
                return parentId;
            }
        } else {
            return getTabName($(element).parent());
        }
    }
    
});

// http://ec2-54-87-246-226.compute-1.amazonaws.com/?university=The University of Texas at Dallas&prof=Zygmunt Haas
