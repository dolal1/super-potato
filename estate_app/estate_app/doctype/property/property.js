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
    // Creates a Touch Address button in the property form
    form.add_custom_button(
      "Touch Address",
      () => {
        frappe.prompt("Address", ({ value }) => {
          if (value) {
            form.set_value("address", value);
            form.refresh_field("address");
            frappe.msgprint(`Address field updated to ${value}`);
          }
        });
      },
      "Actions"
    );

    // Check property types
    form.add_custom_button(
      "Check Property Types",
      () => {
        let property_type = form.doc.property_type;

        // Use AJAX API call
        frappe.call({
          //dotted path to server method
          method:
            "estate_app.estate_app.doctype.property.api.check_property_types",
          args: { property_type: property_type },
          callback: function (r) {
            // code snippet
            console.log(r);

            let data = r.message;
            if (data.length > 0) {
              let head = `<h3>Properties of type ${property_type}</h3>`;
              let body = ``;
              data.forEach((d) => {
                let count = `<p>Property ${d.property_name} <a href="/desk#Form/Property/${d.name}">Visit It</a></p>`;
                body = body + count;
              });

              let html = head + body;

              // Print Messsage
              frappe.msgprint(__(html));
            }
          },
        });
      },
      "Actions"
    );
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
