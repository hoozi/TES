function tes() {
    var $userList = $(".J_user");
    $userList.on("mouseenter mouseleave", function(e) {
        if(e.type=="mouseenter") {
            $(this).addClass("selected");
        } else {
            $(this).removeClass("selected"); 
        }
    })
}

tes();