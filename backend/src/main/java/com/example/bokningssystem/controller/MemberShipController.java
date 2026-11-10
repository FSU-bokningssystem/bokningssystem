package com.example.bokningssystem.controller;

import com.example.bokningssystem.dtos.MembershipResponseDTO;
import com.example.bokningssystem.service.MembershipService;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(allowCredentials = "true",
        originPatterns = {"http://localhost:*"})
@RestController
@RequestMapping("/membership")
@Validated
public class MemberShipController {
    private final MembershipService memberShipService;

    public MemberShipController(MembershipService memberShipService) {
        this.memberShipService = memberShipService;
    }



    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MembershipResponseDTO>> getUserMembership(
            @PathVariable @Positive long userId) {
        return ResponseEntity.ok(memberShipService.findMembership(userId));
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/organization/{orgId}/user/{userId}")
    public void removeUserFromOrganization (
            @PathVariable @Positive long userId,
            @PathVariable @Positive long orgId)
           {
        memberShipService.removeUserFromOrganization(userId,orgId);
    }
}
