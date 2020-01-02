/**
  * 通用table封装
  * 配置信息说明：
  * {
  *    cols: 6, //列数
  *    headers: [{ //列信息 
  *      key:'',
  *      title: '',
  *      align:'center',//left,right
  *      formatter: function(val, item, idx)
  *    }...],
  *    checkbox: false, //是否可选择
  *    pagenation: true, //是否展示分页信息
  *    tableId: '', //表格
  *    width: [20%, 20px, ...], //列宽
  *    url: 'http://xxxx', //数据请求url
  *    method: 'POST',
  *    params: {}, //数据请求的参数
  *    actions: [{name: 'xxx', //操作类型，比如add/del/view
  *      title: 'xxx', //操作展示名称
  *      func: function}...], //操作内容
  *    pagesize: 10,
  *    pagechange: function() //页码发生变化时提示。
  *    data: [] //数据对象,二维数组,查看的时候用的
  *    simplealign:['right','left'], 如果是简单的表格，设置表格内容对齐方式
  *    key: 主键
  *  }
  */
(function($) {
	var _buildPageNation = function(currPage, totalPage) {
		var html = '<ul class="pagination" style="float: right;">';
		if(totalPage > 8) {
			html += '  <li>' + 
			'	<a data-page="prev" ' + ((currPage == 1)?'class="disable"':'') + '>上一页</a>' + 
			'  </li>';
			if(currPage < 5) {
				for(var i = 1; i < 6; i++){
					if(i == currPage) {
						html += '<li><a class="active" data-page="'+i + '">'+i+'</a></li>';
					} else {
						html += '<li><a data-page="'+i + '">'+i+'</a></li>';
					}
				}
				html+= '<li><a data-page="...">...</a></li><li><a data-page="'+totalPage + '">'+totalPage+'</a></li>';
			} else if(currPage < totalPage - 3) {
				for(var i = currPage - 2; i< currPage + 3; i++) {
					if(i == currPage) {
						html += '<li><a class="active" data-page="'+i + '">'+i+'</a></li>';
					} else {
						html += '<li><a data-page="'+i + '">'+i+'</a></li>';
					}
				}
				html+= '<li><a data-page="...">...</a></li><li><a data-page="'+totalPage + '">'+totalPage+'</a></li>';
			} else {
				html += '<li><a data-page="1">1</a></li><li><a data-page="...">...</a></li>';
				for(var i = totalPage - 4; i <= totalPage; i++){
					if(i == currPage) {
						html += '<li><a class="active" data-page="'+i + '">'+i+'</a></li>';
					} else {
						html += '<li><a data-page="'+i + '">'+i+'</a></li>';
					}
				}
			}
			html += '  <li><a data-page="next" ' + ((currPage == totalPage)?'class="disable"':'') + 
					'>下一页</a></li>';
		} else {
			for(var i = 1; i <= totalPage; i++) {
				if(i == currPage) {
					html += '<li><a class="active" data-page="'+i + '">'+i+'</a></li>';
				} else {
					html += '<li><a data-page="'+i + '">'+i+'</a></li>';
				}
			}
		}
		html += '</ul>';
		return html;
	},
//	_buildPageSize = function(pageSize) {
//		var html = '<div class="col-lg-3 column">' + 
//		'	<span>每页显示记录</span>' + 
//		'	<select id="page-size"  class="input-mini" >';
//		for(var idx in pageSize ){
//			html += '<option>' + pageSize[idx] + '</option>';
//		}
//		html += '	</select><span>页</span></div>';
//		return html;
//	},	
	_initFooter = function(currPage, totalPage, pageSize, objId) {
		var html = 
		'	<div class="row">' +
		'		<div class="col-xs-12" aria-label="Page navigation"><div class="page-jump" style="float:right;margin-left:30px">' +
		'			<span>共' + totalPage + '页　 </span>' +
		'			<span>到第</span>' +
		'			<input type="text" id="'+objId+'-page-num" class="input" ></input>' + 
		'			<input type="hidden" id="'+objId+'-page-curr" value="' + currPage + '" ></input>' + 
		'			<span>页</span>' +
		'			<a class="btn btn-primary btn-xs btn-go">GO</a>' + 
		'		</div>' + _buildPageNation(currPage, totalPage) +
		'		</div>' 
		'	</div>';
		
		return html;
	},
	_initHeader = function(headers, actions, width, checkbox) {
		var html = '<thead><tr>';
		if(checkbox) {
			html += "<th width='40'><input class='td-check' type='checkbox' /></th>";
		}
		for(var idx in headers) {
			var header = headers[idx];
			//var align = typeof(header.align) != 'undefined' ?  header.align : "center";
			html += '<th ' + (typeof(width[idx]) != 'undefined' ? 'width="' + width[idx] +'"' : '') + 'style="text-align:center">' + header.title + '</th>';
		}
		if(typeof(actions) != 'undefined') {
			html += '<th class="th-action">操作</th>';
		}
		html += '</tr></thead>';
		return html;
	},
	_buildTableBody = function(tableData, headers, actions, checkbox) {
		var html = "";
		for(var idx in tableData) {
			var val = tableData[idx];
			tableData[idx]["idx"] = idx;
			if(idx % 2 == 0) {
				html += '<tr class="odd">';
			} else {
				html += '<tr class="even">';
			}
			if(checkbox) {
				html += "<td><input class='td-check' type='checkbox' data-idx='" + idx + "'";
				if(val['check']){
					html += "checked";
				}
				if(val['disable']){
				html += " disabled";
				}
				html += " /></td>";
			}
			for(var idxH in headers) {
				var header = headers[idxH];
				var keyValue = val[header.key];
				var align = typeof(header.align) != 'undefined' ?  header.align : "center";
				if(typeof(keyValue) == 'undefined' || keyValue == null) {
					keyValue = "";
				}
				if(typeof(header["formatter"]) == "function"){
					html += '<td style="text-align:'+ align +'">' + header["formatter"](keyValue, val, idxH) + '</td>';
				} else {
					html += '<td style="text-align:'+ align +'">' + keyValue + '</td>'; 
				}
			}
			if(typeof(actions) != 'undefined') {
				html += '<td>';
				for(var idxA in actions) {
					var action = actions[idxA];
					if(!action.hidden){
						html += '<a class="btn btn-link btn-'+action.name + 
					     '" data-idx="'+idx+'">'+action.title+'</a>';
					}
				}
				html += '</td>';
			}
			html += '</tr>';
		}
		return html;
	},
	_buildSimpleDataTableBody = function(tableData, col, width,align) {
		var html = "";
		var hasWidth = (typeof(width) == 'undefined');
		for(var idx in tableData) {
			var val = tableData[idx];
			if(idx % 2 == 0) {
				html += '<tr class="odd">';
			} else {
				html += '<tr class="even">';
			}	
			for(var i = 0; i < col; i++) {
				//var header = headers[idxH];
				html += '<td style="text-align:' + align[i] + '"';
				if(!hasWidth) {
					html += '  width="'+width[i]+'"';
				}
				html += '>' + val[i] + '</td>'; 
			}
			html += '</tr>';
		}
		return html;
	};

	$.fn.table = {
		init: function(obj, op) {
			var _setting = op;
			var selectedItems = [];
			_setting.obj = obj;
			_setting.pagesize = _setting.pagesize || [10, 20, 30];
			_setting.method = _setting.method || 'POST';
			_setting.width = _setting.width || [];
			_setting.pageSize = _setting.pageSize || 10;
			_setting.checkbox = _setting.checkbox || false;
			_setting.params = _setting.params || {};
			if(typeof(_setting.pagenation) == 'undefined') {
				_setting.pagenation = true;
			}
			if(typeof(_setting.data) != 'undefined') {
				_setting.pagenation = false;
				_setting.simpleData = true;
				if(typeof(_setting.width) == 'undefined'){
					_setting.width = ["30%","70%"];
				}
				if(typeof(_setting.simplealign) == 'undefined'){
					_setting.simplealign = ["right","left"];
				}
			} else {
				_setting.simpleData = false;
			}
			 
			var html = '<div class="container-fluid" style="padding-left:0px;padding-right:0px;"><div class="row"><div class="col-xs-12 column" style="overflow: auto;"><table class="table table-hover " id="' + 
				_setting.tableId + '">';
			if(!_setting.simpleData && typeof(_setting.headers) != 'undefined') { 
				html = '<div class="container-fluid" style="padding-left:0px;padding-right:0px;"><div class="row"><div class="col-xs-12 column" style="overflow: auto;"><table class="table table-hover ellipsis-table" id="' + 
				_setting.tableId + '">';
				html += _initHeader(_setting.headers, _setting.actions, _setting.width, _setting.checkbox);
			}
			html += '<tbody>';
			if(_setting.simpleData) {
				
				html += _buildSimpleDataTableBody(_setting.data, _setting.cols,_setting.width,_setting.simplealign);
			}
			html += '</tbody>';
			html += '</table></div></div>';
			if(_setting.pagenation){
				html += '<div class="row"><div class="col-xs-12 column table-footer">';
				html +=  '</div></div>';
			}
			html += '</div>';
			obj.html(html);
			var currPage = getPageCacheById(obj.attr('id')+'-page-curr');
			if(!currPage) {
				currPage = 1;
			}
			var zTable = {
				setting: _setting,
				tableData: [],
				pageInfo: {},
				currPage:  currPage,
				totalPage: 0,
				totalNum: 0,
				initParam: true,
				qryParams: _setting.params,
				selectedItems:[],
				setParam: function(params) {
					if(params != null){
						for (var key in params) {
							this.qryParams[key] = params[key];
						}
						if(this.initParam){
							this.initParam = false;
						} else {
							this.currPage = 1;
						}
					}
				},
				setData:function(data) {
					var that = this;
					for(var i = 0; i < data.length; i++) {
						if(that.selectedItems.length > 0){
							for(var j = 0; j < that.selectedItems.length; j++){
								if(data[i][_setting.key] == that.selectedItems[j][_setting.key]){
									data[i].check = true;
								}
							}
						}
					}
					that.tableData = data;
					for (var i = 0; i < that.tableData.length; i++) {
					   var element = that.tableData[i]
				       for (var key in that.tableData[i]) {
						   if (typeof(that.tableData[i][key]) == 'undefined' || that.tableData[i][key] == null) {
                            that.tableData[i][key]="";
						   }
					   }
					}
					obj.find("table tbody").html(_buildTableBody(that.tableData, _setting.headers, _setting.actions, _setting.checkbox));
					obj.find("td").each(function(){	
						if($(this)[0].scrollWidth > $(this)[0].offsetWidth){							
							  $(this).attr("title",$(this).text());
							  $(this).css("cursor","pointer");
						}						   
					})
				},
				load: function() { //加载数据
					if(_setting.simpleData){
						return;
					}
					var that = this;	
					that.setSelected();				
					this.qryParams.pageNum = that.currPage;
					this.qryParams.pageSize = this.setting.pageSize; 
					if(!_setting.url){
						that.tableData = [];
						that.setData(that.tableData);
						return
					}
					callApi(_setting.url, that.qryParams, _setting.method, function(resp){
						that.tableData = resp.data.items;
						if(!resp.data.items){
							that.tableData = resp.data;
						}
						that.setData(that.tableData);
						//分页信息初始化
						that.currPage = resp.data.currentPage;
						that.totalPage = resp.data.totalPage;
						that.totalNum = resp.data.totalNum; 
						if(_setting.pagenation && that.totalPage && that.totalPage > 1){
							var pageHtml = _initFooter(that.currPage, that.totalPage, _setting.pagesize, _setting.obj.attr('id'));
							obj.find(".table-footer").html(pageHtml);
						} else {
							obj.find(".table-footer").html('');
						}
						//判断是否能勾选全部选中按钮
						if(_setting.checkbox){
							var selectedItems = that.getAllSelected();
							var selectedCount = 0;
							for(var i = 0; i < that.tableData.length; i++){
								for(var j = 0; j < selectedItems.length; j++){
									selectedCount += that.tableData[i][_setting.key] == selectedItems[j][_setting.key] ? 1 : 0;
								}
							}
							if(selectedCount == _setting.pageSize){
								$('th .td-check').prop("checked", true);
							} else {
								$('th .td-check').prop("checked", false);
							}
						}
					}); 
				},
                bindActionEvent: function() {
					var zt = this;
                    $(zt.setting.actions).each(function(){
                        var that = this;
                        obj.on('click', '.btn-' + that.name, function(e){
                            if(typeof(that.func) == 'function'){
                                that.func(zt.tableData[$(this).attr('data-idx')]);
                            }
                        });
                    });
                },
				goToPage: function(page) {
					var tPage = page;
					if(page > this.totalPage) {
						tPage = this.totalPage;
					} else if(page < 1) {
						tPage = 1;
					} else {
						tPage = page;
					}
					// 页发生变化
					if(tPage != this.currPage) {
						this.currPage = tPage;
						this.qryParams.pageNum = this.currPage;
						this.qryParams.pageSize = this.setting.pageSize;
						if(typeof(this.setting.pagechange) == 'function'){
							this.setting.pagechange(tPage);
						}
						this.load();
					}
				},
				getSelected: function() {//当前页选择数据
					var items = [], result = [], objt = {};
					var checks = obj.find("td :checked");
					for(var i = 0; i < checks.length; i++) {
						items.push(this.tableData[$(checks[i]).attr('data-idx')]);
					}
					return items;
				},
				setSelected: function() {//翻页，重新查询时将选择数据添加到selectedItems
					var that = this;
					var checkbox = that.setting.checkbox;
					var curSelectedItems = that.getSelected();
					if(checkbox && curSelectedItems.length > 0){
						that.selectedItems = that.selectedItems.concat(curSelectedItems);
					}
//					console.log(curSelectedItems)
//					console.log(curSelectedItems.length == _setting.pageSize)
//					if(curSelectedItems.length == _setting.pageSize){
//						$("th .td-check").prop("checked", true);
//					} else {
//						$("th .td-check").prop("checked", false);
//					}
				},
				getAllSelected: function() {//所有页选择数据
					var that = this;
					var curSelectedItems = that.getSelected();
					var selectedItems = that.selectedItems;
					if(curSelectedItems.length > 0){
						selectedItems = selectedItems.concat(curSelectedItems);
					}
					var uniqueSelectedItems = that.uniqueArray(selectedItems);
					
					that.selectedItems = uniqueSelectedItems;
					return uniqueSelectedItems;
				},
				uniqueArray: function(arr) {
					var result = [], objt = {}
					if(arr.length > 0){
						for(var i = 0; i < arr.length; i++){
							if(!objt[arr[i][_setting.key]]){
								result.push(arr[i]);
								objt[arr[i][_setting.key]] = true;
							}
						}						
					}
					return result;
				}
			};
				
			if(_setting.checkbox){
				var selectedItems = [];
				
			}
			//翻页按钮绑定
			obj.on("click", ".pagination a", function(e){
				var dataPage = $(this).attr("data-page");
				if(dataPage == "..."){
					return;
				}
				var page = zTable.currPage;
				
				if(dataPage == "more"){
					return;
				} else if(dataPage == "prev") {
					page -= 1;
				} else if(dataPage == "next") {
					page += 1;
				} else {
					page = dataPage;
				}
				zTable.goToPage(page);
			});
			
			//跳转
			obj.on("click", ".btn-go", function(e) {
				var objId = _setting.obj.attr('id');
				if(!obj.find("#"+objId+"-page-num").val()){
					$("#"+objId+"-page-num").focus();
					return
				}
				if(CheckNumber($("#"+objId+"-page-num"))){
					$("#"+objId+"-page-num").val("");
					$("#"+objId+"-page-num").focus();
					return
				}
				zTable.goToPage(obj.find("#"+objId+"-page-num").val());
			});
			
			//全选
			obj.on("change", "th .td-check", function(e){
				var isCheck = $(this).prop("checked");
				$("td .td-check").each(function(){
				    if(!$(this).prop('disabled')){				    
				    	$(this).prop('checked',isCheck); 
				    }
				});
				var currentSelected = zTable.getSelected();
				var allSelected = zTable.getAllSelected();
				
				var currentTableData = zTable.tableData;
				var allData = zTable.getAllSelected();
				if(!isCheck){
					for(var i = 0; i < currentTableData.length; i++){
						for(var j = 0; j < allData.length; j++){
							if(currentTableData[i][_setting.key] == allData[j][_setting.key]){
								allData.splice(j, 1);
								j--;
							}
						}
					}
					zTable.selectedItems = allData;
				}
				var allSelected = zTable.getAllSelected();
			});
			
			// 单选
			obj.on("change", "td .td-check", function(e){
				var idx = e.currentTarget.getAttribute("data-idx");	
				var currentRowData = zTable.tableData[idx];
				var isCheck = $(this).prop("checked");
				var currentSelect = zTable.getSelected();
				var allData = zTable.getAllSelected();
				if(currentSelect.length == _setting.pageSize){
					$('th .td-check').prop("checked", true);
				} else {
					$('th .td-check').prop("checked", false);
				}
				if(isCheck){
					
				} else {
					var result = [];
					for(var i = 0; i < allData.length; i++){
						if(allData[i][_setting.key] != currentRowData[_setting.key]){
							result.push(allData[i]);
						} 	
					}
					zTable.selectedItems = result;
				}
			})
			
			zTable.bindActionEvent();

			return zTable;
		}
	};
	// filter 兼容IE8
	/*if(!Array.prototype.filter){
		Array.prototype.filter = function(fun , thisArg ){
			"use strict";
			
			if(this === void 0 || this === null)
				throw new TypeError();
			var t = Object(this);
			var len = t.length >>> 0;
			if(typeof fun != "function")
				throw new TypeError();
			
			var res = [];
			var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
			for(var i = 0; i < len; i++){
				if(i in t){
					var val = t[i];
					if(fun.call(thisArg, val, i, t))
						res.push(val);
				}
			}
			return res;
		}
	}*/
})(jQuery)
