package com.ASE.Infocur.site.service;

import com.ASE.Infocur.site.dto.request.RequestPhotoProgressDto;
import com.ASE.Infocur.site.dto.response.paginate.PaginatePhotoProgress;
import com.ASE.Infocur.site.dto.response.response.ResponsePhotoProgressDto;

public interface PhotoProgressService {
    public void save(RequestPhotoProgressDto request);
    public void delete(String id);
    public ResponsePhotoProgressDto findById(String id);
    public void updateById(RequestPhotoProgressDto dto,String id);
    public PaginatePhotoProgress searchAll(String searchText,int page,int size);
    public void createProgress(String clientId, String eventId, String bookingId);
    public void updateStatus(String id, String status);
    public void udpatefields(String id, int img_number,String d_link);
    public PaginatePhotoProgress searchByBookingId(String searchText, int page, int size, String bookingId);
    public PaginatePhotoProgress searchByEventId(String searchText, int page, int size, String eventId);
}
