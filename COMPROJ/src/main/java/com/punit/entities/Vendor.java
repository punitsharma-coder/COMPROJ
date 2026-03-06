//Devloped by PUNIT 05-03-2026
package com.punit.entities;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "VENDOR")
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VENDOR_ID", nullable = false)
    private Long vendorId;

    @Column(name = "NAME")
    private String name;

    @Column(name = "CITY")
    private String city;

    @Column(name = "STATE")
    private String state;

    @Column(name = "PHONE")
    private String phone;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "VENDOR", referencedColumnName = "VENDOR_ID")
    private List<Address> address;

    public Vendor() {
    }

    public Vendor(Long vendorId, String name, String city,
                  String state, String phone, List<Address> address) {
        this.vendorId = vendorId;
        this.name = name;
        this.city = city;
        this.state = state;
        this.phone = phone;
        this.address = address;
    }

    public Long getVendorId() {
        return vendorId;
    }

    public void setVendorId(Long vendorId) {
        this.vendorId = vendorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<Address> getAddress() {
        return address;
    }

    public void setAddress(List<Address> address) {
        this.address = address;
    }
}