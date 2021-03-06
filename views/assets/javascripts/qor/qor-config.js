// init for slideout after show event
$.fn.qorSliderAfterShow = $.fn.qorSliderAfterShow || {};
window.QOR = {};

// change Mustache tags from {{}} to [[]]
window.Mustache && (window.Mustache.tags = ['[[', ']]']);

// clear close alert after ajax complete
$(document).ajaxComplete(function(event, xhr, settings) {
    if (settings.type == "POST" || settings.type == "PUT") {
        if ($.fn.qorSlideoutBeforeHide) {
            $.fn.qorSlideoutBeforeHide = null;
            window.onbeforeunload = null;
        }
    }
});


// select2 ajax common options
// $.fn.select2 = $.fn.select2 || function(){};
$.fn.select2.ajaxCommonOptions = {
    dataType: 'json',
    cache: true,
    delay: 250,
    data: function(params) {
        return {
            keyword: params.term, // search term
            page: params.page,
            per_page: 20
        };
    },
    processResults: function(data, params) {
        // parse the results into the format expected by Select2
        // since we are using custom formatting functions we do not need to
        // alter the remote JSON data, except to indicate that infinite
        // scrolling can be used
        params.page = params.page || 1;

        var processedData = $.map(data, function(obj) {
            obj.id = obj.Id || obj.ID;
            return obj;
        });

        return {
            results: processedData,
            pagination: {
                more: processedData.length >= 20
            }
        };
    }
};

// select2 ajax common options
// format ajax template data
$.fn.select2.ajaxFormatResult = function(data, tmpl) {
    var result = "";
    if (tmpl.length > 0) {
        result = window.Mustache.render(tmpl.html().replace(/{{(.*?)}}/g, '[[$1]]'), data);
    } else {
        result = data.text || data.Name || data.Title || data.Code || data[Object.keys(data)[0]];
    }

    // if is HTML
    if (/<(.*)(\/>|<\/.+>)/.test(result)) {
        return $(result);
    }
    return result;
};

$.fn.qorAjaxHandleFile = function(url, contentType, fileName, data) {
    var request = new XMLHttpRequest();

    request.responseType = "arraybuffer";
    request.open("POST", url, true);
    request.onload = function() {

        if (this.status === 200) {
            var blob = new Blob([this.response], {
                type: contentType
            });

            var url = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.href = url;
            a.download = fileName || "download-" + $.now();
            a.click();
        } else {
            window.alert('server error, please try again!');
        }
    };

    request.send(data);
};
