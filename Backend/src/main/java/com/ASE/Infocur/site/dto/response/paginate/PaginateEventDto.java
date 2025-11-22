package com.ASE.Infocur.site.dto.response.paginate;

import com.ASE.Infocur.site.dto.response.response.ResponseEventDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaginateEventDto {
    private long count;
    private List<ResponseEventDto> dataList;
}