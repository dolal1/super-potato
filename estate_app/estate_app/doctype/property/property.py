# -*- coding: utf-8 -*-
# Copyright (c) 2021, David Olal and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Property(Document):
    # pass

    # validate with ODM
    def validate(self):
        try:
            if (self.property_type=='Flat'):
                for amenity in self.amenities:
                    if (amenity.amenity_name=='Out Door Kitchen'):
                        frappe.throw((f'<b>Flats</b> should not have amenity <b>{amenity.amenity_name}</b>'))
        except Exception as e:
            error = frappe.log_error(frappe.get_traceback(), f'{e}')
            frappe.msgprint((f"Error occured. Please See <a href='/desk#Form/Error Log/{error.name}'><b>{error.title}</b></a>"))

    # # validate with SQL
    #  def validate(self):
    #     if (self.property_type=='Flat'):
    #         amenity = frappe.db.sql((f""" SELECT amenity_name FROM `tabProperty Amenity Detail` where parent="{self.name}" AND parenttype="Property" and amenity_name="Out Door Kitchen"; """))
    #         if(amenity):
    #             frappe.throw((f'Property of type <b>Flat</b> should not have amenity <b>{amenity[0]}</b>'))