//__Developed__ by PUNIT 06-03-2026
sap.ui.define(
    ["jquery.sap.global"],
    function(jQuery){
        return{
            callService: function(sUrl, sMethod, oPayload){
                return new Promise(function(resolve,reject){
                    switch(sMethod.toUpperCase()){
                        case "GET":
                            jQuery.ajax({
                                url: sUrl,
                                type: 'GET',
                                success: function(data){
                                    resolve(data);
                                },
                                error:function(err){
                                    reject(err);
                                }
                            });
                            break;
                        case "POST":
                            jQuery.ajax({
                                url: sUrl,
                                type: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify(oPayload),
                                success: function(data){
                                    resolve(data);
                                },
                                error:function(err){
                                    reject(err);
                                }
                            });
                            break;
                        case "PUT":
                            jQuery.ajax({
                                url: sUrl,
                                type: 'PUT',
                                contentType: 'application/json',
                                data: JSON.stringify(oPayload),
                                success: function(data){
                                    resolve(data);
                                },
                                error:function(err){
                                    reject(err);
                                }
                            });
                            break;
                        case "DELETE":
                            jQuery.ajax({
                                url: sUrl,
                                type: 'DELETE',
                                success: function(data){
                                    resolve(data);
                                },
                                error:function(err){
                                    reject(err);
                                }
                            });
                            break;
                    }
                });
            }
        }
    }
);

