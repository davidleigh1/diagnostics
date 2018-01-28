defaults = {
    iframeClass: "iframe-medium"
};

tests = {
    driver_app_breakdown_by_OS: {
        name: 'Driver App Breakdown by OS',
        author: 'David',
        description: 'A breakdown of driver app by OS',
        div: 'driver_app_breakdown_by_OS',
        default_show: 'chart_url',
        query_url: 'queries/1518/source',
        table_url: 'embed/query/1518/visualization/1962',
        chart_url: 'embed/query/1518/visualization/1963',
        all_merchant: 'p_merchant_id=',
        all_team: '',
        list_of_users: '',
        single_user: ''
    },
    driver_app_versions: {
        name: 'Driver App Versions',
        author: 'David',
        description: 'A breakdown of driver app versions for all drivers and all OSs. Chart available.',
        div: 'driver_app_versions',
        default_show: 'table_url',
        query_url: 'queries/1515/source',
        table_url: 'embed/query/1515/visualization/1958',
        chart_url: 'embed/query/1515/visualization/1959',
        all_merchant: 'p_merchant_id=',
        all_team: '',
        list_of_users: '',
        single_user: ''
    },
    imei_per_driver: {
        name: 'Different Devices per Driver',
        author: 'David',
        description: 'List of Device IDs (IMEIs) per driver within the last 30 days. Multiple IMEIs may indicate use of Driver App on different devices.',
        div: 'imei_per_driver',
        default_show: 'table_url',
        query_url: 'queries/1520/source',
        table_url: 'embed/query/1520/visualization/1965',
        chart_url: '',
        all_merchant: '',
        all_team: '',
        list_of_users: '',
        single_user: 'p_user_id='
    },
    driver_onshift_vs_online: {
        name: 'Driver On-Shift vs. Online',
        author: 'AlexS',
        description: 'For persistent connectivity and tracking issues issues. Analysis is for 14 UTC days ending at midnight yesterday UTC.',
        long_description: 'Intended to assist debugging of driver issues specifically persistent connection issues shift issues.<br> The query analyzes the number of actual shift sessions (based on the shifts table - not the shift scheduler!) and their cumulative duration - and compares the number of online sessions (calculated based on the numerous individual user online/offline events) and calculates the cumulative duration of these \'online sessions\'  that occur during the user\'s onshift sessions.<br>Analysis is for 14 UTC days ending at midnight yesterday UTC.',
        div: 'driver_onshift_vs_online',
        default_show: 'table_url',
        /* Region-Specific */
        query_id: '1533',
        query_url: 'queries/1533/source',
        table_url: 'embed/query/1533/visualization/1980',
        chart_url: '',
        all_merchant: 'p_merchant_id=',
        all_team: '',
        list_of_users: '',
        single_user: '',
        /* /Region-Specific */
        queries: {
            us: {
                query_id: '1533',
                query_url: 'queries/1533/source',
                table_url: 'embed/query/1533/visualization/1980',
                chart_url: '',
                all_merchant: 'p_merchant_id=',
                all_team: '',
                list_of_users: '',
                single_user: ''
            },
            eu: {
                query_id: '26',
                table_id: '26',
                chart_id: '29',
                all_merchant: 'p_merchant_id=',
                all_team: '',
                list_of_users: '',
                single_user: '',
                get query_url() { if (this.query_id) { return 'queries/' + this.query_id + '/source'; } else { return false; } },
                get table_url() { if (this.table_id) { return 'embed/query/' + this.query_id + '/visualization/' + this.table_id; } else { return false; } },
                get chart_url() { if (this.chart_id) { return 'embed/query/' + this.query_id + '/visualization/' + this.chart_id; } else { return false; } }
            }
        }
    }
};



jQuery(document).ready(function ($) {

    /* Prep Form Fields */
    initFormFields('onReady');


    /* The [X] clear button on Input Fields - https://codepen.io/frosdqy/pen/grbxGW */
    $('.has-clear input[type="text"]').on('input propertychange', function () {
        var $this = $(this);
        var visible = Boolean($this.val());
        $this.siblings('.form-control-clear').toggleClass('hidden', !visible);
    }).trigger('propertychange');

    $('.form-control-clear').click(function () {
        $(this).siblings('input[type="text"]').val('')
            .trigger('propertychange').focus();
    });


    /* Event Handlers */
    $('.btn_group_scope').change(function (o) {
        groupScopeChange(o.target);
    });

    $("#btnSearch").click(function(){
        runSearch('all');
    });


    /* Different onclick handler technique for test-result-buttons as dynamic content and not here at onReady() */
    $(document).on('click', '.test-cmd-btn', function (elem) {

        var thisObj = tests[$(elem.target).data('test')];

        switch ( $(elem.target).data('cmd') ) {
            case 'open':
                // alert('This will open iframe into new tab');
                var this_url = $("." + $(elem.target).data('test') + " iframe").attr('src');
                openNewTab(this_url);
                break;
            case 'query':
                var this_query_url = buildSearchUrl(thisObj, 'query_url');
                $("." + $(elem.target).data('test') + " iframe").attr('src', this_query_url );
                break;
            case 'chart':
                var this_chart_url = buildSearchUrl(thisObj, 'chart_url');
                $("." + $(elem.target).data('test') + " iframe").attr('src', this_chart_url );
                break;
            case 'table':
                var this_table_url = buildSearchUrl(thisObj, 'table_url');
                $("." + $(elem.target).data('test') + " iframe").attr('src', this_table_url );
                break;
            case 'top':
                window.scrollTo(0,0);
                break;
            default:
                alert('Unknown case [d3453]');
                return false;
                break;
        }
    });

    /* Click Handler for Test Lines - where the Test Results might or might not be on screen! */
    $(document).on('click', '.test-line-btn', function (elem) {

        var thisObj = tests[$(elem.target).data('test')];

        switch ($(elem.target).data('cmd')) {
            case 'line-open':
                var show_table_label = (thisObj.query_url) ? 'query_url' : 'table_url';
                openNewTab(buildSearchUrl(thisObj, show_table_label));
                break;
            case 'line-chart':
                insertTest(thisObj, 'chart_url');
                scrollToAnchor($(elem.target).data('test'));
                break;
            case 'line-table':
                insertTest(thisObj, 'table_url');
                scrollToAnchor($(elem.target).data('test'));
                break;
            case 'line-run':
                insertTest(thisObj);
                scrollToAnchor( $(elem.target).data('test') );
                break;
            default:
                return false;
                break;
        }
    });

    /* Change Iframe Size */
    $(document).on('change', 'input[type=radio][name=iframe-size]', function (elem) {

        if ( $(elem.target).data('test') == 'all' ) {
            defaults.iframeClass = $(elem.target).val();
            $('.results-iframe').removeClass('iframe-small iframe-medium iframe-large').addClass(defaults.iframeClass);
        } else {
            this_iframe = $("." + $(elem.target).data('test') + " iframe").attr('src');
            $("." + $(elem.target).data('test') + " iframe").removeClass('iframe-small iframe-medium iframe-large').addClass( $(elem.target).val() );
        }

    });

/* TESTING ONLY */
    $('#merchant_id').val('10115');
    $('#team_id').val('9821');
    $('#user_list').val('2135550,2046790,2046899');
    $('#user_id').val('72452');
});






/* -------------------------------- UTIL FUNCTIONS ---------------------------------------------------------------- */

function scrollToAnchor(tagId) {
    var destinationTag = $('#' + tagId );
    $('html,body').animate({ scrollTop: destinationTag.offset().top }, 'slow');
}

function openNewTab (url) {
    var win = window.open(url, '_blank');
    if (win) {
        /* Browser has allowed new tab to be opened */
        win.focus();
    } else {
        /* Browser has blocked it */
        alert('Please allow popups to open new tab');
    }
}

/* -------------------------------- CORE FUNCTIONS ---------------------------------------------------------------- */

function runSearch (selectSearch) {

    if (selectSearch === 'all'){

        /* Clear Previous Test Results */
        $(".results").empty();

        /* Iterate through all Tests */
        for (const prop in tests) {
            insertTest(tests[prop]);
        }
    }

};

function insertTest(testObj, chart_to_show = testObj['default_show']) {
    console.info('Loading: ' + testObj.name, chart_to_show);
    var test_url = buildSearchUrl(testObj, chart_to_show);
    if ( test_url ) {

        // [TEST] 'Go to Top' button
        // [TEST] Small | Medium | Large iframe-- also in Advanced Global ??
        // [TEST] Expand or Collapse iframe
        // [TEST] Open in New Tab
        // [TEST] Selector to switch between TABLE and CHARTS
        // [TEST] Author + Description

        var isQueryAvailable = (testObj.query_url) ? '' : 'disabled';
        var isGraphAvailable = (testObj.chart_url) ? '' : 'disabled';
        var isTableAvailable = (testObj.table_url) ? '' : 'disabled';

        var resize_results_radios = ''
            + '<div class="btn-group btn-test" data-toggle="buttons">'
            + '<label class="btn btn-default btn-sm"><input type="radio" name="iframe-size" id="' + testObj.div + '-iframe-small" data-test="' + testObj.div + '" value="iframe-small" autocomplete="off"> S </label>'
            + '<label class="btn btn-default btn-sm"><input type="radio" name="iframe-size" id="' + testObj.div + '-iframe-medium" data-test="' + testObj.div + '" value="iframe-medium" autocomplete="off"> M </label>'
            + '<label class="btn btn-default btn-sm"><input type="radio" name="iframe-size" id="' + testObj.div + '-iframe-large" data-test="' + testObj.div +'" value="iframe-large" autocomplete="off"> L </label>'
            + '</div>';

        var result_header_html = '<div class="row result-header align-bottom">'
            + '<div class="x1 col-sm-4 h4 align-bottom">'+testObj.name+'</div>'
            + '<div class="x2 col-sm-8 text-right align-bottom">'
            + resize_results_radios
            + '<button id="test-cmd-open" data-cmd="open" data-test="'+testObj.div+'" type="button" class="test-cmd-btn btn btn-default btn-sm"> <span class="glyphicon glyphicon-new-window"></span> Open</button>'
            + '<button id="test-cmd-query" data-cmd="query" data-test="' + testObj.div + '" type="button" class="test-cmd-btn btn btn-default btn-sm "' + isQueryAvailable + '> <span class="glyphicon glyphicon-console"></span> Query</button>'
            + '<button id="test-cmd-chart" data-cmd="chart" data-test="' + testObj.div + '" type="button" class="test-cmd-btn btn btn-default btn-sm "' + isGraphAvailable + '> <span class="glyphicon glyphicon-stats"></span> Chart</button>'
            + '<button id="test-cmd-table" data-cmd="table" data-test="' + testObj.div + '" type="button" class="test-cmd-btn btn btn-default btn-sm "' + isTableAvailable + '> <span class="glyphicon glyphicon-list-alt"></span> Table</button>'
            + '<button id="test-cmd-top" data-cmd="top" data-test="'+testObj.div+'" type="button" class="test-cmd-btn btn btn-default btn-sm"> <span class="glyphicon glyphicon-circle-arrow-up"></span> Top</button>'
            + '</div>'
            + '</div >';

            var iframe_html = '<div class="not-a-row results-iframe-row">'
            + '<iframe class="results-iframe ' + defaults.iframeClass +' " src="' + test_url + '" ></iframe >'
            + '</div >';

            var result_footer_html = '<div class="row result-footer">'
            + '<div class="col-sm-12"><i>' + testObj.description +'</i><br>By: ' + testObj.author + '</div>'
            + '</div >';

            var row_html = '<div class="test-results ' + testObj.div + '" id="' + testObj.div + '">'
            + result_header_html
            + iframe_html
            + result_footer_html
            + '</div >';

            // console.info(row_html);

        $(row_html).appendTo(".results");

        // $('.' + testObj.div).html(simple_html);
    } else {
        console.info('Sorry! Unable to insert test "' + testObj.name +'"');
    }
};

function buildSearchUrl(testObj, chart_or_table_url = 'table_url') {
    // console.info('buildSearchUrl', testObj );
    var url = '';
    var domain = $('#server_farm').find('option:selected').attr('data-domain');

    var use_Url = testObj[chart_or_table_url];

    // alert(use_Url);

    var params = '';
    var id_field_value = $('.id-input-field input:visible').val() || "NO_VALUE_FOUND";
    switch ( $('.btn_group_scope').find('option:selected').val() ) {
        case 'all_merchant':
            if ( testObj.all_merchant && testObj.all_merchant != "" ){
                params += testObj.all_merchant + id_field_value + "&";
            } else {
                // alert('"'+testObj.name+'" does not current support diagnostics at Merchant Level');
                return false;
            }
        break;
        case 'all_team':
            if (testObj.all_team && testObj.all_team != "") {
                params += testObj.all_team + id_field_value + "&";
            } else {
                // alert('"' + testObj.name + '" does not current support diagnostics at Team Level');
                return false;
            }
        break;
        case 'list_of_users':
            if (testObj.list_of_users && testObj.list_of_users != "") {
                params += testObj.list_of_users + id_field_value + "&";
            } else {
                // alert('"' + testObj.name + '" does not current support diagnostics at lists of users');
                return false;
            }
            break;
        case 'single_user':
            if (testObj.single_user && testObj.single_user != "") {
                params += testObj.single_user + id_field_value + "&";
            } else {
                // alert('"' + testObj.name + '" does not current support diagnostics for individual users');
                return false;
            }
            break;
        default:
            alert('Sorry! Test "' + testObj.name + '" got confused and something went wrong!');
            return false;
            break;
    }

    url += domain + '/' + use_Url + '?' + params;
    // console.info('URL: ', url, domain, use_Url, params);
    return url;

};

function insertTestLine(testObj) {
    console.info('Loading testLine: ' + testObj.name);
    // var test_url = buildSearchUrl(testObj, testObj['default_show']);

    var isGraphAvailable = (testObj.chart_url) ? '' : 'disabled';
    var isTableAvailable = (testObj.table_url) ? '' : 'disabled';

    var test_line_html = '<div class="row result-header align-bottom">'
        + '<div class="x1 col-sm-8 align-bottom">'
        + '<div class="line-upper"><span class="line-name">' + testObj.name + '</span> <span class="line-by small">by @'+testObj.author+'</span></div>'
        + '<div class="line-lower"><span class="line-detail small">' + testObj.description + '</span></div>'
        + '</div>'
        + '<div class="x2 col-sm-4 text-right align-bottom">'
        // + resize_results_radios
        + '<button id="test-line-open" data-cmd="line-open" data-test="' + testObj.div + '" type="button" class="test-line-btn btn btn-default btn-sm"> <span class="glyphicon glyphicon-console"></span> </button>'
        + '<button id="test-line-chart" data-cmd="line-chart" data-test="' + testObj.div + '" type="button" class="test-line-btn btn btn-default btn-sm "' + isGraphAvailable + '> <span class="glyphicon glyphicon-stats"></span> </button>'
        + '<button id="test-line-table" data-cmd="line-table" data-test="' + testObj.div + '" type="button" class="test-line-btn btn btn-default btn-sm "' + isTableAvailable + '> <span class="glyphicon glyphicon-list-alt"></span> </button>'
        + '<button id="test-line-run" data-cmd="line-run" data-test="' + testObj.div + '" type="button" class="test-line-btn btn btn-default btn-sm"> <span class="glyphicon glyphicon-play"></span> ANALYZE THIS </button>'
        + '</div>'
        + '</div';

    var row_html = '<div class="test-line line-' + testObj.div + '" id="line-' + testObj.div + '">'
        + test_line_html
        + '</div >';


    $(row_html).appendTo(".test-lines");



    // if (test_url) {

/*         var isGraphAvailable = (testObj.chart_url) ? '' : 'disabled';
        var isTableAvailable = (testObj.table_url) ? '' : 'disabled';

        var resize_results_radios = ''
            + '<div class="btn-group btn-test" data-toggle="buttons">'
            + '<label class="btn btn-default btn-sm"><input type="radio" name="iframe-size" id="' + testObj.div + '-iframe-small" data-test="' + testObj.div + '" value="iframe-small" autocomplete="off"> S </label>'
            + '<label class="btn btn-default btn-sm"><input type="radio" name="iframe-size" id="' + testObj.div + '-iframe-medium" data-test="' + testObj.div + '" value="iframe-medium" autocomplete="off"> M </label>'
            + '<label class="btn btn-default btn-sm"><input type="radio" name="iframe-size" id="' + testObj.div + '-iframe-large" data-test="' + testObj.div + '" value="iframe-large" autocomplete="off"> L </label>'
            + '</div>';

        var result_header_html = '<div class="row result-header align-bottom">'
            + '<div class="x1 col-sm-4 h4 align-bottom">' + testObj.name + '</div>'
            + '<div class="x2 col-sm-8 text-right align-bottom">'
            + resize_results_radios
            + '<button id="test-cmd-open" data-cmd="open" data-test="' + testObj.div + '" type="button" class="test-cmd-btn btn btn-default btn-sm"> <span class="glyphicon glyphicon-new-window"></span> Open</button>'
            + '<button id="test-cmd-chart" data-cmd="chart" data-test="' + testObj.div + '" type="button" class="test-cmd-btn btn btn-default btn-sm "' + isGraphAvailable + '> <span class="glyphicon glyphicon-stats"></span> Chart</button>'
            + '<button id="test-cmd-table" data-cmd="table" data-test="' + testObj.div + '" type="button" class="test-cmd-btn btn btn-default btn-sm "' + isTableAvailable + '> <span class="glyphicon glyphicon-list-alt"></span> Table</button>'
            + '<button id="test-cmd-top" data-cmd="top" data-test="' + testObj.div + '" type="button" class="test-cmd-btn btn btn-default btn-sm"> <span class="glyphicon glyphicon-circle-arrow-up"></span> Top</button>'
            + '</div>'
            + '</div >';

        var iframe_html = '<div class="not-a-row results-iframe-row">'
            + '<iframe class="results-iframe ' + defaults.iframeClass + ' " src="' + test_url + '" ></iframe >'
            + '</div >';

        var result_footer_html = '<div class="row result-footer">'
            + '<div class="col-sm-12"><i>' + testObj.description + '</i><br>By: ' + testObj.author + '</div>'
            + '</div >';

        var row_html = '<div class="test-results ' + testObj.div + '" id="' + testObj.div + '">'
            + result_header_html
            + iframe_html
            + result_footer_html
            + '</div >';
 */
        // console.info(row_html);


        // $('.' + testObj.div).html(simple_html);
    // } else {
    //     console.info('Sorry! Unable to insert test line "' + testObj.name + '"');
    // }
};


function initFormFields() {
    /* Hide all ID fields */
    $('.id-input-field').hide();
    /* Show whichever fields are selected in HTML  */
    groupScopeChange( $('.btn_group_scope') );
    /* Select appropriate radio button based on defaults */
    $('#' + defaults.iframeClass).click();
    /* Display list of tests */
        /* Clear Previous Test Results */
        $(".results").empty();
        /* Iterate through all Tests */
        for (const prop in tests) {
            insertTestLine(tests[prop]);
        }

};

function groupScopeChange(thisObj) {

    // console.info('groupScopeChange',thisObj);
    var selectedScopeGroup = $(thisObj).find('option:selected').attr('data-field');
    // console.info('groupScopeChange', selectedScopeGroup);
    /* Hide all ID fields */
    $('.id-input-field').hide();
    /* Show only the selected ID field  */
    $('.' + selectedScopeGroup).show();
};



function parse() {
    var string = document.getElementById("task_text").value;

    var fields = {
        team_external_id: 4,
        invoiced_from_N_A: 4,
        external_id: 11,
        invoice_number_N_A: 14,
        inventory_scan_code: 10,
        inventory_name_part_1: 40,
        inventory_name_part_2: 20,
        delivery_platform_: 4,
        stock_platform_: 4,
        inventory_quantity: 5,
        note_1: 40,
        note_2: 40,
        note_3: 40,
        installation_type: 2,
        tbd_1: 3,
        boul_nomenclature_1: 2,
        boul_nomenclature_2: 2,
        boul_nomenclature_3: 2,
        inventory_category: 2,
        inventoty_weight: 9,
        created_at_: 26,
        scheduled_at: 8,
        time_window: 25,
        code_civil_status_: 1,
        civil_statuc_N_A: 15,
        last_name: 25,
        first_name: 20,
        address: 53,
        address_second_line: 116,
        country: 3,
        zip: 5,
        specific_zip: 5,
        city: 38,
        phone_number: 15,
        inventory_pickup_dropoff: 1,
        price: 11,
        packaging_N_A: 3,
        item_for_pickup: 1,
        N_A_1: 7,
        N_A_2: 7,
        N_A_3: 7,
        N_A_4: 1,
        reason_for_returning: 2,
        details_of_client_invoice_: 34,
        additional_phone_number: 15,
        landline: 15,
        work_phone: 15,
        route: 3,
        due_to_be_paid: 13,
        email: 70
    };

    var counter = 0;

    var table = document.getElementById('task_table');
    table.innerHTML += '<tr><td colspan="2" style="font-size: xx-small;">' + string + '</td></tr>';

    for (var key in fields) {
        table.innerHTML += '<tr><td>' + capitalizeFirstLetter(key) + '</td>' + '<td>' + string.substr(counter, fields[key]) + '</td></tr>';
        counter = counter + fields[key];
    }

    $('textarea.examples').hide();

}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function reset() {
    window.location.reload();
}