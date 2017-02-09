//$(document).ready(function () {
//    //var complaintSummary, complaintDescription;
//    $("#btnFinis").click(function () {
//        complaintSummary = $("#txtAreaDescription").val();
//        barCode = $("#txtBarcode").val();
//        tpnb = $("#txtTPNB").val();
//        tpnc = $("#txtTPNC").val();
//        storeNumber = $("#txtStoreNumber").val();

//        /*
//        * Perform some validation here.
//        */
//        $.post("/CreateProductQuality", { complaintSummary: complaintSummary, barCode: barCode, tpnb: tpnb, tpnc: tpnc, storeNumber: storeNumber }, function (data) {
//            {
//                window.location.href = "/Summary";
//            }
//        });
//    });

    $(document).ready(function () {
        $("#btnFinish").click(function () {

            var port = 3000;
            complaintSummary = $("#txtAreaDescription").val();
            barCode = $("#txtBarcode").val();
            tpnb = $("#txtTPNB").val();
            tpnc = $("#txtTPNC").val();
            storeNumber = $("#txtStoreNumber").val();
            var batchCode = $("#txtBatchCode").val();
            var scCode = $("#txtScCode").val();
            var valid = true;
            var allElements = document.getElementsByName("formElement");
            for (var i = 0, max = allElements.length; i < max; i++) {
                if (allElements[i].value == "") {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                $.post("/CreateProductQuality", { complaintSummary: complaintSummary, barCode: barCode, tpnb: tpnb, tpnc: tpnc, storeNumber: storeNumber }, function (data) {
                    {
                        if (data === 'error') {
                            $("#ServerSideError").modal();
                        } else {
                           
                            document.getElementById('lblMongoDBid').value = data;

                            document.getElementById('lblComplaintSummary').value = complaintSummary;
                            document.getElementById('lblBarCode').value = barCode;
                            document.getElementById('lblTPNB1').value = tpnb.toString();
                            document.getElementById('lblTPNC1').value = tpnc;
                            document.getElementById('lblStoreNumber1').value = storeNumber;
                            $("#myModal").modal();
                        }

                    }
                });
                //$("#myModal").modal();
                //document.getElementById('lblComplaintSummary').value = complaintSummary;
                //document.getElementById('lblBarCode').value = barCode;
            }
            else {

                $("#errorForEmptyFields").modal();
            }
        });
        $("#btnToggle").click(function (e) {
            e.preventDefault();

            $("#wrapper").toggleClass("toggeled");
        });

 

    //form validations code
    $("#txtBarcode").focusout(function () {

        var barCode = document.getElementById('txtBarcode').value;
        if (barCode.length == 0) {
            $(this).css("border-color", "#ff471a");
            $(this).attr("placeholder", "Enter a valid value");
        }
    });

    $("#txtBarcode").focusin(function () {
        //alert("focus out.");
        var barCode = document.getElementById('txtBarcode').value;
        $(this).css("border-color", "#000000");
    });

    $("#txtTPNB").focusout(function () {
        //alert("focus out.");
        var tpnb = document.getElementById('txtTPNB').value;
        if (tpnb.length == 0) {
            $(this).css("border-color", "#ff471a");
            $(this).attr("placeholder", "Enter a valid value");
        }
    });

    $("#txtTPNC").focusout(function () {
        // alert("focus out.");
        var tpnc = document.getElementById('txtTPNC').value;
        if (tpnc.length == 0) {
            $(this).css("border-color", "#ff471a");
            $(this).attr("placeholder", "Enter a valid value");
        }
    });

    $("#txtScCode").focusout(function () {
        //alert("focus out.");
        var ScCode = document.getElementById('txtScCode').value;
        if (ScCode.length == 0) {
            $(this).css("border-color", "#ff471a");
            $(this).attr("placeholder", "Enter a valid value");
        }
    });

    $("#txtStoreNumber").focusout(function () {
        //alert("focus out.");
        var storeNumber = document.getElementById('txtStoreNumber').value;
        if (storeNumber.length == 0) {
            $(this).css("border-color", "#ff471a");
            $(this).attr("placeholder", "Enter a valid Store Number");
        }
    });
    $("#txtStoreNumber").focusin(function () {
        //alert("focus out.");
        var storeNumber = document.getElementById('txtStoreNumber').value;
        $(this).css("border-color", "#ffffff");
    });

    $("#txtBatchCode").focusout(function () {
        //alert("focus out.");
        var storeNumber = document.getElementById('txtBatchCode').value;
        if (storeNumber.length == 0) {
            $(this).css("border-color", "#ff471a");

        }
    });

    //click events
    $("#btnStoreNumber").click(function () {
        var storeNumber = document.getElementById('txtStoreNumber').value;
        var port = 3000;
        var Number = parseInt(storeNumber);
        var len = Number.toString().length;
        if (!$.isNumeric(Number) || len != 4) {
            //errorAlert('Error', 'Please Enter a valid 4 digit code!');
            $("#errorStoreLookUp").modal();

        } else {
            $.ajax({
                type: "GET",
                url: '/storeInfo',
                data: { storeNumber: storeNumber },
                contentType: 'application/json',
                success: function (response) {
                    console.log(response);
                    document.getElementById('txtStoreName').value = response[0].storeName;
                    document.getElementById('txtAreaAddress').value = response[0].storeAdress;
                },
                error: function () {
                    //type error code here
                }
            });
        }

    });

    $("#btnProductLookUp").click(function () {
        barCode = $('#txtBarcode').val();
        tpnb = $("#txtTPNB").val();
        tpnc = $("#txtTPNC").val();
        if (barCode.length != 14 && tpnb.length != 9 && tpnc.length != 9) {
            //errorAlert('Error', 'you have entered an invalid value');
            $("#errorProductLook").modal();
        } else {
            $.ajax({
                type: "GET",
                url: '/productInfo',
                data: { barCode: barCode, tpnb: tpnb, tpnc: tpnc },
                contentType: 'application/json',
                success: function (response) {
                    console.log(response);
                    document.getElementById('txtBarcode').value = response[0].barCode;
                    document.getElementById('txtTPNB').value = response[0].TPNB;
                    document.getElementById('txtTPNC').value = response[0].TPNC;
                    document.getElementById('txtProductDescription').value = response[0].Product_Description;
                    document.getElementById('txtSupplier').value = response[0].Supplier;
                    //test
                    $('#txtBarcode').css("border-color", "#000000");


                    $('#txtTPNB').css("border-color", "#000000");


                    $('#txtTPNC').css("border-color", "#000000");
                    //test
                    $('#txtBarcode').attr('disabled', 'disabled');
                    $('#txtTPNB').attr('disabled', 'disabled');
                    $('#txtTPNC').attr('disabled', 'disabled');




                },
                error: function () {
                    //type error code here
                }
            });
        }
    });

    $('#btnWrongProduct').click(function () {
        //clearing the text field on click
        //for wrong input
        $('#txtBarcode').val("");
        $('#txtTPNB').val("");
        $('#txtTPNC').val("");
        //$('#txtProductDescription').attr('disabled', false);
        $('#txtProductDescription').val("");
        $('#txtSupplier').val("");
        //enabling the input field
        $('#txtBarcode').attr('disabled', false);
        $('#txtTPNB').attr('disabled', false);
        $('#txtTPNC').attr('disabled', false);
        //$('#txtProductDescription').attr('disabled', 'disabled');

        //test
        $('#txtBarcode').css("border-color", "#000000");
        $('#txtBarcode').attr("placeholder", "");

        $('#txtTPNB').css("border-color", "#000000");
        $('#txtTPNB').attr("placeholder", "");

        $('#txtTPNC').css("border-color", "#000000");
        $('#txtTPNC').attr("placeholder", "");


    });

    //textchange event of Purchase Price textBox
    $('#txtPurchasePrice').change(function () {
        if ($('input[type=radio][name=RefundCustomer]:checked').val() == 'Yes') {
            $('#txtRefundValue').val($('#txtPurchasePrice').val());
            $('#txtMoneyCardValue').val($('#txtPurchasePrice').val());
            $('#txtGOGWValue').val("0.0");

        }
    });

    $('input[type=radio][name=RefundCustomer]').change(function () {
        if (this.value == 'Yes') {
            purchasePrice = $('#txtPurchasePrice').val();
            var posOfDot = purchasePrice.indexOf(".");

            if (posOfDot == -1) {
                $('#txtPurchasePrice').val($('#txtPurchasePrice').val() + '.0');
                purchasePrice = $('#txtPurchasePrice').val();
            }

            purchasePriceFloat = parseFloat(purchasePrice).toFixed(1);
            if ($.isNumeric(purchasePriceFloat)) {
                document.getElementById('txtRefundValue').value = purchasePriceFloat;
                document.getElementById('txtMoneyCardValue').value = purchasePriceFloat;
                document.getElementById('txtGOGWValue').value = document.getElementById('txtMoneyCardValue').value - document.getElementById('txtRefundValue').value;
            }

        } else {
            $('#txtMoneyCardValue').attr('disabled', true);
            document.getElementById('txtRefundValue').value = "0.0";
            document.getElementById('txtMoneyCardValue').value = "0.0";
            //$('#txtRefundValue').attr('placeholder', '0.0');
            //$('#txtMoneyCardValue').attr('placeholder', '0.0');
        }
    });

    $('input[type=radio][name=rdGOGW]').change(function () {
        if (this.value == 'Yes') {
            $('#txtMoneyCardValue').attr('disabled', false);
            $('#txtMoneyCardValue').focusout(function () {
                refundValue = $('#txtRefundValue').val();
                moneyCardValue = $('#txtMoneyCardValue').val();

                var posOfDot = moneyCardValue.indexOf(".");

                if (posOfDot == -1) {
                    $('#txtMoneyCardValue').val($('#txtMoneyCardValue').val() + '.0');
                    moneyCardValue = $('#txtMoneyCardValue').val();
                }
                refundValueInt = parseFloat(refundValue).toFixed(1);
                moneyCardValueInt = parseFloat(moneyCardValue).toFixed(1);
                gogwValue = moneyCardValueInt - refundValueInt;
                document.getElementById('txtGOGWValue').value = gogwValue.toFixed(1);
            });
        } else {
            document.getElementById('txtGOGWValue').value = "0.0";
        }
    });

    });