package com.ASE.Infocur.site.dto.response.paginate;

import com.ASE.Infocur.site.dto.response.response.ResponsePhotoProgressDto;
import lombok.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaginatePhotoProgress {
    private long count;
    private List<ResponsePhotoProgressDto> dataList;
}
