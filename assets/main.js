/**
 * Created by charuverma on 2/2/17.
 */

var AA = {

    siteObj: {},
    i: 0,
    formatLen: 0,
    uniqFormats: [],
    inStorage: 0,

    attachDelBtnToFormats: function () {

        var droppedFormats = $(".dropped-formats").find(".format");

        droppedFormats.each(function (e, k) {

            if ($(this).find(".del-format").length == 0) {
                var delFormatBtn = AA.createElement('div', '', '', '', 'del-format fa fa-trash', '', '');
                delFormatBtn
                    .appendTo($(this))
                    .click(function () {
                        $(this).parent(".format").remove();
                    });
            }

        });
    },
    createElement: function (ele, type, id, name, clss, placeholder, value) {

        var newEle = jQuery('<' + ele + '>');

        newEle.attr({
            type: type,
            id: id,
            name: name,
            class: clss,
            placeholder: placeholder,
            value: value
        });

        return newEle;

    },
    addNewPage: function () {

        var pgContainer = AA.createElement('div', '', '', '', 'page-container', '', ''),
            newInput = AA.createElement('input', 'text', "", 'newpage', 'new-page', 'Enter Page name', ''),
            dropContainer = AA.createElement('div', '', '', '', 'dropped-formats droppable', '', ''),
            msgSpan = AA.createElement('span', '', '', '', 'msg', '', ''),
            previewBtn = AA.createElement('div', '', '', '', 'preview-btn fa fa-eye', '', '');

        newInput.appendTo(pgContainer);
        dropContainer.appendTo(pgContainer);
        msgSpan.text("Drag and drop Formats from the right column").appendTo(dropContainer);
        //previewBtn.attr("src", "img/preview.png").appendTo(pgContainer);
        previewBtn.appendTo(pgContainer);
        pgContainer.insertBefore("#add-page"); // Inserts before the "Add new page" button
        AA.initDraggable();// So that the newly created elements are able to drag

    },
    addCustomFormat: function () {

        //var newFormatVal = $("#new-format").val(),
        var cfWidth = $("#cf-width").val(),
            cfHeight = $("#cf-height").val(),
            newFormatVal = cfWidth.trim() + "x" + cfHeight.trim();

        if (cfWidth.length > 0 && cfHeight.length > 0) {

            var newFormatDiv = AA.createElement('div', '', '', '', 'format draggable', '', ''),
                newFormatSpan = AA.createElement('span', '', '', '', 'format-item', '', '');
            newFormatSpan.text(newFormatVal);
            newFormatSpan.appendTo(newFormatDiv);
            newFormatDiv.appendTo("#format-list");
            AA.initDraggable(); // So that the newly created elements are able to drag
            $("#cf-width,#cf-height").val("");

        } else {
            AA.createErrorEle("Format Cannot be blank");
            return false;
        }


    },
    createErrorEle: function (msg) {
        var newErrEle = AA.createElement('div', '', '', '', 'err-msg', '', ''),
            chkSpan = AA.createElement('span', '', '', '', 'fa fa-check', '', ''),
            msgSpan = AA.createElement('span', '', '', '', '', '', '');
        chkSpan.appendTo(newErrEle);
        msgSpan.text(msg).appendTo(newErrEle);
        newErrEle.appendTo("#err-box");
        $("#err-box").show();
    },
    validation: function (pageArr) {

        var ch = "^[A-Za-z0-9_./-]+$",
            siteName = $("#siteName").val(),
            siteUrl = $("#siteUrl").val(),
            errorCounter = 0,
            allSites = AA.getAllFromStorage(),
            iab = $("#iab-category option:selected").val(),
            tmpSiteNames = [];
        //check page names later
        $(".err-msg").remove();


        //console.log(siteName.match(ch));
        // Site URL

        for (var i = 0; i < allSites.length; i++) {
            tmpSiteNames.push(allSites[i].siteName);
        }

        if (siteUrl.trim().indexOf('http://') == -1 && siteUrl.trim().indexOf('https://') == -1) {
            siteUrl = "http://" + siteUrl;
            $("#siteUrl").val(siteUrl);
        }


        if ($.inArray(siteName, tmpSiteNames) != -1) {
            errorCounter++;
            AA.createErrorEle("This site name has already been used.");

        }


        for (var i = 0; i < pageArr.length; i++) {
            if (pageArr[i].pagename.trim().length < 1) {
                AA.createErrorEle("Page name cannot be blank");
                errorCounter++;
            } else if (pageArr[i].pagename.match(ch) !== null) {

            } else {
                AA.createErrorEle("No space allowed in the Page name. Allowed characters A-Za-z0-9_.-");
                errorCounter++;
                //return false;
            }

            if (pageArr[i].formats.length < 1) {
                AA.createErrorEle("Add atleast one format to the page " + pageArr[i].pagename);
                errorCounter++;
            }
            //console.log(pageArr[i].pagename);
        }

        // Site name

        if (siteName.trim().length < 1) {
            AA.createErrorEle("Site Name cannot be blank");
            //return false;
            errorCounter++;
        }

        if (siteName.match(ch) !== null) {

        } else {
            AA.createErrorEle("No space allowed in the Site name. Allowed characters A-Za-z0-9_.-");
            //return false;
            errorCounter++;
        }

        if (iab == "default") {
            errorCounter++;
            AA.createErrorEle("Please select a valid IAB category");
        }

        if (errorCounter > 0) {
            return false;
        } else {
            return true;
        }


    },
    clearOnSubmit: function () {

        $("#siteName,#siteUrl").val("");
        $("#iab-categorylDiv option:eq(1)").prop('selected', true);
        $(".page-container").remove();
        $("#err-box").hide();
        AA.addNewPage();

    },
    putInStorage: function (site, key) {
        localStorage.setItem('site_' + key, JSON.stringify(site));

    },
    getFromStorage: function (key) {
        return JSON.parse(localStorage.getItem('site_' + key));

    },
    chkInStorage: function () {
        for (var i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).indexOf('site_') !== -1) {
                AA.inStorage = AA.inStorage + 1;
            }
        }
    },
    getAllFromStorage: function () {
        var sites = [];
        for (var i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).indexOf('site_') !== -1) {
                var site = localStorage.getItem(localStorage.key(i));
                sites.push(JSON.parse(site));
            }
        }
        //console.log(sites);
        return sites;
    },
    deleteAllFromStorage: function () {

        localStorage.clear();
        $("#delete-data,#table-container").hide();

    },
    deleteFromStorage: function (key) {
        localStorage.removeItem('site_' + key);
    },
    getMaxFormatSetLength: function () {

        var allSites = AA.getAllFromStorage();

        for (var i = 0; i < allSites.length; i++) {

            var pageArr = allSites[i].pages;

            for (var p = 0; p < pageArr.length; p++) {

                var formatArr = pageArr[p].formats;

                for (var f = 0; f < formatArr.length; f++) {

                    if ($.inArray(formatArr[f], AA.uniqFormats) == -1) {
                        AA.uniqFormats.push(formatArr[f]);
                    }
                }

                if (formatArr.length > AA.formatLen) {

                    AA.formatLen = formatArr.length;
                }

            }
        }

        //console.log(AA.uniqFormats);

    },
    // following function:buildSubmittedSites is not being used, but I am keeping it still, just for record sake.
    buildSubmittedSites: function () {

        var allSites = AA.getAllFromStorage();

        for (var i = 0; i < allSites.length; i++) {

            var ssContainer = AA.createElement('div', '', '', '', 'ss-container', '', ''),
                ssName = AA.createElement('div', '', '', '', 'ss-name', '', ''),
                sName = AA.createElement('span', '', '', '', 's-name', '', ''),
                sUrl = AA.createElement('span', '', '', '', 's-url', '', ''),
                pageArr = allSites[i].pages;

            sName.text(allSites[i].siteName).appendTo(ssName);
            sUrl.text(allSites[i].siteUrl).appendTo(ssName);
            ssName.appendTo(ssContainer);
            ssContainer.appendTo($("#ss-list"));

            for (var p = 0; p < pageArr.length; p++) {

                var ssPage = AA.createElement('div', '', '', '', 'ss-page', '', ''),
                    pName = AA.createElement('div', '', '', '', 'p-name', '', ''),
                    pFormatsC = AA.createElement('div', '', '', '', 'p-formats-c', '', ''),
                    formatArr = pageArr[p].formats;

                pName.text(pageArr[p].pagename).appendTo(ssPage);
                pFormatsC.appendTo(ssPage);
                ssPage.appendTo(ssContainer);

                for (var f = 0; f < formatArr.length; f++) {
                    var pFormat = AA.createElement('span', '', '', '', 'p-format', '', '');
                    pFormat.text(formatArr[f]).appendTo(pFormatsC);
                }

            }
        }

    },
    buildTable: function () {

        var html = "",
            allSites = AA.getAllFromStorage();
        AA.getMaxFormatSetLength();

        html += '<tr>\r\n';
        html += '<th>Site Name</th>\r\n';
        html += '<th>Site URL</th>\r\n';
        html += '<th>IAB Name</th>\r\n';
        html += '<th>Page Name</th>\r\n';
        //html += '<th id="format-cell" colspan= "' + AA.formatLen + '">Formats</th>\r\n';

        for (var f = 0; f < AA.uniqFormats.length; f++) {
            html += '<th>' + AA.uniqFormats[f] + '</th>\r\n';
        }
        html += '</tr>\r\n';

        for (var i = 0; i < allSites.length; i++) {

            var pageArr = allSites[i].pages;

            for (var p = 0; p < pageArr.length; p++) {

                var formatArr = pageArr[p].formats;

                if (p > 0) {

                    html += '<tr>\r\n';
                    html += '<td></td>\r\n';
                    html += '<td>' + allSites[i].siteUrl + '</td>\r\n';
                    html += '<td>' + allSites[i].iab + '</td>\r\n';
                    html += '<td>' + pageArr[p].pagename + '</td>\r\n';

                } else {
                    html += '<tr>\r\n';
                    html += '<td>' + allSites[i].siteName + '</td>\r\n';
                    html += '<td>' + allSites[i].siteUrl + '</td>\r\n';
                    html += '<td>' + allSites[i].iab + '</td>\r\n';
                    html += '<td>' + pageArr[p].pagename + '</td>\r\n';
                }


                for (var f = 0; f < AA.uniqFormats.length; f++) {

                    var exists = 0;

                        for(var a=0; a < formatArr.length; a++){

                            if(formatArr[a] == AA.uniqFormats[f]){

                                html += '<td>X</td>\r\n';
                                exists++;
                            }
                        }

                    if(exists == 0){
                        html += '<td></td>\r\n';
                        exists = 0;
                    }

                }
                html += '</tr>\r\n';
            }
        }
        jQuery('#site-list').html(html).show();
        $("#table-container").show();
        $("#delete-data").show();
        $("table").tableExport({
            bootstrap: false
        });
        //console.log("AA.formatLen--"+AA.formatLen);
        //$("#format-cell").attr("colspan",AA.formatLen);

    },
    submitSite: function () {

        var siteName = $("#siteName").val(),
            siteUrl = $("#siteUrl").val(),
            iab = $("#iab-category option:selected").text(),
            pageContainer = $("#pages"),
            i = AA.i,
            pageArr = [],
            formatsArr = [];

        //Create Obj
        AA.siteObj[i] = {};

        pageContainer.find('.page-container').each(function (key, ele) {

            var pageName = $(this).find(".new-page").eq(0).val(),
                allFormats = $(this).find(".format"),
                previewBtn = $(this).find(".preview-btn");

            //SiteObj
            pageArr[key] = {};
            formatsArr[key] = [];

            allFormats.each(function (k, e) {

                var formatVal = $(this).find(".format-item").text();

                if ($.inArray(formatVal, formatsArr[key]) == -1) {
                    formatsArr[key].push(formatVal);
                }
            });

            pageArr[key] = {
                "pagename": pageName,
                "formats": formatsArr[key]
            };

        });

        if (AA.validation(pageArr)) {

            AA.siteObj[i] = {
                "siteName": siteName,
                "siteUrl": siteUrl,
                "iab": iab,
                "pages": pageArr
            }

            AA.chkInStorage(); // counts existing site_ items in the localstorage
            if (AA.inStorage > 0) {
                AA.putInStorage(AA.siteObj[i], localStorage.length);
            } else {
                AA.putInStorage(AA.siteObj[i], i);
            }


            AA.buildTable();
            AA.clearOnSubmit();

            AA.i = AA.i + 1;
            //localStorage.setItem('siteLen', AA.i);

        } else {

            return false;
        }

    },
    showPreview: function (btn) {

        var allFormats = btn.parent(".page-container").find(".format"),
            formatArr = [];
        allFormats.each(function () {
            var formatVal = $(this).find(".format-item").text();
            if ($.inArray(formatVal, formatArr) == -1) {
                formatArr.push(formatVal);
            }
        });
        window.open("preview.html#" + formatArr.join("_"), "_blank");

    },
    initClicks: function () {

        //Add new page
        $("#add-page").click(function () {
            AA.addNewPage();
        });

        //Add new format
        $("#add-format").click(function () {
            AA.addCustomFormat();
        });

        //on enter key press submit the new-format
        $("#cf-height, #cf-width").keyup(function (e) {
            var code = e.which; // recommended to use e.which, it's normalized across browsers
            if (code == 13) {
                e.preventDefault();
                AA.addCustomFormat();

            }
        });

        //Close errorbox if visible
        $("#err-close").click(function () {
            $(".err-msg").remove();
            $("#err-box").hide();

        });

        //Add site
        $("#add-site").click(function () {
            AA.submitSite();
        });

        // Clear allSitesObj permanently
        $("#delete-data").click(function () {
            AA.deleteAllFromStorage();
        });

    },
    getExistingFormatEle: function (parent) {

        var formatVal = parent.find(".format-item"),
            formatArr = [];

        formatVal.each(function (e, k) {
            formatArr.push($(this).text());
        });

        return formatArr;

    },
    initDraggable: function () {
        $(".draggable").draggable({
            helper: "clone"
        });

        $('.droppable').droppable({
            accept: '.draggable',
            drop: function (e, ui) {
                var ef = AA.getExistingFormatEle($(this));

                if ($.inArray($(ui.draggable).find(".format-item").text(), ef) == -1) {
                    $(ui.draggable).clone().appendTo($(this));
                    e.preventDefault();
                    e.stopPropagation();
                    $(".msg").hide();
                    $(".preview-btn")
                        .unbind("click")
                        .bind("click", function () {
                            AA.showPreview($(this));
                        }).show();
                    AA.attachDelBtnToFormats();
                } else {
                    AA.createErrorEle("Duplicate formats not allowed in one page");
                    return false;
                }
            }
        });

    },
    initPageLoad: function () {

        $(document).ready(function () {

            //Attach drag events to the existing draggable elements on load
            AA.initDraggable();

            AA.initClicks();
            if (localStorage.length > 0) {
                AA.buildTable();
            }


            //$('table').table2CSV({
            //    type: "csv",
            //    buttonContent: "Export to csv",
            //    fileName: "id"
            //});
            //$('table').table2CSV({
            //    type: "txt",
            //    buttonContent: "Export to txt",
            //    fileName: "id"
            //});

        });
    }
}

AA.initPageLoad();