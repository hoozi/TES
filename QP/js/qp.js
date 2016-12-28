function sum() {
	var sum = 0;
	$(".tableView_cell[field=sum]").each(function(){
		sum+= +$(this).find(".text_inner").text()
	})
	$("#price_total").find("b").html("合计金额:<span class='t_price'>"+sum.toFixed(2)+"</span>元")
}
function countTEU(){
	/*var sum_TEU = +$("#ctn_total").find("b").text().match(/(\d+)/g)[0];
	var input = $("#containerSize");
	if(input.val() == "S")sum_TEU += 20;
	if(input.val() == "L")sum_TEU += 40;
	$("#ctn_total").find("b").text("合计："+sum_TEU+" TEU");*/
	var sum_TEU = 0;
	$("#qp3_table_view").find("[field-for=containerSize]").each(function(){
		var t = $(this).find(".text_inner").text();
		if(t == "S")sum_TEU += 20;
		if(t == "L")sum_TEU += 40;
	});
	$("#ctn_total").find("b").text("合计："+sum_TEU+" TEU");
}
function accDiv(arg1,arg2){ 
			var t1=0,t2=0,r1,r2; 
			try{t1=arg1.toString().split(".")[1].length}catch(e){} 
			try{t2=arg2.toString().split(".")[1].length}catch(e){} 
			with(Math){ 
			r1=Number(arg1.toString().replace(".","")) 
			r2=Number(arg2.toString().replace(".","")) 
			return (r1/r2)*pow(10,t2-t1); 
			} 
			} 
			//给Number类型增加一个div方法，调用起来更加方便。 
			Number.prototype.div = function (arg){ 
			return accDiv(this, arg); 
			} 
					
				// 四舍六入五单双算法
		function EffectiveNum(val, n) {
            if(isNaN(val)||val==0) return;
            
            var newNum;
            var arrNum = val.toString().split(".");
            var zero = "";
            var valLen = arrNum.length>1?arrNum[1].length:0;
            
            for(var j=0; j<n; j++) {
                zero+= "0";
            }
            var digit = "1"+zero;
            
            //整数补零
            if(!arrNum[1]) {
                return arrNum[0]+"."+zero;
            }
            var last = arrNum[1].substring(arrNum[1].length-1);
            
            //截掉多余的位数
            if(arrNum[1].length>(n+1)) {
                arrNum[1] = arrNum[1].substring(0,(n+1));
            }
            
            //当位数不足n位
            if(arrNum[1].length<=n) {
                var lenofnum = n-arrNum[1].length;
                var append = "";
                for(var i=0;i<lenofnum;i++) {
                    append+="0";
                }
                newNum = arrNum[0]+"."+arrNum[1]+append;
            } else {
                var mender = arrNum[1].charAt(n);
                var concatNum = arrNum[0].concat(arrNum[1]);
                var newConcatNum = +concatNum.substring(0,concatNum.length-1);
                if(parseInt(mender)>5||parseInt(mender)<5) {
                    newNum = parseFloat(val).toFixed(n)
                } else {
                    var loc = arrNum[1].charAt(n-1);
                    if(loc%2==0) {
                        newNum = parseFloat(newConcatNum/digit).toFixed(n);
                    } else {
                        newNum = parseFloat((newConcatNum+1)/digit).toFixed(n);
                    }
                    if(valLen>5 && last>0) {
                       newNum = parseFloat((newConcatNum+1)/digit).toFixed(n);
                    }
                }
            }
            return newNum;
        }
 $("#quantity_goods").blur(function(){
			$("#firstQuantity_goods").val($("#quantity_goods").val());
			$("#firstQuantity_goods").blur();
			//iptBlur(this);
			if($("#sum_goods").val() != "") {
				$("#unitPrice_goods").val(EffectiveNum((defVal.div(Number($("#quantity_goods").val()))),4));		
			}
		})
		var defVal,udefVal = 0;
		$("#unitPrice_goods").blur(function(){
		//console.log(udefVal)
			if($("#quantity_goods").val() != "") {
				if($("#unitPrice_goods").val()!=udefVal) {
					$("#sum_goods").val(EffectiveNum((Number($("#quantity_goods").val() * Number($("#unitPrice_goods").val()))),2));
				}
			}
			//iptBlur(this);
			//iptBlur("#sum_goods");
			//reCalculateSum();
			
		})
		$("#sum_goods").blur(function(){
			defVal = +$("#sum_goods").val();
			if($("#quantity_goods").val() != "") {
				$("#unitPrice_goods").val(EffectiveNum((defVal.div(Number($("#quantity_goods").val()))),4));
				udefVal = $("#unitPrice_goods").val();				
			}
			//iptBlur(this);
			//iptBlur("#unitPrice_goods");
			//reCalculateSum();
		})
var table1 = new TableView("#qp2_table_view");
var table2 = new TableView("#qp3_table_view");
var table3 = new TableView("#qp4_table_view");
table1.init({
	focusItem: "#hsCode_goods",
	copy:true
});
table2.init({
	focusItem: "#containerNo",
	del: function(){
		countTEU();
	}
});
table3.init({
	focusItem: "#docAttachedCode"
});
var $key = $(".qp_key_ipt");
var cursor = 0;
var goods = ctn = attached = {};
var inGoods = inCtn = inAtt = false;

$key.on("focus", function(){
	var index = $(".qp_key_ipt").index(this), $this = $(this);
	$this.addClass("focus").select();
	cursor = index;
	if($this.parents(".hotKey_wrap").is("#qp2")) {
		inCtn = inAtt = false;
		inGoods = true;
	} else if($this.parents(".hotKey_wrap").is("#qp3")) {
		inGoods = inAtt = false;
		inCtn = true;
	} else if($this.parents(".hotKey_wrap").is("#qp4")) {
		inGoods = inCtn = false;
		inAtt = true;
	} else {
		inGoods = inCtn = inAtt = false;
	}
}).on("blur", function(){
	$(this).removeClass("focus");
})
$("#goodsName_goods").on("dblclick", function(){
	var openDialog = $(this).attr("opendialog");
	if(openDialog) {
		$("#"+openDialog).dialog("open");
	}
});

function itemFocus(index) {
	$(".qp_key_ipt").eq(index).focus().select();
}
function addGoods() {
	if(table1.data.length>=20) {
		alert("最多20条!");
		return false;
	}
	var val = +$("input[name=goodsSeq]").val()
	if(val) {
		var row = $("#qp2_table_view").find(".tableView_row[index="+(val-1)+"]");
		$.each($(".e_ipt1"), function(i){
			var name = $(this).attr("name");
			var item = row.find(".tableView_cell[field="+name+"]");
			item.find(".text_inner").text($(this).val())
			.end()
			.find("input[type=hidden]").val($(this).val());
		});
		table1.data[(val-1)]=[
		{
			name:"goodsSeq",
			value:val,
			hiddenName: "declareGoodsList["+(val-1)+"].goodsSeq"
		},
		{
			name:"hsCode",
			value:$("#hsCode_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].hsCode"
		},
		{
			name:"enrolNo",
			value:$("#enrolNo").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].enrolNo"
		},
		{
			name:"goodsName",
			value:$("#goodsName_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].goodsName"
		},
		{
			name:"arrivalCountry",
			value:$("#arrivalCountry_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].arrivalCountry"
		},
		{
			name:"quantity",
			value:$("#quantity_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].quantity"
		},
		{
			name:"quantityUnit",
			value:$("#quantityUnit_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].quantityUnit"
		},
		{
			name:"unitPrice",
			value:$("#unitPrice_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].unitPrice"
		},
		{
			name:"sum",
			value:$("#sum_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].totalPrice"
		},
		{
			name:"currency",
			value:$("#currency_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].currency"
		},
		{
			name:"dutyMode",
			value:$("#dutyMode_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].dutyMode"
		},
		{
			name:"extraNo",
			value:$("#extraNo_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].extraNo"
		},
		{
			name:"goodsVersion",
			value:$("#goodsVersion_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].goodsVersion"
		},
		{
			name:"goodsNo",
			value:$("#goodsNo_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].goodsNo"
		},
		{
			name:"use",
			value:$("#use_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].use"
		},
		{
			name:"model",
			value:$("#model_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].model"
		},
		{
			name:"firstQuantity",
			value:$("#firstQuantity_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].firstQuantity"
		},
		{
			name:"firstUnit",
			value:$("#firstUnit_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].firstUnit"
		},
		{
			name:"secondQuantity",
			value:$("#secondQuantity_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].secondQuantity"
		},
		{
			name:"secondUnit",
			value:$("#secondUnit_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].secondUnit"
		},
		{
			name:"processingCharges",
			value:$("#processingCharges_goods").val(),
			hiddenName: "declareGoodsList["+(val-1)+"].processingCharges"
		},
		{
			name:"declareGoodsId",
			value:"",
			hiddenName: "declareGoodsList["+(val-1)+"].declareGoodsId"
		}
	];
		$("#qp2").find("input[type=text]").val("");
		$("#qp2_table_view").find(".tableView_row").removeClass("ui-selected");
		sum();
		//table1.append();
		return false;
	}
	table1.append([
		{
			name:"goodsSeq",
			value:"!{index}",
			hiddenName: "declareGoodsList[!{index}].goodsSeq"
		},
		{
			name:"hsCode",
			value:$("#hsCode_goods").val(),
			hiddenName: "declareGoodsList[!{index}].hsCode"
		},
		{
			name:"enrolNo",
			value:$("#enrolNo").val(),
			hiddenName: "declareGoodsList[!{index}].enrolNo"
		},
		{
			name:"goodsName",
			value:$("#goodsName_goods").val(),
			hiddenName: "declareGoodsList[!{index}].goodsName"
		},
		{
			name:"arrivalCountry",
			value:$("#arrivalCountry_goods").val(),
			hiddenName: "declareGoodsList[!{index}].arrivalCountry"
		},
		{
			name:"quantity",
			value:$("#quantity_goods").val(),
			hiddenName: "declareGoodsList[!{index}].quantity"
		},
		{
			name:"quantityUnit",
			value:$("#quantityUnit_goods").val(),
			hiddenName: "declareGoodsList[!{index}].quantityUnit"
		},
		{
			name:"unitPrice",
			value:$("#unitPrice_goods").val(),
			hiddenName: "declareGoodsList[!{index}].unitPrice"
		},
		{
			name:"sum",
			value:$("#sum_goods").val(),
			hiddenName: "declareGoodsList[!{index}].totalPrice"
		},
		{
			name:"currency",
			value:$("#currency_goods").val(),
			hiddenName: "declareGoodsList[!{index}].currency"
		},
		{
			name:"dutyMode",
			value:$("#dutyMode_goods").val(),
			hiddenName: "declareGoodsList[!{index}].dutyMode"
		},
		{
			name:"extraNo",
			value:$("#extraNo_goods").val(),
			hiddenName: "declareGoodsList[!{index}].extraNo"
		},
		{
			name:"goodsVersion",
			value:$("#goodsVersion_goods").val(),
			hiddenName: "declareGoodsList[!{index}].goodsVersion"
		},
		{
			name:"goodsNo",
			value:$("#goodsNo_goods").val(),
			hiddenName: "declareGoodsList[!{index}].goodsNo"
		},
		{
			name:"use",
			value:$("#use_goods").val(),
			hiddenName: "declareGoodsList[!{index}].use"
		},
		{
			name:"model",
			value:$("#model_goods").val(),
			hiddenName: "declareGoodsList[!{index}].model"
		},
		{
			name:"firstQuantity",
			value:$("#firstQuantity_goods").val(),
			hiddenName: "declareGoodsList[!{index}].firstQuantity"
		},
		{
			name:"firstUnit",
			value:$("#firstUnit_goods").val(),
			hiddenName: "declareGoodsList[!{index}].firstUnit"
		},
		{
			name:"secondQuantity",
			value:$("#secondQuantity_goods").val(),
			hiddenName: "declareGoodsList[!{index}].secondQuantity"
		},
		{
			name:"secondUnit",
			value:$("#secondUnit_goods").val(),
			hiddenName: "declareGoodsList[!{index}].secondUnit"
		},
		{
			name:"processingCharges",
			value:$("#processingCharges_goods").val(),
			hiddenName: "declareGoodsList[!{index}].processingCharges"
		},
		{
			name:"declareGoodsId",
			value:"",
			hiddenName: "declareGoodsList[!{index}].declareGoodsId"
		}
	]);
	sum();
	$("#qp2").find(".e_ipt1").val("");
	
	//$("#goodsName_goods").focus().select();
}
function addCtn() {
	if(!$("#containerNo").val()) return;
	var val = +$("input[name=ctn_no]").val()
	if(val) {
		var row = $("#qp3_table_view").find(".tableView_row[index="+(val-1)+"]");
		$.each($(".e_ipt2"), function(){
			var name = $(this).attr("name");
			var item = row.find(".tableView_cell[field="+name+"]");
			item.find(".text_inner").text($(this).val())
			.end()
			.find("input[type=hidden]").val($(this).val())
		});
		table2.data[(val-1)] = [
		{
			name:"ctn_no",
			value:val,
			hiddenName: "declareCtnList["+(val-1)+"].ctn_no"
		},
		{
			name:"containerNo",
			value:$("#containerNo").val(),
			hiddenName: "declareCtnList["+(val-1)+"].containerNo"
		},
		{
			name:"containerSize",
			value:$("#containerSize").val(),
			hiddenName: "declareCtnList["+(val-1)+"].containerSize"
		},
		{
			name:"containerWeight",
			value:$("#containerWeight").val(),
			hiddenName: "declareCtnList["+(val-1)+"].containerWeight"
		},
		{
			name:"declareCtnId",
			value:"",
			hiddenName: "declareCtnList["+(val-1)+"].declareCtnId"
		}
	]
		countTEU();
		$("#qp3").find("input[type=text]").val("");
		$("#qp3_table_view").find(".tableView_row").removeClass("ui-selected");
		return false;
	}
	table2.append([
		{
			name:"ctn_no",
			value:"!{index}",
			hiddenName: "declareCtnList[!{index}].ctn_no"
		},
		{
			name:"containerNo",
			value:$("#containerNo").val(),
			hiddenName: "declareCtnList[!{index}].containerNo"
		},
		{
			name:"containerSize",
			value:$("#containerSize").val(),
			hiddenName: "declareCtnList[!{index}].containerSize"
		},
		{
			name:"containerWeight",
			value:$("#containerWeight").val(),
			hiddenName: "declareCtnList[!{index}].containerWeight"
		},
		{
			name:"declareCtnId",
			value:"",
			hiddenName: "declareCtnList[!{index}].declareCtnId"
		}
	]);
	countTEU();
	$("#qp3").find(".qp_key_ipt").val("");
}
function addAtt(){
	var val = +$("input[name=att_no]").val()
	if(val) {
		var row = $("#qp4_table_view").find(".tableView_row[index="+(val-1)+"]");
		$.each($(".e_ipt3"), function(){
			var name = $(this).attr("name");
			var item = row.find(".tableView_cell[field="+name+"]");
			item.find(".text_inner").text($(this).val())
			.end()
			.find("input[type=hidden]").val($(this).val())
		});
		table3.data[(val-1)] = [
		{
			name:"att_no",
			value:val,
			hiddenName: "declareDocList["+(val-1)+"].att_no"
		},
		{
			name:"docAttachedCode",
			value:$("#docAttachedCode").val(),
			hiddenName: "declareDocList["+(val-1)+"].docAttachedCode"
		},
		{
			name:"docAttachedNo",
			value:$("#docAttachedNo").val(),
			hiddenName: "declareDocList["+(val-1)+"].docAttachedNo"
		},
		{
			name:"declareDocId",
			value:"",
			hiddenName: "declareDocList["+(val-1)+"].declareDocId"
		}
	]
		$("#qp4").find("input[type=text]").val("");
		$("#qp4_table_view").find(".tableView_row").removeClass("ui-selected")
		return false;
	}
	table3.append([
		{
			name:"att_no",
			value:"!{index}",
			hiddenName: "declareDocList[!{index}].att_no"
		},
		{
			name:"docAttachedCode",
			value:$("#docAttachedCode").val(),
			hiddenName: "declareDocList[!{index}].docAttachedCode"
		},
		{
			name:"docAttachedNo",
			value:$("#docAttachedNo").val(),
			hiddenName: "declareDocList[!{index}].docAttachedNo"
		},
		{
			name:"declareDocId",
			value:"",
			hiddenName: "declareDocList[!{index}].declareDocId"
		}
	]);
	$("#qp4").find(".qp_key_ipt").val("");
}
function checkIpt(index) {
	var ipt = $(".qp_key_ipt").eq(index),
		openDialog = ipt.attr("opendialog"),
		jump = ipt.data("jump"),
		enter = ipt.data("jump-enter");
	if(jump) {
		$("#"+jump).focus().select();
		if(jump=="goodsName_goods") {
			addGoods();
		} else if(jump=="containerNo") {
			addCtn();
		} else if(jump=="docAttachedCode") {
			addAtt();
		}
	}
	if(enter) {
		$("#"+enter).focus().select();
	}

	if(openDialog) {
		$("#"+openDialog).dialog("open");
		if(openDialog == "search-dialog"){
			$("#hscode_search_content").val($("#hsCode_goods").val());
			//$("#search-dialog").dialog("open");
			if($("#hscode_search_content").val() != "")hscode_search(1);
		}else if(openDialog == "search-name-dialog"){
			$("#hsCode_goods").focus();
		}else if(openDialog == "search-arrivePort-dialog" && $("#arrivedPort_v").val().indexOf(" ") <= 0){
			$("#arrivePort_search_content").val($("#arrivedPort_v").val());
			//$("#search-arrivePort-dialog").dialog("open");
			if($("#arrivePort_search_content").val() != "")arrivePort_search(1);
		}else if(openDialog == "company-record-dialog"){
			$("#companyRecord_search_content").val($("#businessCompanyCode").val());
			//$("#company-record-dialog").dialog("open");
			$("#companyRecord_type").val("1")
			companyRecord_search(1);
		}else if(openDialog == "company-record-dialog-2"){
			$("#companyRecord_search_content").val($("#businessCompanyCode").val());
			//$("#company-record-dialog").dialog("open");
			$("#companyRecord_type").val("2")
			companyRecord_search(1);
		} else if(openDialog == "transactionMode") {
			
		}
	}
}
function checkKey(cursor) {

	/*switch(cursor) {
		case 36:
		case 55:
			itemFocus(52);
		break;
		case 52:
			
			itemFocus(38);
		break;
		case 57:
			itemFocus(55);
		break;
	}*/
}
function keyDownHandler(e) {
	var keyCode = e.keyCode;
	if(e.ctrlKey && keyCode==13) {
		if(inGoods) {
			addGoods();
		} else if(inCtn) {
			addCtn();
		} else if(inAtt) {
			addAtt();
		}
		return false;
	}
	switch(keyCode) {
		case 13:
		case 39:
			cursor < $key.length-1 && cursor++;
			itemFocus(cursor);
			if(keyCode==13) {
				checkIpt(cursor, e);
			}
			e.preventDefault();
		break;
		case 37:
			cursor > 0 && cursor--;
			itemFocus(cursor);
			e.preventDefault();
		break;
	}	
}

$("#form1").on("keydown", ".qp_key_ipt", keyDownHandler);

$(".dec-nav").on("click", "a", function(){
	var $index = $(".dec-nav").find("a").index(this);
	if($index==1) {
		var nums = $("#packagesNum").val();
		var price = $("#price_total .t_price").text();
		var cnName = $("#businessCompany").val();
		$("#numbers_2").val(nums);
		$("#price_2").val(price);
		$("#businessCompany_2").val() || $("#businessCompany_2").val(cnName);
	}
	$(".dec-nav").find("a").removeClass("active");
	$(this).addClass("active");
	$(".dec-panel").hide();
	$(".dec-panel").eq($index).show();
})