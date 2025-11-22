package com.ASE.Infocur.site.service.impl;

import com.ASE.Infocur.site.dto.request.RequestPhotoProgressDto;
import com.ASE.Infocur.site.dto.response.paginate.PaginatePhotoProgress;
import com.ASE.Infocur.site.dto.response.response.ResponsePhotoProgressDto;
import com.ASE.Infocur.site.entity.Booking;
import com.ASE.Infocur.site.entity.Client;
import com.ASE.Infocur.site.entity.Event;
import com.ASE.Infocur.site.entity.PhotoProgress;
import com.ASE.Infocur.site.exception.EntryNotFoundException;
import com.ASE.Infocur.site.repository.BookingRepo;
import com.ASE.Infocur.site.repository.ClientRepo;
import com.ASE.Infocur.site.repository.EventRepo;
import com.ASE.Infocur.site.repository.PhotoProgressRepo;
import com.ASE.Infocur.site.service.EmailService;
import com.ASE.Infocur.site.service.EventService;
import com.ASE.Infocur.site.service.PhotoProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhotoProgressServiceImpl implements PhotoProgressService {


    private final PhotoProgressRepo photoProgressRepo;
    private final ClientRepo clientRepo;
    private final BookingRepo  bookingRepo;
    private final EventRepo eventRepo;

    @Autowired
    private EventService eventService;
    @Autowired
    private EmailService emailService;

    @Override
    public void save(RequestPhotoProgressDto dto) {

            photoProgressRepo.save(toPhotoProgress(dto));
    }

    @Override
    public void delete(String id) {
            photoProgressRepo.deleteById(id);
    }

    @Override
    public ResponsePhotoProgressDto findById(String id) {

        return toResponsePhotoProgressDto(photoProgressRepo.findById(id).orElseThrow(()->new EntryNotFoundException("Entry not found")));
    }

    @Override
    public void updateById(
            RequestPhotoProgressDto dto, String id) {
        if (id == null) {
            throw new IllegalArgumentException(" id must not be null");
        }


//        PhotoProgress progress = photoProgressRepo.findByBookingId(id)
//                .orElseThrow(() -> new RuntimeException("Progress not found"));


            PhotoProgress photoProgress= photoProgressRepo.findById(id).orElseThrow(()->new EntryNotFoundException("Entry not found"));
            photoProgress.setClient(clientRepo.findById(dto.getClientId()).orElseThrow(() -> new EntryNotFoundException("No Client found")));
            photoProgress.setBooking(bookingRepo.findById(dto.getBookingId()).orElseThrow(() -> new EntryNotFoundException("No Booking found")));
            photoProgress.setEvent(eventRepo.findById(dto.getEventId()).orElseThrow(() -> new EntryNotFoundException("No Event found")));
            photoProgress.setImg_number(dto.getImg_number());
            photoProgress.setD_link(dto.getD_link());
            photoProgress.setStatus(dto.getStatus());
            photoProgressRepo.save(photoProgress);
    }

    @Override
    public PaginatePhotoProgress searchAll(String searchText, int page, int size) {
        Page<PhotoProgress> photoList= photoProgressRepo.searchAll(searchText, PageRequest.of(page,size));

        return PaginatePhotoProgress.builder()
                .dataList(
                        photoList.stream().map(e->toResponsePhotoProgressDto(e))
                                .toList()
                )   .count(photoList.getTotalElements())
                .build();
    }


    //------------------------------------------------------------------------------------------
    //Creating progress when booking is created
    // ------------------------------------------------------------------------------------------

    @Override
    public void createProgress(String clientId, String eventId, String bookingId) {

        photoProgressRepo.save(toCreatePhotoProgressDto(clientId, eventId, bookingId));

    }

    //------------------------------------------------------------------------------------------
    //update status
    //------------------------------------------------------------------------------------------




    @Override
    public void updateStatus(String id, String status) {
        PhotoProgress photoProgress = photoProgressRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("progress not found"));

        photoProgress.setStatus(status);
        photoProgressRepo.save(photoProgress);
    }

    //------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------

     //update fields img_number, d_link
    //------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------

    @Override
    public void udpatefields(String id, int img_number, String d_link) {
        PhotoProgress photoProgress = photoProgressRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));


        photoProgress.setImg_number(img_number);
        photoProgress.setD_link(d_link);
        photoProgressRepo.save(photoProgress);

        String clientName=photoProgress.getClient().getFullName();
        String clientEmail=photoProgress.getClient().getEmail();


            if(d_link!=null){
                try{
                    emailService.sendDriveLinkEmail(clientEmail,clientName,d_link);
                }catch(Exception e){
                    throw new RuntimeException(e);
                }

        }



    }


    //------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------



    @Override
    public PaginatePhotoProgress searchByBookingId(String searchText, int page, int size, String bookingId) {

       if(bookingId==null || bookingId.isBlank()){
           return PaginatePhotoProgress.builder()
                   .dataList(Collections.emptyList())
                   .count(0)
                   .build();
       }

       Page<PhotoProgress> photoProgresses=photoProgressRepo.findByBooking_BookingId(bookingId, PageRequest.of(page,size));

         if(photoProgresses.isEmpty()) {
             return PaginatePhotoProgress.builder()
                     .dataList(Collections.emptyList())
                     .count(photoProgresses.getTotalElements())
                     .build();
         }
        return PaginatePhotoProgress.builder()
                .dataList(photoProgresses.stream()
                        .map(this::toResponsePhotoProgressDto)
                        .toList()
                )
                .count(photoProgresses.getTotalElements())
                .build();

    }

    //------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------


    @Override
    public PaginatePhotoProgress searchByEventId(String searchText, int page, int size, String eventId) {

        if(eventId==null||eventId.isBlank()){
            return PaginatePhotoProgress.builder()
                    .dataList(Collections.emptyList())
                    .count(0)
                    .build();
        }

        List<String> approvedBookingIds = bookingRepo.findByStatus("true")
                .stream()
                .map(Booking::getBookingId)
                .toList();

        Page<PhotoProgress> photoProgresses=photoProgressRepo.findByEventId(eventId,approvedBookingIds, PageRequest.of(page,size));
        if(photoProgresses.isEmpty()) {
            return PaginatePhotoProgress.builder()
                    .dataList(Collections.emptyList())
                    .count(photoProgresses.getTotalElements())
                    .build();
        }
        return PaginatePhotoProgress.builder()
                .dataList(photoProgresses.stream()
                        .map(this::toResponsePhotoProgressDto)
                        .toList()
                )
                .count(photoProgresses.getTotalElements())
                .build();
    }


    //------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------


    private PhotoProgress toPhotoProgress(RequestPhotoProgressDto dto){
        if(dto==null)return null;
        Client client = clientRepo.findById(dto.getClientId()).orElse(null);
        Booking booking = bookingRepo.findById(dto.getBookingId()).orElse(null);
        Event event = eventRepo.findById(dto.getEventId()).orElse(null);

        return PhotoProgress.builder()
                .id(UUID.randomUUID().toString())
                .client(client)
                .booking(booking)
                .event(event)
                .img_number(dto.getImg_number())
                .d_link(dto.getD_link())
                .status(dto.getStatus())
                .build();
    }

    private ResponsePhotoProgressDto toResponsePhotoProgressDto(PhotoProgress photoProgress){
        if(photoProgress==null) return null;

        return ResponsePhotoProgressDto.builder()
                .id(photoProgress.getId())
                .clientId(photoProgress.getClient())
                .bookingId(photoProgress.getBooking())
                .eventId(photoProgress.getEvent())
                .img_number(photoProgress.getImg_number())
                .d_link(photoProgress.getD_link())
                .status(photoProgress.getStatus())
                .build();
    }

    //----------------------------------------------------------------------
    //----------------------------------------------------------------------

    private  PhotoProgress toCreatePhotoProgressDto(String clientId, String eventId, String bookingId){
        if(clientId==null || eventId==null || bookingId==null) return null;

        Client client = clientRepo.findById(clientId).orElse(null);
        Booking booking = bookingRepo.findById(bookingId).orElse(null);
        Event event = eventRepo.findById(eventId).orElse(null);

        System.out.println("From toCreateProgressDTo Booking Id: "+bookingId+"Event Id: "+eventId);
        System.out.println("Booking Id: "+booking+"Event Id: "+event);

        return PhotoProgress.builder()
                .id(UUID.randomUUID().toString())
                .client(client)
                .booking(booking)
                .event(event)
                .img_number(0)
                .d_link(null)
                .status("pending")
                .build();
    }

}
