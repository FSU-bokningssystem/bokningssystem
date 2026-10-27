package com.example.bokningssystem.controller;

import com.example.bokningssystem.service.RoomService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RoomController.class)
public class RoomControllerValidationTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RoomService roomService;

    @Test
    public void RoomController_Create_shouldRejectBlankRoomNumber() throws Exception {
        mockMvc.perform(post("/room")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "roomNumber": "",
                      "floor": 5,
                      "name": "Secret",
                      "description": "Super-hemligt rum",
                      "houseId": 1
                    }
                    """))
                .andExpect(status().isBadRequest());
    }
}