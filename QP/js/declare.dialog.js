$("#search-dialog").dialog({
	width:780,
	autoOpen: false,
	modal: true,
	resizable: false,
    closeText:"关闭",
    closeOnEscape: true,
	close: function(){
		
	}
})

$("#result-dialog").dialog({
	width:780,
	autoOpen: false,
	modal: true,
	resizable: false,
    closeText:"关闭",
    closeOnEscape: true
})

$("#search-arrivePort-dialog").dialog({
	width:600,
	autoOpen: false,
	modal: true,
	resizable: false,
	closeText:"关闭",
	closeOnEscape: true,
	close: function(){
		$("#arrivedPort_v").focus();
	}
})
$("#company-record-dialog").dialog({
	width:600,
	autoOpen: false,
	modal: true,
	resizable: false,
	closeText:"关闭",
	closeOnEscape: true,
	close: function(){
		$("#businessCompanyCode").focus();
	}
})
$("#add-companyRecord-dialog").dialog({
	width:600,
	autoOpen: false,
	modal: true,
	resizable: false,
	closeText:"关闭",
	closeOnEscape: true
})