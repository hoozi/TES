;(function($){
	function TableView(container) {
		this.container = container;
		this.data = [];
		this.fields = [];
		this.tableView = {};
		this.appendCount = 0;
	}
	TableView.prototype = {
		fields: [],
		init: function(options){
			this.setOptions(options)
			this.tableViewOptions();
			this.createTable();
			this.fixed();
			this.handler();
			this.contextmenu();
			this.opts.resize && this.resize();
			this.opts.select && this.select();
		},
		tableViewOptions: function() {
			var _this = this, container = $(this.container), options = container.find(".table_options_item");
			this.tableView["len"] = options.length, this.tableView["base"] = [], this.tableView["tbody"] = {};
			options.each(function(){
				var $this = $(this),
					w = $this.attr("colWidth"),
					name = $this.attr("fieldName"),
					text = $this.text(),
					align = $this.attr("headerAlign");
				_this.tableView["base"].push({width:w, name:name, text:text, align:align?align:"thead_left"});
				_this.tableView["tbody"][name] = [];
			});
			options
			.parents(".table_options")
			.remove()
			options = null;

		},
		setOptions: function(options) {
			this.opts = $.extend({}, true, {
				select: true,
				resize: true,
				minWidth: 50,
				focusItem: null
			}, options);
		},
		createTable: function(){
			var container = $(this.container),
				_this = this,
				table = '<div class="tableView_head">\
							<table cellpadding="0" cellspacing="0" border="0" class="tableView_head_table table-fixed" style="width:!{total}px">\
								<tr style="height:0px;" class="tableView_thead">!{width}</tr>\
								<tr>!{thead}</tr>\
							</table>\
							<div class="tableView_shim"></div>\
						</div>\
						<div class="tableView_body">\
							<table cellpadding="0" cellspacing="0" border="0" class="tableView_body_table table-fixed" style="width:100%">\
								<thead>\
									<tr style="height:0px;">!{width}</tr>\
								</thead>\
								<tbody class="tableView_add"></tbody>\
							</table>\
						</div>',
				theadOptions = _this.tableView["base"],
				tableHtml = "";
			var createHead = function() {
					var width = '<td id-at="!{id}" style="margin:0;padding:0;border:0;width:!{colWidth}px;height:0px;"></td>',
						theadItem = '<td id-for="!{id}" class="thead_item_wrap" fileName="!{fileName}"><div class="thead_item !{align} tableView_col_inner">\
								<div class="tableView_text">!{text}</div>\
								<span class="tableView_resize"></span>\
							</div>\
						</td>',
						colWidth = "",
						item = "",
						totalWidth = 0;
				$.each(theadOptions, function(i) {
					colWidth+=_this.render(width, {
						id: i+1,
						colWidth: this["width"]
					});
					totalWidth+=+this["width"]; 
				});
				$.each(theadOptions, function(i) {
					item+=_this.render(theadItem, {
						id: i+1,
						text: this["text"],
						fileName: this["name"],
						align: this["align"] == "center" ? "thead_center" : "thead_left"
					});
				});
				return {
					colWidth: colWidth,
					totalWidth: totalWidth,
					item: item
				}
			}
			var head = createHead();
			tableHtml = this.render(table, {
				total: head.totalWidth,
				width: head.colWidth,
				thead: head.item
			});
			container.html(tableHtml);
		},
		setCount: function(count) {
			this.appendCount = count;
		},
		getCount: function() {
			return this.appendCount;
		},
		append: function(data,action) {
			var _this = this,
				container = $(this.container),
				tr = '<tr class="tableView_row" index=!{trIndex}>!{td}</tr>',
				td = '<td field-for=!{fieldName} index=!{tdIndex}>\
						<div class="tableView_col_inner tableView_cell" field=!{fieldName}>\
							<div class="tableView_text txt-ell">\
								<span class="text_inner">!{text}</span>\
								<input type="hidden" name="!{hiddenName}" value="!{text}"/>\
							</div>\
						</div>\
					</td>',
				trHtml = "";
			data && this.data.push(data)
			$.each(this.data, function(i){
				var tdHtml = "";
				action=="copy" && _this.parse(this);
				$.each(this, function(j){
					tdHtml+= _this.render(td, {
						index: j,
						tdIndex:i+"-"+j,
						fieldName: this["name"],
						text: /\!\{index\}/g.test(this["value"]) ? (i+1) : this["value"],
						hiddenName: this["hiddenName"].replace(/\!\{index\}/g, i)
					});
					//_this.tableView["tbody"][this["name"]].push(this["value"]);
				});
				trHtml+= _this.render(tr, {
					trIndex: i,
					td: tdHtml
				});
			});
			container.find(".tableView_add").html(trHtml);
			if(action!="copy") {
				this.toBottom();
			}
			//this.appendCount++;
		},
		toBottom: function(){
			var container = $(this.container), 
			body = container.find(".tableView_body");
			body.scrollTop(body[0].scrollHeight)
		},
		deleteItem: function(i) {
			var container = $(this.container),
				selected = container.find("tr.ui-selected"),
				len = selected.length;
			this.data.splice(i,1);
			selected.remove();
			this.append();
			sum();
		},
		copyItem: function(i){
			if(this.data.length>=20) {
				alert("最多20条!");
				return false;
			}
			this.data.splice(this.data.length,0,this.data[i]);
			this.append(null, "copy");
			sum()
		},
		parse: function(data) {
			$.each(data, function(i, v){
				if(!/\!\{index\}/g.test(data[i]["hiddenName"])) {
					data[i]["hiddenName"] = data[i]["hiddenName"].replace(/\[\d+\]/g, "[!{index}]");
					if(data[i]["name"]=="goodsSeq") {
						data[i]["value"]="!{index}"
					}
				}
			})
		},
		contextmenu: function(){
			var container = $(this.container),
				_this = this,
				addTable = container.find(".tableView_body"),
				el = $(_this.opts.focusItem), parent = el.parents(".hotKey_wrap");
			addTable.on("contextmenu", function(e){
				//if(!container.find(".ui-selected").length) return;
				$(".tableView_menu").remove();
				var hasSelected = container.find(".ui-selected").length;
				var menu = $("<div class='tableView_menu'><a href='javascript:;' class='tableView_del' title='删除'>删除</a>"+(_this.opts.copy?"<a href='javascript:;' class='tableView_copy' title='复制'>复制</a>":"")+"<a href='javascript:;' class='tableView_add' title='新增'>新增</a></div>")
				.appendTo($("body"));
				!container.find(".tableView_row").length && ($(".tableView_del").hide(),$(".tableView_copy").hide())
				menu.css({
					left:e.pageX,
					top: e.pageY
				})
				menu.on("click", ".tableView_del", function(e){
				console.log(hasSelected)
					if(!hasSelected) {
						alert("请先单击选择需要删除的数据！");
						$(".tableView_menu").remove();
						return false;
					}
					if(confirm("是否删除这些数据？")) {
						_this.deleteItem(container.find(".ui-selected").index());
						parent.find("input[type=text]").val("");
						$(".tableView_menu").remove();
						_this.opts.del && _this.opts.del.call(null,container.find(".ui-selected").index())
					}
					//e.stopPropagation();
				}).on("click", ".tableView_add", function(e) {
					el.focus().select();
					parent.find("input[type=text]").val("");
				}).on("click", ".tableView_copy", function(e) {
					if(!hasSelected) {
						alert("请先单击选择需要复制的数据！");
						$(".tableView_menu").remove();
						return false;
					}
					_this.copyItem(container.find(".ui-selected").index())
				});
				return false;
			});
			$(document).on("click", function(){
				$(".tableView_menu").remove();
			})
		},
		render: function(templ, data) {
			for(var k in data) {
				templ=templ.replace(new RegExp("\\!\\{"+k+"\\}","g"), data[k]);
			}
			return templ	
		},
		resize: function(selector) {
			var _this = this,
				container = $(this.container),
				minWidth = this.opts.minWidth,
				resizable = container.find(".tableView_resize"),
				//headTable = container.find(".tableView_head_table"),
				body = container.find(".tableView_body"),
				bodyTable = container.find(".tableView_body_table");
			resizable.draggable({
				axis: "x",
				start: start,
				drag: drag,
				stop: stop
			});
			function start(e, ui) {
				var el = ui.helper, parent = el.parents(".thead_item_wrap");
				$("<div class='tableView_proxy'></div>").appendTo(container).css({
					width:parent.width(),
					left:parent.position().left-parent.parents(".tableView_head").scrollLeft()
				});
			}
			function drag(e, ui) {
				var w = ui.position.left < minWidth ? minWidth : ui.position.left;
				container.find(".tableView_proxy").css({
					width:w
				});
			}
			function stop(e, ui){
				var el = ui.helper, parent = el.parents(".thead_item_wrap"), 
					proxy = container.find(".tableView_proxy"),
					headTable = container.find(".tableView_head_table"), 
					w = totalWidth = 0;
				if(minWidth > ui.position.left+3) {
					el.css("left",minWidth-3);
					w = minWidth;
				} else {
					w = ui.position.left+3;
				}
				proxy.remove();
				container.find("td[id-at="+parent.attr('id-for')+"]").width(w);
				headTable.css("width","100%").css("width", _this.getTotal());
				body.scrollLeft(body.scrollLeft()-1)
			}
		},
		getTotal: function(){
			var container = $(this.container);
			return container.find(".tableView_thead").width();
		},
		select: function() {
			/*var container = $(this.container),
				addTable = container.find(".tableView_add");
			addTable.selectable({
				cancel:".text_inner",
				selected: function( event, ui ) {
					event.stopPropagation();
					return false
				}
			})*/
		},
		fixed: function() {
			var container = $(this.container), 
			header = container.find(".tableView_head"),
			body = container.find(".tableView_body");
			body.on("scroll", function(){
				var $this = $(this), left = $this.scrollLeft();
				header.scrollLeft(left)
			})
		},
		handler: function(){
			var _this = this,
				container = $(this.container),
				bodyTable = container.find(".tableView_add");
			bodyTable.on("mouseenter mouseleave", ".tableView_row", function(e){
				var type = e.type;
				var el = $(this).find(".tableView_cell");
				if(type=="mouseenter") {
					$(this).addClass("tableView_row_hover");
					el.each(function(){
						var $this = $(this),
							field = $this.attr("field");
						_this.fields.push({
							el: field,
							value: $this.find("input[type=hidden]").val()
						});
					})
				} else {
					_this.fields = [];
					$(this).removeClass("tableView_row_hover");
				}
			}).on("click", ".tableView_row", function(e){
				$(this).siblings().removeClass("ui-selected");
				$(this).addClass("ui-selected");
				$.each(_this.fields, function(){
					$("input[name="+this.el+"]").val(this.value);
				})
			})

		},
		refresh: function(data) {
			var container = $(this.container);
			this.data = [];
			container.find(".tableView_add").children().remove();
		}
	}
	window.TableView = TableView;
})(jQuery)