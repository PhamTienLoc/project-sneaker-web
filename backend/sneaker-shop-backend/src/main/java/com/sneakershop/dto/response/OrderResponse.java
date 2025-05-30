package com.sneakershop.dto.response;

import lombok.*;

@Getter @Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private Long id;
    private String status;
    private Double total;
    private String createdAt;
}
