// 'use strict';

/* 
Version: 2.1
*/

console.info('TODO: Pass non-valid parameters to Dash as 0 - what if not?');
console.info('TODO: For the test lines - check server parameters and then relevant sub-query object - should really be the same on both!');
console.info('TODO: Check for Dash login on both US and EU');

var settings = {
    iframeClass: 'iframe-medium',
    domain_region: '',
    domain_url: '',
    domain_flag: ''
};

var tests = {
    driver_app_breakdown_by_OS: {
        name: 'Driver App Breakdown by OS',
        author: 'David',
        description: 'A breakdown of driver app by OS',
        div: 'driver_app_breakdown_by_OS',
        default_show: 'embed_chart_id',
        /* Query Capabilities */
        by_merchant_id: true,
        by_team_id: false,
        by_user_list: false,
        by_user_id: false,
        /* Regions */
        us: {
            query_id: 1518,
            embed_table_id: 1962,
            embed_chart_id: 1963,
        },
        eu: {
            query_id: 0,
            embed_table_id: 0,
            embed_chart_id: 0,
        }
    },
    driver_app_versions: {
        name: 'Driver App Versions',
        author: 'David',
        description: 'A breakdown of driver app versions for all drivers and all OSs. Chart available.',
        div: 'driver_app_versions',
        default_show: 'embed_table_id',
        /* Query Capabilities */
        by_merchant_id: true,
        by_team_id: false,
        by_user_list: false,
        by_user_id: false,
        /* Regions */
        us: {
            query_id: 1515,
            embed_table_id: 1958,
            embed_chart_id: 1959,
        },
        eu: {
            query_id: 0,
            embed_table_id: 0,
            embed_chart_id: 0,
        }
    },
    imei_per_driver: {
        name: 'Different Devices per Driver',
        author: 'David',
        description: 'List of Device IDs (IMEIs) per driver within the last 30 days. Multiple IMEIs may indicate use of Driver App on different devices.',
        div: 'imei_per_driver',
        default_show: 'embed_table_id',
        /* Query Capabilities */
        by_merchant_id: false,
        by_team_id: false,
        by_user_list: false,
        by_user_id: true,
        /* Regions */
        us: {
            query_id: 1520,
            embed_table_id: 1965,
            embed_chart_id: 0,
        },
        eu: {
            query_id: 0,
            embed_table_id: 0,
            embed_chart_id: 0,
        }
    },
    driver_onshift_vs_online: {
        name: 'Driver On-Shift vs. Online',
        author: 'AlexS',
        description: 'For persistent connectivity and tracking issues issues. Analysis is for 14 UTC days ending at midnight yesterday UTC.',
        long_description: 'Intended to assist debugging of driver issues specifically persistent connection issues shift issues.<br> The query analyzes the number of actual shift sessions (based on the shifts table - not the shift scheduler!) and their cumulative duration - and compares the number of online sessions (calculated based on the numerous individual user online/offline events) and calculates the cumulative duration of these \'online sessions\'  that occur during the user\'s onshift sessions.<br>Analysis is for 14 UTC days ending at midnight yesterday UTC.',
        div: 'driver_onshift_vs_online',
        default_show: 'embed_table_id',
        /* Query Capabilities */
        by_merchant_id: true,
        by_team_id: false,
        by_user_list: false,
        by_user_id: false,
        /* Regions */
        us: {
            query_id: 1533,
            embed_table_id: 1980,
            embed_chart_id: 0,
        },
        eu: {
            query_id: 26,
            embed_table_id: 26,
            embed_chart_id: 0,
        }
    },
    user_location_activity: {
        name: 'User Location Update Activity',
        author: 'David',
        description: 'Counts number of user location updates (from userhistories) were received per user per day for the last 7 days',
        long_description: '',
        div: 'user_location_activity',
        default_show: 'embed_table_id',
        /* Query Capabilities */
        by_merchant_id: true,
        by_team_id: false,
        by_user_list: false,
        by_user_id: true,
        /* Regions */
        eu: {
            query_id: 27,
            embed_table_id: 30,
            embed_chart_id: 0
        }
    },
    late_orders_by_team: {
        name: 'Late Orders by Team by Day',
        author: 'David',
        description: 'Team Performance over last 7 days returns: % Late Tasks, # Late Tasks, Total Tasks, Team ID, Day (by UTC) and List of Late Task IDs',
        long_description: '',
        div: 'late_orders_by_team',
        default_show: 'embed_table_id',
        /* Query Capabilities */
        by_merchant_id: true,
        by_team_id: false,
        by_user_list: false,
        by_user_id: false,
        /* Regions */
        eu: {
            query_id: 28,
            embed_table_id: 31,
            embed_chart_id: 32,
        },
        queries: {
            /* MOVE THIS OUT OF THE QUERIES - THESE ARE STANDARD!! */
            all_merchant: 'p_merchant_id=',
            all_team: 'p_team_id=',
            list_of_users: 'p_user_id_list=',
            single_user: 'p_user_id=',
            get query_url() { if (this.query_id) { return 'queries/' + this.query_id + '/source'; } else { return false; } },
            get table_url() { if (this.table_id) { return 'embed/query/' + this.query_id + '/visualization/' + this.table_id; } else { return false; } },
            get chart_url() { if (this.chart_id) { return 'embed/query/' + this.query_id + '/visualization/' + this.chart_id; } else { return false; } }
        }
    }
};


/* -------------------------------- ONREADY + EVENT HANDLERS ---------------------------------------------------------------- */
/* Moved to end! */

/* -------------------------------- UTIL FUNCTIONS ---------------------------------------------------------------- */

function scrollToAnchor(tagId) {
    var destinationTag = $('#' + tagId );
    $('html,body').animate({ scrollTop: destinationTag.offset().top }, 'slow');
}

function checkValidUrl (urlToTest) {
    /* Check and return false for invalid URLs */
    var regex = /^(https?:\/\/)?[a-z0-9-]*\.?[a-z0-9-]+\.[a-z0-9-]+(\/[^<>]*)?$/;
    // var regex = /^(https?:\/\/)?[a-z0-9-]*\.?[a-z0-9-]+\.[a-z0-9-]+(\/[^<>]*)?$/;
    return regex.test(urlToTest) ? urlToTest : false;
}

function openNewTab (url) {

    /* Open if valid */
    if ( checkValidUrl(url) ){

        var win = window.open(url, '_blank');
        if (win) {
            /* Browser has allowed new tab to be opened */
            win.focus();
        } else {
            /* Browser has blocked it */
            alert('Please allow popups to open new tab');
        }

    } else {
        // alert('Received an invalid URL - unable to open\nSee console for details');
        console.log('Invalid URL to openNewTab()',url);
    }
}

/* -------------------------------- CORE FUNCTIONS ---------------------------------------------------------------- */

function groupServerChange(thisObj) {
    updateUserInputSettings();
    $('.flag').attr('src', settings.domain_flag );
}

function groupScopeChange(thisObj) {
    /* Need to clear all hidden ID fields to avoid them being submitted to queries that accept two parameters */
    // $('.id-input-field input').val(''); 
    updateUserInputSettings();
    /* Hide all ID fields */
    $('.id-input-field').hide();
    /* Show only the selected ID field  */
    $('.' + settings.scope_input ).show();
}


function buildDashUrlNoParams(testObj, chart_or_table_param_name){
    // console.log(testObj, chart_or_table_param_name);

    switch ( chart_or_table_param_name ) {
        case 'query_id':
            return settings.domain_url + '/queries/' + testObj[settings.domain_region]['query_id'] + '/source';
            break;
        case 'embed_table_id':
        case 'embed_chart_id':
            return settings.domain_url + '/embed/query/' + testObj[settings.domain_region]['query_id'] + '/visualization/' + testObj[settings.domain_region][chart_or_table_param_name];
            break;
        default:
            break;
    }
       // get embed_query_url() { if (this.query_id) { return 'queries/' + this.query_id + '/source'; } else { return false; } },
    // get embed_table_url() { if (this.table_id) { return 'embed/query/' + this.query_id + '/visualization/' + this.table_id; } else { return false; } },
    // get embed_chart_url() { if (this.chart_id) { return 'embed/query/' + this.query_id + '/visualization/' + this.chart_id; } else { return false; } }



}

function buildDashUrl(testObj, chart_or_table_param_name = 'query_id', origin) {
    // console.info('buildDashUrl', testObj, chart_or_table_param_name );
    var full_url = base_url = params = errorText = '';
    // var use_Url = testObj[chart_or_table_param_name];
    var id_field_value = settings[settings.scope_param] || "NO_VALUE_FOUND";

    /* Reject if query is not supported in the selected region */
    if ( !testObj[settings.domain_region] || !testObj[settings.domain_region]['query_id'] ){
        errorText = "'" + testObj.name + "' is not current supported in '" + settings.domain_region.toUpperCase() + "' region [241]";
        console.log(errorText);
        if (origin !== 'all') { alert(errorText); }
        return false;
    }

    base_url = buildDashUrlNoParams(testObj, chart_or_table_param_name);
    
    /* ReDash needs to receive a zero value for any dynamic variable so always pass 0 where null */
    params = ''
    + '?' + 'p_merchant_id=' + ((settings.scope_param == 'merchant_id') ? settings.merchant_id : 0)
        + '&' + 'p_team_id=' + ((settings.scope_param == 'team_id') ? settings.team_id : 0)
        + '&' + 'p_user_list=' + ((settings.scope_param == 'user_list') ? settings.user_list : 0)
        + '&' + 'p_user_id=' + ((settings.scope_param == 'user_id') ? settings.user_id : 0);
    
    full_url = base_url + params;

    if ( testObj['by_' + settings.scope_param] ) {
        if ( settings[settings.scope_param] ) {
            console.log('Returning URL: ', full_url);
            return full_url;
        } else {
            errorText = "Please enter a valid '" + settings.scope_param +"' [259]";
            console.log(errorText);
            if (origin !== 'all') { alert(errorText); }
            return false;
        }
    } else {
        errorText = "'" + testObj.name + "' does not currently support diagnostics at '" + settings.scope_label + "' level [266]";
        console.log(errorText);
        if (origin !== 'all') { alert(errorText); }
        return false;
    }
}

function insertTest(testObj, origin) {
    console.info('insertTest: ', testObj.name, origin);
    var test_url = buildDashUrl(testObj, testObj['default_show'], origin);
    if ( test_url ) {

        // [TEST] 'Go to Top' button
        // [TEST] Small | Medium | Large iframe-- also in Advanced Global ??
        // [TEST] Expand or Collapse iframe
        // [TEST] Open in New Tab
        // [TEST] Selector to switch between TABLE and CHARTS
        // [TEST] Author + Description

        var isSourceAvailable = (testObj[settings.domain_region]['query_id']) ? '' : 'disabled';
        var isTableAvailable = (testObj[settings.domain_region]['embed_table_id']) ? '' : 'disabled';
        var isGraphAvailable = (testObj[settings.domain_region]['embed_chart_id']) ? '' : 'disabled';

        var resize_results_radios = ''
            + '<div class="btn-group btn-test" data-toggle="buttons">'
            + '<label class="btn btn-default btn-sm"><input type="radio" name="iframe-size" id="' + testObj.div + '-iframe-small" data-test="' + testObj.div + '" value="iframe-small" autocomplete="off"> S </label>'
            + '<label class="btn btn-default btn-sm"><input type="radio" name="iframe-size" id="' + testObj.div + '-iframe-medium" data-test="' + testObj.div + '" value="iframe-medium" autocomplete="off"> M </label>'
            + '<label class="btn btn-default btn-sm"><input type="radio" name="iframe-size" id="' + testObj.div + '-iframe-large" data-test="' + testObj.div +'" value="iframe-large" autocomplete="off"> L </label>'
            + '</div>';

        var result_header_html = '<div class="row result-header align-bottom">'
            + '<div class="x1 col-sm-4 h4 align-bottom"><span class="test-name">' + testObj.name + '</span><img src="' + settings.domain_flag +'" alt="" class="test-flag"></div>'
            + '<div class="x2 col-sm-8 text-right align-bottom">'
            + resize_results_radios
            + '<button id="test-cmd-open" data-cmd="open" data-test="'+testObj.div+'" type="button" class="test-cmd-btn btn btn-default btn-sm"> <span class="glyphicon glyphicon-new-window"></span> Open</button>'
            + '<button id="test-cmd-source" data-cmd="source" data-test="' + testObj.div + '" type="button" class="test-cmd-btn btn btn-default btn-sm "' + isSourceAvailable + '> <span class="glyphicon glyphicon-console"></span> Source</button>'
            + '<button id="test-cmd-chart" data-cmd="chart" data-test="' + testObj.div + '" type="button" class="test-cmd-btn btn btn-default btn-sm "' + isGraphAvailable + '> <span class="glyphicon glyphicon-stats"></span> Chart</button>'
            + '<button id="test-cmd-table" data-cmd="table" data-test="' + testObj.div + '" type="button" class="test-cmd-btn btn btn-default btn-sm "' + isTableAvailable + '> <span class="glyphicon glyphicon-list-alt"></span> Table</button>'
            + '<button id="test-cmd-top" data-cmd="top" data-test="'+testObj.div+'" type="button" class="test-cmd-btn btn btn-default btn-sm"> <span class="glyphicon glyphicon-circle-arrow-up"></span> Top</button>'
            + '</div>'
            + '</div >';

            var iframe_html = '<div class="not-a-row results-iframe-row">'
            + '<iframe class="results-iframe ' + settings.iframeClass +' " src="' + test_url + '" ></iframe >'
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
        return true;

    } else {
        console.info('Sorry! Unable to insert test "' + testObj.name +'"');
        return false;
    }
}

function insertTestLine(testObj) {
    console.info('Loading testLine: ' + testObj.name);
    // var test_url = buildSearchUrl(testObj, testObj['default_show']);

    // query_id
    // embed_table_id
    // embed_chart_id

    var isAvailableOnEU     = (testObj.eu && testObj.eu.query_id) ? 'show-icon' : 'hide-icon';
    var isAvailableOnUS     = (testObj.us && testObj.us.query_id) ? 'show-icon' : 'hide-icon';
    var isGraphAvailable    = (testObj.chart_url) ? '' : 'hide-icon';
    var isTableAvailable    = (testObj.table_url) ? '' : 'hide-icon';
    var isForMerchant       = (testObj.by_merchant_id ) ? 'show-icon' : 'hide-icon';
    var isForTeam           = (testObj.by_team_id ) ? 'show-icon' : 'hide-icon';
    var isForUserList       = (testObj.by_user_list ) ? 'show-icon' : 'hide-icon';
    var isForUser           = (testObj.by_user_id ) ? 'show-icon' : 'hide-icon';

    var test_line_html = '<div class="row result-header align-bottom">'
        + '<div class="x1 col-sm-8 align-bottom">'
        + '<div class="line-upper"><span class="line-name">' + testObj.name + '</span> <span class="line-by small">by @'+testObj.author+'</span></div>'
        + '<div class="line-lower"><span class="line-detail small">' + testObj.description + '</span></div>'
        + '</div>'
        + '<div class="x2 col-sm-4 text-right align-bottom">'
        // + resize_results_radios
        + '<button id="test-line-source" data-cmd="line-source" data-test="' + testObj.div + '" type="button" class="test-line-btn btn btn-default btn-sm"> <span class="glyphicon glyphicon-console"></span> </button>'
        // + '<button id="test-line-chart" data-cmd="line-chart" data-test="' + testObj.div + '" type="button" class="test-line-btn btn btn-default btn-sm ' + isGraphAvailable + ' "' + isGraphAvailable + '> <span class="glyphicon glyphicon-stats"></span> </button>'
        // + '<button id="test-line-table" data-cmd="line-table" data-test="' + testObj.div + '" type="button" class="test-line-btn btn btn-default btn-sm ' + isTableAvailable + ' "' + isTableAvailable + '> <span class="glyphicon glyphicon-list-alt"></span> </button>'
        + '<button id="test-line-run" data-cmd="line-run" data-test="' + testObj.div + '" type="button" class="test-line-btn btn btn-default btn-sm"> <span class="glyphicon glyphicon-play"></span> ANALYZE THIS </button>'
        + '<div class="line-icons-wrapper">'
        + '<i   class="line-icon ' + isForMerchant +' fa fa-building" aria-hidden="true" title="Available at Merchant-level"></i>'
        + '<i   class="line-icon ' + isForTeam +' fa fa-sitemap" aria-hidden="true" title="Available for Team Users"></i>'
        + '<i   class="line-icon ' + isForUserList +' fa fa-users" aria-hidden="true" title="Available for a comma separated list of User IDs"></i>'
        + '<i   class="line-icon ' + isForUser +' fa fa-user-circle-o" aria-hidden="true" title="Available for individual users"></i>'
        + '<img class="line-icon ' + isAvailableOnEU +' line-flag" src="img/eu_60x40.png" title="Available on EU DB" alt="[EU]">'
        + '<img class="line-icon ' + isAvailableOnUS +' line-flag" src="img/us_60x40.png" title="Available on US DB" alt="[US]">'
        + '</div>'
        + '</div>'
        + '</div';

    var row_html = '<div class="test-line line-' + testObj.div + '" id="line-' + testObj.div + '">'
        + test_line_html
        + '</div >';


    $(row_html).appendTo(".test-lines");



    // if (test_url) {

    /*  var isGraphAvailable = (testObj.chart_url) ? '' : 'disabled';
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
}


function updateUserInputSettings() {
    /* Update settings{} with current user input so parameters can be read from global scope rather than from DOM */

    /* Update Region */
    settings.domain_region = $('#server_farm').find('option:selected').val();
    settings.domain_url = $('#server_farm').find('option:selected').attr('data-domain');
    settings.domain_flag = $('#server_farm').find('option:selected').attr('data-flag');
    
    /* Update Scope */
    settings.scope_param = $('.btn_group_scope').find('option:selected').val();
    settings.scope_input = $('.btn_group_scope').find('option:selected').attr('data-field');
    settings.scope_label = $('.btn_group_scope').find('option:selected').text();

    /* Update User Input Fields - Update all four - not only the visible one! */
    $('.id-input-field input').map(function () {
        settings[$(this).attr('id')] = $(this).val()||0;
        console.log('Setting:', $(this).attr('id'), '=', settings[$(this).attr('id')] );
    });

}

function initFormFields() {
    /* Hide all ID fields */
    $('.id-input-field').hide();
    /* Show whichever fields are selected in HTML  */
    groupScopeChange( $('.btn_group_scope') );
    /* Select appropriate radio button based on defaults */
    $('#' + settings.iframeClass).click();
    /* Display list of tests */
        /* Clear Previous Test Results */
        $(".results").empty();
        /* Iterate through all Tests */
        for (var prop in tests) {
            insertTestLine(tests[prop]);
        }
}

function runSearch(selectSearch) {

    updateUserInputSettings();

    if (selectSearch === 'all') {

        /* Clear Previous Test Results */
        $(".results").empty();

        /* Iterate through all Tests */
        for (const prop in tests) {
            insertTest(tests[prop], selectSearch);
        }
    }

};


/* -------------------------------- ONREADY + EVENT HANDLERS ---------------------------------------------------------------- */

jQuery(document).ready(function ($) {

    /* Prep Form Fields */
    initFormFields('onReady');


    /* The [X] clear button on Input Fields - https://codepen.io/frosdqy/pen/grbxGW */
    $('.has-clear input[type="text"]').on('input propertychange', function () {
        var $this = $(this);
        var visible = Boolean($this.val());
        $this.siblings('.form-control-clear').toggleClass('hidden', !visible);
    }).trigger('propertychange');
    /* Clear text and grab focus when [x] is clicked */
    $('.form-control-clear').click(function () {
        $(this).siblings('input[type="text"]').val('')
            .trigger('propertychange').focus();
    });


    /* --- Event Handlers ------------------------------------------ */

    /* Server Dropdown */
    $('.btn_group_server').change(function (o) {
        groupServerChange(o.currentTarget);
    });

    /* Scope Dropdown */
    $('.btn_group_scope').change(function (o) {
        groupScopeChange(o.currentTarget);
    });

    /* ANALYSE BUTTON */
    $("#btnSearch").click(function () {
        runSearch('all');
    });


    /* Different onclick handler technique for test-result-buttons as dynamic content and not here at onReady() */
    $(document).on('click', '.test-cmd-btn', function (elem) {

        var thisObj = tests[$(elem.currentTarget).data('test')];
        var this_url, this_source_url, this_chart_url, this_table_url;

        switch ($(elem.currentTarget).data('cmd')) {
            case 'open':
                // alert('This will open iframe into new tab');
                this_url = $("." + $(elem.currentTarget).data('test') + " iframe").attr('src');
                openNewTab(this_url);
                //openNewTab( buildDashUrl(thisObj, 'query_id') );
                break;
            case 'source':
                this_source_url = buildDashUrl(thisObj, 'query_id', 'test_button_source');
                if (this_source_url) {
                    $("." + $(elem.currentTarget).data('test') + " iframe").attr('src', this_source_url);
                }
                break;
            case 'chart':
                this_chart_url = buildDashUrl(thisObj, 'embed_chart_id', 'test_button_chart');
                if (this_chart_url) {
                    $("." + $(elem.currentTarget).data('test') + " iframe").attr('src', this_chart_url);
                }
                break;
            case 'table':
                this_table_url = buildDashUrl(thisObj, 'embed_table_id', 'test_button_table');
                if (this_table_url) {
                    $("." + $(elem.currentTarget).data('test') + " iframe").attr('src', this_table_url);
                }
                break;
            case 'top':
                window.scrollTo(0, 0);
                break;
            default:
                alert('Unknown case [d3453]');
                return false;
        }
    });

    /* Click Handler for Test Lines - where the Test Results might or might not be on screen! */
    $(document).on('click', '.test-line-btn', function (elem) {

        var thisObj = tests[$(elem.currentTarget).data('test')];
        // var show_table_label;

        updateUserInputSettings();

        switch ($(elem.currentTarget).data('cmd')) {
            case 'line-source':
                // show_table_label = (thisObj.query_url) ? 'query_url' : 'table_url';
                openNewTab( buildDashUrl(thisObj, 'query_id') );
                break;
            // case 'line-chart':
            //     insertTest(thisObj, 'chart_url');
            //     scrollToAnchor($(elem.currentTarget).data('test'));
            //     break;
            // case 'line-table':
            //     insertTest(thisObj, 'table_url');
            //     scrollToAnchor($(elem.currentTarget).data('test'));
            //     break;
            case 'line-run':
                if (insertTest(thisObj, 'line_'+thisObj.div) ){
                    /* Only scroll if insert returns true */
                    scrollToAnchor($(elem.currentTarget).data('test'));
                }
                break;
            default:
                return false;
        }
    });

    /* Change Iframe Size */
    $(document).on('change', 'input[type=radio][name=iframe-size]', function (elem) {
        if ($(elem.currentTarget).data('test') === 'all') {
            settings.iframeClass = $(elem.currentTarget).val();
            $('.results-iframe').removeClass('iframe-small iframe-medium iframe-large').addClass(settings.iframeClass);
        } else {
            var this_iframe = $("." + $(elem.currentTarget).data('test') + " iframe").attr('src');
            $("." + $(elem.currentTarget).data('test') + " iframe").removeClass('iframe-small iframe-medium iframe-large').addClass($(elem.currentTarget).val());
        }
    });

    /* TESTING ONLY */
    $('#merchant_id').val('10115');
    $('#team_id').val('9821');
    $('#user_list').val('2135550,2046790,2046899');
    $('#user_id').val('72452');
});