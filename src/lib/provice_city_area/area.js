(function($) {

    //去掉传入ID中的#
    function getDomId(domId) {
        return domId.substring(1);
    }

    //初始化下拉框
    function initHtml(initOption) {
        var domSelect = initOption.domSelect;
        var domInit = initOption.domInit;

        var initHtmlModule = `<div class="gf-select" id="${getDomId(domSelect[0])}">
										<span><em>${domInit[0]}</em><i class="icon-jt"><input type="hidden" name="province" value=""/></i></span>
										<ul>
											<li data-value="0">${domInit[0]}</li>
										</ul>
									</div>
									<div class="gf-select" id="city">
										<span><em>${domInit[1]}</em><i class="icon-jt"><input type="hidden" name="city" value=""/></i></span>
										<ul>
											<li data-value="0">${domInit[1]}</li>
										</ul>
									</div>
									<div class="gf-select" id="area">
										<span><em>${domInit[2]}</em><i class="icon-jt"><input type="hidden" name="area" value=""/></i></span>
										<ul>
											<li data-value="0">${domInit[2]}</li>
										</ul>
									</div>`;
        return initHtmlModule;
    }

    //整理用户传入参数
    function getInitOption(option) {
        if (option == undefined || typeof option != "object") {
            return {
                domSelect: ["#province", "#city", "#area"],
                domInit: ["请选择省份", "请选择城市", "请选择区县"],
                errorElement: ".error-area",
                dataType: "name",
            }
        } else {
            if (option.domSelect == undefined || option.domSelect.length != 3) {
                option.domSelect = ["#province", "#city", "#area"];
            }
            if (option.domInit == undefined || option.domInit.length != 3) {
                option.domInit = ["请选择省份", "请选择城市", "请选择区县"];
            }
            if (option.errorElement == undefined) {
                option.errorElement = ".error-area";
            }
             if (option.dataType == undefined) {
                option.dataType = "name";
            }
            return option;
        }
    }


    function selectCity(options) {

        var opts = options;
        var $jsondata = {};
        var dataType = options.dataType == "id" ? "id" : "name";
       
        var provinceItemEvent = function() {
            var json = $jsondata;
            var item = ['<li  data-value="0" name="">' + opts.domInit[1] + '</li>'];
            var name = $(this).attr("name");
            if (name && name != "") {
                var data = json["city"][name];

                for (var i = 0; i < data.length; i++) {
                    item.push('<li data-value="' + data[i][dataType] + '" name="' + data[i]["id"] + '">' + data[i]["name"] + '</li>');
                }
                $(opts.domSelect[1]).find("ul").html(item.join("\n"));
            } else {
                $(opts.domSelect[1]).find("ul").html(item.join("\n"));
            }
            $(opts.domSelect[1]).find("ul li:first").trigger("click");
        }
        var cityItemEvent = function() {
            var json = $jsondata;
            var item = ['<li data-value="0" name="">' + opts.domInit[2] + '</li>'];
            var name = $(this).attr("name");
            if (name && name != "") {
                var data = json["district"][name];
                for (var i = 0; i < data.length; i++) {
                    item.push('<li data-value="' + data[i][dataType] + '" name="' + data[i]["id"] + '">' + data[i]["name"] + '</li>');
                }
                $(opts.domSelect[2]).find("ul").html(item.join("\n"));
            } else {
                $(opts.domSelect[2]).find("ul").html(item.join("\n"));
            }
            $(opts.domSelect[2]).find("ul li:first").trigger("click");
        }
        var initSelectEvent = function(json) {
                var item = ['<li data-value="0" name="">' + opts.domInit[0] + '</li>'];
                var data = json["province"];
                var initProvinVal = $(opts.domSelect[0]).find("input").val();
                var initCityVal = $(opts.domSelect[1]).find("input").val();
                var initAreaVal = $(opts.domSelect[2]).find("input").val();

                for (var i = 0; i < data.length; i++) {
                    item.push('<li data-value="' + data[i][dataType] + '" name="' + data[i]["id"] + '">' + data[i]["name"] + '</li>');
                }
                $(opts.domSelect[0]).find("ul").html(item.join("\n"));
                $jsondata = json;

                if (initProvinVal != "") {
                    $(opts.domSelect[0]).find("ul li[data-value='" + initProvinVal + "']").click();
                }

                if (initCityVal != "") {
                    $(opts.domSelect[1]).find("ul li[data-value='" + initCityVal + "']").click();
                }

                if (initAreaVal != "") {
                    $(opts.domSelect[2]).find("ul li[data-value='" + initAreaVal + "']").click();
                }
            }
            /*var ajaxConfig = {
            	url : "http://192.168.150.129:8888/user/js/lib/provice_city_area/allCity.js",
            	// url : "./js/lib/provice_city_area/allcity.js",
            	dataType : "jsonp",
            	jsonpCallback : "callback",
            	success :
            }*/
            //初始化加载插件
        initSelectEvent(areaData);
        // $.ajax(ajaxConfig);
        $(document).on("click", opts.domSelect[0] + " li", provinceItemEvent);
        $(document).on("click", opts.domSelect[1] + " li", cityItemEvent);
    }

    function comSelect(options) {
        $(document).on("click", ".gf-select > span", function() {
            $(this).closest(".gf-select").css("z-index", 100);
            $(".gf-select ul").hide();
            if ($(this).next("ul").children().length > 4) {
                $(this).next("ul").css({ "height": 154, "overflow": "auto" });
            } else {
                $(this).next("ul").css({ "height": "auto" });
            }
            $(this).next("ul").show();
        });
        $(document).on("click", ".gf-select > span > i", function() {
            var parent = $(this).closest("span").next("ul");
            parent.hide();
            return false;
        });
        $(document).on("click", ".gf-select ul li", function() {
            $(options.errorElement).hide();
            var parent = $(this).closest("ul");
            var select = $(this).closest(".gf-select");
            var value = $(this).attr("data-value");
            var text = $(this).text();
            if ($(this).closest(".gf-select").hasClass("noclick")) {
                parent.hide();
                return false;
            }
            select.css("z-index", 1);
            select.find("em").html(text);
            select.find("input[type='hidden']").val(value != 0 ? value : "");
            parent.hide();
        });
        $(document).on("click", function(e) {
            if ($(e.target).closest(".gf-select").length == 0) {
                $(".gf-select").css("z-index", 1);
                $(".gf-select ul").hide();
            }
        });
    }

    $.fn.selectArea = function(option) {
        //这里写插件所需要的代码
        var option = getInitOption(option);

        $this = $(this);
        console.log(option);
        console.log($this);
        $this.append(initHtml(option));

        selectCity(option);
        comSelect(option);
    }
})(jQuery);
