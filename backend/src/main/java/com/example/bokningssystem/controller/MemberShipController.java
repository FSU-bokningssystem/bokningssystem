package com.example.bokningssystem.controller;

import com.example.bokningssystem.dtos.membershipDtos.AddMemberRequestDTO;
import com.example.bokningssystem.dtos.membershipDtos.MembershipResponseDTO;
import com.example.bokningssystem.dtos.organizationDtos.OrgMemberDTO;
import com.example.bokningssystem.service.MembershipService;
import jakarta.validation.constraints.Positive;
import org.springframework.security.core.Authentication;
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

    @GetMapping("/organization/{orgId}")
    public ResponseEntity<List<OrgMemberDTO>> getOrganizationMembers(
            @PathVariable @Positive long orgId) {
        return ResponseEntity.ok(memberShipService.findMembersOfOrganization(orgId));
    }

    @PostMapping("/organization/addMember")
    public ResponseEntity<MembershipResponseDTO> addUserToOrganization(
            @RequestBody AddMemberRequestDTO dto,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(memberShipService.addUserToOrganizationByEmail(
                        authentication.getName(),
                        dto.userId(),
                        dto.organizationId(),
                        dto.role()
                ));
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping("/organization/transferOwner")
    public void transferOwnership(
            @RequestBody AddMemberRequestDTO dto,
            Authentication authentication) {
        memberShipService.transferOwnershipByEmail(
                authentication.getName(),
                dto.userId(),
                dto.organizationId()
        );
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/organization/{orgId}/user/{userId}")
    public void removeUserFromOrganization(
            @PathVariable("userId") @Positive long targetId,
           @PathVariable @Positive long orgId,
           @RequestParam(defaultValue = "false") boolean anonymize) {{
        memberShipService.removeUserFromOrganization(
                targetId,
                orgId,
                anonymize
        );
    }}
}
