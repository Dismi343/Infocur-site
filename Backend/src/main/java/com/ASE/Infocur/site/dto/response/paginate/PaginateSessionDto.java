package com.ASE.Infocur.site.dto.response.paginate;

import com.ASE.Infocur.site.dto.response.response.ResponseClientDto;
import com.ASE.Infocur.site.dto.response.response.ResponseSessionDto;
import lombok.*;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaginateSessionDto {
    private long count;
    private List<ResponseSessionDto> dataList;
}
