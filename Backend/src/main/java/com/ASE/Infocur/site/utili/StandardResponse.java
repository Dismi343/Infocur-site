package com.ASE.Infocur.site.utili;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StandardResponse {
    private String message;
    private int code;
    private Object data;
}
