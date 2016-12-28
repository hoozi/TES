
//ajax方式生成分页组件
//分页还需在页面上面创建层
//<div class="c_x_pages clearfix" >
	//<div class="pages clearfix fr" id="你指定的id"></div>
//</div>
//此id和ajaxLoadPage(data,id)中的id值要对应

function ajaxLoadPage(data,id){
	  
		var page = eval(data.page);

		$("#"+id).empty();
		
		//加入分页数据不等于0
		if(page.count!=0){
			
			if(page.hasPrePage == true){
				$("#"+id).append('<a href="###" class="prev" onclick="'+page.onClickFunction + '(' + Number(page.currentPage-1) +')">&lt;</a>');
			}

			if(page.endPage < 8){
				for ( var i = 0; i < page.endPage; i++) {
					if(page.currentPage == Number(i+1)){
						$("#"+id).append('<a href="###" onclick="'+page.onClickFunction + '(' + Number(i+1) +')" class="p_current"> '+ Number(i+1) +'</a>');
					}else{
						$("#"+id).append('<a href="###" onclick="'+page.onClickFunction + '(' + Number(i+1) +')"> '+ Number(i+1) +'</a>');
					}
				}
			}else{
				if(page.currentPage < 5){
					for ( var i = 0; i < 7; i++) {
						if(page.currentPage == Number(i+1)){
							$("#"+id).append('<a href="###" onclick="'+page.onClickFunction + '(' + Number(i+1) +')" class="p_current"> '+ Number(i+1) +'</a>');
						}else{
							$("#"+id).append('<a href="###" onclick="'+page.onClickFunction + '(' + Number(i+1) +')"> '+ Number(i+1) +'</a>');
						}
					}
					$("#"+id).append('<a href="###" onclick="'+page.onClickFunction+'(8)"> … </a>');
				}else if(page.currentPage > Number(page.endPage - 4)){
					$("#"+id).append('<a href="###" onclick="'+page.onClickFunction + '('+ Number(page.endPage - 7) +')"> … </a>');
					for ( var i = Number(page.endPage - 7); i < Number(page.endPage); i++) {
						if(page.currentPage == Number(i+1)){
							$("#"+id).append('<a href="###" onclick="'+page.onClickFunction + '(' + Number(i+1) +')" class="p_current"> '+ Number(i+1) +'</a>');
						}else{
							$("#"+id).append('<a href="###" onclick="'+page.onClickFunction + '(' + Number(i+1) +')"> '+ Number(i+1) +'</a>');
						}
					}
				}else{
					$("#"+id).append('<a href="###" onclick="'+page.onClickFunction + '('+ Number(page.currentPage - 4) +')"> … </a>');
					for ( var i = Number(page.currentPage - 4); i < Number(page.currentPage + 3); i++) {
						if(page.currentPage == Number(i+1)){
							$("#"+id).append('<a href="###" onclick="'+page.onClickFunction + '(' + Number(i+1) +')" class="p_current"> '+ Number(i+1) +'</a>');
						}else{
							$("#"+id).append('<a href="###" onclick="'+page.onClickFunction + '(' + Number(i+1) +')"> '+ Number(i+1) +'</a>');
						}
					}
					$("#"+id).append('<a href="###" onclick="'+page.onClickFunction+ '('+ Number(page.currentPage + 4) +')"> … </a>');
				}
			}
			
			if(page.hasNextPage == true){
				$("#"+id).append('<a href="###" class="next" onclick="'+page.onClickFunction + '(' + Number(page.currentPage+1) +')">&gt;</a>');
			}

			$("#"+id).append(
				'<div class="go fl">'+
					'<span>共 '+page.count+' 条 </span>'+
					'<span>到第  </span>'+
					'<input type="text" id="gotoPage'+id+'" class="page_num"/> 页'+
					' <input type="button" value="GO" onclick="'+ page.onClickFunction + '(document.getElementById(\'gotoPage'+id+'\').value)"/>'+
				'</div>'
			);
			
		}else{
			
			$("#"+id).append(
					'<div class="go fl">'+
						'<span><b>没有找到相关数据 </b></span>'+
					'</div>'
				);
			
		}
		
		

		
	}