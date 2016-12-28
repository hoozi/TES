// 页面初始化
$(function(){
//var DOCU_content_store;
	init();
	getDeclareCode();
	set_cqp_info();
	query_cqp_record_url();
});

//保存或修改报关单
function add_declare(){
	
	/*changeStatusToSure($("#dec-ctn-content"));
	changeStatusToSure($("#doc-content"));*/
	
	var options = {
		url : '/declare/addDeclareMain.action',
		type : 'POST',
		dataType:'json',
		beforeSubmit : before_submit,
        success: show_result,
        error : show_error
	};
	$("#form1").ajaxSubmit(options);
	var nums = $("#packagesNum").val();
	var price = $("#price_total .t_price").text();
	//var cnName = $("#businessCompany").val();
	$("#numbers_2").val() || $("#numbers_2").val(nums);
	$("#price_2").val() || $("#price_2").val(price);
	//$("#businessCompany_2").val() || $("#businessCompany_2").val(cnName);
	return false;
}

function before_submit(){
	if($("#businessCompany").val().length > 15){
		alert("经营单位中文名不能超过15位");
		return false;
	}
	if($("#productionCompany").val().length > 15){
		alert("发货单位中文名不能超过15位");
		return false;
	}
	if($("#declareCompany").val().length > 15){
		alert("申请单位中文名不能超过15位");
		return false;
	}
	if($("#businessCompanyCode").val().length != 10){
		alert("经营单位代码只能是10位");
		return false;
	}
	if($("#productionCompanyCode").val().length != 10){
		alert("发货单位代码只能是10位");
		return false;
	}
	if($("#declareCompanyCode").val().length != 10){
		alert("申请单位代码只能是10位");
		return false;
	}
}
function show_result(data){
	if(data.flag == 1){
		var cloudQpId = data.cloudQpId; 
		$("#cqp_id").val(cloudQpId)
		query_cqp_record(cloudQpId);
		alert("保存成功");
	}else{
		alert("error");
	}
}
function show_error(){
	alert("error");
}

//把表格里的未确认的数据自动置为确认状态
function changeStatusToSure($container){
	var $container_list = $($container).find("ul");
	$container_list.each(function(){
		var el = $(this).find(".dec-ok");
		var li = el.parents("ul").find(".input_li");
		if(el.text()=="确定") {
			el.text("修改");
			li.each(function(){
				var div = $(this).find("div");
				var inputText = div.find("input[type=text]");
				var select = div.find("select");
				var selected = select.find("option:selected");
				var inputHid = $(this).find("input[type=hidden]");
				var addClass = $(this).find(".sum").size()&&$(this).find(".sum").val()!=""?"add_sum add_div":"add_div";
				div.html(inputText.val() || selected.text()).addClass(addClass);
				inputText.remove();
				select.hide();
				inputHid.val(inputText.val()||selected.val());
			})
		}
	})
}

//查询报关单记录
function query_cqp_record(cloudQpId){
	
	if(cloudQpId == null || cloudQpId == "" || cloudQpId == undefined){
		cloudQpId = $("#cqp_id").val()
	}
	
	if(cloudQpId == ""){
		alert("流水号不能为空");
		return false;
	}
	clearAllData();
	$.ajax({
		type : "post" ,
	    url : "/declare/queryDfgCtn.action?cloudQpId="+cloudQpId,
	    dataType : "json" ,
	    async:false,
	    success : function(data){
			if(data.flag == "1"){
				var result = eval(data.result);
				if(result != null){
					//第一个TAB页赋值（还差 类型、企业性质）
					$("#cloudQpId").val(result.declareMain.cloudQpId);
					if (result.declareReceipt != null) {
						$("#receiptDes").text(result.declareReceipt.receiptNote);					
					} else {
						$("#receiptDes").text("");
					}
					$("#ieFlag").val(result.declareMain.ieFlag);
					$("#status").val(result.declareMain.status);
					$("#eportNo").val(result.declareMain.eportNo);
					$("#customNo").val(result.declareMain.customNo);
					$("#preentryNo").val(result.declareMain.preentryNo);
					$("#declareLocation_v").val((result.declareMain.declareLocationCode||"")==""?"":(result.declareMain.declareLocationCode+" "+result.declareMain.declareLocation));
					$("#declareLocation").val(result.declareMain.declareLocation);
					$("#declareLocationCode").val(result.declareMain.declareLocationCode);					
					$("#exportLocation_v").val((result.declareMain.exportLocationCode||"")==""?"":(result.declareMain.exportLocationCode+" "+result.declareMain.exportLocation));
					$("#exportLocation").val(result.declareMain.exportLocation);
					$("#exportLocationCode").val(result.declareMain.exportLocationCode);
					$("#enrolNo").val(result.declareMain.enrolNo);
					$("#exportDate").val(result.declareMain.exportDate);
					$("#declareDate").val(result.declareMain.declareDate);
					$("#businessCompanyCode").val(result.declareMain.businessCompanyCode);
					$("#businessCompany").val(result.declareMain.businessCompany);
					$("#transportMode_v").val((result.declareMain.transportModeCode||"")==""?"":(result.declareMain.transportModeCode+" "+result.declareMain.transportMode));
					$("#transportMode").val(result.declareMain.transportMode);
					$("#transportModeCode").val(result.declareMain.transportModeCode||"");
					$("#transportName").val(result.declareMain.transportName);
					$("#transportId").val(result.declareMain.transportId);
					$("#billNo").val(result.declareMain.billNo);
					$("#productionCompanyCode").val(result.declareMain.productionCompanyCode);
					$("#productionCompany").val(result.declareMain.productionCompany);
					$("#tradeMode_v").val((result.declareMain.tradeModeCode||"")==""?"":(result.declareMain.tradeModeCode+" "+result.declareMain.tradeMode));
					$("#tradeMode").val(result.declareMain.tradeMode);
					$("#tradeModeCode").val(result.declareMain.tradeModeCode||"");
					$("#cutMode_v").val((result.declareMain.cutModeCode||"")==""?"":(result.declareMain.cutModeCode+" "+result.declareMain.cutMode));
					$("#cutMode").val(result.declareMain.cutMode);
					$("#cutModeCode").val(result.declareMain.cutModeCode||"");
					$("#payMode_v").val(result.declareMain.payModeCode==""?"":(result.declareMain.payModeCode+" "+result.declareMain.payMode));
					$("#payMode").val(result.declareMain.payMode);
					$("#payModeCode").val(result.declareMain.payModeCode);
					$("#declareCompany").val(result.declareMain.declareCompany);
					$("#declareCompanyCode").val(result.declareMain.declareCompanyCode);
					$("#arrivedCountry_v").val(result.declareMain.arrivedCountryCode==""?"":(result.declareMain.arrivedCountryCode+" "+result.declareMain.arrivedCountry));
					$("#arrivedCountry").val(result.declareMain.arrivedCountry);
					$("#arrivedCountryCode").val(result.declareMain.arrivedCountryCode);
					$("#arrivedPort_v").val(result.declareMain.arrivedPortCode==""?"":(result.declareMain.arrivedPortCode+" "+result.declareMain.arrivedPort));
					$("#arrivedPort").val(result.declareMain.arrivedPort);
					$("#arrivedPortCode").val(result.declareMain.arrivedPortCode);
					$("#goodsSource_v").val(result.declareMain.goodsSourceCode==""?"":(result.declareMain.goodsSourceCode+" "+result.declareMain.goodsSource));
					$("#goodsSource").val(result.declareMain.goodsSource);
					$("#goodsSourceCode").val(result.declareMain.goodsSourceCode);
					$("#tradingCountry_v").val(result.declareMain.tradingCountryCode==""?"":(result.declareMain.tradingCountryCode+" "+result.declareMain.tradingCountry));
					$("#tradingCountry").val(result.declareMain.tradingCountry);
					$("#tradingCountryCode").val(result.declareMain.tradingCountryCode);					
					$("#transactionMode_v").val((result.declareMain.transactionModeCode||"")==""?"":(result.declareMain.transactionModeCode+" "+result.declareMain.transactionMode));
					$("#transactionMode").val(result.declareMain.transactionMode);
					$("#transactionModeCode").val(result.declareMain.transactionModeCode||"");
					$("#freightMark_v").val((result.declareMain.freightMark||"")==""?"":(result.declareMain.freightMark+" "+result.declareMain.freightMarkChn));
					$("#freightMark").val(result.declareMain.freightMark||"");
					$("#freightMarkChn").val(result.declareMain.freightMarkChn);
					$("#freightRate").val(result.declareMain.freightRate||"");
					$("#freightCurrency_v").val(result.declareMain.freightCurrency==""?"":(result.declareMain.freightCurrency+" "+result.declareMain.freightCurrencyChn));
					$("#freightCurrency").val(result.declareMain.freightCurrency);
					$("#freightCurrencyChn").val(result.declareMain.freightCurrencyChn);
					$("#insuranceMark_v").val((result.declareMain.insuranceMark||"")==""?"":(result.declareMain.insuranceMark+" "+result.declareMain.insuranceMarkChn));
					$("#insuranceMark").val(result.declareMain.insuranceMark||"");
					$("#insuranceMarkChn").val(result.declareMain.insuranceMarkChn);
					$("#insuranceRate").val(result.declareMain.insuranceRate||"");
					$("#insuranceCurrency_v").val(result.declareMain.insuranceCurrency==""?"":(result.declareMain.insuranceCurrency+" "+result.declareMain.insuranceCurrencyChn));
					$("#insuranceCurrency").val(result.declareMain.insuranceCurrency);
					$("#insuranceCurrencyChn").val(result.declareMain.insuranceCurrencyChn);
					$("#extrasMark_v").val((result.declareMain.extrasMark||"")==""?"":(result.declareMain.extrasMark+" "+result.declareMain.extrasMarkChn));
					$("#extrasMark").val(result.declareMain.extrasMark||"");
					$("#extrasMarkChn").val(result.declareMain.extrasMarkChn);
					$("#extrasRate").val(result.declareMain.extrasRate||"");
					$("#extrasCurrency_v").val(result.declareMain.extrasCurrency==""?"":(result.declareMain.extrasCurrency+" "+result.declareMain.extrasCurrencyChn));
					$("#extrasCurrency").val(result.declareMain.extrasCurrency);
					$("#extrasCurrencyChn").val(result.declareMain.extrasCurrencyChn);
					$("#packagesNum").val(result.declareMain.packagesNum||"");
					$("#packingType_v").val((result.declareMain.packingTypeCode||"")==""?"":(result.declareMain.packingTypeCode+" "+result.declareMain.packingType));
					$("#packingType").val(result.declareMain.packingType);
					$("#packingTypeCode").val(result.declareMain.packingTypeCode||"");
					$("#grossWeight").val(result.declareMain.grossWeight||"");
					$("#netWeight").val(result.declareMain.netWeight||"");
					$("#remark").val(result.declareMain.remark);
					$("#contractNo").val(result.declareMain.contractNo);
					$("#entryType_v").val(result.declareMain.entryTypeCode==""?"":(result.declareMain.entryTypeCode+" "+result.declareMain.entryType));
					$("#entryType").val(result.declareMain.entryType);
					$("#entryTypeCode").val(result.declareMain.entryTypeCode);
					$("#taxCorporationType").val(result.declareMain.taxCorporationType);
					$("#licenseNo").val(result.declareMain.licenseNo);
					//$("#approvalNo").val(result.declareMain.approvalNo);
					$("#relativeEntryNo").val(result.declareMain.relativeEntryNo);
					$("#relativeEnrolNo").val(result.declareMain.relativeEnrolNo);
					$("#warehouseNo").val(result.declareMain.warehouseNo);
					$("#cyNo").val(result.declareMain.cyNo);
					$("#vouchFlag").val(result.declareMain.vouchFlag);
					if(result.declareMain.vouchFlag == "Y"){
						$("#vouchFlag").prop("checked", "checked");
					}else{
						$("#vouchFlag").prop("checked", "");
					}
					//第一个TAB页表格的数据
					$(result.declareCtnList).each(function(index, obj){
						table2.append([
							{
								name:"ctn_no",
								value:index+1,
								hiddenName: "declareCtnList["+index+"].ctn_no"
							},
							{
								name:"containerNo",
								value:obj.containerNo || "",
								hiddenName: "declareCtnList["+index+"].containerNo"
							},
							{
								name:"containerSize",
								value:obj.containerSize || "",
								hiddenName: "declareCtnList["+index+"].containerSize"
							},
							{
								name:"containerWeight",
								value:obj.containerWeight || "",
								hiddenName: "declareCtnList["+index+"].containerWeight"
							},
							{
								name:"declareCtnId",
								value:obj.declareCtnId,
								hiddenName: "declareCtnList["+index+"].declareCtnId"
							}
						]);
						/*ctnContent +=
							"<ul class='clearfix' data-no="+index+">"+
							"	<li class='ctn-1 input_li' upper='Y'>"+
							"		<div>"+
							"			<input type='text' name='' id='' value='"+obj.containerNo+"' onkeyup='Convert(this)'/>"+
							"		</div>"+
							"		<input type='hidden' name='declareCtnList["+index+"].containerNo' value='"+obj.containerNo+"'/>"+
							"	</li>"+
							"	<li class='ctn-2 input_li'>"+
							"		<div>"+
							"			<input type='text' name='' id='' value='"+obj.containerSize+"'/>"+
							"		</div>"+
							"		<input type='hidden' name='declareCtnList["+index+"].containerSize' value='"+obj.containerSize+"'/>"+
							"	</li>"+
							"	<li class='ctn-3 input_li' onlyNum='Y'>"+
							"		<div>"+
							"			<input type='text' name='' id='' value='"+(obj.containerWeight||"")+"' onkeyup=\"value=value.replace(/[^\\d\\.]/g,'')\"/>"+
							"		</div>"+
							"		<input type='hidden' name='declareCtnList["+index+"].containerWeight' value='"+(obj.containerWeight||"")+"'/>"+
							"	</li>"+
							"	<li class='ctn-4 input_li no_width'>"+
							"		<div style='display:none'>"+
							"			<input type='text' name='' id='' value='"+obj.declareCtnId+"'/>"+
							"		</div>"+
							"		<input type='hidden' name='declareCtnList["+index+"].declareCtnId' value='"+obj.declareCtnId+"'/>"+
							"	</li>"+
							"	<li class='ctn-5'><a href='javascript:;' class='dec-ok'>确定</a><a href='javascript:;' class='dec-del'>删除</a></li>"+
							"</ul>"*/
					})
					//$("#dec-ctn-content").html(ctnContent);
					//第二个TAB页表格的数据
					//var docContent = ""
					$(result.declareDocList).each(function(index, obj){
						table3.append([
							{
								name:"att_no",
								value:index+1,
								hiddenName: "declareDocList["+index+"].att_no"
							},
							{
								name:"docAttachedCode",
								value:obj.docAttachedCode+" "+obj.docAttached,
								hiddenName: "declareDocList["+index+"].docAttachedCode"
							},
							{
								name:"docAttachedNo",
								value:obj.docAttachedNo,
								hiddenName: "declareDocList["+index+"].docAttachedNo"
							},
							{
								name:"declareDocId",
								value:obj.declareDocId,
								hiddenName: "declareDocList["+index+"].declareDocId"
							}
						]);
						/*docContent +=
							"<ul class='clearfix' data-no="+index+">"+
							"	<li class='doc-1 input_li'>"+
							"		<div>"+
							"			<input type='text' name='' id='' value='"+obj.docAttachedCode+" "+obj.docAttached+"'/>"+
							"		</div>"+
							"		<input type='hidden' name='declareDocList["+index+"].docAttachedCode' value='"+obj.docAttachedCode+" "+obj.docAttached+"'/>"+
							"	</li>"+
							"	<li class='doc-2 input_li'>"+
							"		<div>"+
							"			<input type='text' name='' id='' value='"+obj.docAttachedNo+"'/>"+
							"		</div>"+
							"		<input type='hidden' name='declareDocList["+index+"].docAttachedNo' value='"+obj.docAttachedNo+"'/>"+
							"	</li>"+
							"	<li class='doc-3 input_li no_width'>"+
							"		<div style='display:none'>"+
							"			<input type='text' name='' id='' value='"+obj.declareDocId+"'/>"+
							"		</div>"+
							"		<input type='hidden' name='declareDocList["+index+"].declareDocId' value='"+obj.declareDocId+"'/>"+
							"	</li>"+
							"	<li class='doc-4'><a href='javascript:;' class='dec-ok'>确定</a><a href='javascript:;' class='dec-del'>删除</a></li>"+
							"</ul>"*/
					})
					//$("#doc-content").html(docContent);
					//第三个TAB页表格的数据
					//var goodsContent = ""
						$(result.declareGoodsList).each(function(index, obj){
							table1.append([
								{
									name:"goodsSeq",
									value:(obj.goodsSeq||""),
									hiddenName: "declareGoodsList["+index+"].goodsSeq"
								},
								{
									name:"hsCode",
									value:obj.hsCode.substring(0,8),
									hiddenName: "declareGoodsList["+index+"].hsCode"
								},
								{
									name:"enrolNo",
									value:(obj.enrolNo||""),
									hiddenName: "declareGoodsList["+index+"].enrolNo"
								},
								{
									name:"goodsName",
									value:obj.goodsName,
									hiddenName: "declareGoodsList["+index+"].goodsName"
								},
								{
									name:"arrivalCountry",
									value:(obj.arrivalCountryCode == ""?"":(obj.arrivalCountryCode+" "+obj.arrivalCountry)),
									hiddenName: "declareGoodsList["+index+"].arrivalCountry"
								},
								{
									name:"quantity",
									value:(obj.quantity||""),
									hiddenName: "declareGoodsList["+index+"].quantity"
								},
								{
									name:"quantityUnit",
									value:(obj.quantityUnit==""?"":(obj.quantityUnit+" "+obj.quantityUnitChn)),
									hiddenName: "declareGoodsList["+index+"].quantityUnit"
								},
								{
									name:"unitPrice",
									value:(obj.unitPrice||""),
									hiddenName: "declareGoodsList["+index+"].unitPrice"
								},
								{
									name:"sum",
									value:(obj.totalPrice||""),
									hiddenName: "declareGoodsList["+index+"].totalPrice"
								},
								{
									name:"currency",
									value:(obj.currency==""?"":(obj.currency+" "+obj.currencyChn)),
									hiddenName: "declareGoodsList["+index+"].currency"
								},
								{
									name:"dutyMode",
									value:(obj.dutyMode==""?"":(obj.dutyMode+" "+obj.dutyModeChn)),
									hiddenName: "declareGoodsList["+index+"].dutyMode"
								},
								{
									name:"extraNo",
									value:obj.extraNo,
									hiddenName: "declareGoodsList["+index+"].extraNo"
								},
								{
									name:"goodsVersion",
									value:(obj.goodsVersion||""),
									hiddenName: "declareGoodsList["+index+"].goodsVersion"
								},
								{
									name:"goodsNo",
									value:obj.goodsNo,
									hiddenName: "declareGoodsList["+index+"].goodsNo"
								},
								{
									name:"use",
									value:obj.use,
									hiddenName: "declareGoodsList["+index+"].use"
								},
								{
									name:"model",
									value:obj.model,
									hiddenName: "declareGoodsList["+index+"].model"
								},
								{
									name:"firstQuantity",
									value:(obj.firstQuantity||""),
									hiddenName: "declareGoodsList["+index+"].firstQuantity"
								},
								{
									name:"firstUnit",
									value:(obj.firstUnit==""?"":(obj.firstUnit+" "+obj.firstUnitChn)),
									hiddenName: "declareGoodsList["+index+"].firstUnit"
								},
								{
									name:"secondQuantity",
									value:(obj.secondQuantity||""),
									hiddenName: "declareGoodsList["+index+"].secondQuantity"
								},
								{
									name:"secondUnit",
									value:(obj.secondUnit==""?"":(obj.secondUnit+" "+obj.secondUnitChn)),
									hiddenName: "declareGoodsList["+index+"].secondUnit"
								},
								{
									name:"processingCharges",
									value:(obj.processingCharges||""),
									hiddenName: "declareGoodsList["+index+"].processingCharges"
								},
								{
									name:"declareGoodsId",
									value:obj.declareGoodsId,
									hiddenName: "declareGoodsList["+index+"].declareGoodsId"
								}
							]);
							/*goodsContent +=
								"<ul class='clearfix' data-no="+index+">"+
								"	<li class='d-li11 input_li'>"+
								"		<div class='add_div' data-index='goodsSeq'>"+(obj.goodsSeq||"")+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].goodsSeq' value='"+(obj.goodsSeq||"")+"'/>"+
								"	</li>"+
								"	<li class='d-li1 input_li'>"+
								"		<div class='add_div' data-index='hsCode'>"+(obj.hsCode.substring(0,8))+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].hsCode' value='"+(obj.hsCode.substring(0,8))+"'/>"+
								"	</li>"+
								"	<li class='d-li2 input_li'>"+
								"		<div class='add_div' data-index='enrolNo'>"+(obj.enrolNo||"")+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].enrolNo' value='"+(obj.enrolNo||"")+"'/>"+
								"	</li>"+
								"	<li class='d-li3 input_li'>"+
								"		<div class='add_div' data-index='goodsName'>"+obj.goodsName+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].goodsName' value='"+obj.goodsName+"'/>"+
								"	</li>"+
								"	<li class='d-li4 input_li'>"+
								"		<div class='add_div' data-index='arrivalCountry'>"+obj.arrivalCountryCode+" "+obj.arrivalCountry+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].arrivalCountry' value='"+(obj.arrivalCountryCode == ""?"":(obj.arrivalCountryCode+" "+obj.arrivalCountry))+"'/>"+
								"	</li>"+
								"	<li class='d-li5 input_li'>"+
								"		<div class='add_div' data-index='quantity'>"+(obj.quantity||"")+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].quantity' value='"+(obj.quantity||"")+"'/>"+
								"	</li>"+
								"	<li class='d-li6 input_li'>"+
								"		<div class='add_div' data-index='quantityUnit'>"+obj.quantityUnit+" "+obj.quantityUnitChn+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].quantityUnit' value='"+(obj.quantityUnit==""?"":(obj.quantityUnit+" "+obj.quantityUnitChn))+"'/>"+
								"	</li>"+
								"	<li class='d-li7 input_li'>"+
								"		<div class='add_div' data-index='unitPrice'>"+(obj.unitPrice||"")+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].unitPrice' value='"+(obj.unitPrice||"")+"'/>"+
								"	</li>"+
								"	<li class='d-li8 input_li'>"+
								"		<div  class='add_sum add_div' data-index='sum'>"+(obj.totalPrice||"")+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].totalPrice' value='"+(obj.totalPrice||"")+"'/>"+
								"	</li>"+
								"	<li class='d-li9 input_li'>"+
								"		<div class='add_div' data-index='currency'>"+obj.currency+" "+obj.currencyChn+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].currency' value='"+(obj.currency==""?"":(obj.currency+" "+obj.currencyChn))+"'/>"+
								"	</li>"+
								"	<li class='d-li10 input_li'>"+
								"		<div class='add_div' data-index='dutyMode'>"+obj.dutyMode+" "+obj.dutyModeChn+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].dutyMode' value='"+(obj.dutyMode==""?"":(obj.dutyMode+" "+obj.dutyModeChn))+"'/>"+
								"	</li>"+
								"	<li class='d-li12 input_li no_width'>"+
								"		<div class='add_div' data-index='extraNo' style='display:none'>"+obj.extraNo+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].extraNo' value='"+obj.extraNo+"'/>"+
								"	</li>"+
								"	<li class='d-li13 input_li no_width'>"+
								"		<div class='add_div' data-index='goodsVersion' style='display:none'>"+(obj.goodsVersion||"")+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].goodsVersion' value='"+(obj.goodsVersion||"")+"'/>"+
								"	</li>"+
								"	<li class='d-li14 input_li no_width'>"+
								"		<div class='add_div' data-index='goodsNo' style='display:none'>"+obj.goodsNo+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].goodsNo' value='"+obj.goodsNo+"'/>"+
								"	</li>"+
								"	<li class='d-li15 input_li no_width'>"+
								"		<div class='add_div' data-index='use' style='display:none'>"+obj.use+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].use' value='"+obj.use+"'/>"+
								"	</li>"+
								"	<li class='d-li16 input_li no_width'>"+
								"		<div class='add_div' data-index='model' style='display:none'>"+obj.model+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].model' value='"+obj.model+"'/>"+
								"	</li>"+
								"	<li class='d-li17 input_li no_width'>"+
								"		<div class='add_div' data-index='firstQuantity' style='display:none'>"+(obj.firstQuantity||"")+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].firstQuantity' value='"+(obj.firstQuantity||"")+"'/>"+
								"	</li>"+
								"	<li class='d-li18 input_li no_width'>"+
								"		<div class='add_div' data-index='firstUnit' style='display:none'>"+obj.firstUnit+" "+obj.firstUnitChn+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].firstUnit' value='"+(obj.firstUnit==""?"":(obj.firstUnit+" "+obj.firstUnitChn))+"'/>"+
								"	</li>"+
								"	<li class='d-li19 input_li no_width'>"+
								"		<div class='add_div' data-index='secondQuantity' style='display:none'>"+(obj.secondQuantity||"")+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].secondQuantity' value='"+(obj.secondQuantity||"")+"'/>"+
								"	</li>"+
								"	<li class='d-li20 input_li no_width'>"+
								"		<div class='add_div' data-index='secondUnit' style='display:none'>"+(!obj.secondUnit?"":(obj.secondUnit+" "+obj.secondUnitChn))+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].secondUnit' value='"+(obj.secondUnit==""?"":(obj.secondUnit+" "+obj.secondUnitChn))+"'/>"+
								"	</li>"+
								"	<li class='d-li21 input_li no_width'>"+
								"		<div class='add_div' data-index='processingCharges' style='display:none'>"+(obj.processingCharges||"")+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].processingCharges' value='"+(obj.processingCharges||"")+"'/>"+
								"	</li>"+
								"	<li class='d-li22 input_li no_width'>"+
								"		<div class='add_div' data-index='declareGoodsId' style='display:none'>"+obj.declareGoodsId+"</div>"+
								"		<input type='hidden' name='declareGoodsList["+index+"].declareGoodsId' value='"+obj.declareGoodsId+"'/>"+
								"	</li>"+
								"	<li class='d-li23'>"+
								"		<a href='javascript:;' class='dec-del'>删除</a>&nbsp;<a href='javascript:;' class='dec-copy'>复制</a>"+
								"	</li>"+
								"</ul>"*/
						})
						//$("#goods-content").html(goodsContent);
					     sum();
					//第二个TAB页数据
					if(result.declareOther != null){
						$("#invoiceNo_2").val(result.declareOther.invoiceNo);
						$("#numbers_2").val(result.declareOther.numbers);
						$("#unit_2").val(result.declareOther.unit);
						$("#creditNo_2").val(result.declareOther.creditNo);
						$("#invoiceSigner_2").val(result.declareOther.invoiceSigner);
						$("#price_2").val(result.declareOther.price);
						$("#currency_2").val(result.declareOther.currency);
						$("#businessCompany_2").val(result.declareOther.businessCompany);
						$("#businessCompanyEn_2").val(result.declareOther.businessCompanyEn);
						$("#businessCompanyAddr_2").val(result.declareOther.businessCompanyAddr);
						$("#customCompamy_2").val(result.declareOther.customCompamy);
						$("#customTel_2").val(result.declareOther.customTel);
						$("#customCompamyAddr_2").val(result.declareOther.customCompamyAddr);
						$("#customsBroker_2").val(result.declareOther.customsBroker);
						$("#rmbRate_2").val(result.declareOther.rmbRate);
						$("#usdRate_2").val(result.declareOther.usdRate);
						$("#tax_2").val(result.declareOther.tax);
					}
					sum();
					uploadLogo("edocFile_1", "00000001", result.declareMain.cloudQpId);
					uploadLogo("edocFile_2", "00000002", result.declareMain.cloudQpId);
					uploadLogo("edocFile_3", "00000003", result.declareMain.cloudQpId);
					uploadLogo("edocFile_4", "00000004", result.declareMain.cloudQpId);
					uploadLogo("edocFile_5", "00000005", result.declareMain.cloudQpId);
					uploadLogo("edocFile_6", "00000006", result.declareMain.cloudQpId);
					uploadLogo("edocFile_7", "00000007", result.declareMain.cloudQpId);
					uploadLogo("edocFile_8", "00000008", result.declareMain.cloudQpId);
					//uploadLogo("edocFile_9", "10000001", result.declareMain.cloudQpId);
					uploadLogo("edocFile_10", "10000002", result.declareMain.cloudQpId);
					$("#edocFile_9").attr("cloudQpId", result.declareMain.cloudQpId);
					$(result.declareEdocList).each(function(index, obj){
						if(obj.edocCode == "10000001"){
							$("#edocFile_9").val(obj.edocId)
						}
					})
				}
			}else if(data.flag == '0'){
				alert("请先登陆")
			}else if(data.flag == '3'){
				alert("未查询到数据")
			}else{
				alert("对不起，查询异常，请稍后再试")
			}
		},
		error : function(data){
			
		}
	});
}

//查询报关单记录
function copy_cqp_record(cloudQpId){
	
	if(cloudQpId == null || cloudQpId == "" || cloudQpId == undefined){
		cloudQpId = $("#cqp_id").val()
	}
	
	if(cloudQpId == ""){
		alert("流水号不能为空");
		return false;
	}
	
	clearAllData();
	$.ajax({
		type : "post" ,
		url : "/declare/queryDfgCtn.action?cloudQpId="+cloudQpId,
		dataType : "json" ,
		async:false,
		success : function(data){
		if(data.flag == "1"){
			var result = eval(data.result);
			if(result != null){
				//第一个TAB页赋值（还差 类型、企业性质）
				//$("#cloudQpId").val(result.declareMain.cloudQpId);
				$("#ieFlag").val(result.declareMain.ieFlag);
				$("#status").val(result.declareMain.status);
				$("#eportNo").val(result.declareMain.eportNo);
				$("#customNo").val(result.declareMain.customNo);
				$("#preentryNo").val(result.declareMain.preentryNo);
				$("#declareLocation_v").val((result.declareMain.declareLocationCode||"")==""?"":(result.declareMain.declareLocationCode+" "+result.declareMain.declareLocation));
				$("#declareLocation").val(result.declareMain.declareLocation);
				$("#declareLocationCode").val(result.declareMain.declareLocationCode);					
				$("#exportLocation_v").val((result.declareMain.exportLocationCode||"")==""?"":(result.declareMain.exportLocationCode+" "+result.declareMain.exportLocation));
				$("#exportLocation").val(result.declareMain.exportLocation);
				$("#exportLocationCode").val(result.declareMain.exportLocationCode);
				$("#enrolNo").val(result.declareMain.enrolNo);
				$("#exportDate").val(result.declareMain.exportDate);
				$("#declareDate").val(result.declareMain.declareDate);
				$("#businessCompanyCode").val(result.declareMain.businessCompanyCode);
				$("#businessCompany").val(result.declareMain.businessCompany);
				$("#transportMode_v").val((result.declareMain.transportModeCode||"")==""?"":(result.declareMain.transportModeCode+" "+result.declareMain.transportMode));
				$("#transportMode").val(result.declareMain.transportMode);
				$("#transportModeCode").val(result.declareMain.transportModeCode||"");
				$("#transportName").val(result.declareMain.transportName);
				$("#transportId").val(result.declareMain.transportId);
				$("#billNo").val(result.declareMain.billNo);
				$("#productionCompanyCode").val(result.declareMain.productionCompanyCode);
				$("#productionCompany").val(result.declareMain.productionCompany);
				$("#tradeMode_v").val((result.declareMain.tradeModeCode||"")==""?"":(result.declareMain.tradeModeCode+" "+result.declareMain.tradeMode));
				$("#tradeMode").val(result.declareMain.tradeMode);
				$("#tradeModeCode").val(result.declareMain.tradeModeCode||"");
				$("#cutMode_v").val((result.declareMain.cutModeCode||"")==""?"":(result.declareMain.cutModeCode+" "+result.declareMain.cutMode));
				$("#cutMode").val(result.declareMain.cutMode);
				$("#cutModeCode").val(result.declareMain.cutModeCode||"");
				$("#payMode_v").val(result.declareMain.payModeCode==""?"":(result.declareMain.payModeCode+" "+result.declareMain.payMode));
				$("#payMode").val(result.declareMain.payMode);
				$("#payModeCode").val(result.declareMain.payModeCode);
				$("#declareCompany").val(result.declareMain.declareCompany);
				$("#declareCompanyCode").val(result.declareMain.declareCompanyCode);
				$("#arrivedCountry_v").val(result.declareMain.arrivedCountryCode==""?"":(result.declareMain.arrivedCountryCode+" "+result.declareMain.arrivedCountry));
				$("#arrivedCountry").val(result.declareMain.arrivedCountry);
				$("#arrivedCountryCode").val(result.declareMain.arrivedCountryCode);
				$("#arrivedPort_v").val(result.declareMain.arrivedPortCode==""?"":(result.declareMain.arrivedPortCode+" "+result.declareMain.arrivedPort));
				$("#arrivedPort").val(result.declareMain.arrivedPort);
				$("#arrivedPortCode").val(result.declareMain.arrivedPortCode);
				$("#goodsSource_v").val(result.declareMain.goodsSourceCode==""?"":(result.declareMain.goodsSourceCode+" "+result.declareMain.goodsSource));
				$("#goodsSource").val(result.declareMain.goodsSource);
				$("#goodsSourceCode").val(result.declareMain.goodsSourceCode);
				$("#tradingCountry_v").val(result.declareMain.tradingCountryCode==""?"":(result.declareMain.tradingCountryCode+" "+result.declareMain.tradingCountry));
				$("#tradingCountry").val(result.declareMain.tradingCountry);
				$("#tradingCountryCode").val(result.declareMain.tradingCountryCode);
				$("#transactionMode_v").val((result.declareMain.transactionModeCode||"")==""?"":(result.declareMain.transactionModeCode+" "+result.declareMain.transactionMode));
				$("#transactionMode").val(result.declareMain.transactionMode);
				$("#transactionModeCode").val(result.declareMain.transactionModeCode||"");
				$("#freightMark_v").val((result.declareMain.freightMark||"")==""?"":(result.declareMain.freightMark+" "+result.declareMain.freightMarkChn));
				$("#freightMark").val(result.declareMain.freightMark||"");
				$("#freightMarkChn").val(result.declareMain.freightMarkChn);
				$("#freightRate").val(result.declareMain.freightRate||"");
				$("#freightCurrency_v").val(result.declareMain.freightCurrency==""?"":(result.declareMain.freightCurrency+" "+result.declareMain.freightCurrencyChn));
				$("#freightCurrency").val(result.declareMain.freightCurrency);
				$("#freightCurrencyChn").val(result.declareMain.freightCurrencyChn);
				$("#insuranceMark_v").val((result.declareMain.insuranceMark||"")==""?"":(result.declareMain.insuranceMark+" "+result.declareMain.insuranceMarkChn));
				$("#insuranceMark").val(result.declareMain.insuranceMark||"");
				$("#insuranceMarkChn").val(result.declareMain.insuranceMarkChn);
				$("#insuranceRate").val(result.declareMain.insuranceRate||"");
				$("#insuranceCurrency_v").val(result.declareMain.insuranceCurrency==""?"":(result.declareMain.insuranceCurrency+" "+result.declareMain.insuranceCurrencyChn));
				$("#insuranceCurrency").val(result.declareMain.insuranceCurrency);
				$("#insuranceCurrencyChn").val(result.declareMain.insuranceCurrencyChn);
				$("#extrasMark_v").val((result.declareMain.extrasMark||"")==""?"":(result.declareMain.extrasMark+" "+result.declareMain.extrasMarkChn));
				$("#extrasMark").val(result.declareMain.extrasMark||"");
				$("#extrasMarkChn").val(result.declareMain.extrasMarkChn);
				$("#extrasRate").val(result.declareMain.extrasRate||"");
				$("#extrasCurrency_v").val(result.declareMain.extrasCurrency==""?"":(result.declareMain.extrasCurrency+" "+result.declareMain.extrasCurrencyChn));
				$("#extrasCurrency").val(result.declareMain.extrasCurrency);
				$("#extrasCurrencyChn").val(result.declareMain.extrasCurrencyChn);
				$("#packagesNum").val(result.declareMain.packagesNum||"");
				$("#packingType_v").val((result.declareMain.packingTypeCode||"")==""?"":(result.declareMain.packingTypeCode+" "+result.declareMain.packingType));
				$("#packingType").val(result.declareMain.packingType);
				$("#packingTypeCode").val(result.declareMain.packingTypeCode||"");
				$("#grossWeight").val(result.declareMain.grossWeight||"");
				$("#netWeight").val(result.declareMain.netWeight||"");
				$("#remark").val(result.declareMain.remark);
				$("#contractNo").val(result.declareMain.contractNo);
				$("#entryType_v").val(result.declareMain.entryTypeCode==""?"":(result.declareMain.entryTypeCode+" "+result.declareMain.entryType));
				$("#entryType").val(result.declareMain.entryType);
				$("#entryTypeCode").val(result.declareMain.entryTypeCode);
				$("#taxCorporationType").val(result.declareMain.taxCorporationType);
				$("#licenseNo").val(result.declareMain.licenseNo);
				//$("#approvalNo").val(result.declareMain.approvalNo);
				$("#relativeEntryNo").val(result.declareMain.relativeEntryNo);
				$("#relativeEnrolNo").val(result.declareMain.relativeEnrolNo);
				$("#warehouseNo").val(result.declareMain.warehouseNo);
				$("#cyNo").val(result.declareMain.cyNo);
				$("#vouchFlag").val(result.declareMain.vouchFlag);
				if(result.declareMain.vouchFlag == "Y"){
					$("#vouchFlag").prop("checked", "checked");
				}else{
					$("#vouchFlag").prop("checked", "");
				}
				//第一个TAB页表格的数据
				//var ctnContent = ""
					$(result.declareCtnList).each(function(index, obj){
						table2.append([
							{
								name:"ctn_no",
								value:index+1,
								hiddenName: "declareCtnList["+index+"].ctn_no"
							},
							{
								name:"containerNo",
								value:obj.containerNo || "",
								hiddenName: "declareCtnList["+index+"].containerNo"
							},
							{
								name:"containerSize",
								value:obj.containerSize || "",
								hiddenName: "declareCtnList["+index+"].containerSize"
							},
							{
								name:"containerWeight",
								value:obj.containerWeight || "",
								hiddenName: "declareCtnList["+index+"].containerWeight"
							},
							{
								name:"declareCtnId",
								value:obj.declareCtnId,
								hiddenName: "declareCtnList["+index+"].declareCtnId"
							}
						])
					})
					//$("#dec-ctn-content").html(ctnContent);
				//第二个TAB页表格的数据
				//var docContent = ""
					$(result.declareDocList).each(function(index, obj){
						table3.append([
							{
								name:"att_no",
								value:index+1,
								hiddenName: "declareDocList["+index+"].att_no"
							},
							{
								name:"docAttachedCode",
								value:obj.docAttachedCode+" "+obj.docAttached,
								hiddenName: "declareDocList["+index+"].docAttachedCode"
							},
							{
								name:"docAttachedNo",
								value:obj.docAttachedNo,
								hiddenName: "declareDocList["+index+"].docAttachedNo"
							},
							{
								name:"declareDocId",
								value:obj.declareDocId,
								hiddenName: "declareDocList["+index+"].declareDocId"
							}
						]);
					})
					//$("#doc-content").html(docContent);
				//第三个TAB页表格的数据
				//var goodsContent = ""
					$(result.declareGoodsList).each(function(index, obj){
						table1.append([
								{
									name:"goodsSeq",
									value:(obj.goodsSeq||""),
									hiddenName: "declareGoodsList["+index+"].goodsSeq"
								},
								{
									name:"hsCode",
									value:obj.hsCode.substring(0,8),
									hiddenName: "declareGoodsList["+index+"].hsCode"
								},
								{
									name:"enrolNo",
									value:(obj.enrolNo||""),
									hiddenName: "declareGoodsList["+index+"].enrolNo"
								},
								{
									name:"goodsName",
									value:obj.goodsName,
									hiddenName: "declareGoodsList["+index+"].goodsName"
								},
								{
									name:"arrivalCountry",
									value:(obj.arrivalCountryCode == ""?"":(obj.arrivalCountryCode+" "+obj.arrivalCountry)),
									hiddenName: "declareGoodsList["+index+"].arrivalCountry"
								},
								{
									name:"quantity",
									value:(obj.quantity||""),
									hiddenName: "declareGoodsList["+index+"].quantity"
								},
								{
									name:"quantityUnit",
									value:(obj.quantityUnit==""?"":(obj.quantityUnit+" "+obj.quantityUnitChn)),
									hiddenName: "declareGoodsList["+index+"].quantityUnit"
								},
								{
									name:"unitPrice",
									value:(obj.unitPrice||""),
									hiddenName: "declareGoodsList["+index+"].unitPrice"
								},
								{
									name:"sum",
									value:(obj.totalPrice||""),
									hiddenName: "declareGoodsList["+index+"].totalPrice"
								},
								{
									name:"currency",
									value:(obj.currency==""?"":(obj.currency+" "+obj.currencyChn)),
									hiddenName: "declareGoodsList["+index+"].currency"
								},
								{
									name:"dutyMode",
									value:(obj.dutyMode==""?"":(obj.dutyMode+" "+obj.dutyModeChn)),
									hiddenName: "declareGoodsList["+index+"].dutyMode"
								},
								{
									name:"extraNo",
									value:obj.extraNo,
									hiddenName: "declareGoodsList["+index+"].extraNo"
								},
								{
									name:"goodsVersion",
									value:(obj.goodsVersion||""),
									hiddenName: "declareGoodsList["+index+"].goodsVersion"
								},
								{
									name:"goodsNo",
									value:obj.goodsNo,
									hiddenName: "declareGoodsList["+index+"].goodsNo"
								},
								{
									name:"use",
									value:obj.use,
									hiddenName: "declareGoodsList["+index+"].use"
								},
								{
									name:"model",
									value:obj.model,
									hiddenName: "declareGoodsList["+index+"].model"
								},
								{
									name:"firstQuantity",
									value:(obj.firstQuantity||""),
									hiddenName: "declareGoodsList["+index+"].firstQuantity"
								},
								{
									name:"firstUnit",
									value:(obj.firstUnit==""?"":(obj.firstUnit+" "+obj.firstUnitChn)),
									hiddenName: "declareGoodsList["+index+"].firstUnit"
								},
								{
									name:"secondQuantity",
									value:(obj.secondQuantity||""),
									hiddenName: "declareGoodsList["+index+"].secondQuantity"
								},
								{
									name:"secondUnit",
									value:(obj.secondUnit==""?"":(obj.secondUnit+" "+obj.secondUnitChn)),
									hiddenName: "declareGoodsList["+index+"].secondUnit"
								},
								{
									name:"processingCharges",
									value:(obj.processingCharges||""),
									hiddenName: "declareGoodsList["+index+"].processingCharges"
								},
								{
									name:"declareGoodsId",
									value:obj.declareGoodsId,
									hiddenName: "declareGoodsList["+index+"].declareGoodsId"
								}
							]);
					})
					//$("#goods-content").html(goodsContent);
				sum();
				//第二个TAB页数据
				if(result.declareOther != null){
					$("#invoiceNo_2").val(result.declareOther.invoiceNo);
					$("#numbers_2").val(result.declareOther.numbers);
					$("#unit_2").val(result.declareOther.unit);
					$("#creditNo_2").val(result.declareOther.creditNo);
					$("#invoiceSigner_2").val(result.declareOther.invoiceSigner);
					$("#price_2").val(result.declareOther.price);
					$("#currency_2").val(result.declareOther.currency);
					$("#businessCompany_2").val(result.declareOther.businessCompany);
					$("#businessCompanyEn_2").val(result.declareOther.businessCompanyEn);
					$("#businessCompanyAddr_2").val(result.declareOther.businessCompanyAddr);
					$("#customCompamy_2").val(result.declareOther.customCompamy);
					$("#customTel_2").val(result.declareOther.customTel);
					$("#customCompamyAddr_2").val(result.declareOther.customCompamyAddr);
					$("#customsBroker_2").val(result.declareOther.customsBroker);
					$("#rmbRate_2").val(result.declareOther.rmbRate);
					$("#usdRate_2").val(result.declareOther.usdRate);
					$("#tax_2").val(result.declareOther.tax);
				}
				sum();
				uploadLogo("edocFile_1", "00000001", result.declareMain.cloudQpId);
				uploadLogo("edocFile_2", "00000002", result.declareMain.cloudQpId);
				uploadLogo("edocFile_3", "00000003", result.declareMain.cloudQpId);
				uploadLogo("edocFile_4", "00000004", result.declareMain.cloudQpId);
				uploadLogo("edocFile_5", "00000005", result.declareMain.cloudQpId);
				uploadLogo("edocFile_6", "00000006", result.declareMain.cloudQpId);
				uploadLogo("edocFile_7", "00000007", result.declareMain.cloudQpId);
				uploadLogo("edocFile_8", "00000008", result.declareMain.cloudQpId);
				//uploadLogo("edocFile_9", "10000001", result.declareMain.cloudQpId);
				uploadLogo("edocFile_10", "10000002", result.declareMain.cloudQpId);
				$("#edocFile_9").attr("cloudQpId", result.declareMain.cloudQpId);
				$(result.declareEdocList).each(function(index, obj){
					if(obj.edocCode == "10000001"){
						$("#edocFile_9").val(obj.edocId)
					}
				})
			}
			alert("复制"+cloudQpId+"成功，请按需修改后保存");
		}else if(data.flag == '0'){
			alert("请先登陆")
		}else if(data.flag == '3'){
			alert("未查询到数据")
		}else{
			alert("对不起，查询异常，请稍后再试")
		}
	},
	error : function(data){
		
	}
	});
}

//查询报关单记录（通过URL传递的密文）
function query_cqp_record_url(){
	var cloudQpId = getQuery("cloudQpId");
	
	if(cloudQpId == null || cloudQpId == "" || cloudQpId == undefined){
		return false;
	}
	
	$.ajax({
		type : "post" ,
	    url : "/declare/queryAesDfgCtn.action?cloudQpId="+cloudQpId,
	    dataType : "json" ,
	    async:false,
	    success : function(data){
			if(data.flag == "1"){
				var result = eval(data.result);
				if(result != null){
					//第一个TAB页赋值（还差 类型、企业性质）
					$("#cqp_id").val(result.declareMain.cloudQpId);
					$("#cloudQpId").val(result.declareMain.cloudQpId);
					if (result.declareReceipt != null) {
						$("#receiptDes").text(result.declareReceipt.receiptNote);					
					} else {
						$("#receiptDes").text("");
					}
					$("#ieFlag").val(result.declareMain.ieFlag);
					$("#status").val(result.declareMain.status);
					$("#eportNo").val(result.declareMain.eportNo);
					$("#customNo").val(result.declareMain.customNo);
					$("#preentryNo").val(result.declareMain.preentryNo);
					$("#declareLocation_v").val((result.declareMain.declareLocationCode||"")==""?"":(result.declareMain.declareLocationCode+" "+result.declareMain.declareLocation));
					$("#declareLocation").val(result.declareMain.declareLocation);
					$("#declareLocationCode").val(result.declareMain.declareLocationCode);					
					$("#exportLocation_v").val((result.declareMain.exportLocationCode||"")==""?"":(result.declareMain.exportLocationCode+" "+result.declareMain.exportLocation));
					$("#exportLocation").val(result.declareMain.exportLocation);
					$("#exportLocationCode").val(result.declareMain.exportLocationCode);
					$("#enrolNo").val(result.declareMain.enrolNo);
					$("#exportDate").val(result.declareMain.exportDate);
					$("#declareDate").val(result.declareMain.declareDate);
					$("#businessCompanyCode").val(result.declareMain.businessCompanyCode);
					$("#businessCompany").val(result.declareMain.businessCompany);
					$("#transportMode_v").val((result.declareMain.transportModeCode||"")==""?"":(result.declareMain.transportModeCode+" "+result.declareMain.transportMode));
					$("#transportMode").val(result.declareMain.transportMode);
					$("#transportModeCode").val(result.declareMain.transportModeCode||"");
					$("#transportName").val(result.declareMain.transportName);
					$("#transportId").val(result.declareMain.transportId);
					$("#billNo").val(result.declareMain.billNo);
					$("#productionCompanyCode").val(result.declareMain.productionCompanyCode);
					$("#productionCompany").val(result.declareMain.productionCompany);
					$("#tradeMode_v").val((result.declareMain.tradeModeCode||"")==""?"":(result.declareMain.tradeModeCode+" "+result.declareMain.tradeMode));
					$("#tradeMode").val(result.declareMain.tradeMode);
					$("#tradeModeCode").val(result.declareMain.tradeModeCode||"");
					$("#cutMode_v").val((result.declareMain.cutModeCode||"")==""?"":(result.declareMain.cutModeCode+" "+result.declareMain.cutMode));
					$("#cutMode").val(result.declareMain.cutMode);
					$("#cutModeCode").val(result.declareMain.cutModeCode||"");
					$("#payMode_v").val(result.declareMain.payModeCode==""?"":(result.declareMain.payModeCode+" "+result.declareMain.payMode));
					$("#payMode").val(result.declareMain.payMode);
					$("#payModeCode").val(result.declareMain.payModeCode);
					$("#declareCompany").val(result.declareMain.declareCompany);
					$("#declareCompanyCode").val(result.declareMain.declareCompanyCode);
					$("#arrivedCountry_v").val(result.declareMain.arrivedCountryCode==""?"":(result.declareMain.arrivedCountryCode+" "+result.declareMain.arrivedCountry));
					$("#arrivedCountry").val(result.declareMain.arrivedCountry);
					$("#arrivedCountryCode").val(result.declareMain.arrivedCountryCode);
					$("#arrivedPort_v").val(result.declareMain.arrivedPortCode==""?"":(result.declareMain.arrivedPortCode+" "+result.declareMain.arrivedPort));
					$("#arrivedPort").val(result.declareMain.arrivedPort);
					$("#arrivedPortCode").val(result.declareMain.arrivedPortCode);
					$("#goodsSource_v").val(result.declareMain.goodsSourceCode==""?"":(result.declareMain.goodsSourceCode+" "+result.declareMain.goodsSource));
					$("#goodsSource").val(result.declareMain.goodsSource);
					$("#goodsSourceCode").val(result.declareMain.goodsSourceCode);					
					$("#tradingCountry_v").val(result.declareMain.tradingCountryCode==""?"":(result.declareMain.tradingCountryCode+" "+result.declareMain.tradingCountry));
					$("#tradingCountry").val(result.declareMain.tradingCountry);
					$("#tradingCountryCode").val(result.declareMain.tradingCountryCode);					
					$("#transactionMode_v").val((result.declareMain.transactionModeCode||"")==""?"":(result.declareMain.transactionModeCode+" "+result.declareMain.transactionMode));
					$("#transactionMode").val(result.declareMain.transactionMode);
					$("#transactionModeCode").val(result.declareMain.transactionModeCode||"");
					$("#freightMark_v").val((result.declareMain.freightMark||"")==""?"":(result.declareMain.freightMark+" "+result.declareMain.freightMarkChn));
					$("#freightMark").val(result.declareMain.freightMark||"");
					$("#freightMarkChn").val(result.declareMain.freightMarkChn);
					$("#freightRate").val(result.declareMain.freightRate||"");
					$("#freightCurrency_v").val(result.declareMain.freightCurrency==""?"":(result.declareMain.freightCurrency+" "+result.declareMain.freightCurrencyChn));
					$("#freightCurrency").val(result.declareMain.freightCurrency);
					$("#freightCurrencyChn").val(result.declareMain.freightCurrencyChn);
					$("#insuranceMark_v").val((result.declareMain.insuranceMark||"")==""?"":(result.declareMain.insuranceMark+" "+result.declareMain.insuranceMarkChn));
					$("#insuranceMark").val(result.declareMain.insuranceMark||"");
					$("#insuranceMarkChn").val(result.declareMain.insuranceMarkChn);
					$("#insuranceRate").val(result.declareMain.insuranceRate||"");
					$("#insuranceCurrency_v").val(result.declareMain.insuranceCurrency==""?"":(result.declareMain.insuranceCurrency+" "+result.declareMain.insuranceCurrencyChn));
					$("#insuranceCurrency").val(result.declareMain.insuranceCurrency);
					$("#insuranceCurrencyChn").val(result.declareMain.insuranceCurrencyChn);
					$("#extrasMark_v").val((result.declareMain.extrasMark||"")==""?"":(result.declareMain.extrasMark+" "+result.declareMain.extrasMarkChn));
					$("#extrasMark").val(result.declareMain.extrasMark||"");
					$("#extrasMarkChn").val(result.declareMain.extrasMarkChn);
					$("#extrasRate").val(result.declareMain.extrasRate||"");
					$("#extrasCurrency_v").val(result.declareMain.extrasCurrency==""?"":(result.declareMain.extrasCurrency+" "+result.declareMain.extrasCurrencyChn));
					$("#extrasCurrency").val(result.declareMain.extrasCurrency);
					$("#extrasCurrencyChn").val(result.declareMain.extrasCurrencyChn);
					$("#packagesNum").val(result.declareMain.packagesNum||"");
					$("#packingType_v").val((result.declareMain.packingTypeCode||"")==""?"":(result.declareMain.packingTypeCode+" "+result.declareMain.packingType));
					$("#packingType").val(result.declareMain.packingType);
					$("#packingTypeCode").val(result.declareMain.packingTypeCode||"");
					$("#grossWeight").val(result.declareMain.grossWeight||"");
					$("#netWeight").val(result.declareMain.netWeight||"");
					$("#remark").val(result.declareMain.remark);
					$("#contractNo").val(result.declareMain.contractNo);
					$("#entryType_v").val(result.declareMain.entryTypeCode==""?"":(result.declareMain.entryTypeCode+" "+result.declareMain.entryType));
					$("#entryType").val(result.declareMain.entryType);
					$("#entryTypeCode").val(result.declareMain.entryTypeCode);
					$("#taxCorporationType").val(result.declareMain.taxCorporationType);
					$("#licenseNo").val(result.declareMain.licenseNo);
					//$("#approvalNo").val(result.declareMain.approvalNo);
					$("#relativeEntryNo").val(result.declareMain.relativeEntryNo);
					$("#relativeEnrolNo").val(result.declareMain.relativeEnrolNo);
					$("#warehouseNo").val(result.declareMain.warehouseNo);
					$("#cyNo").val(result.declareMain.cyNo);
					$("#vouchFlag").val(result.declareMain.vouchFlag);
					if(result.declareMain.vouchFlag == "Y"){
						$("#vouchFlag").prop("checked", "checked");
					}else{
						$("#vouchFlag").prop("checked", "");
					}
					//第一个TAB页表格的数据
					//var ctnContent = ""
					$(result.declareCtnList).each(function(index, obj){
						table2.append([
							{
								name:"ctn_no",
								value:index+1,
								hiddenName: "declareCtnList["+index+"].ctn_no"
							},
							{
								name:"containerNo",
								value:obj.containerNo || "",
								hiddenName: "declareCtnList["+index+"].containerNo"
							},
							{
								name:"containerSize",
								value:obj.containerSize || "",
								hiddenName: "declareCtnList["+index+"].containerSize"
							},
							{
								name:"containerWeight",
								value:obj.containerWeight || "",
								hiddenName: "declareCtnList["+index+"].containerWeight"
							},
							{
								name:"declareCtnId",
								value:obj.declareCtnId,
								hiddenName: "declareCtnList["+index+"].declareCtnId"
							}
						])
					})
					//$("#dec-ctn-content").html(ctnContent);
					//第二个TAB页表格的数据
					//var docContent = ""
					
					$(result.declareDocList).each(function(index, obj){
						table3.append([
							{
								name:"att_no",
								value:index+1,
								hiddenName: "declareDocList["+index+"].att_no"
							},
							{
								name:"docAttachedCode",
								value:obj.docAttachedCode+" "+obj.docAttached,
								hiddenName: "declareDocList["+index+"].docAttachedCode"
							},
							{
								name:"docAttachedNo",
								value:obj.docAttachedNo,
								hiddenName: "declareDocList["+index+"].docAttachedNo"
							},
							{
								name:"declareDocId",
								value:obj.declareDocId,
								hiddenName: "declareDocList["+index+"].declareDocId"
							}
						]);
					})
					//$("#doc-content").html(docContent);
					//第三个TAB页表格的数据
					//var goodsContent = ""
						$(result.declareGoodsList).each(function(index, obj){
							table1.append([
								{
									name:"goodsSeq",
									value:(obj.goodsSeq||""),
									hiddenName: "declareGoodsList["+index+"].goodsSeq"
								},
								{
									name:"hsCode",
									value:obj.hsCode.substring(0,8),
									hiddenName: "declareGoodsList["+index+"].hsCode"
								},
								{
									name:"enrolNo",
									value:(obj.enrolNo||""),
									hiddenName: "declareGoodsList["+index+"].enrolNo"
								},
								{
									name:"goodsName",
									value:obj.goodsName,
									hiddenName: "declareGoodsList["+index+"].goodsName"
								},
								{
									name:"arrivalCountry",
									value:(obj.arrivalCountryCode == ""?"":(obj.arrivalCountryCode+" "+obj.arrivalCountry)),
									hiddenName: "declareGoodsList["+index+"].arrivalCountry"
								},
								{
									name:"quantity",
									value:(obj.quantity||""),
									hiddenName: "declareGoodsList["+index+"].quantity"
								},
								{
									name:"quantityUnit",
									value:(obj.quantityUnit==""?"":(obj.quantityUnit+" "+obj.quantityUnitChn)),
									hiddenName: "declareGoodsList["+index+"].quantityUnit"
								},
								{
									name:"unitPrice",
									value:(obj.unitPrice||""),
									hiddenName: "declareGoodsList["+index+"].unitPrice"
								},
								{
									name:"sum",
									value:(obj.totalPrice||""),
									hiddenName: "declareGoodsList["+index+"].totalPrice"
								},
								{
									name:"currency",
									value:(obj.currency==""?"":(obj.currency+" "+obj.currencyChn)),
									hiddenName: "declareGoodsList["+index+"].currency"
								},
								{
									name:"dutyMode",
									value:(obj.dutyMode==""?"":(obj.dutyMode+" "+obj.dutyModeChn)),
									hiddenName: "declareGoodsList["+index+"].dutyMode"
								},
								{
									name:"extraNo",
									value:obj.hsCode.slice(-2),
									hiddenName: "declareGoodsList["+index+"].extraNo"
								},
								{
									name:"goodsVersion",
									value:(obj.goodsVersion||""),
									hiddenName: "declareGoodsList["+index+"].goodsVersion"
								},
								{
									name:"goodsNo",
									value:obj.goodsNo,
									hiddenName: "declareGoodsList["+index+"].goodsNo"
								},
								{
									name:"use",
									value:obj.use,
									hiddenName: "declareGoodsList["+index+"].use"
								},
								{
									name:"model",
									value:obj.model,
									hiddenName: "declareGoodsList["+index+"].model"
								},
								{
									name:"firstQuantity",
									value:(obj.firstQuantity||""),
									hiddenName: "declareGoodsList["+index+"].firstQuantity"
								},
								{
									name:"firstUnit",
									value:(obj.firstUnit==""?"":(obj.firstUnit+" "+obj.firstUnitChn)),
									hiddenName: "declareGoodsList["+index+"].firstUnit"
								},
								{
									name:"secondQuantity",
									value:(obj.secondQuantity||""),
									hiddenName: "declareGoodsList["+index+"].secondQuantity"
								},
								{
									name:"secondUnit",
									value:(obj.secondUnit==""?"":(obj.secondUnit+" "+obj.secondUnitChn)),
									hiddenName: "declareGoodsList["+index+"].secondUnit"
								},
								{
									name:"processingCharges",
									value:(obj.processingCharges||""),
									hiddenName: "declareGoodsList["+index+"].processingCharges"
								},
								{
									name:"declareGoodsId",
									value:obj.declareGoodsId,
									hiddenName: "declareGoodsList["+index+"].declareGoodsId"
								}
							]);
						})
						//$("#goods-content").html(goodsContent);
					 sum();
					//第二个TAB页数据
					if(result.declareOther != null){
						$("#invoiceNo_2").val(result.declareOther.invoiceNo);
						$("#numbers_2").val(result.declareOther.numbers);
						$("#unit_2").val(result.declareOther.unit);
						$("#creditNo_2").val(result.declareOther.creditNo);
						$("#invoiceSigner_2").val(result.declareOther.invoiceSigner);
						$("#price_2").val(result.declareOther.price);
						$("#currency_2").val(result.declareOther.currency);
						$("#businessCompany_2").val(result.declareOther.businessCompany);
						$("#businessCompanyEn_2").val(result.declareOther.businessCompanyEn);
						$("#businessCompanyAddr_2").val(result.declareOther.businessCompanyAddr);
						$("#customCompamy_2").val(result.declareOther.customCompamy);
						$("#customTel_2").val(result.declareOther.customTel);
						$("#customCompamyAddr_2").val(result.declareOther.customCompamyAddr);
						$("#customsBroker_2").val(result.declareOther.customsBroker);
						$("#rmbRate_2").val(result.declareOther.rmbRate);
						$("#usdRate_2").val(result.declareOther.usdRate);
						$("#tax_2").val(result.declareOther.tax);
					}
					
					uploadLogo("edocFile_1", "00000001", result.declareMain.cloudQpId);
					uploadLogo("edocFile_2", "00000002", result.declareMain.cloudQpId);
					uploadLogo("edocFile_3", "00000003", result.declareMain.cloudQpId);
					uploadLogo("edocFile_4", "00000004", result.declareMain.cloudQpId);
					uploadLogo("edocFile_5", "00000005", result.declareMain.cloudQpId);
					uploadLogo("edocFile_6", "00000006", result.declareMain.cloudQpId);
					uploadLogo("edocFile_7", "00000007", result.declareMain.cloudQpId);
					uploadLogo("edocFile_8", "00000008", result.declareMain.cloudQpId);
					//uploadLogo("edocFile_9", "10000001", result.declareMain.cloudQpId);
					uploadLogo("edocFile_10", "10000002", result.declareMain.cloudQpId);
					$("#edocFile_9").attr("cloudQpId", result.declareMain.cloudQpId);
					$(result.declareEdocList).each(function(index, obj){
						if(obj.edocCode == "10000001"){
							$("#edocFile_9").val(obj.edocId)
						}
					})
				}
			}else if(data.flag == '0'){
				alert("请先登陆")
			}else if(data.flag == '3'){
				alert("未查询到数据")
			}else{
				alert("对不起，查询异常，请稍后再试")
			}
		},
		error : function(data){
			
		}
	});
}

//根据URL参数设置页面内容
function set_cqp_info(){
	var vessel = getQuery("vessel");
	var voyage = getQuery("voyage");
	var bill = getQuery("bill");
	
	if(vessel == null || vessel == "" || vessel == undefined){
		return false;
	}
	
	if (vessel != "") $("#transportName").val(decodeURI(vessel));
	if (voyage != "") $("#transportId").val(voyage);
	if (bill != "") $("#billNo").val(bill);
}

function export_cqp_record(){
	
	var cloudQpId = $("#cqp_id").val();
	
	if(cloudQpId == null || cloudQpId == ""){
		
		alert("没有数据可导出");
		
		return false;
		
	}
	
	window.location.href = "/declare/exportDfgCtn.action?cloudQpId="+cloudQpId;
	
}

function export_cqp_record2(){
	
	var cloudQpId = $("#cqp_id").val();
	
	if(cloudQpId == null || cloudQpId == ""){
		
		alert("没有数据可导出");
		
		return false;
		
	}
	if($("#pdfFlag").is(":checked")) {
		window.location.href = "/declare/exportDfgCtnEx.action?cloudQpId="+cloudQpId + "&pdfFlag=" + $("#pdfFlag").val();
	} else {
		window.location.href = "/declare/exportDfgCtnEx.action?cloudQpId="+cloudQpId;	
	}	
}

function upload_cqp_record2(){	
	var cloudQpId = $("#cqp_id").val();	
	if(cloudQpId == null || cloudQpId == ""){		
		alert("没有数据可导出");		
		return false;		
	}
	var uploadUrl = "/declare/uploadDfgCtnEx.action?cloudQpId="+cloudQpId;
	if($("#pdfFlag").is(":checked")) {
		uploadUrl = uploadUrl + "&pdfFlag=" + $("#pdfFlag").val();
	}	
	$.ajax({
		type : "post" ,
	    url : uploadUrl,
	    dataType : "json" ,
	    async:false,
	    success : function(data){
	    	if (data.flag == "1") {
	    		alert("上传成功，请稍候查看报关单暂存状态");
	    	} else {
	    		alert("上传失败");
	    	}      	
	    },
	    error : function(data){
	    	alert("报文上传异常");
	    } 
    });
}

	//flash上传方式
	$('#analyzeDeclareExcel').uploadify({
			"formData":{},
			'swf'      : '/upload/uploadify.swf',
			'uploader' : "/declare/analyzeDeclareExcel.action",
			'fileTypeExts' : '*.xls; *.XLS; *.XLSX; *.xlsx',
			'buttonText': "解析报关单",
			"fileDesc":"请选择报关单execl文件",
			'fileObjName':'declareExcelFile',
			"width":100,
			"height":30,
			'buttonClass':"rmb submit up_ico qb",
			"removeTimeout" : 1,
			"multi":true,
			"queueID":"upload_body",
			"itemTemplate":'<div class="dialog up_dialog" id="@[fileID]">\
							<div class="up_content" id="up_content">\
							<div class="up">\
						<b class="up_wait_t">@[fileName] 上传中...</b>\
						<div class="uploadify-progress">\
							<div class="data-info"><span class="fileName">@[fileSize]</span><span class="data"></span></div>\
							<div class="uploadify-progress-bar"></div>\
						</div>\
						<ul>\
							<li>禁止上传任何违法，侵权或无法审查内容的文件，上传即代表接受<a href="###">上传协议</a>。</li>\
							<li>易步通有义务配合有关部门将上传违规文件的用户信息保留，并进行提交。 </li>\
							<li>文件大小请勿超过50M。</li>\
						</ul>\
					</div>\
					</div>\
					</div>',
			"queueSizeLimit":50,
			"onSelect":function(){
				//$.eport.bar({start:0,pause:75,total:450});
			},
			'onUploadStart' : function() {
				//$.eport.bar({start:75,pause:231,total:450});
			},
			'onUploadSuccess':function(file, data, response){
				data = $.parseJSON(data);
				if(data.flag==0) {
					alert("您的登陆状态已过期，请重新登录！");
					window.location.href="/login.jsp"
				}else if(data.flag==2){
					alert(data.dataError);
				}else if(data.flag == 1){
					var decHeadContext = data.declareInfo.ResponseData.HedContext;
					//清空内容
					clearAllData();					
					//第一个TAB页赋值（还差 类型、企业性质）
					$("#ieFlag").val("E");
					//$("#status").val(result.declareMain.status);
					//$("#eportNo").val(result.declareMain.eportNo);
					//$("#customNo").val(result.declareMain.customNo);
					//$("#preentryNo").val(result.declareMain.preentryNo);
					$("#declareLocation_v").val(""); 
					$("#declareLocation").val(""); 
					$("#declareLocationCode").val(""); 		
					var decIEPortName = getDeclareCodeName(decHeadContext.IEPort, eval(CUST_content_store));
					$("#exportLocation_v").val(decHeadContext.IEPort + " " + decIEPortName);
					$("#exportLocation").val(decIEPortName); 
					$("#exportLocationCode").val(decHeadContext.IEPort);
					//$("#enrolNo").val(result.declareMain.enrolNo);
					//$("#exportDate").val(result.declareMain.exportDate);
					//$("#declareDate").val(""); 
					$("#businessCompanyCode").val(decHeadContext.TradeCode);
					$("#businessCompany").val(decHeadContext.TradeName);
					var decTransfTypeName = getDeclareCodeName(decHeadContext.TransfType, eval(TRAF_content_store));
					$("#transportMode_v").val(decHeadContext.TransfType + " " + decTransfTypeName); 
					$("#transportMode").val(decTransfTypeName);
					$("#transportModeCode").val(decHeadContext.TransfType); 
					//$("#transportName").val(result.declareMain.transportName);
					//$("#transportId").val(result.declareMain.transportId);
					$("#billNo").val(""); 
 					$("#productionCompanyCode").val(decHeadContext.OwnerCode);
					$("#productionCompany").val(decHeadContext.OwnerName);
					var decTradeModeName = getDeclareCodeName(decHeadContext.TradeMode, eval(TRADE_content_store));
					$("#tradeMode_v").val(decHeadContext.TradeMode + " " + decTradeModeName); 
					$("#tradeMode").val(decTradeModeName);
					$("#tradeModeCode").val(decHeadContext.TradeMode);
					var decCutModeName = getDeclareCodeName(decHeadContext.CutMode, eval(CUT_content_store));
					$("#cutMode_v").val(decHeadContext.CutMode + " " + decCutModeName); 
					$("#cutMode").val(decCutModeName);
					$("#cutModeCode").val(decHeadContext.CutMode);
					var decPayWayName = getDeclareCodeName(decHeadContext.PayWay, eval(PAY_content_store));
					$("#payMode_v").val(decHeadContext.PayWay + " " + decPayWayName); 
					$("#payMode").val(decPayWayName); 
					$("#payModeCode").val(decHeadContext.PayWay);
					//$("#declareCompany").val(result.declareMain.declareCompany);
					//$("#declareCompanyCode").val(result.declareMain.declareCompanyCode);
					var decTradeCountryName = getDeclareCodeName(decHeadContext.TradeCountry, eval(COUNTRY_content_store));
					$("#arrivedCountry_v").val(decHeadContext.TradeCountry + " " + decTradeCountryName);
					$("#arrivedCountry").val(decTradeCountryName);
					$("#arrivedCountryCode").val(decHeadContext.TradeCountry);
					$("#arrivedPort_v").val(decHeadContext.DestinationPort);
					$("#arrivedPort").val("");
					$("#arrivedPortCode").val(decHeadContext.DestinationPort);
					$("#goodsSource_v").val("");
					$("#goodsSource").val(decHeadContext.GSource);
					$("#goodsSourceCode").val("");
					var decTradingCountryName = getDeclareCodeName(decHeadContext.TradingCountry, eval(COUNTRY_content_store));
					$("#tradingCountry_v").val(decHeadContext.TradingCountry + " " + decTradingCountryName);
					$("#tradingCountry").val(decTradingCountryName);
					$("#tradingCountryCode").val(decHeadContext.TradingCountry);					
					var decTransModeName = getDeclareCodeName(decHeadContext.TransMode, eval(TRANS_content_store));
					$("#transactionMode_v").val(decHeadContext.TransMode + " " + decTransModeName);
					$("#transactionMode").val(decTransModeName);
					$("#transactionModeCode").val(decHeadContext.TransMode);
					$("#freightMark_v").val("");
					$("#freightMark").val("");
					$("#freightMarkChn").val("");
					$("#freightRate").val(decHeadContext.TransfFee);
					$("#freightCurrency_v").val("");
					$("#freightCurrency").val("");
					$("#freightCurrencyChn").val("");
					$("#insuranceMark_v").val("");
					$("#insuranceMark").val("");
					$("#insuranceMarkChn").val("");
					$("#insuranceRate").val(decHeadContext.InsurFee);
					$("#insuranceCurrency_v").val("");
					$("#insuranceCurrency").val("");
					$("#insuranceCurrencyChn").val("");
					$("#extrasMark_v").val("");
					$("#extrasMark").val("");
					$("#extrasMarkChn").val("");
					$("#extrasRate").val(decHeadContext.OtherFee);
					$("#extrasCurrency_v").val("");
					$("#extrasCurrency").val("");
					$("#extrasCurrencyChn").val("");
					$("#packagesNum").val(decHeadContext.PackNo);
					var decWrapTypeName = getDeclareCodeName(decHeadContext.WrapType, eval(WARP_content_store));
					$("#packingType_v").val(decHeadContext.WrapType + " " + decWrapTypeName);
					$("#packingType").val(decWrapTypeName);
					$("#packingTypeCode").val(decHeadContext.WrapType);
					$("#grossWeight").val(decHeadContext.GrossWt);
					$("#netWeight").val(decHeadContext.NetWt);
					//$("#remark").val(result.declareMain.remark);
					$("#contractNo").val(decHeadContext.ContrNo);
					//$("#entryType_v").val(result.declareMain.entryTypeCode==""?"":(result.declareMain.entryTypeCode+" "+result.declareMain.entryType));
					//$("#entryType").val(result.declareMain.entryType);
					//$("#entryTypeCode").val(result.declareMain.entryTypeCode);
					//$("#taxCorporationType").val(result.declareMain.taxCorporationType);
					//$("#licenseNo").val(result.declareMain.licenseNo);
					//$("#approvalNo").val(result.declareMain.approvalNo);
					//$("#relativeEntryNo").val(result.declareMain.relativeEntryNo);
					//$("#relativeEnrolNo").val(result.declareMain.relativeEnrolNo);
					//$("#warehouseNo").val(result.declareMain.warehouseNo);
					//$("#cyNo").val(result.declareMain.cyNo);
					//$("#vouchFlag").val(result.declareMain.vouchFlag);
					//if(result.declareMain.vouchFlag == "Y"){
					//	$("#vouchFlag").prop("checked", "checked");
					//}else{
					//	$("#vouchFlag").prop("checked", "");
					//}

					//第三个TAB页表格的数据
					//var goodsContent = ""
					$(data.declareInfo.ResponseData.LstContexts).each(function(index, obj){
						var decGUnitName = getDeclareCodeName(obj.GUnit, eval(UNIT_content_store));
						var decGCurrName = getDeclareCodeName(obj.Curr, eval(CURR_content_store));
						var decGCountryName = getDeclareCodeName(obj.Country, eval(COUNTRY_content_store));
						var decGDutyModeName = getDeclareCodeName(obj.DutyMode, eval(DUTY_content_store));
						table1.append([
							{
								name:"goodsSeq",
								value:(obj.goodsSeq||""),
								hiddenName: "declareGoodsList["+index+"].goodsSeq"
							},
							{
								name:"hsCode",
								value:obj.CodeTs.substring(0,8),
								hiddenName: "declareGoodsList["+index+"].hsCode"
							},
							{
								name:"enrolNo",
								value:(obj.enrolNo||""),
								hiddenName: "declareGoodsList["+index+"].enrolNo"
							},
							{
								name:"goodsName",
								value:obj.GName,
								hiddenName: "declareGoodsList["+index+"].goodsName"
							},
							{
								name:"arrivalCountry",
								value:obj.Country+" "+decGCountryName,
								hiddenName: "declareGoodsList["+index+"].arrivalCountry"
							},
							{
								name:"quantity",
								value:(obj.GQty||""),
								hiddenName: "declareGoodsList["+index+"].quantity"
							},
							{
								name:"quantityUnit",
								value:obj.GUnit+" "+decGUnitName,
								hiddenName: "declareGoodsList["+index+"].quantityUnit"
							},
							{
								name:"unitPrice",
								value:(obj.DeclPrice||""),
								hiddenName: "declareGoodsList["+index+"].unitPrice"
							},
							{
								name:"sum",
								value:(obj.TotalPrice||""),
								hiddenName: "declareGoodsList["+index+"].totalPrice"
							},
							{
								name:"currency",
								value:obj.Curr+" "+decGCurrName,
								hiddenName: "declareGoodsList["+index+"].currency"
							},
							{
								name:"dutyMode",
								value:obj.DutyMode+" "+decGDutyModeName,
								hiddenName: "declareGoodsList["+index+"].dutyMode"
							},
							{
								name:"extraNo",
								value:obj.CodeTs.substring(8,10),
								hiddenName: "declareGoodsList["+index+"].extraNo"
							},
							{
								name:"goodsVersion",
								value:(obj.goodsVersion||""),
								hiddenName: "declareGoodsList["+index+"].goodsVersion"
							},
							{
								name:"goodsNo",
								value:obj.goodsNo || "",
								hiddenName: "declareGoodsList["+index+"].goodsNo"
							},
							{
								name:"use",
								value:obj.use || "",
								hiddenName: "declareGoodsList["+index+"].use"
							},
							{
								name:"model",
								value:obj.model || "",
								hiddenName: "declareGoodsList["+index+"].model"
							},
							{
								name:"firstQuantity",
								value:(obj.firstQuantity||""),
								hiddenName: "declareGoodsList["+index+"].firstQuantity"
							},
							{
								name:"firstUnit",
								value:(obj.firstUnit==""?"":(obj.firstUnit+" "+obj.firstUnitChn)),
								hiddenName: "declareGoodsList["+index+"].firstUnit"
							},
							{
								name:"secondQuantity",
								value:(obj.secondQuantity||""),
								hiddenName: "declareGoodsList["+index+"].secondQuantity"
							},
							{
								name:"secondUnit",
								value:(obj.secondUnit==""?"":(obj.secondUnit+" "+obj.secondUnitChn)),
								hiddenName: "declareGoodsList["+index+"].secondUnit"
							},
							{
								name:"processingCharges",
								value:(obj.processingCharges||""),
								hiddenName: "declareGoodsList["+index+"].processingCharges"
							},
							{
								name:"declareGoodsId",
								value:obj.declareGoodsId || "",
								hiddenName: "declareGoodsList["+index+"].declareGoodsId"
							}
						]);
					})
					//$("#goods-content").html(goodsContent);
					sum();
				}else{
					alert("对不起，您没有解析报关单EXCEL的权限");
				}
			},
			"onUploadError":function(file, errorCode, errorMsg, errorString){
				$("div.data-info").css("color","red").text("内部错误,解析失败。请稍后再试")
				$.eport.dialog({
					element :".error_dialog",
					state:"open"
				});
				$("#error_txt").val("内部错误,解析失败。请稍后再试");
			}
	});



//上传附件
function uploadEdoc(id, edocCode){
	
	var options = {
		url : '/declare/uploadEdoc.action?edocCode='+edocCode,
		type : 'POST',
		dataType:'json',
		beforeSubmit : before_submit_1,
        success: show_result_1
	};
	$("#edocFile_1_form").ajaxSubmit(options);
	return false;
}
function before_submit_1(){
	//alert("b")
	}
function show_result_1(data){
}

//预览附件
function previewEdoc(edocCode){	
	if ($("#cloudQpId").val() != "") {
		$.ajax({
			type : "post" ,
		    url : "/declare/getEdocContent.action?cloudQpId="+$("#cloudQpId").val() + "&edocCode=" + edocCode,
		    dataType : "json" ,
		    async:false,
		    success : function(data){
		    	$("#previewEdoc").html('<embed style="width:100%;height:100%"  src="data:application/pdf;base64,'+data.result+'"></embed>')
		        	
		    },
		    error : function(data){
		    	alert("附件显示异常");
		    } 
		});
	}
}

//预览附件URL方式
function previewEdocUrl(edocCode){	
	if ($("#cloudQpId").val() != "") {
		$.ajax({
			type : "post" ,
		    url : "/declare/getEdocFileUrl.action?cloudQpId="+$("#cloudQpId").val() + "&edocCode=" + edocCode,
		    dataType : "json" ,
		    async:false,
		    success : function(data){
		    	$("#previewEdoc").html('<embed style="width:100%;height:100%"  src="/'+data.result+'"></embed>')
		        	
		    },
		    error : function(data){
		    	alert("附件显示异常");
		    } 
		});
	}
}

var CUST_content_store;
var TRAF_content_store;
var TRADE_content_store;
var CUT_content_store;
var PAY_content_store; 
var DIST_content_store;
var TRANS_content_store;
var WARP_content_store;
var DOCU_content_store; 
var UNIT_content_store; 
var CURR_content_store;
var DUTY_content_store;
var COUNTRY_content_store;

function getDeclareCode(){
	$.ajax({
		type : "post" ,
	    url : "/declare/getDeclareCode.action",
	    dataType : "json" ,
	    async : false,
	    success : function(data){
			if(data.flag == 1){
				
				var codeSimpleCodeList = eval(data.codeSimpleCodeList);
				var CUST_content  = "[";
				var TRAF_content  = "[";
				var TRADE_content  = "[";
				var CUT_content  = "[";
				var PAY_content  = "[";
				var DIST_content  = "[";
				var TRANS_content  = "[";
				var WARP_content  = "[";
				var DOCU_content  = "[";
				var UNIT_content  = "[";
				var CURR_content  = "[";
				var DUTY_content  = "[";
				var COUNTRY_content  = "[";
				$(codeSimpleCodeList).each(function(index, obj){
					var $html = "{label:\""+obj.code+" "+obj.chnDesc+"\"}";			
					if(obj.codeType == "CUST")CUST_content += $html+",";
					if(obj.codeType == "TRAF")TRAF_content += $html+",";
					if(obj.codeType == "TRADE")TRADE_content += $html+",";
					if(obj.codeType == "CUT")CUT_content += $html+",";
					if(obj.codeType == "PAY")PAY_content += $html+",";
					if(obj.codeType == "DIST")DIST_content += $html+",";
					if(obj.codeType == "TRANS")TRANS_content += $html+",";
					if(obj.codeType == "WARP")WARP_content += $html+",";
					if(obj.codeType == "DOCU")DOCU_content += $html+",";
					if(obj.codeType == "UNIT")UNIT_content += $html+",";
					if(obj.codeType == "CURR")CURR_content += $html+",";
					if(obj.codeType == "DUTY")DUTY_content += $html+",";
					if(obj.codeType == "COUNTRY")COUNTRY_content += $html+",";
				})
				if (CUST_content.length > 1){CUST_content = CUST_content.substring(0, CUST_content.length-1)+"]";}else{CUST_content += "]";}
				if (TRAF_content.length > 1){TRAF_content = TRAF_content.substring(0, TRAF_content.length-1)+"]";}else{TRAF_content += "]";}
				if (TRADE_content.length > 1){TRADE_content = TRADE_content.substring(0, TRADE_content.length-1)+"]";}else{TRADE_content += "]";}
				if (CUT_content.length > 1){CUT_content = CUT_content.substring(0, CUT_content.length-1)+"]";}else{CUT_content += "]";}
				if (PAY_content.length > 1){PAY_content = PAY_content.substring(0, PAY_content.length-1)+"]";}else{PAY_content += "]";}
				if (DIST_content.length > 1){DIST_content = DIST_content.substring(0, DIST_content.length-1)+"]";}else{DIST_content += "]";}
				if (TRANS_content.length > 1){TRANS_content = TRANS_content.substring(0, TRANS_content.length-1)+"]";}else{TRANS_content += "]";}
				if (WARP_content.length > 1){WARP_content = WARP_content.substring(0, WARP_content.length-1)+"]";}else{WARP_content += "]";}
				if (DOCU_content.length > 1){DOCU_content = DOCU_content.substring(0, DOCU_content.length-1)+"]";}else{DOCU_content += "]";}
				if (UNIT_content.length > 1){UNIT_content = UNIT_content.substring(0, UNIT_content.length-1)+"]";}else{UNIT_content += "]";}
				if (CURR_content.length > 1){CURR_content = CURR_content.substring(0, CURR_content.length-1)+"]";}else{CURR_content += "]";}
				if (DUTY_content.length > 1){DUTY_content = DUTY_content.substring(0, DUTY_content.length-1)+"]";}else{DUTY_content += "]";}
				if (COUNTRY_content.length > 1){COUNTRY_content = COUNTRY_content.substring(0, COUNTRY_content.length-1)+"]";}else{COUNTRY_content += "]";}
	
                CUST_content_store = CUST_content;
				TRAF_content_store = TRAF_content;
				TRADE_content_store = TRADE_content;
				CUT_content_store = CUT_content;
				PAY_content_store = PAY_content; 
				DIST_content_store = DIST_content;
				TRANS_content_store = TRANS_content;
				WARP_content_store = WARP_content;
				DOCU_content_store = DOCU_content; 
				UNIT_content_store = UNIT_content; 
				CURR_content_store = CURR_content;
				DUTY_content_store = DUTY_content;
				COUNTRY_content_store = COUNTRY_content;				

                $("#docAttachedCode").autocomplete({
					source : eval(DOCU_content_store),
					autoFocus : true,
					select : function(event,ui){}
				});	
				$("#declareLocation_v").autocomplete({
					source : eval(CUST_content),
					autoFocus : true,
					select : function(event,ui){
						var temp = ui.item.label;
						var list = temp.split(" ");
						if(list.length == 2){
							$("#declareLocationCode").val(list[0]);
							$("#declareLocation").val(list[1]);
						}
					}
				});			
				$("#exportLocation_v").autocomplete({
					source : eval(CUST_content),
					autoFocus : true,
					select : function(event,ui){
						var temp = ui.item.label;
						var list = temp.split(" ");
						if(list.length == 2){
							$("#exportLocationCode").val(list[0]);
							$("#exportLocation").val(list[1]);
						}
					}
				});	
				$("#transportMode_v").autocomplete({
					source : eval(TRAF_content),
					autoFocus : true,
					select : function(event,ui){
						var temp = ui.item.label;
						var list = temp.split(" ");
						if(list.length == 2){
							$("#transportModeCode").val(list[0]);
							$("#transportMode").val(list[1]);
						}
					}
				});	
				$("#tradeMode_v").autocomplete({
					source : eval(TRADE_content),
					autoFocus : true,
					select : function(event,ui){
						var temp = ui.item.label;
						var list = temp.split(" ");
						if(list.length == 2){
							$("#tradeModeCode").val(list[0]);
							$("#tradeMode").val(list[1]);
						}
					}
				});	
				$("#cutMode_v").autocomplete({
					source : eval(CUT_content),
					autoFocus : true,
					select : function(event,ui){
						var temp = ui.item.label;
						var list = temp.split(" ");
						if(list.length == 2){
							$("#cutModeCode").val(list[0]);
							$("#cutMode").val(list[1]);
						}
					}
				});	
				$("#payMode_v").autocomplete({
					source : eval(PAY_content),
					autoFocus : true,
					select : function(event,ui){
						var temp = ui.item.label;
						var list = temp.split(" ");
						if(list.length == 2){
							$("#payModeCode").val(list[0]);
							$("#payMode").val(list[1]);
						}
					}
				});	
				$("#arrivedCountry_v").autocomplete({
					source : eval(COUNTRY_content),
					autoFocus : true,
					select : function(event,ui){
					var temp = ui.item.label;
					var list = temp.split(" ");
					if(list.length == 2){
						$("#arrivedCountryCode").val(list[0]);
						$("#arrivedCountry").val(list[1]);
					}
				}
				});	
				$("#goodsSource_v").autocomplete({
					source : eval(DIST_content),
					autoFocus : true,
					appendTo: null,
					select : function(event,ui){
						var temp = ui.item.label;
						var list = temp.split(" ");
						if(list.length == 2){
							$("#goodsSourceCode").val(list[0]);
							$("#goodsSource").val(list[1]);
						}
						event.stopPropagation();
					}
				});	
				$("#tradingCountry_v").autocomplete({
					source : eval(COUNTRY_content),
					autoFocus : true,
					select : function(event,ui){
					var temp = ui.item.label;
					var list = temp.split(" ");
					if(list.length == 2){
						$("#tradingCountryCode").val(list[0]);
						$("#tradingCountry").val(list[1]);
					}
				}
				});					
				$("#transactionMode_v").autocomplete({
					source : eval(TRANS_content),
					autoFocus : true,
					select : function(event,ui){
						var temp = ui.item.label;
						var list = temp.split(" ");
						var val = list[1];
						if($("#ieFlag").val() == "E" && val == "FOB"){
							$("#freightMark_v").removeClass("qp_key_ipt").addClass("qp_readonly").attr("readonly",true).val("");
							$("#freightRate").removeClass("qp_key_ipt").addClass("qp_readonly").attr("readonly",true).val("");
							$("#freightCurrency_v").removeClass("qp_key_ipt").addClass("qp_readonly").attr("readonly",true).val("");
							$("#insuranceMark_v").removeClass("qp_key_ipt").addClass("qp_readonly").attr("readonly",true).val("");
							$("#insuranceRate").removeClass("qp_key_ipt").addClass("qp_readonly").attr("readonly",true).val("");
							$("#insuranceCurrency_v").removeClass("qp_key_ipt").addClass("qp_readonly").attr("readonly",true).val("");
						}else if($("#ieFlag").val() == "E" && val == "C&F"){
							$("#insuranceMark_v").removeClass("qp_key_ipt").addClass("qp_readonly").attr("readonly",true).val("");
							$("#insuranceRate").removeClass("qp_key_ipt").addClass("qp_readonly").attr("readonly",true).val("");
							$("#insuranceCurrency_v").removeClass("qp_key_ipt").addClass("qp_readonly").attr("readonly",true).val("");
							if(!$("#freightMark_v").hasClass("qp_key_ipt"))$("#freightMark_v").removeClass("qp_readonly").addClass("qp_key_ipt").attr("readonly",false);
							if(!$("#freightRate").hasClass("qp_key_ipt"))$("#freightRate").removeClass("qp_readonly").addClass("qp_key_ipt").attr("readonly",false);
							if(!$("#freightCurrency_v").hasClass("qp_key_ipt"))$("#freightCurrency_v").removeClass("qp_readonly").addClass("qp_key_ipt").attr("readonly",false);
						}else{
							if(!$("#freightMark_v").hasClass("qp_key_ipt"))$("#freightMark_v").removeClass("qp_readonly").addClass("qp_key_ipt").attr("readonly",false);
							if(!$("#freightRate").hasClass("qp_key_ipt"))$("#freightRate").removeClass("qp_readonly").addClass("qp_key_ipt").attr("readonly",false);
							if(!$("#freightCurrency_v").hasClass("qp_key_ipt"))$("#freightCurrency_v").removeClass("qp_readonly").addClass("qp_key_ipt").attr("readonly",false);
							if(!$("#insuranceMark_v").hasClass("qp_key_ipt"))$("#insuranceMark_v").removeClass("qp_readonly").addClass("qp_key_ipt").attr("readonly",false);
							if(!$("#insuranceRate").hasClass("qp_key_ipt"))$("#insuranceRate").removeClass("qp_readonly").addClass("qp_key_ipt").attr("readonly",false);
							if(!$("#insuranceCurrency_v").hasClass("qp_key_ipt"))$("#insuranceCurrency_v").removeClass("qp_readonly").addClass("qp_key_ipt").attr("readonly",false);
						}
						if(list.length == 2){
							$("#transactionModeCode").val(list[0]);
							$("#transactionMode").val(list[1]);
						}
						
					}
				});	
				$("#packingType_v").autocomplete({
					source : eval(WARP_content),
					autoFocus : true,
					select : function(event,ui){
						var temp = ui.item.label;
						var list = temp.split(" ");
						if(list.length == 2){
							$("#packingTypeCode").val(list[0]);
							$("#packingType").val(list[1]);
						}
					}
				});
				var entry_type_code = '[{label:"001 普通报关"},{label:"002 带清单普通报关"},{label:"003 无纸报关"},{label:"004 带清单无纸报关"}]';
				$("#entryType_v").autocomplete({
					source : eval(entry_type_code),
					autoFocus : true,
					select : function(event,ui){
						var temp = ui.item.label;
						var list = temp.split(" ");
						if(list.length == 2){
							$("#entryTypeCode").val(list[0]);
							$("#entryType").val(list[1]);
						}
					}
				});
				var freightMark = '[{label:"1 费率"},{label:"2 单价"},{label:"3 总价"}]';
				$("#freightMark_v").autocomplete({
					source : eval(freightMark),
					autoFocus : true,
					select : function(event,ui){
						var temp = ui.item.label;
						var list = temp.split(" ");
						if(list.length == 2){
							$("#freightMark").val(list[0]);
							$("#freightMarkChn").val(list[1]);
						}
					}
				});
				$("#insuranceMark_v").autocomplete({
					source : eval(freightMark),
					autoFocus : true,
					select : function(event,ui){
						var temp = ui.item.label;
						var list = temp.split(" ");
						if(list.length == 2){
							$("#insuranceMark").val(list[0]);
							$("#insuranceMarkChn").val(list[1]);
						}
					}
				});
				$("#extrasMark_v").autocomplete({
					source : eval(freightMark),
					autoFocus : true,
					select : function(event,ui){
						var temp = ui.item.label;
						var list = temp.split(" ");
						if(list.length == 2){
							$("#extrasMark").val(list[0]);
							$("#extrasMarkChn").val(list[1]);
						}
					}
				});
				$("#freightCurrency_v").autocomplete({
					source : eval(CURR_content),
					autoFocus : true,
					select : function(event,ui){
					var temp = ui.item.label;
					var list = temp.split(" ");
					if(list.length == 2){
						$("#freightCurrency").val(list[0]);
						$("#freightCurrencyChn").val(list[1]);
					}
				}
				});
				$("#insuranceCurrency_v").autocomplete({
					source : eval(CURR_content),
					autoFocus : true,
					select : function(event,ui){
					var temp = ui.item.label;
					var list = temp.split(" ");
					if(list.length == 2){
						$("#insuranceCurrency").val(list[0]);
						$("#insuranceCurrencyChn").val(list[1]);
					}
				}
				});
				$("#extrasCurrency_v").autocomplete({
					source : eval(CURR_content),
					autoFocus : true,
					select : function(event,ui){
					var temp = ui.item.label;
					var list = temp.split(" ");
					if(list.length == 2){
						$("#extrasCurrency").val(list[0]);
						$("#extrasCurrencyChn").val(list[1]);
					}
				}
				});
				$("#quantityUnit_goods").autocomplete({
					source : eval(UNIT_content),
					autoFocus : true,
					select : function(event,ui){}
				});	
				$("#firstUnit_goods").autocomplete({
					source : eval(UNIT_content),
					autoFocus : true,
					select : function(event,ui){}
				});	
				$("#secondUnit_goods").autocomplete({
					source : eval(UNIT_content),
					autoFocus : true,
					select : function(event,ui){}
				});	
				$("#currency_goods").autocomplete({
					source : eval(CURR_content),
					autoFocus : true,
					select : function(event,ui){}
				});	
				$("#dutyMode_goods").autocomplete({
					source : eval(DUTY_content),
					autoFocus : true,
					select : function(event,ui){}
				});	
				$("#arrivalCountry_goods").autocomplete({
					source : eval(COUNTRY_content),
					autoFocus : true,
					select : function(event,ui){}
				});	
			}else{
				alert("获取下拉选择数据异常");
			}
		},
		error : function(data){
			
		}
	});
	
}
function getDeclareCodeName(code, declareCodeList){
	for(var i=0; i<declareCodeList.length; i++) {
		if(declareCodeList[i]["label"].indexOf(code) == 0) {
			return declareCodeList[i]["label"].substring(code.length + 1);
		}
	}
	return "";
}

function init(){

	
	$("#search-dialog").on("dblclick", ".db", function(e){
		var list = eval(hscode_search_result_store.hsCodeList);
		var hscode = list[$(this).attr("index")];
		
		$("#hsCode_goods").val(hscode.codeHscode.hscode.substring(0,8));
		$("#extraNo_goods").val(hscode.codeHscode.hscode.substring(8,10));
		//$("#goodsName_goods").val(hscode.codeHscode.chnName);
		$("#quantityUnit_goods").val(hscode.codeHscode.unit1+" "+hscode.unit1Chn);
		$("#firstUnit_goods").val(hscode.codeHscode.unit1+" "+hscode.unit1Chn);
		$("#secondUnit_goods").val(hscode.codeHscode.unit2==""?"":(hscode.codeHscode.unit2+" "+hscode.unit2Chn));
		$("#search-dialog").dialog("close");
		$("#hsCode_goods").blur();
		$("#extraNo_goods").blur();
		$("#goodsName_goods").blur();
		$("#quantityUnit_goods").blur();
		$("#firstUnit_goods").blur();
		$("#secondUnit_goods").blur();
		
		var html = '<tr><th>1.品名</th><td>'+hscode.codeHscode.chnName+'</td></tr>';
		$.ajax({
			type : "post" ,
		    url : "/declare/getMerchElement.action?hscode="+hscode.codeHscode.hscode,
		    dataType : "json" ,
		    async : false,
		    success : function(data){
				if(data.flag == 1){
					var list = eval(data.list);
					$(list).each(function(index, obj){
						html += '<tr><th>'+Number(index+2)+'.'+obj.element+'</th><td><input type="text" class="inp2"/></td></tr>'
					});
				}
			},
			error : function(data){
				
			}
		});
		
		$("#result-dialog_hscode").html(hscode.codeHscode.hscode.substring(0,8));
		$("#result-dialog-table tbody").html(html);
		guigeJump();
		$("#result-dialog").dialog("open");
		
	}).on("click", ".db", function(e){
		$(".db").removeClass("c-act");
		$(this).addClass("c-act");
	});
	
	
	$("#search-arrivePort-dialog").on("dblclick", ".db", function(e){
		
		var portCode = $(this).attr("portCode");
		var portCName = $(this).attr("portCName");
		var countryCode = $(this).attr("countryCode");
		var countryName = $(this).attr("countryName");
		
		$("#search-arrivePort-dialog").dialog("close");
		$("#arrivedPort_v").val(portCode+" "+portCName);
		$("#arrivedPortCode").val(portCode);
		$("#arrivedPort").val(portCName);
		if($("#arrivedCountry_v").val() == ""){
			$("#arrivedCountryCode").val(countryCode);
			$("#arrivedCountry_v").val(countryCode+" "+countryName);
			$("#arrivedCountry").val(countryName);
		}
		$("#goodsSource_v").focus();
		
	}).on("click", ".db", function(e){
		$(".db").removeClass("c-act");
		$(this).addClass("c-act");
	})
}

var hscode_search_result_store;
function hscode_search(pageNo){
	
	 $.ajax({
		type : "post" ,
        url : "/declare/getDeclareHsCode.action?hscode="+encodeURI(encodeURI($("#hscode_search_content").val()))+"&gotoPage="+pageNo,
        dataType : "json" ,
        beforeSend : function(){
		 	$("#hscode_result_table tbody").html(
		 		'<tr class="db">'+
					'<td colspan="4"><image src="/images/loading.gif"></td>'+
				'</tr>'
		 	);
	 	},
        success : function(data){
	 		if(data.flag == 1){
	 			var list = eval(data.hsCodeList);
	 			var html = "";
	 			$(list).each(function(index, obj){
	 				html += 
	 					'<tr class="db" index="'+index+'">'+
						'	<td>'+obj.codeHscode.hscode+'</td>'+
						'	<td>'+obj.codeHscode.chnName+'</td>'+
						'	<td>'+obj.unit1Chn+'</td>'+
						'	<td>'+obj.unit2Chn+'</td>'+
						'</tr>'
	 			})
	 			$("#hscode_result_table tbody").html(html);
	 			hscode_search_result_store = data;
	 			ajaxLoadPage(data, "pages_hscode_result_table");
	 		}else{
	 			$("#hscode_result_table tbody").html("对不起，查询异常");
	 		}
	 	},
	 	error : function(data){
	 		$("#hscode_result_table tbody").html(
	 			'<tr class="db">'+
					'<td colspan="4">对不起，查询异常</td>'+
				'</tr>'
	 		);
	 	}
	 })
}

function hscode_confirm(){
	var list = eval(hscode_search_result_store.hsCodeList);
	var hscode;
	if($("#hscode_result_table tbody").find(".c-act").length == 0){
		alert("请先选择一条数据");
	}else{
		$("#hscode_result_table tbody").find(".c-act").each(function(){
			hscode = list[$(this).attr("index")];
		});
		$("#hsCode_goods").val(hscode.codeHscode.hscode.substring(0,8));
		$("#extraNo_goods").val(hscode.codeHscode.hscode.substring(8,10));
		//$("#goodsName_goods").val(hscode.codeHscode.chnName);
		$("#quantityUnit_goods").val(hscode.codeHscode.unit1+" "+hscode.unit1Chn);
		$("#firstUnit_goods").val(hscode.codeHscode.unit1+" "+hscode.unit1Chn);
		$("#secondUnit_goods").val(hscode.codeHscode.unit2==""?"":(hscode.codeHscode.unit2+" "+hscode.unit2Chn));
		$("#search-dialog").dialog("close");
		$("#hsCode_goods").blur();
		$("#extraNo_goods").blur();
		$("#goodsName_goods").blur();
		$("#quantityUnit_goods").blur();
		$("#firstUnit_goods").blur();
		$("#secondUnit_goods").blur();
		
		var html = '<tr><th>1.品名</th><td>'+hscode.codeHscode.chnName+'</td></tr>';
		$.ajax({
			type : "post" ,
		    url : "/declare/getMerchElement.action?hscode="+hscode.codeHscode.hscode,
		    dataType : "json" ,
		    async : false,
		    success : function(data){
				if(data.flag == 1){
					var list = eval(data.list);
					$(list).each(function(index, obj){
						html += '<tr><th>'+Number(index+2)+'.'+obj.element+'</th><td><input type="text" class="inp2"/></td></tr>'
					});
				}
			},
			error : function(data){
				
			}
		});
		
		$("#result-dialog_hscode").html(hscode.codeHscode.hscode.substring(0,8));
		$("#result-dialog-table tbody").html(html);
		guigeJump();
		$("#result-dialog").dialog("open");
	}
}

function result_dialog_yes(){
	var guige = "";
	$("#result-dialog-table").find("input").each(function(){
		guige += $(this).val() + "|";
	})
	guige = guige.substring(0, guige.length - 1);//先去掉最后一个斜杠
	if(guige.substring(guige.length - 1, guige.length) == "|"){
		$("#model_goods").val(guige.substring(0, guige.length - 1));//如果其他为空，再删掉最后一个斜杠
	}else{
		$("#model_goods").val(guige);//如果其他不为空
	}
	$("#model_goods").blur();
	$("#result-dialog").dialog("close");
	$("#quantity_goods").focus()
}
function result_dialog_no(){
	$("#result-dialog").dialog("close");
	$("#hsCode_goods").focus();
}

function arrivePort_search(pageNo){
	$.ajax({
		type : "post" ,
        url : "/declare/getArrivePort.action?arrivePort="+encodeURI(encodeURI($("#arrivePort_search_content").val()))+"&gotoPage="+pageNo,
        dataType : "json" ,
        beforeSend : function(){
		 	$("#arrivePort_result_table tbody").html(
		 		'<tr class="db">'+
					'<td colspan="2"><image src="/images/loading.gif"></td>'+
				'</tr>'
		 	);
	 	},
        success : function(data){
	 		if(data.flag == 1){
	 			var list = eval(data.portList);
	 			var html = "";
	 			if($(list).length == 1){
	 				port_data = $(list)[0];
	 				//如果只有一条，则直接关闭查询框，直接赋值
	 				$("#search-arrivePort-dialog").dialog("close");
	 				$("#arrivedPort_v").val(port_data.codePort.portCode+" "+port_data.codePort.portCName);
	 				$("#arrivedPortCode").val(port_data.codePort.portCode);
	 				$("#arrivedPort").val(port_data.codePort.portCName);
 					$("#arrivedCountryCode").val(port_data.codePort.countryCode);
 					$("#arrivedCountry_v").val(port_data.codePort.countryCode+" "+port_data.countryName);
 					$("#arrivedCountry").val(port_data.countryName);
	 				$("#goodsSource_v").focus();
	 				return false;
	 			}
	 			$(list).each(function(index, obj){
	 				html += 
	 					'<tr class="db" portCode="'+obj.codePort.portCode+'" portCName="'+obj.codePort.portCName+'" countryCode="'+obj.codePort.countryCode+'" countryName="'+obj.countryName+'">'+
						'	<td>'+obj.codePort.portCode+'</td>'+
						'	<td>'+obj.codePort.portCName+'</td>'+
						'</tr>'
	 			})
	 			$("#arrivePort_result_table tbody").html(html);
	 			ajaxLoadPage(data, "pages_arrivePort_result_table");
	 		}else{
	 			$("#arrivePort_result_table tbody").html(
 			 		'<tr class="db">'+
 						'<td colspan="2">对不起，查询异常</td>'+
 					'</tr>'
 			 	);
	 		}
	 		
	 	},
	 	error : function(data){
	 		$("#arrivePort_result_table tbody").html(
		 		'<tr class="db">'+
					'<td colspan="2">对不起，查询异常</td>'+
				'</tr>'
		 	);
	 	}
	});
}

function getQuery(name) {
	var search = window.location.search ? window.location.search.substring(1).split("&") : "";
	var item = [];
	for(var i=0, l=search.length; i<l; i++) {
		item[i] = search[i].split("=");
		if(name === item[i][0]) {
			return item[i][1];
		}
	}
	return "";
}
function guigeJump(){
			var j = 0;
			$(".inp2").each(function(index){
				$(this).keydown(function(e){
					if(e.keyCode == 13){
						if(j == $(".inp2").length){
							result_dialog_yes();
						}else{
							$(".inp2")[j].focus();
						}
					}
					e.stopPropagation();
				});
				$(this).focus(function(){
					j = index + 1;
				});
			});
		}
$("#model_goods").on("dblclick", function(e){
	if($("#hsCode_goods").val().length != 8 || $("#extraNo_goods").val().length != 2){
		alert("请先填写正确的HSCODE");
		return false;
	}
	var elements = $("#model_goods").val();
	var temp = elements.split("|");
	
	var html = '<tr><th>1.品名</th><td>'+$("#goodsName_goods").val()+'</td></tr>';
	$.ajax({
		type : "post" ,
	    url : "/declare/getMerchElement.action?hscode="+$("#hsCode_goods").val()+$("#extraNo_goods").val(),
	    dataType : "json" ,
	    async : false,
	    success : function(data){
			if(data.flag == 1){
				var list = eval(data.list);
//				if($(list).length == (temp.length)){
					$(list).each(function(index, obj){
						html += '<tr><th>'+Number(index+2)+'.'+obj.element+'</th><td><input type="text" class="inp2" value="'+(temp[index]||'')+'"/></td></tr>'
					});
					$("#result-dialog-table tbody").html(html);
					guigeJump();
					$("#result-dialog").dialog("open");
//				}else{
//					alert("HSCODE错误");
//				}
				
			}
		},
		error : function(data){
			
		}
	});
})

function companyRecord_search(pageNo){
	$.ajax({
		type : "post" ,
		url : "/declare/getBusinessCompanyRecord.action?companyName="+encodeURI(encodeURI($("#companyRecord_search_content").val()))+"&gotoPage="+pageNo+"&type="+$("#companyRecord_type").val(),
		dataType : "json" ,
		beforeSend : function(){
		$("#companyRecord_result_table tbody").html(
				'<tr class="db">'+
				'<td colspan="3"><image src="/images/loading.gif"></td>'+
				'</tr>'
		);
	},
	success : function(data){
		if(data.flag == 1){
			var list = eval(data.list);
			var html = "";
			$(list).each(function(index, obj){
				html += 
					'<tr class="db" companyCode="'+obj.companyCode+'" companyChn="'+obj.companyChn+'" >'+
					'	<td>'+obj.companyCode+'</td>'+
					'	<td>'+obj.companyChn+'</td>'+
					'	<td><a href="javascript:;" onclick="companyRecord_del(\''+obj.id+'\')">删除</a></td>'+
					'</tr>'
			})
			$("#companyRecord_result_table tbody").html(html);
			ajaxLoadPage(data, "pages_companyRecord_result_table");
		}else{
			$("#companyRecord_result_table tbody").html(
					'<tr class="db">'+
					'<td colspan="3">对不起，查询异常</td>'+
					'</tr>'
			);
		}
		
	},
	error : function(data){
		$("#companyRecord_result_table tbody").html(
				'<tr class="db">'+
				'<td colspan="3">对不起，查询异常</td>'+
				'</tr>'
		);
	}
	});
}

//删除经营单位记录
function companyRecord_del(id){
	$.ajax({
		type : "post" ,
		url : "/declare/delBusinessCompanyRecord.action?id="+id,
		dataType : "json" ,
		success : function(data){
			if(data.flag == "1"){
				alert("删除成功");
				companyRecord_search(1);
			}else{
				alert("对不起，删除失败，请稍后再试");
			}
		},
		error : function(){
			alert("对不起，删除失败，请稍后再试");
		}
	});
}

function companyRecord_add(){
	$("#add_business_company_code").val("");
	$("#add_business_company_chn").val("");
	$("#add-companyRecord-dialog").dialog("open");
}

function add_companyRecord_yes(){
	$.ajax({
		type : "post" ,
        url : "/declare/addBusinessCompanyRecord.action?id=&companyCode="+$("#add_business_company_code").val()+
        		"&companyChn="+encodeURI(encodeURI($("#add_business_company_chn").val()))+"&type="+$("#companyRecord_type").val(),
        dataType : "json" ,
        success : function(data){
			if(data.flag == "1"){
				alert("新增成功");
				$("#add-companyRecord-dialog").dialog("close");
				$("#company-record-dialog").dialog("close");
				if($("#companyRecord_type").val() == "1"){
					$("#businessCompanyCode").val($("#add_business_company_code").val());
					$("#businessCompany").val($("#add_business_company_chn").val());
					$("#transportMode_v").focus();
				}else{
					$("#productionCompanyCode").val($("#add_business_company_code").val());
					$("#productionCompany").val($("#add_business_company_chn").val());
					$("#tradeMode_v").focus();
				}
			}else{
				alert("对不起，新增失败，请稍后再试");
			}
		},
		error : function(data){
			alert("对不起，新增失败，请稍后再试");
		}
	})
}

function add_companyRecord_no(){
	$("#add-companyRecord-dialog").dialog("close");
}

$("#company-record-dialog").on("dblclick", ".db", function(e){
	
	$("#company-record-dialog").dialog("close");
	var bussinessCompanyCode = $(this).attr("companyCode");
	var bussinessCompanyCnh = $(this).attr("companyChn");
	if($("#companyRecord_type").val() == "1"){
		$("#businessCompanyCode").val(bussinessCompanyCode);
		$("#businessCompany").val(bussinessCompanyCnh);
		$("#transportMode_v").focus();
	}else{
		$("#productionCompanyCode").val(bussinessCompanyCode);
		$("#productionCompany").val(bussinessCompanyCnh);
		$("#tradeMode_v").focus();
	}
	
}).on("click", ".db", function(e){
	$(".db").removeClass("c-act");
	$(this).addClass("c-act");
})

//保存电子委托协议号
function edocIdSave(){
	if($("#edocFile_9").attr("cloudQpId") == null || $("#edocFile_9").attr("cloudQpId") == "" || $("#edocFile_9").attr("cloudQpId") == undefined){
		alert("请先保存报关单信息F1之后再保存电子委托协议号");
		$("#edocFile_9").val("电子代理报关委托编号")
		return false;
	}else{
		$.ajax({
			type : "post" ,
	        url : "/declare/edocIdSave.action?cloudQpId="+$("#edocFile_9").attr("cloudQpId")+"&edocId="+
	        	$("#edocFile_9").val()+"&edocCode="+$("#edocFile_9").attr("edocType"),
	        dataType : "json" ,
	        beforeSend : function(){
				$(".dec-save").val("保存中··")
			},
	        success : function(data){
				if(data.flag == "1"){
					alert("保存成功");
				}else{
					$("#edocFile_9").val("电子代理报关委托编号")
					alert("对不起，保存失败，请稍后再试");
				}
				$(".dec-save").val("保存")
			},
			error : function(data){
				$(".dec-save").val("保存")
				$("#edocFile_9").val("电子代理报关委托编号")
				alert("对不起，保存失败，请稍后再试");
			}
		})
	}
}

function clearAllData(){
	//第一个TAB页赋值（还差 类型、企业性质）
	$("#cloudQpId").val("");
	$("#receiptDes").text("");
	$("#ieFlag").val("");
	$("#status").val("");
	$("#eportNo").val("");
	$("#customNo").val("");
	$("#preentryNo").val("");
	$("#declareLocation_v").val("");
	$("#declareLocation").val("");
	$("#declareLocationCode").val("");					
	$("#exportLocation_v").val("");
	$("#exportLocation").val("");
	$("#exportLocationCode").val("");
	$("#enrolNo").val("");
	$("#exportDate").val("");
	$("#declareDate").val("");
	$("#businessCompanyCode").val("");
	$("#businessCompany").val("");
	$("#transportMode_v").val("");
	$("#transportMode").val("");
	$("#transportModeCode").val("");
	$("#transportName").val("");
	$("#transportId").val("");
	$("#billNo").val("");
	$("#productionCompanyCode").val("");
	$("#productionCompany").val("");
	$("#tradeMode_v").val("");
	$("#tradeMode").val("");
	$("#tradeModeCode").val("");
	$("#cutMode_v").val("");
	$("#cutMode").val("");
	$("#cutModeCode").val("");
	$("#payMode_v").val("");
	$("#payMode").val("");
	$("#payModeCode").val("");
	$("#declareCompany").val("");
	$("#declareCompanyCode").val("");
	$("#arrivedCountry_v").val("");
	$("#arrivedCountry").val("");
	$("#arrivedCountryCode").val("");
	$("#arrivedPort_v").val("");
	$("#arrivedPort").val("");
	$("#arrivedPortCode").val("");
	$("#goodsSource_v").val("");
	$("#goodsSource").val("");
	$("#goodsSourceCode").val("");
	$("#tradingCountry_v").val("");
	$("#tradingCountry").val("");
	$("#tradingCountryCode").val("");
	$("#transactionMode_v").val("");
	$("#transactionMode").val("");
	$("#transactionModeCode").val("");
	$("#freightMark_v").val("");
	$("#freightMark").val("");
	$("#freightMarkChn").val("");
	$("#freightRate").val("");
	$("#freightCurrency_v").val("");
	$("#freightCurrency").val("");
	$("#freightCurrencyChn").val("");
	$("#insuranceMark_v").val("");
	$("#insuranceMark").val("");
	$("#insuranceMarkChn").val("");
	$("#insuranceRate").val("");
	$("#insuranceCurrency_v").val("");
	$("#insuranceCurrency").val("");
	$("#insuranceCurrencyChn").val("");
	$("#extrasMark_v").val("");
	$("#extrasMark").val("");
	$("#extrasMarkChn").val("");
	$("#extrasRate").val("");
	$("#extrasCurrency_v").val("");
	$("#extrasCurrency").val("");
	$("#extrasCurrencyChn").val("");
	$("#packagesNum").val("");
	$("#packingType_v").val("");
	$("#packingType").val("");
	$("#packingTypeCode").val("");
	$("#grossWeight").val("");
	$("#netWeight").val("");
	$("#remark").val("");
	$("#contractNo").val("");
	$("#entryType_v").val("");
	$("#entryType").val("");
	$("#entryTypeCode").val("");
	$("#taxCorporationType").val("");
	$("#licenseNo").val("");
	//$("#approvalNo").val("");
	$("#relativeEntryNo").val("");
	$("#relativeEnrolNo").val("");
	$("#warehouseNo").val("");
	$("#cyNo").val("");
	$("#vouchFlag").val("");
	$("#vouchFlag").prop("checked", "");
	//表格的数据
	table1.refresh();
	table2.refresh();
	table3.refresh();
	
	sum();
	//第二个TAB页数据
	$("#invoiceNo_2").val("");
	$("#numbers_2").val("");
	$("#unit_2").val("");
	$("#creditNo_2").val("");
	$("#invoiceSigner_2").val("");
	$("#price_2").val("");
	$("#currency_2").val("");
	$("#businessCompany_2").val("");
	$("#businessCompanyEn_2").val("");
	$("#businessCompanyAddr_2").val("");
	$("#customCompamy_2").val("");
	$("#customTel_2").val("");
	$("#customCompamyAddr_2").val("");
	$("#customsBroker_2").val("");
	$("#rmbRate_2").val("");
	$("#usdRate_2").val("");
	$("#tax_2").val("");
	//第三个TAB页数据
	uploadLogo("edocFile_1", "00000001", "");
	uploadLogo("edocFile_2", "00000002", "");
	uploadLogo("edocFile_3", "00000003", "");
	uploadLogo("edocFile_4", "00000004", "");
	uploadLogo("edocFile_5", "00000005", "");
	uploadLogo("edocFile_6", "00000006", "");
	uploadLogo("edocFile_7", "00000007", "");
	uploadLogo("edocFile_8", "00000008", "");
	//uploadLogo("edocFile_9", "10000001", "");
	uploadLogo("edocFile_10", "10000002", "");
	//第一页下面用于输入的框清空
	$("#goodsSeq_goods").val("");
	$("#enrolNo_goods").val("");
	$("#hsCode_goods").val("");
	$("#extraNo_goods").val("");
	$("#goodsName_goods").val("");
	$("#goodsVersion_goods").val("");
	$("#goodsNo_goods").val("");
	$("#use_goods").val("");
	$("#model_goods").val("");
	$("#quantity_goods").val("");
	$("#quantityUnit_goods").val("");
	$("#unitPrice_goods").val("");
	$("#sum_goods").val("");
	$("#currency_goods").val("");
	$("#arrivalCountry_goods").val("");
	$("#firstQuantity_goods").val("");
	$("#firstUnit_goods").val("");
	$("#secondQuantity_goods").val("");
	$("#secondUnit_goods").val("");
	$("#dutyMode_goods").val("");
	$("#processingCharges_goods").val("");
	//电子委托协议号清空
	$("#edocFile_9").val("电子代理报关委托编号");
	$("#edocFile_9").attr("cloudQpId","");
}

function getDataFromCLPByBillNo(){
	var billNo = $("#billNo").val();
	if(billNo == ""){
		alert("请先填写提单号");
		return false;
	}
	$.ajax({
		type : "post" ,
        url : "/declare/getDataFromCLPByBillNo.action?billNo="+billNo,
        dataType : "json" ,
        beforeSend : function(){
			$("#getDataFromCLPByBillNo_btn").val("查询中··")
		},
        success : function(data){
			$("#getDataFromCLPByBillNo_btn").val("查询")
			$("#transportName").val("");
			$("#transportId").val("");
			$("#packagesNum").val("")
			$("#grossWeight").val("")
			//$("#netWeight").val("")
			table2.refresh();
			if(data.flag == "0"){
				alert("未查询到数据");
			}else if(data.flag == "2"){
				alert("对不起，查询异常，请稍后再试！");
			}else if(data.flag == "100"){
				alert("对不起，您没有权限，请联系管理员！");
			}else{
				//如果有数据，运输方式选择水路运输
				//console.log(data);
				var jsonData = eval(data);
				var clpRecordList = eval(jsonData.CLPRecord);
				if(clpRecordList[0].costcoBlDeoList.length == 0){
					alert("未查询到数据");
					return false;
				}
				$("#transportMode_v").val("2 水路运输");
				$("#transportModeCode").val("2");
				$("#transportMode").val("水路运输");
				$("#transportName").val(clpRecordList[0].costcoMainDeo.vessel);
				$("#transportId").val((clpRecordList[0].costcoMainDeo.voyage).substring(0,(clpRecordList[0].costcoMainDeo.voyage).length-1));
				var js = 0;
				var mz = 0;
				//var jz = 0;
				//var ctnContent = ""
				$(clpRecordList).each(function(index, obj){
					//件数，毛重，净重累加
					$(obj.costcoBlDeoList).each(function(index1, obj1){
						if(obj1.blNo == billNo){
							js += +(obj1.ctnPackageNum);
							mz += +(obj1.grossWeight);
						}
					})
					//js += +(obj.costcoBlDeoList[0].ctnPackageNum);
					//mz += +(obj.costcoBlDeoList[0].grossWeight);
					//jz += +(obj.costcoBlDeoList[0].ctnNetWeight);
					//填写箱信息
					//第一个TAB页表格的数据
					var ctnSizeType = obj.costcoMainDeo.sizetype;
					if(ctnSizeType.substring(0,1) == "2"){
						ctnSizeType = "S";
					}else{
						ctnSizeType = "L";
					}
					table2.append([
						{
							name:"ctn_no",
							value:index+1,
							hiddenName: "declareCtnList["+index+"].ctn_no"
						},
						{
							name:"containerNo",
							value:obj.costcoMainDeo.ctnNo || "",
							hiddenName: "declareCtnList["+index+"].containerNo"
						},
						{
							name:"containerSize",
							value:ctnSizeType || "",
							hiddenName: "declareCtnList["+index+"].containerSize"
						},
						{
							name:"containerWeight",
							value:"",
							hiddenName: "declareCtnList["+index+"].containerWeight"
						},
						{
							name:"declareCtnId",
							value:"",
							hiddenName: "declareCtnList["+index+"].declareCtnId"
						}
					])
					
				})
				$("#packagesNum").val(js)
				$("#grossWeight").val(mz)
				//$("#netWeight").val(jz)
				//$("#dec-ctn-content").html(ctnContent);
				// 判断海关预配数据是否与港区一致
				var cusJs = 0;
				var cusMz = 0;
				var manifestRecord = eval("(" + jsonData.ManifestRecord + ")");
				if(manifestRecord.Result == 1 && manifestRecord.Data.length > 0){
					cusJs = manifestRecord.Data[0].PackNo;
					cusMz = manifestRecord.Data[0].GrossWT;
					if (js == cusJs && mz == cusMz) {
						alert("运抵与预配数据件数、毛重一致！");
					} else {
						alert("运抵与预配件数、毛重不一致！预配数据为：件数 " + cusJs + " 毛重 " + cusMz);
					}					
				} else {
					alert("海关预配信息为空");
				}
			}
		},
		error : function(data){
			$("#getDataFromCLPByBillNo_btn").val("查询")
			alert("对不起，查询异常，请稍后再试！");
		}
	})
}
//-----------------附件上传START-----------------------------------------
		function uploadLogo(id, edocCode, cloudQpId){
			$('#'+id).uploadify({
				'debug':false,
				'fileSizeLimit' : '5000',
				'formData':{'cloudQpId':cloudQpId||''},
				'swf'      : 'QP/upload/uploadify.swf',
				'uploader' : '/declare/uploadEdoc.action?edocCode='+edocCode,
				'fileTypeExts' : '*.pdf; *.xls; *.xlsx; *.doc; *.docx',
				'fileDesc':"上传",
				'fileObjName':'edocFile',
				'width':65,
				'height':30,
				'buttonText':"点击上传",
				'buttonClass':"dec",
				'removeTimeout' : 0.1,
				'multi':false,
				
				"onSelect":function(file){
					$('#'+id).uploadify('settings','formData',{'cloudQpId':cloudQpId||'', 'fileName':file.name});
				},
				'onUploadStart' : function() {
					
				},
				'onUploadSuccess' : function(file, data, response){
					var obj = $.parseJSON(data);
					if(obj.flag == "1"){
						alert("上传成功");
					}else if(obj.flag == "2"){
						alert("上传失败:"+obj.desc);
					}else{
						alert("上传异常");
					}
				},
				"onUploadError":function(file, errorCode, errorMsg, errorString){
					alert("上传失败");
				}
			});
		}
		uploadLogo("edocFile_1", "00000001");
		uploadLogo("edocFile_2", "00000002");
		uploadLogo("edocFile_3", "00000003");
		uploadLogo("edocFile_4", "00000004");
		uploadLogo("edocFile_5", "00000005");
		uploadLogo("edocFile_6", "00000006");
		uploadLogo("edocFile_7", "00000007");
		uploadLogo("edocFile_8", "00000008");
		//uploadLogo("edocFile_9", "10000001");
		uploadLogo("edocFile_10", "10000002");
		//-----------------附件上传END-------------------------------------------
