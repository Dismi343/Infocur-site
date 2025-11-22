package com.ASE.Infocur.site.dto.response.paginate;

import com.ASE.Infocur.site.dto.response.response.ResponseBankDetailsDto;
import com.ASE.Infocur.site.dto.response.response.ResponseBookingDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaginateBankDetialsDto {
    private long count;
    private List<ResponseBankDetailsDto> dataList;
}
