package com.ASE.Infocur.site.dto.response.paginate;


import com.ASE.Infocur.site.dto.response.response.ResponseBookingDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaginateBookingDto {
    private long count;
    private List<ResponseBookingDto> dataList;
}
