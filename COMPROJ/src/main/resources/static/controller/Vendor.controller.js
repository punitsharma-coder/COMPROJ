//__Developed__ by PUNIT 06-03-2026
sap.ui.define(
    ["sap/ui/core/mvc/Controller",
     "jquery.sap.global",
     "punit/util/service",
     "sap/m/MessageBox"],
    function(Controller, jQuery, service, MessageBox){
        return Controller.extend("punit.controller.Vendor", {
            onInit: function(){
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({
                    "postPayload": {
                        "name": "",
                        "city": "",
                        "state": "",
                        "phone": ""
                    },
                    "editPayload": {
                        "vendorId": "",
                        "name": "",
                        "city": "",
                        "state": "",
                        "phone": ""
                    },
                    "vendor": [],
                    "editMode": false,
                    "searchVendorId": ""
                });
                this.getView().setModel(oModel);
            },

            // CREATE - Save new Vendor
            onSave: function(){
                var oModel = this.getView().getModel();
                var payload = oModel.getProperty("/postPayload");

                // Validation
                if(!payload.name || !payload.city || !payload.state || !payload.phone){
                    MessageBox.error("Please fill all required fields");
                    return;
                }

                service.callService("http://localhost:8081/Vendors", "POST", payload)
                .then(function(response){
                    MessageBox.success("Vendor Created Successfully");
                    // Reset form
                    oModel.setProperty("/postPayload", {
                        "name": "",
                        "city": "",
                        "state": "",
                        "phone": ""
                    });
                    // Reload data
                    this.onLoadData();
                }.bind(this))
                .catch(function(err){
                    MessageBox.error("Error: Failed to create vendor");
                    console.error(err);
                });
            },

            // READ - Load all Vendors
            onLoadData: function(){
                var that = this;
                service.callService("http://localhost:8081/Vendors", "GET", {})
                .then(function(data){
                    var oTable = that.getView().byId("idTable");
                    var oModel = that.getView().getModel();
                    oModel.setProperty("/vendor", data);
                    oTable.bindRows("/vendor");
                    MessageBox.information("Data loaded successfully. Total records: " + data.length);
                })
                .catch(function(err){
                    MessageBox.error("Error loading data");
                    console.error(err);
                });
            },

            // EDIT - Search and load vendor by ID
            onEditVendor: function(){
                var oModel = this.getView().getModel();
                var vendorId = oModel.getProperty("/searchVendorId");

                // Validation
                if(!vendorId || vendorId.trim() === ""){
                    MessageBox.error("Please enter a Vendor ID");
                    return;
                }

                service.callService("http://localhost:8081/Vendors/" + vendorId, "GET", {})
                .then(function(data){
                    oModel.setProperty("/editPayload", {
                        "vendorId": data.vendorId,
                        "name": data.name,
                        "city": data.city,
                        "state": data.state,
                        "phone": data.phone
                    });
                    oModel.setProperty("/editMode", true);
                    MessageBox.information("Vendor data loaded successfully");
                })
                .catch(function(err){
                    MessageBox.error("Error: Vendor with ID " + vendorId + " not found");
                    console.error(err);
                });
            },

            // UPDATE - Save edited vendor
            onUpdateVendor: function(){
                var oModel = this.getView().getModel();
                var editPayload = oModel.getProperty("/editPayload");

                // Validation
                if(!editPayload.name || !editPayload.city || !editPayload.state || !editPayload.phone){
                    MessageBox.error("Please fill all required fields");
                    return;
                }

                // Remove vendorId from payload for update
                var updatePayload = {
                    "name": editPayload.name,
                    "city": editPayload.city,
                    "state": editPayload.state,
                    "phone": editPayload.phone
                };

                service.callService("http://localhost:8081/Vendors/" + editPayload.vendorId, "PUT", updatePayload)
                .then(function(response){
                    MessageBox.success("Vendor Updated Successfully");
                    // Reset edit form
                    oModel.setProperty("/editMode", false);
                    oModel.setProperty("/searchVendorId", "");
                    oModel.setProperty("/editPayload", {
                        "vendorId": "",
                        "name": "",
                        "city": "",
                        "state": "",
                        "phone": ""
                    });
                    // Reload data
                    this.onLoadData();
                }.bind(this))
                .catch(function(err){
                    MessageBox.error("Error: Failed to update vendor");
                    console.error(err);
                });
            },

            // Cancel edit mode
            onCancelEdit: function(){
                var oModel = this.getView().getModel();
                oModel.setProperty("/editMode", false);
                oModel.setProperty("/searchVendorId", "");
                oModel.setProperty("/editPayload", {
                    "vendorId": "",
                    "name": "",
                    "city": "",
                    "state": "",
                    "phone": ""
                });
            },

            // DELETE - Delete selected vendors
            onDeleteSelected: function(){
                var that = this;
                var oTable = this.getView().byId("idTable");
                var aSelectedIndices = oTable.getSelectedIndices();

                if(aSelectedIndices.length === 0){
                    MessageBox.warning("Please select at least one row to delete");
                    return;
                }

                MessageBox.confirm("Are you sure you want to delete " + aSelectedIndices.length + " selected record(s)?", {
                    onClose: function(oAction){
                        if(oAction === "OK"){
                            var deletePromises = [];
                            
                            aSelectedIndices.forEach(function(iIndex){
                                var oContext = oTable.getContextByIndex(iIndex);
                                if(oContext){
                                    var oObject = oContext.getObject();
                                    var vendorId = oObject.vendorId;
                                    deletePromises.push(
                                        service.callService("http://localhost:8081/Vendors/" + vendorId, "DELETE", {})
                                    );
                                }
                            });

                            // Execute all delete operations
                            Promise.all(deletePromises)
                            .then(function(){
                                MessageBox.success("Vendor(s) deleted successfully");
                                that.onLoadData();
                            })
                            .catch(function(err){
                                MessageBox.error("Error deleting vendor(s)");
                                console.error(err);
                            });
                        }
                    }
                });
            }
        });
    }
);
