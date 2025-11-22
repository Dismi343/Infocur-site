package com.ASE.Infocur.site.dto.response.paginate;

import com.ASE.Infocur.site.dto.response.response.ResponsePackageDto;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaginatePackageDto {
    private long count;
    private List<ResponsePackageDto> dataList;
}
