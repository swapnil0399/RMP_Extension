$(document).ready(function() {
    $(".loader").hide();
    hideAllTabs();
    hideAllRatings();
    hideAllRMPLinks();
    $("#tab_1").show();

    $(".tablink").click(function(){
        hideAllTabs();
        var tabname = "#tab_" + $(this).text().toString();
        $(tabname).show();
    });

    $(".rate").click(function(){
        $.get("http://ec2-54-87-246-226.compute-1.amazonaws.com/?university=The University of Texas at Dallas&prof=Zygmunt Haas", function(data, status){
            console.log(data);
            console.log(status);
        });
        // data = getProfData("The University of Texas at Dallas", "Ivor Page");
    });

    function hideAllTabs(){
        $(".tab").each(function(){
            $(this).hide();
        });
    }

    function hideAllRatings(){
        $(".ratings").each(function(){
            $(this).hide();
        });
    }

    function hideAllRMPLinks(){
        $(".link").each(function(){
            $(this).hide();
        }); 
    }
});

// http://ec2-54-87-246-226.compute-1.amazonaws.com/?university=The University of Texas at Dallas&prof=Zygmunt Haas


