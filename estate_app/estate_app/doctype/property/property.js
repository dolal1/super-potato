// Copyright (c) 2021, David Olal and contributors
// For license information, please see license.txt

frappe.ui.form.on("Property", {
  // When writing custom methods, put them in the setup
  setup: function (form) {
    // TODO: check amenities for duplicate entries
    form.check_duplicate_amenities = function (form, row) {
      form.doc.amenities.forEach((item) => {
        console.log(item.amenity_name);
        if (row.amenity_name == "" || row.idx == item.idx) {
          // pass
        } else {
          if (row.amenity_name == item.amenity_name) {
            form.check_outdoor_kitchen_in_flat(form, row);
          }
        }
      });
    };

    // Check if flat has outdoor kitchen
    form.check_outdoor_kitchen_in_flat = function (form, row) {
      if (
        row.amenity_name == "Out Door Kitchen" &&
        form.doc.property_type == "Flat"
      ) {
        // set amenity
        let amenity = row.amenity_name;

        // clear row
        row.amenity_name = "";

        // throw error
        frappe.throw(__(`${amenity} cannot be in a flat`));

        form.refresh_field("amenity_name");
      }
    };
  },

  refresh: function (form) {
    // // Creates a Touch Address button in the property form
    // form.add_custom_button("Touch Address", () => {
    //   frappe.prompt("Address", ({ value }) => {
    //     if (value) {
    //       form.set_value("address", value);
    //       form.refresh_field("address");
    //       frappe.msgprint(`Address field updaed to ${value}`);
    //     }
    //   });
    // });
  },
});

frappe.ui.form.on("Property Amenity Detail", {
  amenity_name: function (form, childDocType, childDocName) {
    // Get an entire record
    let row = locals[childDocType][childDocName];

    form.check_outdoor_kitchen_in_flat(form, row);

    form.check_duplicate_amenities(form, row);
  },
});
