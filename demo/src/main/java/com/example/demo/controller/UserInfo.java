package com.example.demo.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserInfo {

    @JsonProperty("firstname")
    private String firstName;

    @JsonProperty("lastname")
    private String lastName;

    @JsonProperty("id")
    private Long id;


    public UserInfo(String firstName, String lastName,Long id) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.id=id;
    }

    public UserInfo(Long id, String firstName, String lastName) {
    }
}
